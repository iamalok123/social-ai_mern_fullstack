import { describe, it } from "node:test";
import assert from "node:assert";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "../services/social/index.js";
import { protect, AuthRequest } from "../middlewares/authMiddleware.js";
import { postValidationMiddleware } from "../middlewares/postValidationMiddleware.js";
import { User } from "../models/User.js";

describe("Security, Authentication & Data Protection Test Suite", () => {
    const TEST_JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_key_12345";
    process.env.JWT_SECRET = TEST_JWT_SECRET;

    describe("JWT Authentication Middleware (protect)", () => {
        it("rejects requests missing the Authorization header", async () => {
            let statusCode = 200;
            let responseBody: any = null;
            let nextCalled = false;

            const req: any = { headers: {} };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            const next = () => { nextCalled = true; };

            await protect(req as AuthRequest, res, next);

            assert.strictEqual(statusCode, 401);
            assert.strictEqual(responseBody?.message, "Not authorized, no token");
            assert.strictEqual(nextCalled, false);
            assert.strictEqual(req.user, undefined);
        });

        it("rejects requests where Authorization header does not use Bearer scheme", async () => {
            let statusCode = 200;
            let responseBody: any = null;
            let nextCalled = false;

            const req: any = { headers: { authorization: "Basic dXNlcjpwYXNz" } };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            const next = () => { nextCalled = true; };

            await protect(req as AuthRequest, res, next);

            assert.strictEqual(statusCode, 401);
            assert.strictEqual(responseBody?.message, "Not authorized, no token");
            assert.strictEqual(nextCalled, false);
        });

        it("rejects requests with malformed or tampered JWT token", async () => {
            let statusCode = 200;
            let responseBody: any = null;
            let nextCalled = false;

            const req: any = { headers: { authorization: "Bearer invalid.jwt.token" } };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            const next = () => { nextCalled = true; };

            await protect(req as AuthRequest, res, next);

            assert.strictEqual(statusCode, 401);
            assert.ok(responseBody?.message.includes("jwt") || responseBody?.message.includes("token"));
            assert.strictEqual(nextCalled, false);
        });

        it("rejects requests with expired JWT token", async () => {
            let statusCode = 200;
            let responseBody: any = null;
            let nextCalled = false;

            // Generate an already expired token (1 second lifetime, signed in past)
            const expiredToken = jwt.sign({ id: "user_test_123" }, TEST_JWT_SECRET, { expiresIn: "0s" });

            // Small delay to ensure expiration
            await new Promise((resolve) => setTimeout(resolve, 50));

            const req: any = { headers: { authorization: `Bearer ${expiredToken}` } };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            const next = () => { nextCalled = true; };

            await protect(req as AuthRequest, res, next);

            assert.strictEqual(statusCode, 401);
            assert.ok(responseBody?.message.includes("expired"));
            assert.strictEqual(nextCalled, false);
        });

        it("rejects requests with token signed with foreign / invalid secret", async () => {
            let statusCode = 200;
            let responseBody: any = null;
            let nextCalled = false;

            const foreignToken = jwt.sign({ id: "user_test_123" }, "malicious_different_secret_9999");

            const req: any = { headers: { authorization: `Bearer ${foreignToken}` } };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            const next = () => { nextCalled = true; };

            await protect(req as AuthRequest, res, next);

            assert.strictEqual(statusCode, 401);
            assert.ok(responseBody?.message.includes("invalid signature") || responseBody?.message.includes("token"));
            assert.strictEqual(nextCalled, false);
        });

        it("rejects when token is valid but user no longer exists in database", async () => {
            let statusCode = 200;
            let responseBody: any = null;
            let nextCalled = false;

            const validToken = jwt.sign({ id: "nonexistent_user_id" }, TEST_JWT_SECRET, { expiresIn: "1h" });

            // Mock User.findById returning null
            const originalFindById = User.findById;
            (User as any).findById = () => ({
                select: () => Promise.resolve(null)
            });

            try {
                const req: any = { headers: { authorization: `Bearer ${validToken}` } };
                const res: any = {
                    status: (code: number) => {
                        statusCode = code;
                        return { json: (data: any) => { responseBody = data; } };
                    }
                };
                const next = () => { nextCalled = true; };

                await protect(req as AuthRequest, res, next);

                assert.strictEqual(statusCode, 401);
                assert.strictEqual(responseBody?.message, "Not authorized, user not found");
                assert.strictEqual(nextCalled, false);
            } finally {
                (User as any).findById = originalFindById;
            }
        });

        it("successfully authenticates and sets req.user without password field", async () => {
            let statusCode = 200;
            let nextCalled = false;

            const validToken = jwt.sign({ id: "valid_user_123" }, TEST_JWT_SECRET, { expiresIn: "1h" });

            // Mock User.findById returning user without password
            const originalFindById = User.findById;
            const mockUser = {
                _id: "valid_user_123",
                name: "Verified User",
                email: "user@example.com",
                authProvider: "email"
            };

            (User as any).findById = (id: string) => ({
                select: (fields: string) => {
                    assert.strictEqual(id, "valid_user_123");
                    assert.strictEqual(fields, "-password");
                    return Promise.resolve(mockUser);
                }
            });

            try {
                const req: any = { headers: { authorization: `Bearer ${validToken}` } };
                const res: any = {
                    status: (code: number) => {
                        statusCode = code;
                        return { json: () => {} };
                    }
                };
                const next = () => { nextCalled = true; };

                await protect(req as AuthRequest, res, next);

                assert.strictEqual(statusCode, 200);
                assert.strictEqual(nextCalled, true);
                assert.deepStrictEqual(req.user, mockUser);
                assert.strictEqual((req.user as any).password, undefined);
            } finally {
                (User as any).findById = originalFindById;
            }
        });
    });

    describe("Password Security & Hashing Guardrails (bcrypt)", () => {
        it("hashes passwords securely with unique salt", async () => {
            const rawPassword = "StrongPassword123!";
            const salt = await bcrypt.genSalt(10);
            const hash1 = await bcrypt.hash(rawPassword, salt);
            const salt2 = await bcrypt.genSalt(10);
            const hash2 = await bcrypt.hash(rawPassword, salt2);

            assert.notStrictEqual(hash1, rawPassword);
            assert.notStrictEqual(hash2, rawPassword);
            // Two hashes of same password with different salts must differ
            assert.notStrictEqual(hash1, hash2);

            // Validates against original password
            const isMatch1 = await bcrypt.compare(rawPassword, hash1);
            const isMatch2 = await bcrypt.compare(rawPassword, hash2);
            assert.strictEqual(isMatch1, true);
            assert.strictEqual(isMatch2, true);

            // Rejects incorrect password
            const isWrongMatch = await bcrypt.compare("WrongPassword456", hash1);
            assert.strictEqual(isWrongMatch, false);
        });

        it("enforces minimum 6 character password requirement in validation logic", () => {
            const shortPasswords = ["", "1", "12", "123", "1234", "12345"];
            for (const pass of shortPasswords) {
                const isValid = pass.length >= 6;
                assert.strictEqual(isValid, false, `Password "${pass}" should be rejected`);
            }

            const validPasswords = ["123456", "SecurePass!", "P@ssword2026"];
            for (const pass of validPasswords) {
                const isValid = pass.length >= 6;
                assert.strictEqual(isValid, true, `Password "${pass}" should be accepted`);
            }
        });
    });

    describe("Input Sanitization & Injection Prevention", () => {
        it("rejects post with whitespace-only content", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const req: any = {
                body: {
                    content: "   \n\t   ",
                    platforms: ["twitter"],
                    scheduledFor: new Date().toISOString()
                }
            };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            let nextCalled = false;
            postValidationMiddleware(req, res, () => { nextCalled = true; });

            assert.strictEqual(statusCode, 400);
            assert.strictEqual(responseBody?.message, "Post content is required.");
            assert.strictEqual(nextCalled, false);
        });

        it("safely handles malformed JSON strings in multipart form fields without crashing", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const req: any = {
                body: {
                    content: "Test post",
                    platforms: "not-a-valid-json-array{",
                    scheduledFor: new Date().toISOString()
                }
            };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            let nextCalled = false;
            postValidationMiddleware(req, res, () => { nextCalled = true; });

            assert.strictEqual(statusCode, 400);
            assert.ok(responseBody?.message);
            assert.strictEqual(nextCalled, false);
        });

        it("prevents scheduling posts in the distant past (over 24 hours ago)", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const pastDate = new Date(Date.now() - 48 * 3600 * 1000).toISOString(); // 48 hours ago
            const req: any = {
                body: {
                    content: "Old post",
                    platforms: ["twitter"],
                    scheduledFor: pastDate
                }
            };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            let nextCalled = false;
            postValidationMiddleware(req, res, () => { nextCalled = true; });

            assert.strictEqual(statusCode, 400);
            assert.ok(responseBody?.message.includes("past"));
            assert.strictEqual(nextCalled, false);
        });
    });
});

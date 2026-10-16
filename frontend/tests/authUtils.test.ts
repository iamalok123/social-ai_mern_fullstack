import { describe, it } from "node:test";
import assert from "node:assert";
import { Buffer } from "node:buffer";
import { isTokenExpired } from "../src/utils/authUtils.ts";

describe("Auth Utilities & Token Expiration Suite", () => {
    // Helper to generate mock base64url encoded JWT
    const createMockJwt = (payloadObj: any): string => {
        const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
        const payload = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
        const signature = "mock_signature_12345";
        return `${header}.${payload}.${signature}`;
    };

    it("identifies empty, null or non-string tokens as expired", () => {
        assert.strictEqual(isTokenExpired(""), true);
        assert.strictEqual(isTokenExpired(null as any), true);
        assert.strictEqual(isTokenExpired(undefined as any), true);
        assert.strictEqual(isTokenExpired(12345 as any), true);
    });

    it("identifies malformed tokens without 3 parts as expired", () => {
        assert.strictEqual(isTokenExpired("invalid-token-string"), true);
        assert.strictEqual(isTokenExpired("part1.part2"), true);
        assert.strictEqual(isTokenExpired("part1.part2.part3.part4"), true);
    });

    it("detects expired tokens where exp timestamp is in the past", () => {
        const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
        const token = createMockJwt({ id: "user_123", exp: pastTimestamp });
        assert.strictEqual(isTokenExpired(token), true);
    });

    it("detects tokens near expiration within the 10s buffer window", () => {
        const nearExpTimestamp = Math.floor(Date.now() / 1000) + 5; // 5 seconds in future (within 10s buffer)
        const token = createMockJwt({ id: "user_123", exp: nearExpTimestamp });
        assert.strictEqual(isTokenExpired(token), true);
    });

    it("identifies valid future tokens as not expired", () => {
        const futureTimestamp = Math.floor(Date.now() / 1000) + 86400; // 1 day in future
        const token = createMockJwt({ id: "user_123", exp: futureTimestamp });
        assert.strictEqual(isTokenExpired(token), false);
    });

    it("handles tokens with corrupt payload base64 gracefully as expired", () => {
        const token = "header.invalid!!base64.signature";
        assert.strictEqual(isTokenExpired(token), true);
    });
});

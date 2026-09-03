import { describe, it } from "node:test";
import assert from "node:assert";
import "../services/social/index.js";
import { postValidationMiddleware } from "../middlewares/postValidationMiddleware.js";
import { getAllPlatforms, getPlatformById } from "../controllers/platformController.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";

describe("Routes, Controllers & Middlewares Test Suite", () => {
    describe("postValidationMiddleware", () => {
        it("rejects post with missing content", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const req: any = {
                body: {
                    content: "",
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
            const next = () => { nextCalled = true; };

            postValidationMiddleware(req, res, next);

            assert.strictEqual(statusCode, 400);
            assert.strictEqual(responseBody?.message, "Post content is required.");
            assert.strictEqual(nextCalled, false);
        });

        it("rejects post with missing platforms", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const req: any = {
                body: {
                    content: "Valid content",
                    platforms: "[]",
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
            const next = () => { nextCalled = true; };

            postValidationMiddleware(req, res, next);

            assert.strictEqual(statusCode, 400);
            assert.strictEqual(responseBody?.message, "At least one platform must be selected.");
            assert.strictEqual(nextCalled, false);
        });

        it("rejects post with invalid scheduled date", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const req: any = {
                body: {
                    content: "Valid content",
                    platforms: ["twitter"],
                    scheduledFor: "invalid-date-string"
                }
            };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            postValidationMiddleware(req, res, next);

            assert.strictEqual(statusCode, 400);
            assert.strictEqual(responseBody?.message, "Invalid scheduled date format.");
            assert.strictEqual(nextCalled, false);
        });

        it("rejects Instagram when no media is attached", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const req: any = {
                body: {
                    content: "Instagram text only",
                    platforms: JSON.stringify(["instagram"]),
                    scheduledFor: new Date().toISOString()
                },
                files: []
            };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            postValidationMiddleware(req, res, next);

            assert.strictEqual(statusCode, 400);
            assert.ok(responseBody?.message.includes("requires at least one image or video"));
            assert.strictEqual(nextCalled, false);
        });

        it("accepts valid multi-platform request (Twitter + LinkedIn + Instagram) and parses fields", () => {
            const req: any = {
                body: {
                    content: "Excited to share our new launch!",
                    platforms: JSON.stringify(["twitter", "linkedin", "instagram"]),
                    scheduledFor: new Date(Date.now() + 3600000).toISOString(),
                    mediaUrls: JSON.stringify(["https://res.cloudinary.com/demo/image/upload/sample.jpg"]),
                    firstComment: "Check details at https://launch.example.com",
                    disableLinkPreview: "true"
                },
                files: []
            };
            let statusCode = 200;
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: () => {} };
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            postValidationMiddleware(req, res, next);

            assert.strictEqual(nextCalled, true);
            assert.strictEqual(statusCode, 200);
            assert.deepStrictEqual(req.body.parsedPlatforms, ["twitter", "linkedin", "instagram"]);
            assert.deepStrictEqual(req.body.parsedMediaUrls, ["https://res.cloudinary.com/demo/image/upload/sample.jpg"]);
            assert.strictEqual(req.body.parsedDisableLinkPreview, true);
            assert.strictEqual(req.body.parsedFirstComment, "Check details at https://launch.example.com");
        });
    });

    describe("platformController", () => {
        it("getAllPlatforms returns capabilities for all 4 platforms", () => {
            let responseData: any = null;
            const req: any = {};
            const res: any = {
                json: (data: any) => { responseData = data; }
            };

            getAllPlatforms(req, res);

            assert.ok(Array.isArray(responseData));
            assert.strictEqual(responseData.length, 4);
            const ids = responseData.map((p: any) => p.platformId);
            assert.ok(ids.includes("twitter"));
            assert.ok(ids.includes("linkedin"));
            assert.ok(ids.includes("instagram"));
            assert.ok(ids.includes("facebook"));
        });

        it("getPlatformById returns single platform capabilities", () => {
            let responseData: any = null;
            const req: any = { params: { platform: "twitter" } };
            const res: any = {
                json: (data: any) => { responseData = data; }
            };

            getPlatformById(req, res);

            assert.ok(responseData);
            assert.strictEqual(responseData.platformId, "twitter");
            assert.strictEqual(responseData.maxMediaCount, 4);
            assert.strictEqual(responseData.supportsPolls, true);
        });

        it("getPlatformById returns 404 for unknown platform", () => {
            let statusCode = 200;
            let responseData: any = null;
            const req: any = { params: { platform: "unknown_network" } };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseData = data; } };
                }
            };

            getPlatformById(req, res);

            assert.strictEqual(statusCode, 404);
            assert.ok(responseData?.message.includes("not found"));
        });
    });

    describe("Multi-Platform Data Extraction in Adapters", () => {
        it("Twitter adapter correctly extracts poll and reply settings", () => {
            const twitter = SocialPlatformRegistry.get("twitter")!;
            const details = twitter.extractPlatformDetails({
                content: "Twitter poll",
                platformSpecificData: {
                    twitter: {
                        replySettings: "verified",
                        poll: { options: ["A", "B"], durationMinutes: 60 }
                    }
                }
            });

            assert.strictEqual(details.status, "pending");
            assert.strictEqual(details.replySettings, "verified");
            assert.deepStrictEqual(details.poll?.options, ["A", "B"]);
        });

        it("LinkedIn adapter extracts documentTitle, firstComment and disableLinkPreview", () => {
            const linkedin = SocialPlatformRegistry.get("linkedin")!;
            const details = linkedin.extractPlatformDetails({
                content: "LinkedIn doc",
                firstComment: "First comment text",
                disableLinkPreview: true,
                platformSpecificData: {
                    linkedin: {
                        documentTitle: "SlideDeck.pdf"
                    }
                }
            });

            assert.strictEqual(details.status, "pending");
            assert.strictEqual(details.firstComment, "First comment text");
            assert.strictEqual(details.disableLinkPreview, true);
            assert.strictEqual(details.documentTitle, "SlideDeck.pdf");
        });

        it("Instagram adapter extracts reel settings, collaborators and user tags", () => {
            const instagram = SocialPlatformRegistry.get("instagram")!;
            const details = instagram.extractPlatformDetails({
                content: "Reel caption",
                platformSpecificData: {
                    instagram: {
                        contentType: "reel",
                        reelCover: "https://example.com/cover.png",
                        collaborators: ["brand_partner"],
                        userTags: [{ username: "model", x: 0.5, y: 0.5 }]
                    }
                }
            });

            assert.strictEqual(details.status, "pending");
            assert.strictEqual(details.contentType, "reel");
            assert.strictEqual(details.reelCover, "https://example.com/cover.png");
            assert.deepStrictEqual(details.collaborators, ["brand_partner"]);
            assert.strictEqual(details.userTags?.[0].username, "model");
        });

        it("Facebook adapter extracts carouselCards, title and draft mode", () => {
            const facebook = SocialPlatformRegistry.get("facebook")!;
            const details = facebook.extractPlatformDetails({
                content: "Facebook carousel",
                platformSpecificData: {
                    facebook: {
                        title: "Spring Collection",
                        draft: true,
                        carouselCards: [
                            { link: "https://shop.com/1", name: "Card 1" },
                            { link: "https://shop.com/2", name: "Card 2" }
                        ]
                    }
                }
            });

            assert.strictEqual(details.status, "pending");
            assert.strictEqual(details.title, "Spring Collection");
            assert.strictEqual(details.draft, true);
            assert.strictEqual(details.carouselCards?.length, 2);
        });
    });
});

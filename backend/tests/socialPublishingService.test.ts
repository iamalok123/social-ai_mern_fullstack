import { describe, it } from "node:test";
import assert from "node:assert";
import "../services/social/index.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";

describe("Multi-Platform Broadcasting & Error Normalization", () => {
    it("builds multi-platform payloads for Twitter, LinkedIn, Instagram, and Facebook simultaneously", () => {
        const twitter = SocialPlatformRegistry.get("twitter")!;
        const linkedin = SocialPlatformRegistry.get("linkedin")!;
        const instagram = SocialPlatformRegistry.get("instagram")!;
        const facebook = SocialPlatformRegistry.get("facebook")!;

        const mockPost = {
            content: "Check out our global product announcement! https://company.com/announcement",
            firstComment: "Link for quick access: https://company.com/announcement",
            disableLinkPreview: true,
            platformDetails: {
                twitter: {
                    replySettings: "following",
                },
                linkedin: {
                    documentTitle: "Product Overview",
                    disableLinkPreview: true
                },
                instagram: {
                    contentType: "reel",
                    reelCover: "https://example.com/cover.jpg"
                },
                facebook: {
                    title: "Announcement Video",
                    contentType: "reel"
                }
            }
        };

        const twPayload = twitter.buildZernioPlatformEntry({ platform: "twitter", zernioAccountId: "tw_1" }, mockPost);
        const liPayload = linkedin.buildZernioPlatformEntry({ platform: "linkedin", zernioAccountId: "li_1" }, mockPost);
        const igPayload = instagram.buildZernioPlatformEntry({ platform: "instagram", zernioAccountId: "ig_1" }, mockPost);
        const fbPayload = facebook.buildZernioPlatformEntry({ platform: "facebook", zernioAccountId: "fb_1" }, mockPost);

        // Twitter assertions
        assert.strictEqual(twPayload.platform, "twitter");
        assert.strictEqual(twPayload.accountId, "tw_1");
        assert.strictEqual(twPayload.platformSpecificData?.replySettings, "following");

        // LinkedIn assertions
        assert.strictEqual(liPayload.platform, "linkedin");
        assert.strictEqual(liPayload.accountId, "li_1");
        assert.strictEqual(liPayload.platformSpecificData?.documentTitle, "Product Overview");
        assert.strictEqual(liPayload.platformSpecificData?.disableLinkPreview, true);
        assert.strictEqual(liPayload.platformSpecificData?.firstComment, "Link for quick access: https://company.com/announcement");

        // Instagram assertions
        assert.strictEqual(igPayload.platform, "instagram");
        assert.strictEqual(igPayload.accountId, "ig_1");
        assert.strictEqual(igPayload.platformSpecificData?.reelCover, "https://example.com/cover.jpg");

        // Facebook assertions
        assert.strictEqual(fbPayload.platform, "facebook");
        assert.strictEqual(fbPayload.accountId, "fb_1");
        assert.strictEqual(fbPayload.platformSpecificData?.title, "Announcement Video");
        assert.strictEqual(fbPayload.platformSpecificData?.contentType, "reel");
    });

    describe("Per-Platform Error Normalization", () => {
        it("LinkedIn: recognizes 422 duplicate content error", () => {
            const linkedin = SocialPlatformRegistry.get("linkedin")!;
            const error = {
                response: {
                    status: 422,
                    data: { message: "urn:li:share: Duplicate content detected" }
                }
            };
            const normalized = linkedin.normalizeError(error);
            assert.ok(normalized?.includes("LinkedIn duplicate content error (422)"));
            assert.ok(normalized?.includes("modify the text meaningfully"));
        });

        it("LinkedIn: recognizes 401 token expiration error", () => {
            const linkedin = SocialPlatformRegistry.get("linkedin")!;
            const error = {
                response: {
                    status: 401,
                    data: { message: "Token expired or revoked" }
                }
            };
            const normalized = linkedin.normalizeError(error);
            assert.ok(normalized?.includes("token expired or revoked"));
            assert.ok(normalized?.includes("Channels & Accounts to reconnect"));
        });

        it("Twitter: recognizes duplicate tweet status error", () => {
            const twitter = SocialPlatformRegistry.get("twitter")!;
            const error = {
                response: {
                    status: 403,
                    data: { message: "Status is a duplicate." }
                }
            };
            const normalized = twitter.normalizeError(error);
            assert.ok(normalized?.includes("Duplicate tweet detected"));
        });

        it("Twitter: recognizes 429 rate limit error", () => {
            const twitter = SocialPlatformRegistry.get("twitter")!;
            const error = {
                response: {
                    status: 429,
                    data: { message: "Rate limit exceeded" }
                }
            };
            const normalized = twitter.normalizeError(error);
            assert.ok(normalized?.includes("Rate limit exceeded"));
        });

        it("Instagram: recognizes aspect ratio mismatch error", () => {
            const instagram = SocialPlatformRegistry.get("instagram")!;
            const error = {
                response: {
                    status: 400,
                    data: { message: "Invalid media aspect ratio: 2.39:1" }
                }
            };
            const normalized = instagram.normalizeError(error);
            assert.ok(normalized?.includes("Media aspect ratio is not supported"));
            assert.ok(normalized?.includes("1:1 square, 4:5 portrait, or 16:9 landscape"));
        });

        it("Facebook: recognizes page permission error", () => {
            const facebook = SocialPlatformRegistry.get("facebook")!;
            const error = {
                response: {
                    status: 403,
                    data: { message: "User does not have permission to manage this page" }
                }
            };
            const normalized = facebook.normalizeError(error);
            assert.ok(normalized?.includes("Insufficient permissions for the selected Facebook Page"));
        });
    });
});

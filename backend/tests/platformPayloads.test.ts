import { describe, it } from "node:test";
import assert from "node:assert";
import "../services/social/index.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";

describe("Platform Payload Generation & Error Normalization", () => {
    it("LinkedIn: correctly formats firstComment and disableLinkPreview in payload", () => {
        const linkedin = SocialPlatformRegistry.get("linkedin")!;
        const mockAccount = { platform: "linkedin", zernioAccountId: "acc_li_123" };
        const mockPost = {
            content: "Check out this link https://example.com",
            firstComment: "Link in comments: https://example.com",
            disableLinkPreview: true,
            platformDetails: {
                linkedin: {
                    documentTitle: "My Presentation PDF"
                }
            }
        };

        const payload = linkedin.buildZernioPlatformEntry(mockAccount, mockPost);

        assert.strictEqual(payload.platform, "linkedin");
        assert.strictEqual(payload.accountId, "acc_li_123");
        assert.strictEqual(payload.platformSpecificData?.firstComment, "Link in comments: https://example.com");
        assert.strictEqual(payload.platformSpecificData?.disableLinkPreview, true);
        assert.strictEqual(payload.platformSpecificData?.documentTitle, "My Presentation PDF");
    });

    it("Twitter: builds poll and reply settings payload", () => {
        const twitter = SocialPlatformRegistry.get("twitter")!;
        const mockAccount = { platform: "twitter", zernioAccountId: "acc_tw_123" };
        const mockPost = {
            content: "What is your favorite stack?",
            platformDetails: {
                twitter: {
                    replySettings: "following",
                    poll: { options: ["MERN", "Next.js", "Remix"], durationMinutes: 1440 }
                }
            }
        };

        const payload = twitter.buildZernioPlatformEntry(mockAccount, mockPost);

        assert.strictEqual(payload.platform, "twitter");
        assert.strictEqual(payload.platformSpecificData?.replySettings, "following");
        assert.deepStrictEqual(payload.platformSpecificData?.poll?.options, ["MERN", "Next.js", "Remix"]);
    });

    it("Instagram: sets reelCover and contentType", () => {
        const instagram = SocialPlatformRegistry.get("instagram")!;
        const mockAccount = { platform: "instagram", zernioAccountId: "acc_ig_123" };
        const mockPost = {
            content: "Behind the scenes reel",
            platformDetails: {
                instagram: {
                    contentType: "reel",
                    reelCover: "https://example.com/cover.jpg",
                    collaborators: ["john_doe"]
                }
            }
        };

        const payload = instagram.buildZernioPlatformEntry(mockAccount, mockPost);

        assert.strictEqual(payload.platform, "instagram");
        assert.strictEqual(payload.platformSpecificData?.reelCover, "https://example.com/cover.jpg");
        assert.deepStrictEqual(payload.platformSpecificData?.collaborators, ["john_doe"]);
    });

    it("LinkedIn: normalizes 422 duplicate content error with helpful message", () => {
        const linkedin = SocialPlatformRegistry.get("linkedin")!;
        const mockError = {
            response: {
                status: 422,
                data: { message: "Duplicate content detected: urn:li:share:12345" }
            }
        };

        const normalized = linkedin.normalizeError(mockError);
        assert.ok(normalized);
        assert.ok(normalized.includes("LinkedIn duplicate content error (422)"));
    });

    it("Twitter: normalizes duplicate status error", () => {
        const twitter = SocialPlatformRegistry.get("twitter")!;
        const mockError = {
            response: {
                status: 403,
                data: { message: "Status is a duplicate" }
            }
        };

        const normalized = twitter.normalizeError(mockError);
        assert.ok(normalized);
        assert.ok(normalized.includes("Duplicate tweet detected"));
    });
});

import { describe, it } from "node:test";
import assert from "node:assert";
import "../services/social/index.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";
import { formatYoutubeTags, validateYoutubePostContent } from "../services/social/platforms/youtube/youtubeService.js";

describe("YouTube Platform Integration & Zernio Specification Suite", () => {
    const mockAccount = { platform: "youtube", zernioAccountId: "yt_acc_123" };
    const youtube = SocialPlatformRegistry.get("youtube")!;

    describe("Registry & Capabilities", () => {
        it("should be registered in SocialPlatformRegistry with correct capabilities", () => {
            assert.ok(youtube, "YouTube adapter should be registered");
            assert.strictEqual(youtube.platformId, "youtube");
            assert.strictEqual(youtube.displayName, "YouTube");

            const caps = youtube.getCapabilities();
            assert.strictEqual(caps.maxCharacters, 5000);
            assert.deepStrictEqual(caps.supportedMediaTypes, ["video"]);
            assert.strictEqual(caps.maxMediaCount, 1);
            assert.strictEqual(caps.supportsFirstComment, true);
            assert.strictEqual(caps.supportsCustomTitle, true);
        });
    });

    describe("Tag Formatting (formatYoutubeTags)", () => {
        it("should strip leading #, deduplicate, and enforce length limits", () => {
            const raw = ["#javascript", "coding", "javascript", "#webdev", "a".repeat(101)];
            const formatted = formatYoutubeTags(raw);

            assert.strictEqual(formatted.includes("javascript"), true);
            assert.strictEqual(formatted.includes("coding"), true);
            assert.strictEqual(formatted.includes("webdev"), true);
            assert.strictEqual(formatted.filter((t) => t === "javascript").length, 1, "Should deduplicate tags");
            assert.strictEqual(formatted.some((t) => t.length > 100), false, "Should skip tags > 100 chars");
        });

        it("should parse comma-separated strings", () => {
            const formatted = formatYoutubeTags("react, nodejs, #express");
            assert.deepStrictEqual(formatted, ["react", "nodejs", "express"]);
        });
    });

    describe("Validation Rules (validateYoutubePostContent)", () => {
        it("should reject posts with 0 media items (text-only)", () => {
            const result = youtube.validatePost({
                content: "Hello YouTube World",
                mediaItems: []
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some((e) => e.includes("requires exactly 1 video")));
        });

        it("should reject image-only posts", () => {
            const result = youtube.validatePost({
                content: "Photo post",
                mediaItems: [{ url: "https://example.com/pic.jpg", type: "image" }]
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some((e) => e.includes("only supports video uploads")));
        });

        it("should reject posts with more than 1 video", () => {
            const result = youtube.validatePost({
                content: "Multiple videos",
                mediaItems: [
                    { url: "https://example.com/v1.mp4", type: "video" },
                    { url: "https://example.com/v2.mp4", type: "video" }
                ]
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some((e) => e.includes("only supports 1 video per post")));
        });

        it("should reject cloud storage URLs that return HTML viewers", () => {
            const result = youtube.validatePost({
                content: "Google Drive video",
                mediaItems: [{ url: "https://drive.google.com/file/d/12345/view", type: "video" }]
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some((e) => e.includes("Google Drive, Dropbox, OneDrive, or iCloud")));
        });

        it("should reject titles exceeding 100 characters", () => {
            const result = youtube.validatePost({
                content: "Video with super long title",
                mediaItems: [{ url: "https://example.com/video.mp4", type: "video" }],
                platformSpecificData: {
                    youtube: {
                        title: "T".repeat(101)
                    }
                }
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some((e) => e.includes("title exceeds the 100 character limit")));
        });

        it("should reject descriptions exceeding 5,000 characters", () => {
            const result = youtube.validatePost({
                content: "D".repeat(5001),
                mediaItems: [{ url: "https://example.com/video.mp4", type: "video" }]
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some((e) => e.includes("description exceeds the 5,000 character limit")));
        });

        it("should warn if custom thumbnail is passed for a Short", () => {
            const result = youtube.validatePost({
                content: "Short video",
                mediaItems: [{ url: "https://example.com/short.mp4", type: "video", thumbnail: "https://example.com/thumb.jpg" }],
                platformSpecificData: {
                    youtube: {
                        isShort: true,
                        thumbnail: "https://example.com/thumb.jpg"
                    }
                }
            });
            assert.strictEqual(result.isValid, true);
            assert.ok(result.warnings && result.warnings.some((w) => w.includes("does not support custom thumbnails for Shorts")));
        });

        it("should accept valid video post with full metadata", () => {
            const result = youtube.validatePost({
                content: "Full video tutorial.\n\nEnjoy learning!",
                mediaItems: [{ url: "https://example.com/video.mp4", type: "video" }],
                platformSpecificData: {
                    youtube: {
                        title: "TypeScript Deep Dive",
                        visibility: "public",
                        categoryId: "27",
                        madeForKids: false,
                        containsSyntheticMedia: false,
                        playlistId: "PL12345",
                        firstComment: "Link in description!"
                    }
                }
            });
            assert.strictEqual(result.isValid, true);
            assert.strictEqual(result.errors.length, 0);
        });
    });

    describe("Payload Generation & Zernio API Mapping", () => {
        it("should construct valid Zernio platform payload with title and COPPA flags", () => {
            const mockPost = {
                content: "Mastering Node.js\n\nFull backend course.",
                platformSpecificData: {
                    youtube: {
                        title: "Node.js Complete Guide",
                        visibility: "unlisted",
                        categoryId: "27",
                        madeForKids: false,
                        containsSyntheticMedia: true,
                        playlistId: "PL_tutorials_999",
                        firstComment: "Source code is available on GitHub."
                    }
                }
            };

            const payload = youtube.buildZernioPlatformEntry(mockAccount, mockPost);

            assert.strictEqual(payload.platform, "youtube");
            assert.strictEqual(payload.accountId, "yt_acc_123");
            assert.deepStrictEqual(payload.platformSpecificData, {
                title: "Node.js Complete Guide",
                visibility: "unlisted",
                categoryId: "27",
                madeForKids: false,
                containsSyntheticMedia: true,
                playlistId: "PL_tutorials_999",
                firstComment: "Source code is available on GitHub."
            });
        });

        it("should fallback title to first line of content if title is not specified", () => {
            const mockPost = {
                content: "First Line As Video Title\n\nRemaining description text.",
                platformSpecificData: {
                    youtube: {
                        visibility: "public"
                    }
                }
            };

            const payload = youtube.buildZernioPlatformEntry(mockAccount, mockPost);
            assert.strictEqual(payload.platformSpecificData?.title, "First Line As Video Title");
            assert.strictEqual(payload.platformSpecificData?.visibility, "public");
            assert.strictEqual(payload.platformSpecificData?.categoryId, "22");
        });
    });

    describe("Error Normalization for Zernio YouTube Errors", () => {
        it("normalizes suspended channel 403 error", () => {
            const err = {
                response: {
                    data: {
                        message: "The YouTube account of the authenticated user is suspended."
                    }
                }
            };
            const normalized = youtube.normalizeError(err);
            assert.ok(normalized?.includes("YouTube channel is suspended"));
        });

        it("normalizes quota exceeded error", () => {
            const err = {
                message: "YouTube daily upload quota exceeded"
            };
            const normalized = youtube.normalizeError(err);
            assert.ok(normalized?.includes("upload quota exceeded"));
        });

        it("normalizes video fetch 404 error", () => {
            const err = {
                message: "Failed to fetch video from URL: 404"
            };
            const normalized = youtube.normalizeError(err);
            assert.ok(normalized?.includes("could not download the video"));
        });
    });
});

import { describe, it } from "node:test";
import assert from "node:assert";
import "../services/social/index.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";

describe("Facebook Platform Integration & Zernio Specification Suite", () => {
    const facebook = SocialPlatformRegistry.get("facebook")!;
    const mockAccount = { platform: "facebook", zernioAccountId: "fb_acc_999" };

    describe("Payload Generation & facebookSettings Nesting", () => {
        it("correctly nests draft inside facebookSettings", () => {
            const mockPost = {
                content: "Review draft post before publishing",
                platformDetails: {
                    facebook: {
                        draft: true,
                        contentType: "feed"
                    }
                }
            };

            const payload = facebook.buildZernioPlatformEntry(mockAccount, mockPost);

            assert.strictEqual(payload.platform, "facebook");
            assert.strictEqual(payload.accountId, "fb_acc_999");
            assert.strictEqual(payload.platformSpecificData?.facebookSettings?.draft, true);
        });

        it("nests carouselCards, carouselLink and suppresses firstComment in draft", () => {
            const mockPost = {
                content: "Check out our catalog",
                firstComment: "Shop now at https://store.com",
                platformDetails: {
                    facebook: {
                        draft: true,
                        carouselLink: "https://store.com",
                        carouselCards: [
                            { link: "https://store.com/item1", name: "Item 1", description: "Desc 1" },
                            { link: "https://store.com/item2", name: "Item 2", description: "Desc 2" }
                        ]
                    }
                }
            };

            const payload = facebook.buildZernioPlatformEntry(mockAccount, mockPost);

            assert.strictEqual(payload.platformSpecificData?.facebookSettings?.draft, true);
            assert.strictEqual(payload.platformSpecificData?.facebookSettings?.carouselLink, "https://store.com");
            assert.strictEqual(payload.platformSpecificData?.facebookSettings?.carouselCards?.length, 2);
            // First comment must be skipped when draft is true
            assert.strictEqual(payload.platformSpecificData?.firstComment, undefined);
        });

        it("correctly nests textFormatPresetId and formats geoRestriction", () => {
            const mockPost = {
                content: "Major announcement today!",
                platformDetails: {
                    facebook: {
                        textFormatPresetId: "12345",
                        geoRestriction: {
                            countries: ["us", "gb", "ca"]
                        }
                    }
                }
            };

            const payload = facebook.buildZernioPlatformEntry(mockAccount, mockPost);

            assert.strictEqual(payload.platformSpecificData?.facebookSettings?.textFormatPresetId, "12345");
            assert.deepStrictEqual(payload.platformSpecificData?.geoRestriction?.countries, ["US", "GB", "CA"]);
        });

        it("supports first comment on feed posts and reels when draft is false", () => {
            const mockPostFeed = {
                content: "Feed post with comment",
                firstComment: "First comment here",
                platformDetails: {
                    facebook: { draft: false, contentType: "feed" }
                }
            };
            const payloadFeed = facebook.buildZernioPlatformEntry(mockAccount, mockPostFeed);
            assert.strictEqual(payloadFeed.platformSpecificData?.firstComment, "First comment here");

            const mockPostReel = {
                content: "Reel caption",
                firstComment: "Reel comment",
                platformDetails: {
                    facebook: { draft: false, contentType: "reel", title: "My Reel" }
                }
            };
            const payloadReel = facebook.buildZernioPlatformEntry(mockAccount, mockPostReel);
            assert.strictEqual(payloadReel.platformSpecificData?.firstComment, "Reel comment");
            assert.strictEqual(payloadReel.platformSpecificData?.title, "My Reel");

            // Story must suppress firstComment
            const mockPostStory = {
                content: "Story caption",
                firstComment: "Story comment",
                platformDetails: {
                    facebook: { draft: false, contentType: "story" }
                }
            };
            const payloadStory = facebook.buildZernioPlatformEntry(mockAccount, mockPostStory);
            assert.strictEqual(payloadStory.platformSpecificData?.firstComment, undefined);
        });
    });

    describe("Facebook Validation Guardrails", () => {
        it("rejects mixing images and videos in the same post", () => {
            const result = facebook.validatePost({
                content: "Mixing media",
                mediaItems: [
                    { url: "photo.jpg", type: "image" },
                    { url: "video.mp4", type: "video" }
                ]
            });

            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some((e) => e.includes("mixing images and videos")));
        });

        it("rejects more than 1 video", () => {
            const result = facebook.validatePost({
                content: "Two videos",
                mediaItems: [
                    { url: "video1.mp4", type: "video" },
                    { url: "video2.mp4", type: "video" }
                ]
            });

            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some((e) => e.includes("only support up to 1 video")));
        });

        it("rejects more than 10 images", () => {
            const images = Array.from({ length: 11 }, (_, i) => ({
                url: `img${i}.jpg`,
                type: "image" as const
            }));
            const result = facebook.validatePost({
                content: "Too many images",
                mediaItems: images
            });

            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some((e) => e.includes("maximum of 10 images")));
        });

        it("validates large text background preset restrictions", () => {
            // Cannot use with media
            const resultWithMedia = facebook.validatePost({
                content: "Background text with media",
                mediaItems: [{ url: "photo.jpg", type: "image" }],
                platformSpecificData: {
                    facebook: { textFormatPresetId: "123" }
                }
            });
            assert.strictEqual(resultWithMedia.isValid, false);
            assert.ok(resultWithMedia.errors.some((e) => e.includes("only available for text-only posts")));

            // Cannot use with story/reel
            const resultWithReel = facebook.validatePost({
                content: "Background text with reel",
                mediaItems: [],
                platformSpecificData: {
                    facebook: { textFormatPresetId: "123", contentType: "reel" }
                }
            });
            assert.strictEqual(resultWithReel.isValid, false);
            assert.ok(resultWithReel.errors.some((e) => e.includes("only supported for feed posts")));

            // Valid text-only preset
            const resultValid = facebook.validatePost({
                content: "Short punchy announcement",
                mediaItems: [],
                platformSpecificData: {
                    facebook: { textFormatPresetId: "123" }
                }
            });
            assert.strictEqual(resultValid.isValid, true);
        });

        it("validates geo-restriction country codes", () => {
            const resultInvalid = facebook.validatePost({
                content: "Restricted post",
                mediaItems: [],
                platformSpecificData: {
                    facebook: {
                        geoRestriction: { countries: ["USA", "12"] }
                    }
                }
            });

            assert.strictEqual(resultInvalid.isValid, false);
            assert.ok(resultInvalid.errors.some((e) => e.includes("Invalid country code")));

            const resultValid = facebook.validatePost({
                content: "Restricted post",
                mediaItems: [],
                platformSpecificData: {
                    facebook: {
                        geoRestriction: { countries: ["US", "GB", "DE"] }
                    }
                }
            });
            assert.strictEqual(resultValid.isValid, true);
        });
    });

    describe("Error Normalization for Zernio / Facebook Errors", () => {
        it("normalizes 4MB photo limit error", () => {
            const err = { response: { data: { message: "Photos should be smaller than 4MB and saved as JPG or PNG." } } };
            const normalized = facebook.normalizeError(err);
            assert.ok(normalized?.includes("Photos must be under 4 MB"));
        });

        it("normalizes inaccessible video URL error", () => {
            const err = { response: { data: { message: "Unable to fetch video file from URL." } } };
            const normalized = facebook.normalizeError(err);
            assert.ok(normalized?.includes("Facebook servers could not download the video"));
        });

        it("normalizes identity verification check", () => {
            const err = { response: { data: { message: "Confirm your identity before you can publish as this Page." } } };
            const normalized = facebook.normalizeError(err);
            assert.ok(normalized?.includes("identity verification"));
        });

        it("normalizes max retries reached error", () => {
            const err = { response: { data: { message: "Publishing failed due to max retries reached" } } };
            const normalized = facebook.normalizeError(err);
            assert.ok(normalized?.includes("Publishing failed after maximum retries"));
        });
    });
});

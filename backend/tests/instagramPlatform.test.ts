import { describe, it } from "node:test";
import assert from "node:assert";
import "../services/social/index.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";
import { Post } from "../models/Post.js";

describe("Instagram Platform Integration & Zernio Specification Suite", () => {
    const instagram = SocialPlatformRegistry.get("instagram")!;
    const mockAccount = { platform: "instagram", zernioAccountId: "ig_acc_888" };

    describe("Payload Generation & Zernio API Mapping", () => {
        it("correctly builds feed payload with thumbnail and user tags", () => {
            const mockPost = {
                content: "Exploring the mountains! 🏔️",
                media: [
                    { type: "image", url: "https://res.cloudinary.com/demo/image/upload/sample.jpg" }
                ],
                platformDetails: {
                    instagram: {
                        contentType: "feed",
                        instagramThumbnail: "https://res.cloudinary.com/demo/image/upload/thumb.jpg",
                        userTags: [
                            { username: "traveler_dan", x: 0.5, y: 0.8 }
                        ],
                        collaborators: ["mountain_crew"],
                        locationId: "12345678",
                        commentsEnabled: true
                    }
                }
            };

            const payload = instagram.buildZernioPlatformEntry(mockAccount, mockPost);

            assert.strictEqual(payload.platform, "instagram");
            assert.strictEqual(payload.accountId, "ig_acc_888");
            assert.strictEqual(payload.platformSpecificData?.contentType, "feed");
            assert.strictEqual(payload.platformSpecificData?.instagramThumbnail, "https://res.cloudinary.com/demo/image/upload/thumb.jpg");
            // Backward compatibility
            assert.strictEqual(payload.platformSpecificData?.reelCover, "https://res.cloudinary.com/demo/image/upload/thumb.jpg");
            assert.strictEqual(payload.platformSpecificData?.locationId, "12345678");
            assert.strictEqual(payload.platformSpecificData?.commentsEnabled, true);
            assert.strictEqual(payload.platformSpecificData?.userTags?.length, 1);
            assert.strictEqual(payload.platformSpecificData?.userTags?.[0]?.username, "traveler_dan");
            assert.deepStrictEqual(payload.platformSpecificData?.collaborators, ["mountain_crew"]);
        });

        it("correctly builds Reel payload with audioConfiguration, trialParams, and thumbOffset", () => {
            const mockPost = {
                content: "Check out this reel!",
                media: [
                    { type: "video", url: "https://res.cloudinary.com/demo/video/upload/dance.mp4" }
                ],
                platformDetails: {
                    instagram: {
                        contentType: "reel",
                        shareToFeed: true,
                        thumbOffset: 3500,
                        audioConfiguration: {
                            audioId: "music_track_999",
                            audioVolume: 80,
                            videoVolume: 20
                        },
                        trialParams: {
                            graduationStrategy: "performance",
                            duration: "3_days"
                        },
                        userTags: [
                            { username: "dancer_alok" } // Video user tags without coordinates
                        ]
                    }
                }
            };

            const payload = instagram.buildZernioPlatformEntry(mockAccount, mockPost);

            assert.strictEqual(payload.platformSpecificData?.contentType, "reel");
            assert.strictEqual(payload.platformSpecificData?.shareToFeed, true);
            assert.strictEqual(payload.platformSpecificData?.thumbOffset, 3500);
            assert.strictEqual(payload.platformSpecificData?.audioConfiguration?.audioId, "music_track_999");
            assert.strictEqual(payload.platformSpecificData?.audioConfiguration?.audioVolume, 80);
            assert.strictEqual(payload.platformSpecificData?.audioConfiguration?.videoVolume, 20);
            assert.strictEqual(payload.platformSpecificData?.trialParams?.graduationStrategy, "performance");
            assert.strictEqual(payload.platformSpecificData?.userTags?.[0]?.username, "dancer_alok");
            assert.strictEqual(payload.platformSpecificData?.userTags?.[0]?.x, undefined);
        });

        it("correctly builds Paid Partnership payload with branded sponsors", () => {
            const mockPost = {
                content: "Loving this product from @nike!",
                media: [{ type: "image", url: "https://res.cloudinary.com/demo/image/upload/shoes.jpg" }],
                platformDetails: {
                    instagram: {
                        contentType: "feed",
                        isPaidPartnership: true,
                        brandedContentSponsors: ["nike", "nikerunning"]
                    }
                }
            };

            const payload = instagram.buildZernioPlatformEntry(mockAccount, mockPost);

            assert.strictEqual(payload.platformSpecificData?.isPaidPartnership, true);
            assert.deepStrictEqual(payload.platformSpecificData?.brandedContentSponsors, ["nike", "nikerunning"]);
        });
    });

    describe("Instagram Platform Validation Rules", () => {
        it("rejects post without media", () => {
            const result = instagram.validatePost({
                content: "Text only post for Instagram"
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some(e => e.toLowerCase().includes("media")));
        });

        it("Story: allows only 1 media item and rejects 2+ items", () => {
            const result = instagram.validatePost({
                content: "Story caption",
                mediaItems: [
                    { type: "image", url: "https://cdn.example.com/img1.jpg" },
                    { type: "image", url: "https://cdn.example.com/img2.jpg" }
                ],
                platformDetails: {
                    instagram: { contentType: "story" }
                }
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some(e => e.includes("Instagram Stories only support 1 image or 1 video")));
        });

        it("Story: rejects paid partnership, locationId, and audioConfiguration", () => {
            const result = instagram.validatePost({
                content: "Story",
                mediaItems: [{ type: "image", url: "https://cdn.example.com/story.jpg" }],
                platformDetails: {
                    instagram: {
                        contentType: "story",
                        isPaidPartnership: true,
                        locationId: "loc_123",
                        audioConfiguration: { audioId: "track_1" }
                    }
                }
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some(e => e.includes("Paid partnership labels and branded content sponsors are not supported on Instagram Stories")));
            assert.ok(result.errors.some(e => e.includes("Location tags are not supported on Instagram Stories")));
            assert.ok(result.errors.some(e => e.includes("Catalog audio tracks cannot be attached to Instagram Stories")));
        });

        it("Reel: rejects image-only Reel without video", () => {
            const result = instagram.validatePost({
                content: "My reel",
                mediaItems: [{ type: "image", url: "https://cdn.example.com/pic.jpg" }],
                platformDetails: {
                    instagram: { contentType: "reel" }
                }
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some(e => e.includes("Instagram Reels require a video file")));
        });

        it("Cloud storage URLs: blocks Google Drive, Dropbox, OneDrive, iCloud", () => {
            const driveResult = instagram.validatePost({
                content: "Drive video",
                mediaItems: [{ type: "video", url: "https://drive.google.com/file/d/123/view" }],
                platformDetails: { instagram: { contentType: "reel" } }
            });
            assert.strictEqual(driveResult.isValid, false);
            assert.ok(driveResult.errors.some(e => e.includes("Google Drive, Dropbox, OneDrive, or iCloud")));

            const dropboxResult = instagram.validatePost({
                content: "Dropbox image",
                mediaItems: [{ type: "image", url: "https://www.dropbox.com/s/xyz/photo.jpg" }]
            });
            assert.strictEqual(dropboxResult.isValid, false);
            assert.ok(dropboxResult.errors.some(e => e.includes("Google Drive, Dropbox, OneDrive, or iCloud")));
        });

        it("Collaborators: rejects more than 3 collaborators", () => {
            const result = instagram.validatePost({
                content: "Squad goals",
                mediaItems: [{ type: "image", url: "https://cdn.example.com/pic.jpg" }],
                platformDetails: {
                    instagram: {
                        collaborators: ["user1", "user2", "user3", "user4"]
                    }
                }
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some(e => e.includes("Instagram allows a maximum of 3 collaborators")));
        });

        it("Paid partnership: rejects more than 2 branded content sponsors", () => {
            const result = instagram.validatePost({
                content: "Sponsored",
                mediaItems: [{ type: "image", url: "https://cdn.example.com/pic.jpg" }],
                platformDetails: {
                    instagram: {
                        isPaidPartnership: true,
                        brandedContentSponsors: ["sponsor1", "sponsor2", "sponsor3"]
                    }
                }
            });
            assert.strictEqual(result.isValid, false);
            assert.ok(result.errors.some(e => e.includes("maximum of 2 branded content sponsors")));
        });

        it("User tags: requires coordinates for images but allows coordinate-free for video/reels", () => {
            // Image with missing coordinates -> error
            const imgResult = instagram.validatePost({
                content: "Image tag",
                mediaItems: [{ type: "image", url: "https://cdn.example.com/pic.jpg" }],
                platformDetails: {
                    instagram: {
                        contentType: "feed",
                        userTags: [{ username: "friend" }]
                    }
                }
            });
            assert.strictEqual(imgResult.isValid, false);
            assert.ok(imgResult.errors.some(e => e.includes("require (x, y) coordinates")));

            // Reel with missing coordinates -> valid!
            const reelResult = instagram.validatePost({
                content: "Reel tag",
                mediaItems: [{ type: "video", url: "https://cdn.example.com/video.mp4" }],
                platformDetails: {
                    instagram: {
                        contentType: "reel",
                        userTags: [{ username: "friend" }]
                    }
                }
            });
            assert.strictEqual(reelResult.isValid, true);
        });

        it("Audio Configuration: enforces 0-100 volume bounds and audioId requirement", () => {
            const invalidVolume = instagram.validatePost({
                content: "Reel with bad audio",
                mediaItems: [{ type: "video", url: "https://cdn.example.com/vid.mp4" }],
                platformDetails: {
                    instagram: {
                        contentType: "reel",
                        audioConfiguration: {
                            audioId: "track_1",
                            audioVolume: 150
                        }
                    }
                }
            });
            assert.strictEqual(invalidVolume.isValid, false);
            assert.ok(invalidVolume.errors.some(e => e.includes("Audio volume must be between 0 and 100")));

            const missingId = instagram.validatePost({
                content: "Reel with no audioId",
                mediaItems: [{ type: "video", url: "https://cdn.example.com/vid.mp4" }],
                platformDetails: {
                    instagram: {
                        contentType: "reel",
                        audioConfiguration: {
                            audioVolume: 50
                        } as any
                    }
                }
            });
            assert.strictEqual(missingId.isValid, false);
            assert.ok(missingId.errors.some(e => e.includes("audioConfiguration requires an audioId")));
        });
    });

    describe("Error Normalization for Zernio Instagram Errors", () => {
        it("normalizes aspect ratio mismatch error", () => {
            const err = { response: { data: { message: "The image ratio is not supported. Supported aspect ratio: 4:5 to 1.91:1" } } };
            const normalized = instagram.normalizeError(err);
            assert.ok(normalized?.includes("Media aspect ratio is not supported"));
        });

        it("normalizes cloud storage URL error", () => {
            const err = { response: { data: { message: "Cannot process video from this URL Google Drive" } } };
            const normalized = instagram.normalizeError(err);
            assert.ok(normalized?.includes("cloud sharing links"));
        });

        it("normalizes audio requires facebook login error", () => {
            const err = { response: { data: { message: "instagram_audio_requires_facebook_login" } } };
            const normalized = instagram.normalizeError(err);
            assert.ok(normalized?.includes("Catalog audio requires an Instagram account connected via Facebook Login"));
        });

        it("normalizes paid partnership requires facebook login error", () => {
            const err = { response: { data: { message: "instagram_paid_partnership_requires_facebook_login" } } };
            const normalized = instagram.normalizeError(err);
            assert.ok(normalized?.includes("Paid Partnership label requires an Instagram account connected via Facebook Login"));
        });
    });

    describe("Mongoose Post Schema Validation Guardrails", () => {
        it("allows userTags without coordinates in Post document", () => {
            const postDoc = new Post({
                user: "507f1f77bcf86cd799439011",
                scheduledFor: new Date(),
                content: "Video post with coordinate-free tag",
                platforms: ["instagram"],
                status: "draft",
                platformDetails: {
                    instagram: {
                        contentType: "reel",
                        userTags: [
                            { username: "creative_tag" }
                        ],
                        audioConfiguration: {
                            audioId: "track_abc",
                            audioVolume: 90
                        },
                        trialParams: {
                            graduationStrategy: "SS_PERFORMANCE"
                        }
                    }
                }
            });

            const validateErr = postDoc.validateSync();
            assert.strictEqual(validateErr, undefined, "Post schema should accept coordinate-free user tags");
            assert.strictEqual(postDoc.platformDetails.instagram.userTags[0].username, "creative_tag");
            assert.strictEqual(postDoc.platformDetails.instagram.userTags[0].x, undefined);
        });

        it("supports status 'publishing' in Post model", () => {
            const postDoc = new Post({
                user: "507f1f77bcf86cd799439011",
                scheduledFor: new Date(),
                content: "Publishing lock test",
                platforms: ["instagram"],
                status: "publishing"
            });

            const validateErr = postDoc.validateSync();
            assert.strictEqual(validateErr, undefined, "Post schema should accept 'publishing' status");
            assert.strictEqual(postDoc.status, "publishing");
        });
    });
});

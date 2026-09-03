import { describe, it } from "node:test";
import assert from "node:assert";
import "../services/social/index.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";

describe("Platform Specific Validation Tests", () => {
    it("Twitter: blocks more than 4 images", () => {
        const twitter = SocialPlatformRegistry.get("twitter")!;
        const result = twitter.validatePost({
            content: "Testing Twitter images",
            mediaItems: [
                { url: "img1.jpg", type: "image" },
                { url: "img2.jpg", type: "image" },
                { url: "img3.jpg", type: "image" },
                { url: "img4.jpg", type: "image" },
                { url: "img5.jpg", type: "image" },
            ]
        });

        assert.strictEqual(result.isValid, false);
        assert.ok(result.errors.some((e) => e.includes("maximum of 4 images")));
    });

    it("Twitter: blocks mixing video with images", () => {
        const twitter = SocialPlatformRegistry.get("twitter")!;
        const result = twitter.validatePost({
            content: "Testing Twitter mix",
            mediaItems: [
                { url: "video.mp4", type: "video" },
                { url: "img1.jpg", type: "image" },
            ]
        });

        assert.strictEqual(result.isValid, false);
        assert.ok(result.errors.some((e) => e.includes("cannot mix video and images")));
    });

    it("Twitter: blocks polls with media", () => {
        const twitter = SocialPlatformRegistry.get("twitter")!;
        const result = twitter.validatePost({
            content: "Poll test",
            mediaItems: [{ url: "img1.jpg", type: "image" }],
            platformSpecificData: {
                twitter: {
                    poll: { options: ["Option 1", "Option 2"] }
                }
            }
        });

        assert.strictEqual(result.isValid, false);
        assert.ok(result.errors.some((e) => e.includes("polls cannot be combined with media")));
    });

    it("LinkedIn: accepts up to 20 images", () => {
        const linkedin = SocialPlatformRegistry.get("linkedin")!;
        const twentyImages = Array.from({ length: 20 }, (_, i) => ({
            url: `img${i}.jpg`,
            type: "image" as const
        }));

        const result = linkedin.validatePost({
            content: "Testing LinkedIn carousel",
            mediaItems: twentyImages
        });

        assert.strictEqual(result.isValid, true);
        assert.strictEqual(result.errors.length, 0);
    });

    it("Instagram: rejects text-only posts without media", () => {
        const instagram = SocialPlatformRegistry.get("instagram")!;
        const result = instagram.validatePost({
            content: "Text only on Instagram",
            mediaItems: []
        });

        assert.strictEqual(result.isValid, false);
        assert.ok(result.errors.some((e) => e.includes("requires at least one image or video")));
    });

    it("Instagram: rejects more than 3 collaborators", () => {
        const instagram = SocialPlatformRegistry.get("instagram")!;
        const result = instagram.validatePost({
            content: "Collaborator test",
            mediaItems: [{ url: "photo.jpg", type: "image" }],
            platformSpecificData: {
                instagram: {
                    collaborators: ["user1", "user2", "user3", "user4"]
                }
            }
        });

        assert.strictEqual(result.isValid, false);
        assert.ok(result.errors.some((e) => e.includes("maximum of 3 collaborators")));
    });

    it("Facebook: rejects Reel without video", () => {
        const facebook = SocialPlatformRegistry.get("facebook")!;
        const result = facebook.validatePost({
            content: "Facebook Reel text only",
            mediaItems: [{ url: "photo.jpg", type: "image" }],
            platformSpecificData: {
                facebook: { contentType: "reel" }
            }
        });

        assert.strictEqual(result.isValid, false);
        assert.ok(result.errors.some((e) => e.includes("Reels require a video file")));
    });

    it("Facebook: rejects Story without media", () => {
        const facebook = SocialPlatformRegistry.get("facebook")!;
        const result = facebook.validatePost({
            content: "Facebook Story without media",
            mediaItems: [],
            platformSpecificData: {
                facebook: { contentType: "story" }
            }
        });

        assert.strictEqual(result.isValid, false);
        assert.ok(result.errors.some((e) => e.includes("Stories require an image or video")));
    });

    it("Facebook: blocks video in Carousel cards", () => {
        const facebook = SocialPlatformRegistry.get("facebook")!;
        const result = facebook.validatePost({
            content: "Facebook Carousel with video",
            mediaItems: [
                { url: "img1.jpg", type: "image" },
                { url: "video.mp4", type: "video" },
            ],
            platformSpecificData: {
                facebook: {
                    carouselCards: [
                        { link: "https://example.com/1" },
                        { link: "https://example.com/2" }
                    ]
                }
            }
        });

        assert.strictEqual(result.isValid, false);
        assert.ok(result.errors.some((e) => e.includes("Carousel posts only support images, not videos")));
    });
});

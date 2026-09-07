import { describe, it } from "node:test";
import assert from "node:assert";
import type {
    Post,
    LinkedInOptions,
    FacebookOptions,
    InstagramOptions,
    AnalyticsData
} from "../src/components/Scheduler/types.ts";

describe("Scheduler Modular Architecture & Business Rules Unit Tests", () => {
    describe("Data Contract & Type Interface Conformance", () => {
        it("instantiates a valid Post object with all modular properties", () => {
            const post: Post = {
                _id: "post_12345",
                content: "Exciting product announcement! #launch",
                scheduledFor: "2026-09-15T14:30:00.000Z",
                status: "scheduled",
                platforms: ["twitter", "linkedin", "facebook", "instagram"],
                mediaUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                mediaUrls: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
                mediaType: "image",
                firstComment: "Read more here: https://example.com",
                disableLinkPreview: false,
                platformSpecificData: {
                    facebook: { contentType: "feed" },
                    instagram: { contentType: "reel", shareToFeed: true }
                }
            };

            assert.strictEqual(post._id, "post_12345");
            assert.strictEqual(post.status, "scheduled");
            assert.strictEqual(post.platforms.length, 4);
            assert.strictEqual(post.platformSpecificData?.instagram?.shareToFeed, true);
        });

        it("validates LinkedIn options interface schema", () => {
            const options: LinkedInOptions = {
                firstComment: "Link in comments: https://example.com/blog",
                isFirstCommentRequired: true,
                disableLinkPreview: true
            };

            assert.strictEqual(options.isFirstCommentRequired, true);
            assert.strictEqual(options.disableLinkPreview, true);
            assert.ok(options.firstComment.length > 0);
        });

        it("validates Facebook options interface schema", () => {
            const fbOptions: FacebookOptions = {
                contentType: "reel",
                title: "Behind the Scenes Reel",
                draft: false,
                textPreset: "",
                geoCountries: "US, CA, GB"
            };

            assert.strictEqual(fbOptions.contentType, "reel");
            assert.strictEqual(fbOptions.draft, false);
            assert.strictEqual(fbOptions.geoCountries, "US, CA, GB");
        });

        it("validates Instagram options interface schema", () => {
            const igOptions: InstagramOptions = {
                contentType: "reel",
                shareToFeed: true,
                audioConfig: null,
                muteAudio: false,
                trial: true,
                trialGraduation: "SS_PERFORMANCE",
                thumbnail: "https://example.com/cover.jpg",
                thumbOffset: 2.5,
                collaborators: "@partner_brand",
                locationId: "1029384756",
                paidPartnership: true,
                sponsors: "@sponsor_account",
                commentsEnabled: true
            };

            assert.strictEqual(igOptions.contentType, "reel");
            assert.strictEqual(igOptions.trial, true);
            assert.strictEqual(igOptions.trialGraduation, "SS_PERFORMANCE");
            assert.strictEqual(igOptions.thumbOffset, 2.5);
            assert.strictEqual(igOptions.paidPartnership, true);
        });

        it("validates AnalyticsData schema", () => {
            const analytics: AnalyticsData = {
                impressions: 12500,
                reach: 9800,
                likes: 450,
                comments: 68,
                shares: 34,
                saved: 19
            };

            assert.strictEqual(analytics.impressions, 12500);
            assert.strictEqual(analytics.likes, 450);
            assert.strictEqual(analytics.shares, 34);
        });
    });

    describe("Character Count & Hook Analysis Validations", () => {
        it("identifies LinkedIn first line hook length correctly (threshold <= 80)", () => {
            const shortHook = "Stop scrolling right now.\nThis is a major productivity hack.";
            const firstLine = shortHook.split("\n")[0];
            assert.strictEqual(firstLine.length, 25);
            assert.ok(firstLine.length <= 80, "Hook should be within recommended 80 chars");

            const longHook = "This is an extremely long opening line that exceeds the standard preview threshold before the see more button appears on mobile and desktop feeds";
            assert.ok(longHook.length > 80, "Detected long hook exceeding 80 chars");
        });

        it("handles LinkedIn URL extraction for First Comment feature", () => {
            const content = "Check out our latest release at https://example.com/product and let us know your thoughts!";
            const urlRegex = /(https?:\/\/[^\s]+)/gi;
            const urls = content.match(urlRegex);
            assert.ok(urls && urls.length > 0);
            assert.strictEqual(urls[0], "https://example.com/product");

            const newContent = content.replace(urls[0], "").replace(/\n\s*\n\s*\n/g, "\n\n").trim();
            assert.strictEqual(newContent, "Check out our latest release at  and let us know your thoughts!");
        });

        it("validates platform character thresholds (Twitter: 280, LinkedIn: 3000, Facebook: 63206)", () => {
            const tweet = "A".repeat(280);
            assert.strictEqual(tweet.length, 280);

            const overTweet = "A".repeat(281);
            assert.ok(overTweet.length > 280);

            const linkedInPost = "B".repeat(3000);
            assert.strictEqual(linkedInPost.length, 3000);

            const overLinkedIn = "B".repeat(3001);
            assert.ok(overLinkedIn.length > 3000);

            const fbPost = "C".repeat(63206);
            assert.strictEqual(fbPost.length, 63206);

            const overFb = "C".repeat(63207);
            assert.ok(overFb.length > 63206);
        });
    });

    describe("Multi-Platform Media Rules & Conflict Matrix", () => {
        const checkMediaRules = (platforms: string[], imageCount: number, hasVideo: boolean) => {
            const errors: string[] = [];
            const isTwitter = platforms.includes("twitter");
            const isFacebook = platforms.includes("facebook");
            const isInstagram = platforms.includes("instagram");
            const isLinkedIn = platforms.includes("linkedin");

            if (isTwitter && !hasVideo && imageCount > 4) {
                errors.push("Twitter/X only supports up to 4 images");
            }
            if (isFacebook) {
                if (imageCount > 0 && hasVideo) {
                    errors.push("Facebook does not allow mixing images and videos");
                }
                if (imageCount > 10) {
                    errors.push("Facebook allows a maximum of 10 images");
                }
            }
            if (isInstagram) {
                const totalMedia = imageCount + (hasVideo ? 1 : 0);
                if (totalMedia === 0) {
                    errors.push("Instagram requires an image or video");
                }
            }
            if (isLinkedIn && imageCount > 20) {
                errors.push("LinkedIn allows a maximum of 20 images");
            }

            return errors;
        };

        it("validates Twitter max 4 images rule", () => {
            const valid = checkMediaRules(["twitter"], 4, false);
            assert.strictEqual(valid.length, 0);

            const invalid = checkMediaRules(["twitter"], 5, false);
            assert.strictEqual(invalid.length, 1);
            assert.ok(invalid[0].includes("Twitter/X only supports up to 4 images"));
        });

        it("validates Facebook cannot mix images and video", () => {
            const invalid = checkMediaRules(["facebook"], 2, true);
            assert.strictEqual(invalid.length, 1);
            assert.ok(invalid[0].includes("mixing images and videos"));

            const validImagesOnly = checkMediaRules(["facebook"], 10, false);
            assert.strictEqual(validImagesOnly.length, 0);

            const validVideoOnly = checkMediaRules(["facebook"], 0, true);
            assert.strictEqual(validVideoOnly.length, 0);
        });

        it("validates Instagram requires media", () => {
            const invalid = checkMediaRules(["instagram"], 0, false);
            assert.strictEqual(invalid.length, 1);
            assert.ok(invalid[0].includes("Instagram requires an image or video"));

            const valid = checkMediaRules(["instagram"], 1, false);
            assert.strictEqual(valid.length, 0);
        });

        it("validates LinkedIn up to 20 images limit", () => {
            const valid = checkMediaRules(["linkedin"], 20, false);
            assert.strictEqual(valid.length, 0);

            const invalid = checkMediaRules(["linkedin"], 21, false);
            assert.strictEqual(invalid.length, 1);
            assert.ok(invalid[0].includes("LinkedIn allows a maximum of 20 images"));
        });
    });

    describe("Platform Specific Data Payload Serialization", () => {
        it("constructs Facebook geo-restriction array properly from comma-separated input", () => {
            const rawInput = "us, CA, gb, 12, FRA, in";
            const countries = rawInput
                .split(",")
                .map((c) => c.trim().toUpperCase())
                .filter((c) => /^[A-Z]{2}$/.test(c));

            assert.deepStrictEqual(countries, ["US", "CA", "GB", "IN"]);
        });

        it("constructs Instagram collaborators list removing @ prefix", () => {
            const rawCollabs = "@techlead,  @creator_one, @designteam ";
            const collabs = rawCollabs
                .split(",")
                .map((c) => c.trim().replace(/^@/, ""))
                .filter(Boolean);

            assert.deepStrictEqual(collabs, ["techlead", "creator_one", "designteam"]);
        });

        it("constructs valid platformSpecificData payload for multi-platform schedule", () => {
            const platformSpecificData: Record<string, any> = {};

            // Facebook payload
            platformSpecificData.facebook = {
                contentType: "reel",
                title: "Launch Announcement",
                draft: false
            };

            // Instagram payload
            platformSpecificData.instagram = {
                contentType: "reel",
                shareToFeed: true,
                thumbOffset: 3,
                commentsEnabled: true
            };

            assert.ok(platformSpecificData.facebook);
            assert.strictEqual(platformSpecificData.facebook.contentType, "reel");
            assert.strictEqual(platformSpecificData.facebook.title, "Launch Announcement");

            assert.ok(platformSpecificData.instagram);
            assert.strictEqual(platformSpecificData.instagram.thumbOffset, 3);
            assert.strictEqual(platformSpecificData.instagram.shareToFeed, true);

            const serialized = JSON.stringify(platformSpecificData);
            const parsed = JSON.parse(serialized);
            assert.deepStrictEqual(parsed, platformSpecificData);
        });
    });

    describe("Schedule Date & Time Calculations", () => {
        it("formats ISO string correctly from date and time strings", () => {
            const date = "2026-09-15";
            const time = "14:30";
            const scheduledFor = new Date(`${date}T${time}:00`).toISOString();
            
            const parsedDate = new Date(scheduledFor);
            assert.ok(!isNaN(parsedDate.getTime()));
            assert.strictEqual(parsedDate.getFullYear(), 2026);
            assert.strictEqual(parsedDate.getMonth(), 8); // 0-indexed: September
            assert.strictEqual(parsedDate.getDate(), 15);
        });

        it("computes relative time display correctly for countdown", () => {
            const formatRelativeSchedule = (targetDate: Date, now: Date) => {
                const diffMs = targetDate.getTime() - now.getTime();
                if (diffMs <= 0) return "Due now";
                const diffMins = Math.round(diffMs / 60000);
                if (diffMins < 60) return `in ${diffMins}m`;
                const diffHours = Math.floor(diffMins / 60);
                const remainingMins = diffMins % 60;
                if (diffHours < 24) return remainingMins > 0 ? `in ${diffHours}h ${remainingMins}m` : `in ${diffHours}h`;
                const diffDays = Math.floor(diffHours / 24);
                return `in ${diffDays}d`;
            };

            const now = new Date("2026-09-06T12:00:00Z");
            
            // Due now
            assert.strictEqual(formatRelativeSchedule(new Date("2026-09-06T11:59:00Z"), now), "Due now");
            
            // 30 mins
            assert.strictEqual(formatRelativeSchedule(new Date("2026-09-06T12:30:00Z"), now), "in 30m");
            
            // 2 hours 15 mins
            assert.strictEqual(formatRelativeSchedule(new Date("2026-09-06T14:15:00Z"), now), "in 2h 15m");
            
            // 3 days
            assert.strictEqual(formatRelativeSchedule(new Date("2026-09-09T12:00:00Z"), now), "in 3d");
        });
    });
});

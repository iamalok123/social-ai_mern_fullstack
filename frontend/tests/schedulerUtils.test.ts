import { describe, it } from "node:test";
import assert from "node:assert";
import {
    calculateTwitterLength,
    getMediaUploaderHint,
    getActivePlatformDisplayName
} from "../src/utils/schedulerUtils.ts";

describe("Frontend Scheduler Utilities Suite", () => {
    describe("calculateTwitterLength", () => {
        it("calculates 0 for empty string", () => {
            assert.strictEqual(calculateTwitterLength(""), 0);
        });

        it("counts basic ASCII characters as 1 unit", () => {
            const text = "Hello World! Social Media Scheduler";
            assert.strictEqual(calculateTwitterLength(text), text.length);
        });

        it("counts any http or https URL as exactly 23 characters", () => {
            const shortUrl = "https://a.co";
            const longUrl = "https://subdomain.company.org/deeply/nested/article/path?ref=campaign&id=987654321";
            
            assert.strictEqual(calculateTwitterLength(shortUrl), 23);
            assert.strictEqual(calculateTwitterLength(longUrl), 23);
        });

        it("correctly counts mixed text with multiple URLs", () => {
            const text = "Read our docs at https://docs.zernio.com and blog at https://zernio.com/blog today!";
            assert.strictEqual(calculateTwitterLength(text), 83);
        });

        it("counts emojis and extended Unicode as 2 units", () => {
            const text = "🚀🔥✨";
            assert.strictEqual(calculateTwitterLength(text), 6);

            const mixed = "Launch 🚀 ready!";
            assert.strictEqual(calculateTwitterLength(mixed), 16);
        });
    });

    describe("getMediaUploaderHint", () => {
        it("returns Twitter single-platform hint", () => {
            const hint = getMediaUploaderHint(["twitter"], true, false, false, false);
            assert.strictEqual(hint, "Twitter/X supports up to 4 images (or 1 video)");
        });

        it("returns Twitter multi-platform limit hint", () => {
            const hint = getMediaUploaderHint(["twitter", "facebook"], true, true, false, false);
            assert.strictEqual(hint, "Twitter/X limit applies: up to 4 images (or 1 video)");
        });

        it("returns Facebook single-platform hint", () => {
            const hint = getMediaUploaderHint(["facebook"], false, true, false, false);
            assert.strictEqual(hint, "Facebook supports up to 10 images (JPEG, PNG, GIF) or 1 video");
        });

        it("returns Facebook multi-platform limit hint with 4MB notice", () => {
            const hint = getMediaUploaderHint(["facebook", "linkedin"], false, true, false, true);
            assert.strictEqual(hint, "Facebook limit applies: up to 10 images (under 4 MB) or 1 video");
        });

        it("returns Instagram mandatory media hint", () => {
            const hint = getMediaUploaderHint(["instagram"], false, false, true, false);
            assert.strictEqual(hint, "Instagram requires media: up to 10 images or 1 video");
        });

        it("returns LinkedIn 20-image hint", () => {
            const hint = getMediaUploaderHint(["linkedin"], false, false, false, true);
            assert.strictEqual(hint, "LinkedIn supports up to 20 images (JPEG, PNG, GIF) or 1 video");
        });

        it("returns default generic hint when no specific platform is selected", () => {
            const hint = getMediaUploaderHint([], false, false, false, false);
            assert.strictEqual(hint, "Supports images (JPEG, PNG, GIF) or video (MP4)");
        });
    });

    describe("getActivePlatformDisplayName", () => {
        it("returns correct display name for single selections", () => {
            assert.strictEqual(getActivePlatformDisplayName(true, false, false, false), "Twitter/X");
            assert.strictEqual(getActivePlatformDisplayName(false, true, false, false), "Facebook");
            assert.strictEqual(getActivePlatformDisplayName(false, false, true, false), "Instagram");
            assert.strictEqual(getActivePlatformDisplayName(false, false, false, true), "LinkedIn");
        });

        it("falls back to Social when none are active", () => {
            assert.strictEqual(getActivePlatformDisplayName(false, false, false, false), "Social");
        });
    });
});

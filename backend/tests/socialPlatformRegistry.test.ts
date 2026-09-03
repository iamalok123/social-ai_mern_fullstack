import { describe, it } from "node:test";
import assert from "node:assert";
import "../services/social/index.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";

describe("SocialPlatformRegistry", () => {
    it("should register all 4 core platforms", () => {
        const expectedPlatforms = ["twitter", "linkedin", "instagram", "facebook"];
        for (const platformId of expectedPlatforms) {
            const service = SocialPlatformRegistry.get(platformId);
            assert.ok(service, `Expected platform service for '${platformId}' to be registered`);
            assert.strictEqual(service.platformId, platformId);
        }
    });

    it("should resolve aliases correctly", () => {
        const xService = SocialPlatformRegistry.get("x");
        assert.ok(xService);
        assert.strictEqual(xService.platformId, "twitter");

        const linkedinPage = SocialPlatformRegistry.get("linkedin_page");
        assert.ok(linkedinPage);
        assert.strictEqual(linkedinPage.platformId, "linkedin");

        const fbPage = SocialPlatformRegistry.get("facebook_page");
        assert.ok(fbPage);
        assert.strictEqual(fbPage.platformId, "facebook");

        const igBiz = SocialPlatformRegistry.get("instagram_business");
        assert.ok(igBiz);
        assert.strictEqual(igBiz.platformId, "instagram");
    });

    it("should return capabilities for all registered platforms", () => {
        const caps = SocialPlatformRegistry.getAllCapabilities();
        assert.ok(Array.isArray(caps));
        assert.strictEqual(caps.length >= 4, true);

        const twitterCap = caps.find((c) => c.platformId === "twitter");
        assert.ok(twitterCap);
        assert.strictEqual(twitterCap.maxMediaCount, 4);
        assert.strictEqual(twitterCap.supportsPolls, true);

        const linkedinCap = caps.find((c) => c.platformId === "linkedin");
        assert.ok(linkedinCap);
        assert.strictEqual(linkedinCap.maxMediaCount, 20);
        assert.strictEqual(linkedinCap.supportsFirstComment, true);

        const instagramCap = caps.find((c) => c.platformId === "instagram");
        assert.ok(instagramCap);
        assert.strictEqual(instagramCap.supportsStories, true);
        assert.strictEqual(instagramCap.supportsReels, true);

        const facebookCap = caps.find((c) => c.platformId === "facebook");
        assert.ok(facebookCap);
        assert.strictEqual(facebookCap.maxMediaCount, 20);
        assert.strictEqual(facebookCap.supportsReels, true);
    });
});

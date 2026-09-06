import { describe, it } from "node:test";
import assert from "node:assert";
import { getInstagramBadgeInfo } from "../src/utils/accountUtils.ts";

describe("Account Utilities Suite", () => {
    describe("getInstagramBadgeInfo", () => {
        it("identifies direct Instagram login when loginMethod is instagram_login", () => {
            const account = {
                platform: "instagram",
                loginMethod: "instagram_login",
                capabilities: { posting: true, analytics: true }
            };
            const result = getInstagramBadgeInfo(account);
            assert.strictEqual(result.badgeText, "📸 Direct Login");
            assert.strictEqual(result.isFacebookLogin, false);
            assert.strictEqual(result.tooltip, "Connected via Direct Instagram Login");
        });

        it("identifies Facebook login when loginMethod is facebook_login", () => {
            const account = {
                platform: "instagram",
                loginMethod: "facebook_login",
                capabilities: { posting: true, analytics: true, catalogAudio: true, paidPartnership: true }
            };
            const result = getInstagramBadgeInfo(account);
            assert.strictEqual(result.badgeText, "⚡ Facebook Login");
            assert.strictEqual(result.isFacebookLogin, true);
            assert.ok(result.tooltip.includes("Facebook Page Login"));
        });

        it("identifies Facebook login when metadata has selectedPageId and selectedPageName", () => {
            const account = {
                platform: "instagram",
                metadata: {
                    loginMethod: "facebook_login",
                    selectedPageId: "1020732941133866",
                    selectedPageName: "PremReel"
                }
            };
            const result = getInstagramBadgeInfo(account);
            assert.strictEqual(result.badgeText, "⚡ Facebook Login");
            assert.strictEqual(result.isFacebookLogin, true);
            assert.ok(result.tooltip.includes("PremReel"));
        });

        it("handles undefined or empty account gracefully by defaulting to direct login", () => {
            const resultUndefined = getInstagramBadgeInfo(undefined);
            assert.strictEqual(resultUndefined.badgeText, "📸 Direct Login");
            assert.strictEqual(resultUndefined.isFacebookLogin, false);

            const resultEmpty = getInstagramBadgeInfo({});
            assert.strictEqual(resultEmpty.badgeText, "📸 Direct Login");
            assert.strictEqual(resultEmpty.isFacebookLogin, false);
        });
    });
});

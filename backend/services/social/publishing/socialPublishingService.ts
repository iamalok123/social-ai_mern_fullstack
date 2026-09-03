import { Post } from "../../../models/Post.js";
import { Account } from "../../../models/Account.js";
import { ActivityLog } from "../../../models/ActivityLog.js";
import zernio from "../../../config/zernio.js";
import { SocialPlatformRegistry } from "../core/SocialPlatformRegistry.js";
import { MediaItem, ZernioPlatformPayload } from "../core/types.js";

export interface PublishResult {
    success: boolean;
    postId: string;
    publishedPlatforms?: string[];
    error?: string;
}

/**
 * Publishes a post across all its configured platforms via Zernio using functional adapters
 */
export async function publishPost(post: any): Promise<PublishResult> {
    let targetedAccounts: any[] = [];

    try {
        // Find connected accounts for all specified platforms
        const accounts = await Account.find({
            user: post.user,
            platform: { $in: post.platforms },
            status: "connected",
            zernioAccountId: { $exists: true }
        });

        targetedAccounts = accounts;

        if (accounts.length === 0) {
            const noAccountMsg = `No connected active accounts found for post ${post._id} on platforms: ${post.platforms.join(", ")}`;
            console.warn(`⚠️ [PUBLISHER] ${noAccountMsg}`);
            post.status = "failed";
            post.failedReason = noAccountMsg;
            await post.save();
            return { success: false, postId: post._id.toString(), error: noAccountMsg };
        }

        // Build Zernio platforms payload via registered functional adapters
        const zernioPlatforms: ZernioPlatformPayload[] = [];
        for (const acc of accounts) {
            const adapter = SocialPlatformRegistry.get(acc.platform);
            if (adapter) {
                const entry = adapter.buildZernioPlatformEntry(acc, post);
                zernioPlatforms.push(entry);
            } else {
                // Generic fallback for any unregistered platform
                zernioPlatforms.push({
                    platform: acc.platform,
                    accountId: acc.zernioAccountId!,
                    ...(post.platformSpecificData?.[acc.platform]
                        ? { platformSpecificData: post.platformSpecificData[acc.platform] }
                        : {})
                });
            }
        }

        // Consolidate mediaItems payload
        let mediaItemsPayload: MediaItem[] = [];
        if (Array.isArray(post.mediaItems) && post.mediaItems.length > 0) {
            mediaItemsPayload = post.mediaItems.map((item: any) => ({
                type: item.type || "image",
                url: item.url,
                title: item.title,
                altText: item.altText,
                thumbnail: item.thumbnail
            }));
        } else if (Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0) {
            mediaItemsPayload = post.mediaUrls.map((url: string) => ({
                type: (/\.(mp4|webm|mov|mkv|ogg)$/i.test(url) || url.includes("/video/")) ? "video" : "image",
                url
            }));
        } else if (post.mediaUrl) {
            const resolvedMediaType = post.mediaType || (
                (/\.(mp4|webm|mov|mkv|ogg)$/i.test(post.mediaUrl) || post.mediaUrl.includes("/video/")) ? "video" : "image"
            );
            mediaItemsPayload = [{
                type: resolvedMediaType,
                url: post.mediaUrl
            }];
        }

        // Filter media per platform capabilities if any platform requires special constraints
        for (const acc of accounts) {
            const adapter = SocialPlatformRegistry.get(acc.platform);
            if (adapter?.filterMediaItems) {
                mediaItemsPayload = adapter.filterMediaItems(mediaItemsPayload);
            }
        }

        const payload: Record<string, any> = {
            content: post.content,
            publishNow: true,
            platforms: zernioPlatforms,
        };

        if (mediaItemsPayload.length > 0) {
            payload.mediaItems = mediaItemsPayload;
        }

        console.log(`🚀 [PUBLISHER] Publishing post ${post._id} to Zernio across ${accounts.length} account(s)...`);

        const response = await zernio.posts.createPost({
            body: payload as any
        });

        const publishedPost = (response.data as any)?.post || response.data;
        if (!publishedPost) {
            throw new Error("Failed to get post object from Zernio response");
        }

        const externalId = publishedPost._id || publishedPost.id;
        console.log(`✅ [PUBLISHER] Zernio post created successfully: ${externalId}`);

        // Update Post model status and granular platformDetails
        post.status = "published";
        post.failedReason = undefined;

        if (!post.platformDetails) {
            post.platformDetails = {};
        }

        for (const acc of accounts) {
            if (!post.platformDetails[acc.platform]) {
                post.platformDetails[acc.platform] = {};
            }
            post.platformDetails[acc.platform].status = "published";
            post.platformDetails[acc.platform].publishedPostId = externalId;
            post.platformDetails[acc.platform].publishedAt = new Date();
            post.platformDetails[acc.platform].failedReason = undefined;
        }

        await post.save();

        await ActivityLog.create({
            user: post.user,
            actionType: "POST_PUBLISHED",
            description: `Published post to ${accounts.map((a) => a.platform).join(", ")}`,
            relatedPost: post._id,
        });

        return {
            success: true,
            postId: post._id.toString(),
            publishedPlatforms: accounts.map((a) => a.platform)
        };
    } catch (err: any) {
        let errorMsg = "Failed to publish post";

        // Run error normalization through the targeted platform adapters
        for (const acc of targetedAccounts) {
            const adapter = SocialPlatformRegistry.get(acc.platform);
            const normalized = adapter?.normalizeError(err);
            if (normalized) {
                errorMsg = normalized;
                break;
            }
        }

        if (errorMsg === "Failed to publish post") {
            const rawError =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                (typeof err?.response?.data === "string" ? err.response.data : "") ||
                err?.message ||
                "Failed to publish post";
            errorMsg = typeof rawError === "string" ? rawError : JSON.stringify(rawError);
        }

        // Detect token expiration / revocation (401)
        const statusCode = err?.response?.status;
        const isTokenExpired = statusCode === 401 || /expired|revoked|invalid_token|unauthorized/i.test(errorMsg);
        if (isTokenExpired) {
            errorMsg = "Social account token expired or revoked. Please visit Channels & Accounts to reconnect your account.";
            try {
                if (targetedAccounts.length > 0) {
                    const disconnectedAccountIds = targetedAccounts.map((a: any) => a._id);
                    await Account.updateMany(
                        { _id: { $in: disconnectedAccountIds } },
                        { status: "disconnected" }
                    );
                    console.warn(`⚠️ [PUBLISHER] Marked accounts ${disconnectedAccountIds.join(", ")} as disconnected due to expired token.`);
                }
            } catch (accErr) {
                console.error("Failed to update account status to disconnected:", accErr);
            }
        }

        console.error(`❌ [PUBLISHER] Failed to publish post ${post._id}:`, errorMsg);

        // Update Post model status and per-platform failed reason
        post.status = "failed";
        post.failedReason = errorMsg;

        if (!post.platformDetails) {
            post.platformDetails = {};
        }
        for (const acc of targetedAccounts) {
            if (!post.platformDetails[acc.platform]) {
                post.platformDetails[acc.platform] = {};
            }
            post.platformDetails[acc.platform].status = "failed";
            post.platformDetails[acc.platform].failedReason = errorMsg;
        }

        await post.save();

        await ActivityLog.create({
            user: post.user,
            actionType: "POST_FAILED",
            description: `Failed to publish post: ${errorMsg}`,
            relatedPost: post._id,
        });

        return {
            success: false,
            postId: post._id.toString(),
            error: errorMsg
        };
    }
}

// Backward-compatible export
export const socialPublishingService = {
    publishPost
};

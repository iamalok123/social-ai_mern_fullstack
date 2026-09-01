import cron from "node-cron";
import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import { ActivityLog } from "../models/ActivityLog.js";
import zernio from "../config/zernio.js";


export const evaluateScheduledPosts = async () => {
    // Skip run if MongoDB is temporarily disconnected
    if (mongoose.connection.readyState !== 1) {
        console.warn("⚠️ [SCHEDULER] MongoDB is currently disconnected. Skipping tick until reconnected.");
        return { count: 0, message: "MongoDB disconnected" };
    }

    try {
        const now = new Date();
        const postsToPublish = await Post.find({
            status: "scheduled",
            scheduledFor: { $lte: now }
        });

        let publishedCount = 0;
        let failedCount = 0;

        for (const post of postsToPublish) {
            try {
                const accounts = await Account.find({
                    user: post.user,
                    platform: { $in: post.platforms },
                    status: "connected",
                    zernioAccountId: { $exists: true }
                });

                if (accounts.length === 0) {
                    console.log(`No connected zernio accounts found for post ${post._id}`);
                    continue;
                }

                const zernioPlatforms = accounts.map((acc) => ({
                    platform: acc.platform as any,
                    accountId: acc.zernioAccountId!
                }));

                // Build mediaItems payload from mediaItems array, mediaUrls array, or legacy single mediaUrl
                let mediaItemsPayload: { type: "image" | "video"; url: string }[] = [];
                if (Array.isArray((post as any).mediaItems) && (post as any).mediaItems.length > 0) {
                    mediaItemsPayload = (post as any).mediaItems.map((item: any) => ({
                        type: item.type || "image",
                        url: item.url
                    }));
                } else if (Array.isArray((post as any).mediaUrls) && (post as any).mediaUrls.length > 0) {
                    mediaItemsPayload = (post as any).mediaUrls.map((url: string) => ({
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

                // If targeting Twitter, ensure limit of max 4 images
                if (post.platforms.includes("twitter")) {
                    const images = mediaItemsPayload.filter(m => m.type === "image");
                    const videos = mediaItemsPayload.filter(m => m.type === "video");
                    if (videos.length > 0) {
                        mediaItemsPayload = [videos[0]];
                    } else if (images.length > 4) {
                        mediaItemsPayload = images.slice(0, 4);
                    }
                }

                const payload = {
                    content: post.content,
                    publishNow: true,
                    ...(mediaItemsPayload.length > 0 ? { mediaItems: mediaItemsPayload } : {}),
                    platforms: zernioPlatforms,
                };

                console.log(`Publishing post ${post._id} to Zernio with ${mediaItemsPayload.length} media item(s)`);

                const response = await zernio.posts.createPost({
                    body: payload as any
                });

                const publishedPost = (response.data as any)?.post || response.data;

                if (!publishedPost) {
                    throw new Error("Failed to get post object from Zernio response");
                }

                console.log(`Zernio post created: ${publishedPost._id || publishedPost.id}`);

                post.status = "published";
                (post as any).failedReason = undefined;
                await post.save();
                publishedCount++;

                await ActivityLog.create({
                    user: post.user,
                    actionType: "POST_PUBLISHED",
                    description: `Published post to ${accounts.map((a) => a.platform).join(", ")}`,
                    relatedPost: post._id,
                });
            } catch (err: any) {
                const rawError = err?.response?.data?.message || err?.response?.data?.error || (typeof err?.response?.data === "string" ? err.response.data : "") || err?.message || "Failed to publish post";
                const errorMsg = typeof rawError === "string" ? rawError : JSON.stringify(rawError);
                console.error(`Failed to publish post ${post._id} :`, errorMsg);
                post.status = "failed";
                (post as any).failedReason = errorMsg;
                await post.save();
                failedCount++;

                await ActivityLog.create({
                    user: post.user,
                    actionType: "POST_FAILED",
                    description: `Failed to publish post: ${errorMsg}`,
                    relatedPost: post._id,
                });
            }
        }

        if (postsToPublish.length > 0) {
            console.log(`Evaluated ${postsToPublish.length} posts at ${now.toISOString()} (Published: ${publishedCount}, Failed: ${failedCount})`);
        }

        return { count: postsToPublish.length, published: publishedCount, failed: failedCount };
    } catch (error: any) {
        if (error?.name === "MongoServerSelectionError" || error?.code === "ENOTFOUND") {
            console.warn("⚠️ [SCHEDULER] Skipping cron task due to temporary MongoDB network disconnection.");
        } else {
            console.error("Error in scheduler cron task:", error);
        }
        return { error: error?.message || "Scheduler error" };
    }
};

export const initScheduler = () => {
    console.log("Scheduler service initialized");
    cron.schedule("* * * * *", async () => {
        await evaluateScheduledPosts();
    });
};


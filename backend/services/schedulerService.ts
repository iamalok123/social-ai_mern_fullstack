import cron from "node-cron";
import mongoose from "mongoose";
import { Post } from "../models/Post.js";
import { socialPublishingService } from "./social/publishing/socialPublishingService.js";

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
            // Atomically claim post to prevent concurrent ticks or long video transcodes from re-dispatching
            const claimedPost = await Post.findOneAndUpdate(
                { _id: post._id, status: "scheduled" },
                { $set: { status: "publishing" } },
                { returnDocument: "after" }
            );

            if (!claimedPost) {
                // Post was already claimed or updated by another process
                continue;
            }

            const result = await socialPublishingService.publishPost(claimedPost);
            if (result.success) {
                publishedCount++;
            } else {
                failedCount++;
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



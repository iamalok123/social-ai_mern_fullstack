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
            const result = await socialPublishingService.publishPost(post);
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



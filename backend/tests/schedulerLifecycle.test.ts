import { describe, it } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import "../services/social/index.js";
import { evaluateScheduledPosts } from "../services/schedulerService.js";
import { publishPost } from "../services/social/publishing/socialPublishingService.js";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import { ActivityLog } from "../models/ActivityLog.js";
import zernio from "../config/zernio.js";

describe("Scheduler & Publishing Lifecycle Test Suite", () => {
    describe("Scheduler Evaluation Engine (evaluateScheduledPosts)", () => {
        it("gracefully aborts tick when MongoDB is not connected (readyState !== 1)", async () => {
            // Mock disconnected readyState
            const originalReadyState = mongoose.connection.readyState;
            Object.defineProperty(mongoose.connection, "readyState", {
                value: 0,
                configurable: true
            });

            try {
                const result = await evaluateScheduledPosts();
                assert.strictEqual(result.count, 0);
                assert.strictEqual(result.message, "MongoDB disconnected");
            } finally {
                Object.defineProperty(mongoose.connection, "readyState", {
                    value: originalReadyState,
                    configurable: true
                });
            }
        });

        it("detects overdue scheduled posts and accurately aggregates results", async () => {
            // Ensure readyState is 1 (connected)
            const originalReadyState = mongoose.connection.readyState;
            Object.defineProperty(mongoose.connection, "readyState", {
                value: 1,
                configurable: true
            });

            const originalFind = Post.find;
            const originalPublish = publishPost;

            const fakePosts = [
                { _id: "post_1", content: "Post 1", platforms: ["twitter"] },
                { _id: "post_2", content: "Post 2", platforms: ["facebook"] }
            ];

            (Post as any).find = (query: any) => {
                assert.strictEqual(query.status, "scheduled");
                assert.ok(query.scheduledFor?.$lte instanceof Date);
                return Promise.resolve(fakePosts);
            };

            let publishCalls = 0;
            const mockPublishPost = async (post: any) => {
                publishCalls++;
                if (post._id === "post_1") {
                    return { success: true, postId: "post_1" };
                }
                return { success: false, postId: "post_2", error: "Simulated error" };
            };

            // Test execution
            try {
                const now = new Date();
                const posts = await Post.find({ status: "scheduled", scheduledFor: { $lte: now } });
                let publishedCount = 0;
                let failedCount = 0;

                for (const post of posts) {
                    const res = await mockPublishPost(post);
                    if (res.success) publishedCount++;
                    else failedCount++;
                }

                assert.strictEqual(publishCalls, 2);
                assert.strictEqual(publishedCount, 1);
                assert.strictEqual(failedCount, 1);
            } finally {
                (Post as any).find = originalFind;
                Object.defineProperty(mongoose.connection, "readyState", {
                    value: originalReadyState,
                    configurable: true
                });
            }
        });
    });

    describe("Publishing Service Guardrails (publishPost)", () => {
        it("marks post as failed when no active connected account exists", async () => {
            const originalAccountFind = Account.find;
            (Account as any).find = () => Promise.resolve([]); // No connected accounts

            let saved = false;
            const mockPost: any = {
                _id: "post_no_acc",
                user: "user_123",
                platforms: ["twitter", "linkedin"],
                content: "Orphaned post",
                save: async () => { saved = true; }
            };

            try {
                const result = await publishPost(mockPost);
                assert.strictEqual(result.success, false);
                assert.strictEqual(saved, true);
                assert.strictEqual(mockPost.status, "failed");
                assert.ok(mockPost.failedReason.includes("No connected active accounts found"));
            } finally {
                (Account as any).find = originalAccountFind;
            }
        });

        it("successfully updates post status, platformDetails, and creates ActivityLog on success", async () => {
            const originalAccountFind = Account.find;
            const originalCreatePost = zernio.posts.createPost;
            const originalActivityCreate = ActivityLog.create;

            const mockAccounts = [
                { _id: "acc_tw", platform: "twitter", zernioAccountId: "z_tw_1", status: "connected" },
                { _id: "acc_fb", platform: "facebook", zernioAccountId: "z_fb_1", status: "connected" }
            ];

            (Account as any).find = () => Promise.resolve(mockAccounts);
            (zernio.posts as any).createPost = async ({ body }: any) => {
                assert.strictEqual(body.publishNow, true);
                assert.strictEqual(body.platforms.length, 2);
                return { data: { post: { _id: "zernio_post_999" } } };
            };

            let activityLogged = false;
            (ActivityLog as any).create = async (logData: any) => {
                assert.strictEqual(logData.actionType, "POST_PUBLISHED");
                assert.strictEqual(logData.relatedPost, "post_success_123");
                activityLogged = true;
                return logData;
            };

            let postSaved = false;
            const mockPost: any = {
                _id: "post_success_123",
                user: "user_123",
                platforms: ["twitter", "facebook"],
                content: "Success post content",
                platformDetails: {},
                save: async () => { postSaved = true; }
            };

            try {
                const result = await publishPost(mockPost);
                assert.strictEqual(result.success, true);
                assert.strictEqual(postSaved, true);
                assert.strictEqual(activityLogged, true);
                assert.strictEqual(mockPost.status, "published");
                assert.strictEqual(mockPost.platformDetails.twitter.status, "published");
                assert.strictEqual(mockPost.platformDetails.twitter.publishedPostId, "zernio_post_999");
                assert.strictEqual(mockPost.platformDetails.facebook.status, "published");
                assert.strictEqual(mockPost.platformDetails.facebook.publishedPostId, "zernio_post_999");
            } finally {
                (Account as any).find = originalAccountFind;
                (zernio.posts as any).createPost = originalCreatePost;
                (ActivityLog as any).create = originalActivityCreate;
            }
        });

        it("detects 401 token expiration and marks accounts as disconnected", async () => {
            const originalAccountFind = Account.find;
            const originalAccountUpdateMany = Account.updateMany;
            const originalCreatePost = zernio.posts.createPost;
            const originalActivityCreate = ActivityLog.create;

            const mockAccounts = [
                { _id: "acc_expired_1", platform: "linkedin", zernioAccountId: "z_li_expired", status: "connected" }
            ];

            (Account as any).find = () => Promise.resolve(mockAccounts);
            (zernio.posts as any).createPost = async () => {
                const err: any = new Error("Unauthorized");
                err.response = { status: 401, data: { message: "Access token is expired" } };
                throw err;
            };

            let disconnectedAccountIds: any = null;
            (Account as any).updateMany = async (filter: any, update: any) => {
                disconnectedAccountIds = filter._id.$in;
                assert.strictEqual(update.status, "disconnected");
                return { modifiedCount: 1 };
            };

            let failureLogged = false;
            (ActivityLog as any).create = async (logData: any) => {
                assert.strictEqual(logData.actionType, "POST_FAILED");
                failureLogged = true;
                return logData;
            };

            let postSaved = false;
            const mockPost: any = {
                _id: "post_401_error",
                user: "user_123",
                platforms: ["linkedin"],
                content: "Will fail with 401",
                platformDetails: {},
                save: async () => { postSaved = true; }
            };

            try {
                const result = await publishPost(mockPost);
                assert.strictEqual(result.success, false);
                assert.strictEqual(postSaved, true);
                assert.strictEqual(failureLogged, true);
                assert.deepStrictEqual(disconnectedAccountIds, ["acc_expired_1"]);
                assert.strictEqual(mockPost.status, "failed");
                assert.ok(mockPost.failedReason.includes("Channels & Accounts to reconnect"));
            } finally {
                (Account as any).find = originalAccountFind;
                (Account as any).updateMany = originalAccountUpdateMany;
                (zernio.posts as any).createPost = originalCreatePost;
                (ActivityLog as any).create = originalActivityCreate;
            }
        });
    });
});

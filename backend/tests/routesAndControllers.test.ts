import { describe, it } from "node:test";
import assert from "node:assert";
import "../services/social/index.js";
import { postValidationMiddleware } from "../middlewares/postValidationMiddleware.js";
import { getAllPlatforms, getPlatformById } from "../controllers/platformController.js";
import { getPosts, deletePost, getPostAnalytics } from "../controllers/postController.js";
import { searchInstagramAudio, getAccountHealth } from "../controllers/accountController.js";
import { generateAuthUrl, syncAccounts } from "../controllers/socialAuthController.js";
import zernio from "../config/zernio.js";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";

describe("Routes, Controllers & Middlewares Test Suite", () => {
    describe("postValidationMiddleware", () => {
        it("rejects post with missing content", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const req: any = {
                body: {
                    content: "",
                    platforms: ["twitter"],
                    scheduledFor: new Date().toISOString()
                }
            };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            postValidationMiddleware(req, res, next);

            assert.strictEqual(statusCode, 400);
            assert.strictEqual(responseBody?.message, "Post content is required.");
            assert.strictEqual(nextCalled, false);
        });

        it("rejects post with missing platforms", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const req: any = {
                body: {
                    content: "Valid content",
                    platforms: "[]",
                    scheduledFor: new Date().toISOString()
                }
            };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            postValidationMiddleware(req, res, next);

            assert.strictEqual(statusCode, 400);
            assert.strictEqual(responseBody?.message, "At least one platform must be selected.");
            assert.strictEqual(nextCalled, false);
        });

        it("rejects post with invalid scheduled date", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const req: any = {
                body: {
                    content: "Valid content",
                    platforms: ["twitter"],
                    scheduledFor: "invalid-date-string"
                }
            };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            postValidationMiddleware(req, res, next);

            assert.strictEqual(statusCode, 400);
            assert.strictEqual(responseBody?.message, "Invalid scheduled date format.");
            assert.strictEqual(nextCalled, false);
        });

        it("rejects Instagram when no media is attached", () => {
            let statusCode = 200;
            let responseBody: any = null;

            const req: any = {
                body: {
                    content: "Instagram text only",
                    platforms: JSON.stringify(["instagram"]),
                    scheduledFor: new Date().toISOString()
                },
                files: []
            };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseBody = data; } };
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            postValidationMiddleware(req, res, next);

            assert.strictEqual(statusCode, 400);
            assert.ok(responseBody?.message.includes("requires at least one image or video"));
            assert.strictEqual(nextCalled, false);
        });

        it("accepts valid multi-platform request (Twitter + LinkedIn + Instagram) and parses fields", () => {
            const req: any = {
                body: {
                    content: "Excited to share our new launch!",
                    platforms: JSON.stringify(["twitter", "linkedin", "instagram"]),
                    scheduledFor: new Date(Date.now() + 3600000).toISOString(),
                    mediaUrls: JSON.stringify(["https://res.cloudinary.com/demo/image/upload/sample.jpg"]),
                    firstComment: "Check details at https://launch.example.com",
                    disableLinkPreview: "true"
                },
                files: []
            };
            let statusCode = 200;
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: () => {} };
                }
            };
            let nextCalled = false;
            const next = () => { nextCalled = true; };

            postValidationMiddleware(req, res, next);

            assert.strictEqual(nextCalled, true);
            assert.strictEqual(statusCode, 200);
            assert.deepStrictEqual(req.body.parsedPlatforms, ["twitter", "linkedin", "instagram"]);
            assert.deepStrictEqual(req.body.parsedMediaUrls, ["https://res.cloudinary.com/demo/image/upload/sample.jpg"]);
            assert.strictEqual(req.body.parsedDisableLinkPreview, true);
            assert.strictEqual(req.body.parsedFirstComment, "Check details at https://launch.example.com");
        });
    });

    describe("platformController", () => {
        it("getAllPlatforms returns capabilities for all 4 platforms", () => {
            let responseData: any = null;
            const req: any = {};
            const res: any = {
                json: (data: any) => { responseData = data; }
            };

            getAllPlatforms(req, res);

            assert.ok(Array.isArray(responseData));
            assert.strictEqual(responseData.length, 4);
            const ids = responseData.map((p: any) => p.platformId);
            assert.ok(ids.includes("twitter"));
            assert.ok(ids.includes("linkedin"));
            assert.ok(ids.includes("instagram"));
            assert.ok(ids.includes("facebook"));
        });

        it("getPlatformById returns single platform capabilities", () => {
            let responseData: any = null;
            const req: any = { params: { platform: "twitter" } };
            const res: any = {
                json: (data: any) => { responseData = data; }
            };

            getPlatformById(req, res);

            assert.ok(responseData);
            assert.strictEqual(responseData.platformId, "twitter");
            assert.strictEqual(responseData.maxMediaCount, 4);
            assert.strictEqual(responseData.supportsPolls, true);
        });

        it("getPlatformById returns 404 for unknown platform", () => {
            let statusCode = 200;
            let responseData: any = null;
            const req: any = { params: { platform: "unknown_network" } };
            const res: any = {
                status: (code: number) => {
                    statusCode = code;
                    return { json: (data: any) => { responseData = data; } };
                }
            };

            getPlatformById(req, res);

            assert.strictEqual(statusCode, 404);
            assert.ok(responseData?.message.includes("not found"));
        });
    });

    describe("Multi-Platform Data Extraction in Adapters", () => {
        it("Twitter adapter correctly extracts poll and reply settings", () => {
            const twitter = SocialPlatformRegistry.get("twitter")!;
            const details = twitter.extractPlatformDetails({
                content: "Twitter poll",
                platformSpecificData: {
                    twitter: {
                        replySettings: "verified",
                        poll: { options: ["A", "B"], durationMinutes: 60 }
                    }
                }
            });

            assert.strictEqual(details.status, "pending");
            assert.strictEqual(details.replySettings, "verified");
            assert.deepStrictEqual(details.poll?.options, ["A", "B"]);
        });

        it("LinkedIn adapter extracts documentTitle, firstComment and disableLinkPreview", () => {
            const linkedin = SocialPlatformRegistry.get("linkedin")!;
            const details = linkedin.extractPlatformDetails({
                content: "LinkedIn doc",
                firstComment: "First comment text",
                disableLinkPreview: true,
                platformSpecificData: {
                    linkedin: {
                        documentTitle: "SlideDeck.pdf"
                    }
                }
            });

            assert.strictEqual(details.status, "pending");
            assert.strictEqual(details.firstComment, "First comment text");
            assert.strictEqual(details.disableLinkPreview, true);
            assert.strictEqual(details.documentTitle, "SlideDeck.pdf");
        });

        it("Instagram adapter extracts reel settings, collaborators and user tags", () => {
            const instagram = SocialPlatformRegistry.get("instagram")!;
            const details = instagram.extractPlatformDetails({
                content: "Reel caption",
                platformSpecificData: {
                    instagram: {
                        contentType: "reel",
                        reelCover: "https://example.com/cover.png",
                        collaborators: ["brand_partner"],
                        userTags: [{ username: "model", x: 0.5, y: 0.5 }]
                    }
                }
            });

            assert.strictEqual(details.status, "pending");
            assert.strictEqual(details.contentType, "reel");
            assert.strictEqual(details.reelCover, "https://example.com/cover.png");
            assert.deepStrictEqual(details.collaborators, ["brand_partner"]);
            assert.strictEqual(details.userTags?.[0].username, "model");
        });

        it("Facebook adapter extracts carouselCards, title and draft mode", () => {
            const facebook = SocialPlatformRegistry.get("facebook")!;
            const details = facebook.extractPlatformDetails({
                content: "Facebook carousel",
                platformSpecificData: {
                    facebook: {
                        title: "Spring Collection",
                        draft: true,
                        carouselCards: [
                            { link: "https://shop.com/1", name: "Card 1" },
                            { link: "https://shop.com/2", name: "Card 2" }
                        ]
                    }
                }
            });

            assert.strictEqual(details.status, "pending");
            assert.strictEqual(details.title, "Spring Collection");
            assert.strictEqual(details.draft, true);
            assert.strictEqual(details.carouselCards?.length, 2);
        });
    });

    describe("postController Security & Authorization", () => {
        it("getPosts: only queries posts belonging to authenticated user", async () => {
            const originalFind = Post.find;
            let queriedUserId: any = null;

            (Post as any).find = (query: any) => {
                queriedUserId = query.user;
                return {
                    sort: () => Promise.resolve([{ _id: "p1", user: "auth_user_123" }])
                };
            };

            try {
                let responseData: any = null;
                const req: any = { user: { _id: "auth_user_123" } };
                const res: any = {
                    json: (data: any) => { responseData = data; }
                };

                await getPosts(req, res);

                assert.strictEqual(queriedUserId, "auth_user_123");
                assert.strictEqual(responseData.length, 1);
            } finally {
                (Post as any).find = originalFind;
            }
        });

        it("deletePost: returns 404 when user tries to delete a post belonging to another user", async () => {
            const originalFindOne = Post.findOne;

            (Post as any).findOne = (query: any) => {
                assert.strictEqual(query._id, "post_belonging_to_other");
                assert.strictEqual(query.user, "attacker_user_id");
                return Promise.resolve(null); // Not found because user doesn't own it
            };

            try {
                let statusCode = 200;
                let responseData: any = null;
                const req: any = {
                    params: { id: "post_belonging_to_other" },
                    user: { _id: "attacker_user_id" }
                };
                const res: any = {
                    status: (code: number) => {
                        statusCode = code;
                        return { json: (data: any) => { responseData = data; } };
                    }
                };

                await deletePost(req, res);

                assert.strictEqual(statusCode, 404);
                assert.strictEqual(responseData.message, "Post not found");
            } finally {
                (Post as any).findOne = originalFindOne;
            }
        });

        it("deletePost: blocks deletion of already published posts (400)", async () => {
            const originalFindOne = Post.findOne;

            (Post as any).findOne = () => Promise.resolve({
                _id: "published_post_id",
                user: "user_owner",
                status: "published"
            });

            try {
                let statusCode = 200;
                let responseData: any = null;
                const req: any = {
                    params: { id: "published_post_id" },
                    user: { _id: "user_owner" }
                };
                const res: any = {
                    status: (code: number) => {
                        statusCode = code;
                        return { json: (data: any) => { responseData = data; } };
                    }
                };

                await deletePost(req, res);

                assert.strictEqual(statusCode, 400);
                assert.strictEqual(responseData.message, "Published posts cannot be deleted.");
            } finally {
                (Post as any).findOne = originalFindOne;
            }
        });

        it("deletePost: successfully deletes scheduled post owned by user", async () => {
            const originalFindOne = Post.findOne;
            const originalDeleteOne = Post.deleteOne;
            const originalPostExists = Post.exists;

            (Post as any).findOne = () => Promise.resolve({
                _id: "scheduled_post_id",
                user: "user_owner",
                status: "scheduled",
                mediaUrls: []
            });

            let deleteCalled = false;
            (Post as any).deleteOne = async (query: any) => {
                assert.strictEqual(query._id, "scheduled_post_id");
                deleteCalled = true;
                return { deletedCount: 1 };
            };
            (Post as any).exists = () => Promise.resolve(false);

            try {
                let responseData: any = null;
                const req: any = {
                    params: { id: "scheduled_post_id" },
                    user: { _id: "user_owner" }
                };
                const res: any = {
                    json: (data: any) => { responseData = data; }
                };

                await deletePost(req, res);

                assert.strictEqual(deleteCalled, true);
                assert.strictEqual(responseData.message, "Scheduled post deleted successfully");
                assert.strictEqual(responseData.id, "scheduled_post_id");
            } finally {
                (Post as any).findOne = originalFindOne;
                (Post as any).deleteOne = originalDeleteOne;
                (Post as any).exists = originalPostExists;
            }
        });
    });

    describe("Post Analytics & Account Diagnostics Endpoints", () => {
        it("getPostAnalytics: returns 404 when post is not found", async () => {
            const originalFindOne = Post.findOne;
            (Post as any).findOne = () => Promise.resolve(null);

            try {
                let statusCode = 200;
                let responseBody: any = null;
                const req: any = {
                    params: { id: "non_existent_post" },
                    user: { _id: "user_123" },
                    query: {}
                };
                const res: any = {
                    status: (code: number) => {
                        statusCode = code;
                        return { json: (data: any) => { responseBody = data; } };
                    }
                };

                await getPostAnalytics(req, res);
                assert.strictEqual(statusCode, 404);
                assert.strictEqual(responseBody?.message, "Post not found");
            } finally {
                (Post as any).findOne = originalFindOne;
            }
        });

        it("getPostAnalytics: returns 400 when post has no published external ID for platform", async () => {
            const originalFindOne = Post.findOne;
            (Post as any).findOne = () => Promise.resolve({
                _id: "draft_post_id",
                user: "user_123",
                platforms: ["instagram"],
                platformDetails: {}
            });

            try {
                let statusCode = 200;
                let responseBody: any = null;
                const req: any = {
                    params: { id: "draft_post_id" },
                    user: { _id: "user_123" },
                    query: { platform: "instagram" }
                };
                const res: any = {
                    status: (code: number) => {
                        statusCode = code;
                        return { json: (data: any) => { responseBody = data; } };
                    }
                };

                await getPostAnalytics(req, res);
                assert.strictEqual(statusCode, 400);
                assert.strictEqual(responseBody?.message, "Post has not been published to instagram or lacks an external ID");
            } finally {
                (Post as any).findOne = originalFindOne;
            }
        });

        it("searchInstagramAudio: returns 404 when no connected Instagram account exists", async () => {
            const originalFindOne = Account.findOne;
            (Account as any).findOne = () => Promise.resolve(null);

            try {
                let statusCode = 200;
                let responseBody: any = null;
                const req: any = {
                    params: {},
                    query: { q: "pop" },
                    user: { _id: "user_123" }
                };
                const res: any = {
                    status: (code: number) => {
                        statusCode = code;
                        return { json: (data: any) => { responseBody = data; } };
                    }
                };

                await searchInstagramAudio(req, res);
                assert.strictEqual(statusCode, 404);
                assert.strictEqual(responseBody?.message, "Connected Instagram account not found. Please connect an Instagram account first.");
            } finally {
                (Account as any).findOne = originalFindOne;
            }
        });

        it("getAccountHealth: returns 404 when account is not found", async () => {
            const originalFindOne = Account.findOne;
            (Account as any).findOne = () => Promise.resolve(null);

            try {
                let statusCode = 200;
                let responseBody: any = null;
                const req: any = {
                    params: { id: "missing_account" },
                    user: { _id: "user_123" }
                };
                const res: any = {
                    status: (code: number) => {
                        statusCode = code;
                        return { json: (data: any) => { responseBody = data; } };
                    }
                };

                await getAccountHealth(req, res);
                assert.strictEqual(statusCode, 404);
                assert.strictEqual(responseBody?.message, "Account not found or not connected to Zernio");
            } finally {
                (Account as any).findOne = originalFindOne;
            }
        });
    });

    describe("socialAuthController: Instagram loginMethod resolution", () => {
        it("generateAuthUrl: includes loginMethod parameter in redirect URL for Instagram", async () => {
            const originalGetConnectUrl = zernio.connect.getConnectUrl;
            let capturedOptions: any = null;
            (zernio.connect as any).getConnectUrl = async (opts: any) => {
                capturedOptions = opts;
                return { data: { authUrl: "https://zernio.com/oauth/mock" } };
            };

            try {
                let statusCode = 200;
                let responseBody: any = null;
                const req: any = {
                    params: { platform: "instagram" },
                    query: { loginMethod: "facebook_login" },
                    headers: { origin: "http://localhost:5173" },
                    user: { _id: "user_test_123", zernioProfileId: "prof_123" }
                };
                const res: any = {
                    status: (code: number) => {
                        statusCode = code;
                        return { json: (data: any) => { responseBody = data; } };
                    }
                };

                await generateAuthUrl(req, res);
                assert.strictEqual(statusCode, 200);
                assert.strictEqual(responseBody?.url, "https://zernio.com/oauth/mock");
                assert.strictEqual(capturedOptions?.query?.loginMethod, "facebook_login");
                assert.ok(capturedOptions?.query?.redirect_url.includes("loginMethod=facebook_login"));
            } finally {
                (zernio.connect as any).getConnectUrl = originalGetConnectUrl;
            }
        });

        it("syncAccounts: correctly saves loginMethod as facebook_login and sets capabilities when account has Facebook Page metadata", async () => {
            const originalListAccounts = zernio.accounts.listAccounts;
            const originalFindOneAndUpdate = Account.findOneAndUpdate;

            let capturedUpdateDoc: any = null;

            (zernio.accounts as any).listAccounts = async () => ({
                data: {
                    accounts: [
                        {
                            _id: "z_ig_fb_123",
                            platform: "instagram",
                            username: "fb_linked_ig",
                            profilePicture: "https://example.com/pic.jpg",
                            metadata: {
                                loginMethod: "facebook_login",
                                selectedPageId: "page_999",
                                selectedPageName: "My Brand Page"
                            }
                        }
                    ]
                }
            });

            (Account as any).findOneAndUpdate = async (_filter: any, update: any) => {
                capturedUpdateDoc = update;
                return update;
            };

            try {
                let responseBody: any = null;
                const req: any = {
                    query: {},
                    user: { _id: "user_test_123", zernioProfileId: "prof_123" }
                };
                const res: any = {
                    json: (data: any) => { responseBody = data; },
                    status: () => ({ json: (data: any) => { responseBody = data; } })
                };

                await syncAccounts(req, res);
                assert.strictEqual(capturedUpdateDoc?.loginMethod, "facebook_login");
                assert.strictEqual(capturedUpdateDoc?.capabilities?.catalogAudio, true);
                assert.strictEqual(capturedUpdateDoc?.capabilities?.paidPartnership, true);
                assert.strictEqual(capturedUpdateDoc?.avatarUrl, "https://example.com/pic.jpg");
            } finally {
                (zernio.accounts as any).listAccounts = originalListAccounts;
                (Account as any).findOneAndUpdate = originalFindOneAndUpdate;
            }
        });

        it("syncAccounts: correctly saves loginMethod as instagram_login when direct Instagram login is used", async () => {
            const originalListAccounts = zernio.accounts.listAccounts;
            const originalFindOneAndUpdate = Account.findOneAndUpdate;

            let capturedUpdateDoc: any = null;

            (zernio.accounts as any).listAccounts = async () => ({
                data: {
                    accounts: [
                        {
                            _id: "z_ig_direct_456",
                            platform: "instagram",
                            username: "direct_ig",
                            metadata: {
                                loginMethod: "instagram_login"
                            }
                        }
                    ]
                }
            });

            (Account as any).findOneAndUpdate = async (_filter: any, update: any) => {
                capturedUpdateDoc = update;
                return update;
            };

            try {
                let responseBody: any = null;
                const req: any = {
                    query: {},
                    user: { _id: "user_test_123", zernioProfileId: "prof_123" }
                };
                const res: any = {
                    json: (data: any) => { responseBody = data; },
                    status: () => ({ json: (data: any) => { responseBody = data; } })
                };

                await syncAccounts(req, res);
                assert.strictEqual(capturedUpdateDoc?.loginMethod, "instagram_login");
                assert.strictEqual(capturedUpdateDoc?.capabilities?.catalogAudio, false);
                assert.strictEqual(capturedUpdateDoc?.capabilities?.paidPartnership, false);
            } finally {
                (zernio.accounts as any).listAccounts = originalListAccounts;
                (Account as any).findOneAndUpdate = originalFindOneAndUpdate;
            }
        });
    });
});


import { Response } from "express";
import axios from "axios";
import { AuthRequest } from "../../../../middlewares/authMiddleware.js";
import { Account } from "../../../../models/Account.js";
import { Post } from "../../../../models/Post.js";
import { ActivityLog } from "../../../../models/ActivityLog.js";

const getZernioHeaders = () => ({
    Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
    "Content-Type": "application/json",
});

/**
 * List YouTube Playlists for a connected channel
 * GET /api/accounts/:id/youtube/playlists OR GET /api/accounts/youtube/playlists
 */
export const getYoutubePlaylists = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = req.params.id || (req.query.accountId as string);
        const query: any = { user: req.user._id, platform: "youtube", status: "connected" };

        if (targetId && targetId !== "youtube" && targetId !== "playlists") {
            query._id = targetId;
        }

        const account = await Account.findOne(query);
        if (!account || !account.zernioAccountId) {
            res.status(404).json({ message: "Connected YouTube channel not found. Please connect your YouTube account first." });
            return;
        }

        const response = await axios.get(
            `https://zernio.com/api/v1/accounts/${account.zernioAccountId}/youtube-playlists`,
            { headers: getZernioHeaders() }
        );

        res.json(response.data);
    } catch (error: any) {
        const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to fetch YouTube playlists";
        res.status(error?.response?.status || 500).json({ message: msg });
    }
};

/**
 * Edit a published YouTube video description
 * POST /api/posts/:id/youtube/edit
 */
export const editYoutubePostDescription = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (typeof content !== "string") {
            res.status(400).json({ message: "Content (description) is required." });
            return;
        }

        const post = await Post.findOne({ _id: id, user: req.user._id });
        if (!post) {
            res.status(404).json({ message: "Post not found." });
            return;
        }

        if (!post.platforms.includes("youtube")) {
            res.status(400).json({ message: "Post was not targeted to YouTube." });
            return;
        }

        const externalId = post.platformDetails?.youtube?.publishedPostId || (post as any).publishedPostId;
        if (!externalId) {
            res.status(400).json({ message: "Post does not have an external published YouTube video ID." });
            return;
        }

        // Sanitize content per YouTube Zernio specification:
        // Angle brackets (< and >) are stripped, and content past 5,000 characters is truncated.
        const sanitizedContent = content.replace(/[<>]/g, "").substring(0, 5000);

        const response = await axios.post(
            `https://zernio.com/api/v1/posts/${externalId}/edit`,
            {
                platform: "youtube",
                content: sanitizedContent
            },
            { headers: getZernioHeaders() }
        );

        // Update post content in MongoDB if editing base description
        post.content = sanitizedContent;
        await post.save();

        await ActivityLog.create({
            user: req.user._id,
            actionType: "POST_PUBLISHED",
            description: `Updated YouTube video description for post ${post._id}`,
            relatedPost: post._id,
        });

        res.json({
            success: true,
            id: response.data?.id,
            url: response.data?.url,
            message: response.data?.message || "YouTube post edited successfully"
        });
    } catch (error: any) {
        const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to edit YouTube video description";
        res.status(error?.response?.status || 500).json({ message: msg });
    }
};

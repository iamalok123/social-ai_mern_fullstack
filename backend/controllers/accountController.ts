import { Response } from "express";
import axios from "axios";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";

// Helper for direct Zernio v1 REST calls
const getZernioHeaders = () => ({
    Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
    "Content-Type": "application/json",
});

// Get all accounts
// GET /api/accounts
export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const accounts = await Account.find({ user: req.user._id });
        res.json(accounts);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Server error" });
    }
};

// Add account
// POST /api/accounts
export const addAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { platform, handle, avatarUrl, loginMethod, capabilities } = req.body;

        const account = await Account.create({
            user: req.user._id,
            platform,
            handle,
            avatarUrl,
            loginMethod: loginMethod || "instagram_login",
            capabilities: capabilities || {},
        });
        res.status(201).json(account);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Server error" });
    }
};

// Disconnect account
// DELETE /api/accounts/:id
export const disconnectAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const account = await Account.findOne({ _id: req.params.id, user: req.user._id });
        if (!account) {
            res.status(404).json({ message: "Account not found" });
            return;
        }
        if (account.zernioAccountId) {
            try {
                await zernio.accounts.deleteAccount({
                    path: {
                        accountId: account.zernioAccountId
                    }
                });
            } catch (error: any) {
                console.warn("Failed to delete account on Zernio:", error?.response?.data?.message || error?.message);
            }
        }
        await account.deleteOne();
        res.json({ message: "Account disconnected successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Server error" });
    }
};

// Get account health diagnostics
// GET /api/accounts/:id/health
export const getAccountHealth = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const account = await Account.findOne({ _id: req.params.id, user: req.user._id });
        if (!account || !account.zernioAccountId) {
            res.status(404).json({ message: "Account not found or not connected to Zernio" });
            return;
        }

        const result = await zernio.accounts.getAccountHealth({
            path: { accountId: account.zernioAccountId }
        });

        res.json((result.data as any) || result);
    } catch (error: any) {
        res.status(500).json({ message: error?.response?.data?.message || error?.message || "Failed to fetch account health" });
    }
};

// Search Instagram Audio catalog (licensed music & original sounds)
// GET /api/accounts/instagram/audio/search OR GET /api/accounts/:id/instagram/audio
export const searchInstagramAudio = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = req.params.id || (req.query.accountId as string);
        const query: any = { user: req.user._id, platform: "instagram", isConnected: true };
        if (targetId && targetId !== "search" && targetId !== "instagram") {
            query._id = targetId;
        }

        const account = await Account.findOne(query);
        if (!account || !account.zernioAccountId) {
            res.status(404).json({ message: "Connected Instagram account not found. Please connect an Instagram account first." });
            return;
        }

        const audioType = req.query.audioType || "music";
        const q = req.query.q || "";

        const response = await axios.get(`https://zernio.com/api/v1/accounts/${account.zernioAccountId}/instagram/audio`, {
            headers: getZernioHeaders(),
            params: { audioType, ...(q ? { q } : {}) }
        });

        res.json(response.data);
    } catch (error: any) {
        const msg = error?.response?.data?.message || error?.response?.data?.error || error?.message;
        if (/instagram_audio_requires_facebook_login/i.test(msg)) {
            res.status(400).json({
                message: "Catalog audio requires an Instagram account connected via Facebook Login. Please reconnect your account using the Facebook Page option.",
                code: "instagram_audio_requires_facebook_login"
            });
            return;
        }
        res.status(error?.response?.status || 500).json({ message: msg || "Failed to search Instagram audio" });
    }
};

// Get single Instagram Audio item by audioId (refreshes preview URL)
// GET /api/accounts/instagram/audio/:audioId OR GET /api/accounts/:id/instagram/audio/:audioId
export const getInstagramAudioItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = req.params.id || (req.query.accountId as string);
        const query: any = { user: req.user._id, platform: "instagram", isConnected: true };
        if (targetId && targetId !== "search" && targetId !== "instagram") {
            query._id = targetId;
        }

        const account = await Account.findOne(query);
        if (!account || !account.zernioAccountId) {
            res.status(404).json({ message: "Connected Instagram account not found" });
            return;
        }

        const { audioId } = req.params;
        const response = await axios.get(`https://zernio.com/api/v1/accounts/${account.zernioAccountId}/instagram/audio/${audioId}`, {
            headers: getZernioHeaders()
        });

        res.json(response.data);
    } catch (error: any) {
        res.status(error?.response?.status || 500).json({ message: error?.response?.data?.message || error?.message || "Failed to fetch audio item" });
    }
};

// List active Instagram stories (last 24 hours)
// GET /api/accounts/:id/instagram/stories
export const listInstagramStories = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const account = await Account.findOne({ _id: req.params.id, user: req.user._id });
        if (!account || !account.zernioAccountId) {
            res.status(404).json({ message: "Connected Instagram account not found" });
            return;
        }

        const result = await zernio.instagram.listInstagramStories({
            path: { accountId: account.zernioAccountId }
        });

        res.json((result.data as any) || []);
    } catch (error: any) {
        res.status(500).json({ message: error?.response?.data?.message || error?.message || "Failed to list Instagram stories" });
    }
};

// Get Instagram story insights
// GET /api/accounts/:id/instagram/stories/:storyId/insights
export const getInstagramStoryInsights = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const account = await Account.findOne({ _id: req.params.id, user: req.user._id });
        if (!account || !account.zernioAccountId) {
            res.status(404).json({ message: "Connected Instagram account not found" });
            return;
        }

        const result = await zernio.instagram.getInstagramStoryInsights({
            path: {
                accountId: account.zernioAccountId,
                storyId: req.params.storyId
            }
        });

        res.json((result.data as any) || result);
    } catch (error: any) {
        res.status(500).json({ message: error?.response?.data?.message || error?.message || "Failed to fetch story insights" });
    }
};

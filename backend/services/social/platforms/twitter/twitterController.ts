import { Request, Response } from "express";
import { twitterAdapter } from "./twitterService.js";

export const validateTwitterPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { content, mediaItems, poll, threadItems, replySettings } = req.body;
        const result = twitterAdapter.validatePost({
            content,
            mediaItems,
            platformSpecificData: {
                twitter: { poll, threadItems, replySettings }
            }
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Failed to validate Twitter post" });
    }
};

export const getTwitterCapabilities = async (_req: Request, res: Response): Promise<void> => {
    res.json(twitterAdapter.getCapabilities());
};

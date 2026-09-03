import { Request, Response } from "express";
import { instagramAdapter } from "./instagramService.js";

export const validateInstagramPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { content, mediaItems, contentType, shareToFeed, collaborators, userTags, reelCover, audioName, isAiGenerated } = req.body;
        const result = instagramAdapter.validatePost({
            content,
            mediaItems,
            platformSpecificData: {
                instagram: {
                    contentType,
                    shareToFeed,
                    collaborators,
                    userTags,
                    reelCover,
                    audioName,
                    isAiGenerated
                }
            }
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Failed to validate Instagram post" });
    }
};

export const getInstagramCapabilities = async (_req: Request, res: Response): Promise<void> => {
    res.json(instagramAdapter.getCapabilities());
};

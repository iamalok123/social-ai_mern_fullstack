import { Request, Response } from "express";
import { facebookAdapter } from "./facebookService.js";

export const validateFacebookPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { content, mediaItems, contentType, title, firstComment, pageId, carouselCards, carouselLink, draft } = req.body;
        const result = facebookAdapter.validatePost({
            content,
            mediaItems,
            firstComment,
            platformSpecificData: {
                facebook: {
                    contentType,
                    title,
                    pageId,
                    carouselCards,
                    carouselLink,
                    draft
                }
            }
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Failed to validate Facebook post" });
    }
};

export const getFacebookCapabilities = async (_req: Request, res: Response): Promise<void> => {
    res.json(facebookAdapter.getCapabilities());
};

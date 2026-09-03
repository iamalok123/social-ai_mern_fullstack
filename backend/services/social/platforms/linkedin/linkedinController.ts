import { Request, Response } from "express";
import { linkedinAdapter } from "./linkedinService.js";

export const validateLinkedInPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { content, mediaItems, firstComment, disableLinkPreview, documentTitle } = req.body;
        const result = linkedinAdapter.validatePost({
            content,
            mediaItems,
            firstComment,
            disableLinkPreview,
            platformSpecificData: {
                linkedin: { documentTitle }
            }
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Failed to validate LinkedIn post" });
    }
};

export const getLinkedInCapabilities = async (_req: Request, res: Response): Promise<void> => {
    res.json(linkedinAdapter.getCapabilities());
};

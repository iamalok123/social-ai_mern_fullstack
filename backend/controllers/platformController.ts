import { Request, Response } from "express";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";

// GET /api/platforms
export const getAllPlatforms = (_req: Request, res: Response): void => {
    try {
        const capabilities = SocialPlatformRegistry.getAllCapabilities();
        res.json(capabilities);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Failed to retrieve platforms" });
    }
};

// GET /api/platforms/:platform
export const getPlatformById = (req: Request, res: Response): void => {
    try {
        const platform = Array.isArray(req.params.platform) ? req.params.platform[0] : req.params.platform;
        if (!platform) {
            res.status(400).json({ message: "Platform parameter is required" });
            return;
        }
        const service = SocialPlatformRegistry.get(platform);
        if (!service) {
            res.status(404).json({ message: `Platform '${platform}' not found` });
            return;
        }
        res.json(service.getCapabilities());
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Failed to retrieve platform" });
    }
};

import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";
import { MediaItem } from "../services/social/core/types.js";

export const postValidationMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const { content, platforms, scheduledFor, firstComment, disableLinkPreview, platformSpecificData } = req.body;

        // 1. Parse platformSpecificData early
        let parsedPlatformSpecificData: Record<string, any> = {};
        if (platformSpecificData) {
            try {
                parsedPlatformSpecificData = typeof platformSpecificData === "string"
                    ? JSON.parse(platformSpecificData)
                    : platformSpecificData;
            } catch {
                parsedPlatformSpecificData = {};
            }
        }

        // 2. Parse platforms
        if (!platforms) {
            res.status(400).json({ message: "At least one platform must be selected." });
            return;
        }

        let parsedPlatforms: string[] = [];
        if (typeof platforms === "string") {
            try {
                const parsed = JSON.parse(platforms);
                parsedPlatforms = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                parsedPlatforms = platforms.split(",").map((p) => p.trim()).filter(Boolean);
            }
        } else if (Array.isArray(platforms)) {
            parsedPlatforms = platforms;
        }

        if (parsedPlatforms.length === 0) {
            res.status(400).json({ message: "At least one platform must be selected." });
            return;
        }

        // Validate that all specified platforms are supported by registered platform adapters
        for (const platformId of parsedPlatforms) {
            if (!SocialPlatformRegistry.has(platformId)) {
                res.status(400).json({
                    message: `Invalid or unsupported platform: "${platformId}". Supported platforms are: ${SocialPlatformRegistry.getAll().map((a) => a.platformId).join(", ")}`
                });
                return;
            }
        }

        // 3. Content check (Story posts do not show captions on Instagram)
        const isInstagramStoryOnly =
            parsedPlatforms.length === 1 &&
            parsedPlatforms[0] === "instagram" &&
            (parsedPlatformSpecificData?.instagram?.contentType === "story" || parsedPlatformSpecificData?.contentType === "story");

        const normalizedContent = typeof content === "string" ? content.trim() : "";

        if (!isInstagramStoryOnly && !normalizedContent) {
            res.status(400).json({ message: "Post content is required." });
            return;
        }

        // If story only and content is omitted, default to empty string
        req.body.content = normalizedContent;

        if (!scheduledFor) {
            res.status(400).json({ message: "Scheduled date and time are required." });
            return;
        }

        const scheduledDate = new Date(scheduledFor);
        if (isNaN(scheduledDate.getTime())) {
            res.status(400).json({ message: "Invalid scheduled date format." });
            return;
        }

        // Guard against scheduling posts in the past (15-minute grace period for immediate publish & clock drift)
        const isDraft = req.body.status === "draft";
        const now = Date.now();
        if (!isDraft && scheduledDate.getTime() < now - 15 * 60 * 1000) {
            res.status(400).json({ message: "Scheduled date cannot be in the past." });
            return;
        }

        // 3. Parse existing mediaUrls
        let parsedMediaUrls: string[] = [];
        if (req.body.mediaUrls) {
            if (typeof req.body.mediaUrls === "string") {
                try {
                    const parsed = JSON.parse(req.body.mediaUrls);
                    if (Array.isArray(parsed)) parsedMediaUrls.push(...parsed);
                    else parsedMediaUrls.push(req.body.mediaUrls);
                } catch {
                    parsedMediaUrls.push(req.body.mediaUrls);
                }
            } else if (Array.isArray(req.body.mediaUrls)) {
                parsedMediaUrls.push(...req.body.mediaUrls);
            }
        } else if (req.body.mediaUrl) {
            parsedMediaUrls.push(req.body.mediaUrl);
        }

        const parsedDisableLinkPreview = disableLinkPreview === true || disableLinkPreview === "true";
        const parsedFirstComment = typeof firstComment === "string" && firstComment.trim() ? firstComment.trim() : undefined;

        // 5. Construct preliminary mediaItems list for validation before uploading to Cloudinary
        const files: Express.Multer.File[] = Array.isArray(req.files)
            ? (req.files as Express.Multer.File[])
            : (req.file ? [req.file] : []);

        const preliminaryMediaItems: MediaItem[] = [];

        for (const file of files) {
            const isVideo = file.mimetype.startsWith("video/");
            preliminaryMediaItems.push({
                url: "pending_upload",
                type: isVideo ? "video" : "image"
            });
        }

        for (const url of parsedMediaUrls) {
            if (typeof url === "string" && url.trim()) {
                const isVideo = /\.(mp4|webm|mov|mkv|ogg)$/i.test(url) || url.includes("/video/upload/") || url.includes("/video/");
                preliminaryMediaItems.push({
                    url: url.trim(),
                    type: isVideo ? "video" : "image"
                });
            }
        }

        // 6. Run per-platform validation across all targeted platforms
        for (const platformId of parsedPlatforms) {
            const platformService = SocialPlatformRegistry.get(platformId);
            if (platformService) {
                const validation = platformService.validatePost({
                    content,
                    mediaItems: preliminaryMediaItems,
                    platformSpecificData: parsedPlatformSpecificData,
                    firstComment: parsedFirstComment,
                    disableLinkPreview: parsedDisableLinkPreview
                });

                if (!validation.isValid) {
                    res.status(400).json({ message: validation.errors.join("; ") });
                    return;
                }
            }
        }

        // Attach normalized values for the controller
        req.body.parsedPlatforms = parsedPlatforms;
        req.body.parsedMediaUrls = parsedMediaUrls;
        req.body.parsedPlatformSpecificData = parsedPlatformSpecificData;
        req.body.parsedDisableLinkPreview = parsedDisableLinkPreview;
        req.body.parsedFirstComment = parsedFirstComment;

        next();
    } catch (error: any) {
        res.status(400).json({ message: error?.message || "Invalid post data" });
    }
};

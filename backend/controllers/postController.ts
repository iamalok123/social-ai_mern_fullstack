import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { cloudinary } from "../config/cloudinary.js";
import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";
import { SocialPlatformRegistry } from "../services/social/core/SocialPlatformRegistry.js";
import { MediaItem } from "../services/social/core/types.js";

/**
 * Helper to extract Cloudinary public_id from a secure_url
 */
function extractCloudinaryPublicId(url: string): string | null {
    if (!url || !url.includes("cloudinary.com")) return null;
    try {
        const parts = url.split("/upload/");
        if (parts.length < 2) return null;
        const pathAfterUpload = parts[1];
        const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
        const lastDotIndex = pathWithoutVersion.lastIndexOf(".");
        return lastDotIndex !== -1 ? pathWithoutVersion.substring(0, lastDotIndex) : pathWithoutVersion;
    } catch {
        return null;
    }
}

// Get posts
// GET /api/posts
export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const posts = await Post.find({ user: req.user._id }).sort({ scheduledFor: -1 });
        res.json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "Server error" });
    }
};

// Schedule post
// POST /api/posts
export const schedulePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            content,
            scheduledFor,
            status,
            parsedPlatforms,
            parsedMediaUrls,
            parsedPlatformSpecificData,
            parsedDisableLinkPreview,
            parsedFirstComment
        } = req.body;

        const platforms: string[] = parsedPlatforms || (typeof req.body.platforms === "string" ? JSON.parse(req.body.platforms) : req.body.platforms);
        const uploadedMediaItems: MediaItem[] = [];

        // 1. Upload files to Cloudinary via upload_stream
        const files: Express.Multer.File[] = Array.isArray(req.files)
            ? (req.files as Express.Multer.File[])
            : (req.file ? [req.file] : []);

        if (files.length > 0) {
            const uploadPromises = files.map((file) => {
                const isVideoFile = file.mimetype.startsWith("video/");
                return new Promise<MediaItem>((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: isVideoFile ? "video" : "auto",
                            folder: "social-ai"
                        },
                        (error, result) => {
                            if (error || !result) reject(error || new Error("Cloudinary upload failed"));
                            else {
                                resolve({
                                    url: result.secure_url,
                                    type: (result.resource_type === "video" || isVideoFile) ? "video" : "image"
                                });
                            }
                        }
                    );
                    stream.end(file.buffer);
                });
            });

            const uploadResults = await Promise.all(uploadPromises);
            uploadedMediaItems.push(...uploadResults);
        }

        // 2. Incorporate existing media URLs
        const existingUrls: string[] = parsedMediaUrls || [];
        for (const url of existingUrls) {
            if (typeof url === "string" && url.trim() && !uploadedMediaItems.some((item) => item.url === url)) {
                const isVideo = /\.(mp4|webm|mov|mkv|ogg)$/i.test(url) || url.includes("/video/upload/") || url.includes("/video/");
                uploadedMediaItems.push({
                    url: url.trim(),
                    type: isVideo ? "video" : "image"
                });
            }
        }

        const mediaUrls = uploadedMediaItems.map((i) => i.url);
        const primaryMedia = uploadedMediaItems[0];

        // 3. Construct structured platformDetails via registered platform services
        const platformDetails: Record<string, any> = {};
        for (const platformId of platforms) {
            const platformService = SocialPlatformRegistry.get(platformId);
            if (platformService) {
                platformDetails[platformService.platformId] = platformService.extractPlatformDetails({
                    content,
                    mediaItems: uploadedMediaItems,
                    platformSpecificData: parsedPlatformSpecificData,
                    firstComment: parsedFirstComment,
                    disableLinkPreview: parsedDisableLinkPreview
                });
            } else {
                platformDetails[platformId] = {
                    status: "pending",
                    ...(parsedPlatformSpecificData?.[platformId] || {})
                };
            }
        }

        // 4. Create Post in MongoDB
        const post = await Post.create({
            user: req.user._id,
            content,
            platforms: platforms as any,
            mediaUrl: primaryMedia?.url,
            mediaType: primaryMedia?.type,
            mediaUrls,
            mediaItems: uploadedMediaItems,
            scheduledFor,
            status: status || "scheduled",
            firstComment: parsedFirstComment,
            disableLinkPreview: parsedDisableLinkPreview,
            platformSpecificData: parsedPlatformSpecificData,
            platformDetails
        });

        res.status(201).json(post);
    } catch (error: any) {
        console.error("Schedule Post Error:", error);
        res.status(500).json({ message: error?.message || "Server error" });
    }
};

// Delete upcoming scheduled post
// DELETE /api/posts/:id
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id, user: req.user._id });

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (post.status === "published") {
            res.status(400).json({ message: "Published posts cannot be deleted." });
            return;
        }

        // Delete all associated media from Cloudinary if not used in other active posts/generations
        const urlsToCleanup: string[] = [
            ...(post.mediaUrls || []),
            ...(post.mediaUrl ? [post.mediaUrl] : [])
        ];
        const uniqueUrls = Array.from(new Set(urlsToCleanup));

        for (const url of uniqueUrls) {
            const publicId = extractCloudinaryPublicId(url);
            if (publicId) {
                const isUsedInOtherPost = await Post.exists({ _id: { $ne: post._id }, $or: [{ mediaUrl: url }, { mediaUrls: url }] });
                const isUsedInGen = await Generation.exists({ mediaUrl: url });
                if (!isUsedInOtherPost && !isUsedInGen) {
                    try {
                        const isVideo = /\.(mp4|webm|mov|mkv|ogg)$/i.test(url) || url.includes("/video/upload/");
                        const cloudRes = await cloudinary.uploader.destroy(publicId, {
                            resource_type: isVideo ? "video" : "image"
                        });
                        console.log(`🗑️ [CLOUDINARY POST MEDIA DELETED] Public ID: ${publicId}, Result:`, cloudRes);
                    } catch (cloudErr: any) {
                        console.warn(`⚠️ [CLOUDINARY DELETE ERROR] Failed to delete post media ${publicId}:`, cloudErr?.message || cloudErr);
                    }
                }
            }
        }

        await Post.deleteOne({ _id: id });
        console.log(`🗑️ [SCHEDULED POST DELETED] Post ID: ${id}`);
        res.json({ message: "Scheduled post deleted successfully", id });
    } catch (error: any) {
        console.error("Delete Post Error:", error);
        res.status(500).json({ message: error?.message || "Failed to delete scheduled post" });
    }
};
import {
    MediaItem,
    PlatformAdapter,
    PlatformCapabilities,
    PostValidationInput,
    ValidationResult,
    ZernioPlatformPayload
} from "../../core/types.js";
import {
    defaultNormalizeError,
    getRawPlatformData
} from "../../core/adapterHelpers.js";
import { YouTubePlatformData } from "./youtubeTypes.js";

const CAPABILITIES: PlatformCapabilities = {
    platformId: "youtube",
    displayName: "YouTube",
    maxCharacters: 5000,
    supportedMediaTypes: ["video"],
    maxMediaCount: 1,
    supportsFirstComment: true,
    supportsLinkPreviewToggle: false,
    supportsPolls: false,
    supportsThreads: false,
    supportsStories: false,
    supportsReels: false,
    supportsCustomTitle: true,
};

const CLOUD_STORAGE_REGEX = /drive\.google\.com|dropbox\.com|onedrive\.live\.com|1drv\.ms|sharepoint\.com|icloud\.com/i;

/**
 * Normalizes and formats tags for YouTube:
 * - Strips leading '#'
 * - Splits comma-separated strings
 * - Drops duplicates
 * - Enforces <= 100 characters per tag and <= 500 combined characters
 */
export function formatYoutubeTags(tagsInput: string[] | string | undefined): string[] {
    if (!tagsInput) return [];
    const rawTags = Array.isArray(tagsInput) ? tagsInput : tagsInput.split(",");
    const result: string[] = [];
    let combinedLength = 0;

    for (let tag of rawTags) {
        tag = (tag || "").trim().replace(/^#+/, "");
        if (!tag || tag.length > 100) continue;
        if (result.includes(tag)) continue;
        if (combinedLength + tag.length > 500) break;
        result.push(tag);
        combinedLength += tag.length;
    }

    return result;
}

/**
 * Validates post input against YouTube's specifications
 */
export function validateYoutubePostContent(input: PostValidationInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const mediaItems: MediaItem[] = (input.mediaItems || (input as any).media || []) as MediaItem[];
    const rawData = (getRawPlatformData(input, "youtube") || {}) as YouTubePlatformData;

    // 1. Media Requirements: YouTube strictly requires exactly 1 video
    if (mediaItems.length === 0) {
        errors.push("YouTube requires exactly 1 video. Text-only posts and image-only posts are not supported by YouTube.");
    } else if (mediaItems.length > 1) {
        errors.push(`YouTube only supports 1 video per post (You selected ${mediaItems.length} media items).`);
    } else {
        const item = mediaItems[0];
        if (item.type !== "video") {
            errors.push("YouTube only supports video uploads. Images and documents cannot be posted to YouTube.");
        }
    }

    // 2. Cloud Storage Check (Google Drive, Dropbox, OneDrive, iCloud)
    for (const item of mediaItems) {
        if (item.url && CLOUD_STORAGE_REGEX.test(item.url)) {
            errors.push("YouTube cannot fetch media from Google Drive, Dropbox, OneDrive, or iCloud links because they return HTML pages. Please upload the file directly or use a direct CDN URL.");
            break;
        }
    }

    // 3. Title Constraints (max 100 chars)
    if (rawData.title && rawData.title.length > 100) {
        errors.push(`YouTube video title exceeds the 100 character limit (Current: ${rawData.title.length}/100).`);
    }

    // 4. Description Content Constraints (max 5000 chars)
    if (input.content && input.content.length > 5000) {
        errors.push(`YouTube video description exceeds the 5,000 character limit (Current: ${input.content.length}/5,000).`);
    }

    // 5. First Comment Constraints (max 10000 chars)
    const firstComment = rawData.firstComment || input.firstComment;
    if (firstComment && firstComment.length > 10000) {
        errors.push(`YouTube first comment exceeds the 10,000 character limit (Current: ${firstComment.length}/10,000).`);
    }

    // 6. Shorts & Custom Thumbnail warning
    if (rawData.isShort && (rawData.thumbnail || mediaItems[0]?.thumbnail)) {
        warnings.push("YouTube API does not support custom thumbnails for Shorts. The custom thumbnail will be skipped.");
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * YouTube Platform Adapter implementation
 */
export const youtubeAdapter: PlatformAdapter = {
    platformId: "youtube",
    displayName: "YouTube",

    getCapabilities(): PlatformCapabilities {
        return CAPABILITIES;
    },

    validatePost(input: PostValidationInput): ValidationResult {
        return validateYoutubePostContent(input);
    },

    filterMediaItems(mediaItems: MediaItem[]): MediaItem[] {
        const video = mediaItems.find((m) => m.type === "video");
        return video ? [video] : [];
    },

    extractPlatformDetails(postData: any): Record<string, any> {
        const raw = getRawPlatformData(postData, "youtube") as YouTubePlatformData;
        const fallbackTitle = postData.content ? postData.content.split("\n")[0].substring(0, 100) : "Untitled Video";

        return {
            title: raw.title || fallbackTitle,
            visibility: raw.visibility || "public",
            categoryId: raw.categoryId || "22",
            madeForKids: Boolean(raw.madeForKids),
            containsSyntheticMedia: Boolean(raw.containsSyntheticMedia),
            playlistId: raw.playlistId || undefined,
            firstComment: raw.firstComment || postData.firstComment || undefined,
            isShort: Boolean(raw.isShort),
            tags: formatYoutubeTags(raw.tags),
            thumbnail: raw.thumbnail || undefined,
            status: "pending"
        };
    },

    buildZernioPlatformEntry(account: any, post: any): ZernioPlatformPayload {
        const rawData = getRawPlatformData(post, "youtube") as YouTubePlatformData;
        const details = post.platformDetails?.youtube || {};
        const mergedData: YouTubePlatformData = { ...rawData, ...details };

        const fallbackTitle = post.content ? post.content.split("\n")[0].substring(0, 100) : "Untitled Video";
        const title = mergedData.title?.trim() || fallbackTitle;
        const visibility = mergedData.visibility || "public";
        const categoryId = mergedData.categoryId || "22";
        const madeForKids = Boolean(mergedData.madeForKids);
        const containsSyntheticMedia = Boolean(mergedData.containsSyntheticMedia);

        const platformSpecificData: Record<string, any> = {
            title,
            visibility,
            categoryId,
            madeForKids,
            containsSyntheticMedia
        };

        if (mergedData.playlistId) {
            platformSpecificData.playlistId = mergedData.playlistId;
        }

        const comment = mergedData.firstComment || post.firstComment;
        if (comment && comment.trim()) {
            platformSpecificData.firstComment = comment.trim().substring(0, 10000);
        }

        const payload: ZernioPlatformPayload = {
            platform: "youtube",
            accountId: account.zernioAccountId,
            platformSpecificData
        };

        return payload;
    },

    normalizeError(error: any): string | null {
        const raw = defaultNormalizeError(error);
        if (!raw) return null;

        if (/account.*suspended/i.test(raw)) {
            return "The YouTube channel is suspended. Please check your channel status in YouTube Studio.";
        }
        if (/quota.*exceeded|daily upload quota/i.test(raw)) {
            return "YouTube upload quota exceeded for this channel. Please try again tomorrow.";
        }
        if (/social account not found/i.test(raw)) {
            return "YouTube account not found or disconnected. Please reconnect your YouTube channel.";
        }
        if (/Failed to fetch video from URL/i.test(raw)) {
            return "YouTube could not download the video from the provided URL. Ensure the URL is public and valid.";
        }
        if (/YouTube permission error|required scopes/i.test(raw)) {
            return "YouTube permissions error: Ensure the channel has required scopes enabled. Please reconnect your account.";
        }
        if (/YouTube upload initialization failed/i.test(raw)) {
            return "YouTube upload initialization failed. Please check your channel status, upload quota, or video format.";
        }
        if (/unverified channel/i.test(raw)) {
            return "This channel is unverified. Custom thumbnails and videos longer than 15 minutes require phone verification at youtube.com/verify.";
        }

        return raw;
    }
};

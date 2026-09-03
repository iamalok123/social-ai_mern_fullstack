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
import { TwitterPlatformData } from "./twitterTypes.js";

const CAPABILITIES: PlatformCapabilities = {
    platformId: "twitter",
    displayName: "Twitter / X",
    maxCharacters: 280,
    supportedMediaTypes: ["image", "video"],
    maxMediaCount: 4,
    supportsFirstComment: false,
    supportsLinkPreviewToggle: false,
    supportsPolls: true,
    supportsThreads: true,
    supportsStories: false,
    supportsReels: false,
    supportsCustomTitle: false,
};

export function validateTwitterPostContent(input: PostValidationInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const mediaItems = input.mediaItems || [];
    const videoCount = mediaItems.filter((i) => i.type === "video").length;
    const imageCount = mediaItems.filter((i) => i.type === "image").length;

    // Video and Image combination rules
    if (videoCount > 1) {
        errors.push("Twitter/X allows a maximum of 1 video per post.");
    }
    if (videoCount === 1 && imageCount > 0) {
        errors.push("Twitter/X cannot mix video and images in a single post.");
    }
    if (imageCount > 4) {
        errors.push(`Twitter/X allows a maximum of 4 images per post. (Found ${imageCount})`);
    }

    // Poll validation
    const rawData = getRawPlatformData(input, "twitter") as TwitterPlatformData;
    if (rawData?.poll) {
        if (mediaItems.length > 0) {
            errors.push("Twitter/X polls cannot be combined with media attachments.");
        }
        if (!Array.isArray(rawData.poll.options) || rawData.poll.options.length < 2 || rawData.poll.options.length > 4) {
            errors.push("Twitter/X polls require between 2 and 4 options.");
        } else {
            for (const opt of rawData.poll.options) {
                if (!opt || opt.trim().length === 0) {
                    errors.push("Twitter/X poll options cannot be empty.");
                } else if (opt.length > 25) {
                    errors.push(`Twitter/X poll option "${opt}" exceeds the 25-character limit.`);
                }
            }
        }
    }

    // Character length warning for non-threads
    const content = rawData?.customContent || input.content || "";
    if (!rawData?.threadItems && content.length > 280) {
        warnings.push("Post content exceeds 280 characters. Consider splitting into a thread or ensure you have an X Premium account.");
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

export function filterTwitterMedia(mediaItems: MediaItem[]): MediaItem[] {
    const videos = mediaItems.filter((m) => m.type === "video");
    const images = mediaItems.filter((m) => m.type === "image");

    if (videos.length > 0) {
        return [videos[0]];
    }
    return images.slice(0, 4);
}

export function extractTwitterDetails(postData: any): Record<string, any> {
    const raw = getRawPlatformData(postData, "twitter") as TwitterPlatformData;
    return {
        status: "pending",
        customContent: raw.customContent,
        replySettings: raw.replySettings,
        quoteTweetId: raw.quoteTweetId,
        replyToTweetId: raw.replyToTweetId,
        poll: raw.poll,
        threadItems: raw.threadItems,
    };
}

export function buildTwitterZernioEntry(account: any, post: any): ZernioPlatformPayload {
    const details = post.platformDetails?.twitter || getRawPlatformData(post, "twitter");
    const entry: ZernioPlatformPayload = {
        platform: "twitter",
        accountId: account.zernioAccountId,
    };

    if (details.customContent) {
        entry.customContent = details.customContent;
    }

    const psData: Record<string, any> = {};
    if (details.replySettings) psData.replySettings = details.replySettings;
    if (details.quoteTweetId) psData.quoteTweetId = details.quoteTweetId;
    if (details.replyToTweetId) psData.replyToTweetId = details.replyToTweetId;
    if (details.poll) psData.poll = details.poll;
    if (details.threadItems && details.threadItems.length > 0) psData.threadItems = details.threadItems;

    if (Object.keys(psData).length > 0) {
        entry.platformSpecificData = psData;
    }

    return entry;
}

export function normalizeTwitterError(error: any): string | null {
    const msg = defaultNormalizeError(error);
    if (!msg) return null;

    if (/duplicate/i.test(msg) || /status is a duplicate/i.test(msg)) {
        return "Twitter/X error: Duplicate tweet detected. You have already posted this identical text recently.";
    }
    if (/rate limit/i.test(msg) || error?.response?.status === 429) {
        return "Twitter/X error: Rate limit exceeded. Please wait a while before posting again.";
    }
    if (/too long/i.test(msg) || /character/i.test(msg)) {
        return "Twitter/X error: Tweet text exceeds character length limit.";
    }

    return msg;
}

// Functional Platform Adapter
export const twitterAdapter: PlatformAdapter = {
    platformId: "twitter",
    displayName: "Twitter / X",
    getCapabilities: () => CAPABILITIES,
    validatePost: validateTwitterPostContent,
    filterMediaItems: filterTwitterMedia,
    extractPlatformDetails: extractTwitterDetails,
    buildZernioPlatformEntry: buildTwitterZernioEntry,
    normalizeError: normalizeTwitterError,
};

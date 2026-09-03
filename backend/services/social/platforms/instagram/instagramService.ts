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
import { InstagramPlatformData } from "./instagramTypes.js";

const CAPABILITIES: PlatformCapabilities = {
    platformId: "instagram",
    displayName: "Instagram",
    maxCharacters: 2200,
    supportedMediaTypes: ["image", "video"],
    maxMediaCount: 10,
    supportsFirstComment: true,
    supportsLinkPreviewToggle: false,
    supportsPolls: false,
    supportsThreads: false,
    supportsStories: true,
    supportsReels: true,
    supportsCustomTitle: false,
};

export function validateInstagramPostContent(input: PostValidationInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const mediaItems = input.mediaItems || [];

    // Instagram REQUIRES media
    if (mediaItems.length === 0) {
        errors.push("Instagram requires at least one image or video. Text-only posts are not supported by Instagram.");
    }

    if (mediaItems.length > 10) {
        errors.push(`Instagram carousel supports a maximum of 10 items. (Found ${mediaItems.length})`);
    }

    const rawData = getRawPlatformData(input, "instagram") as InstagramPlatformData;

    // Collaborators limit
    if (rawData?.collaborators && Array.isArray(rawData.collaborators)) {
        if (rawData.collaborators.length > 3) {
            errors.push("Instagram allows a maximum of 3 collaborators per post.");
        }
    }

    // User tags validation
    if (rawData?.userTags && Array.isArray(rawData.userTags)) {
        for (const tag of rawData.userTags) {
            if (!tag.username) {
                errors.push("Instagram user tag requires a valid username.");
            }
            if (tag.x < 0 || tag.x > 1 || tag.y < 0 || tag.y > 1) {
                errors.push("Instagram user tag coordinates must be between 0.0 and 1.0.");
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

export function filterInstagramMedia(mediaItems: MediaItem[]): MediaItem[] {
    return mediaItems.slice(0, 10);
}

export function extractInstagramDetails(postData: any): Record<string, any> {
    const raw = getRawPlatformData(postData, "instagram") as InstagramPlatformData;
    return {
        status: "pending",
        customContent: raw.customContent,
        contentType: raw.contentType || "feed",
        shareToFeed: raw.shareToFeed !== undefined ? raw.shareToFeed : true,
        collaborators: raw.collaborators,
        firstComment: raw.firstComment || postData.firstComment,
        userTags: raw.userTags,
        reelCover: raw.reelCover,
        audioName: raw.audioName,
        isAiGenerated: raw.isAiGenerated || false,
    };
}

export function buildInstagramZernioEntry(account: any, post: any): ZernioPlatformPayload {
    const details = post.platformDetails?.instagram || getRawPlatformData(post, "instagram");
    const entry: ZernioPlatformPayload = {
        platform: "instagram",
        accountId: account.zernioAccountId,
    };

    if (details.customContent) {
        entry.customContent = details.customContent;
    }

    const psData: Record<string, any> = {};

    if (details.contentType === "story") {
        psData.contentType = "story";
    }
    if (details.shareToFeed !== undefined) {
        psData.shareToFeed = details.shareToFeed;
    }
    if (details.collaborators && details.collaborators.length > 0) {
        psData.collaborators = details.collaborators;
    }
    const firstComment = details.firstComment || post.firstComment;
    if (firstComment && typeof firstComment === "string" && firstComment.trim() && details.contentType !== "story") {
        psData.firstComment = firstComment.trim();
    }
    if (details.userTags && details.userTags.length > 0) {
        psData.userTags = details.userTags;
    }
    if (details.reelCover) {
        psData.instagramThumbnail = details.reelCover;
        psData.reelCover = details.reelCover;
    }
    if (details.audioName) {
        psData.audioName = details.audioName;
    }
    if (details.isAiGenerated) {
        psData.isAiGenerated = true;
    }

    if (Object.keys(psData).length > 0) {
        entry.platformSpecificData = psData;
    }

    return entry;
}

export function normalizeInstagramError(error: any): string | null {
    const msg = defaultNormalizeError(error);
    if (!msg) return null;

    if (/aspect ratio/i.test(msg)) {
        return "Instagram error: Media aspect ratio is not supported. Please use 1:1 square, 4:5 portrait, or 16:9 landscape.";
    }
    if (/media required/i.test(msg) || /no media/i.test(msg)) {
        return "Instagram error: An image or video is required to post on Instagram.";
    }
    if (/expired|revoked|invalid_token|unauthorized/i.test(msg) || error?.response?.status === 401) {
        return "Instagram account token expired or revoked. Please visit Channels & Accounts to reconnect your Instagram account.";
    }

    return msg;
}

// Functional Platform Adapter
export const instagramAdapter: PlatformAdapter = {
    platformId: "instagram",
    displayName: "Instagram",
    getCapabilities: () => CAPABILITIES,
    validatePost: validateInstagramPostContent,
    filterMediaItems: filterInstagramMedia,
    extractPlatformDetails: extractInstagramDetails,
    buildZernioPlatformEntry: buildInstagramZernioEntry,
    normalizeError: normalizeInstagramError,
};

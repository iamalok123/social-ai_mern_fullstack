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
import { FacebookPlatformData } from "./facebookTypes.js";

const CAPABILITIES: PlatformCapabilities = {
    platformId: "facebook",
    displayName: "Facebook",
    maxCharacters: 63206,
    supportedMediaTypes: ["image", "video"],
    maxMediaCount: 20,
    supportsFirstComment: true,
    supportsLinkPreviewToggle: false,
    supportsPolls: false,
    supportsThreads: false,
    supportsStories: true,
    supportsReels: true,
    supportsCustomTitle: true,
};

export function validateFacebookPostContent(input: PostValidationInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const mediaItems = input.mediaItems || [];
    const rawData = getRawPlatformData(input, "facebook") as FacebookPlatformData;

    // Reel requirements
    if (rawData?.contentType === "reel") {
        const hasVideo = mediaItems.some((m) => m.type === "video");
        if (!hasVideo) {
            errors.push("Facebook Reels require a video file.");
        }
    }

    // Story requirements
    if (rawData?.contentType === "story") {
        if (mediaItems.length === 0) {
            errors.push("Facebook Stories require an image or video file.");
        }
    }

    // Carousel requirements
    if (rawData?.carouselCards && rawData.carouselCards.length > 0) {
        const hasVideo = mediaItems.some((m) => m.type === "video");
        if (hasVideo) {
            errors.push("Facebook Carousel posts only support images, not videos.");
        }
        if (rawData.carouselCards.length !== mediaItems.length) {
            warnings.push("Number of Facebook carousel cards does not match the number of attached images.");
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

export function filterFacebookMedia(mediaItems: MediaItem[]): MediaItem[] {
    return mediaItems.slice(0, 20);
}

export function extractFacebookDetails(postData: any): Record<string, any> {
    const raw = getRawPlatformData(postData, "facebook") as FacebookPlatformData;
    return {
        status: "pending",
        customContent: raw.customContent,
        contentType: raw.contentType || "feed",
        title: raw.title,
        firstComment: raw.firstComment || postData.firstComment,
        pageId: raw.pageId,
        carouselCards: raw.carouselCards,
        carouselLink: raw.carouselLink,
        draft: raw.draft || false,
    };
}

export function buildFacebookZernioEntry(account: any, post: any): ZernioPlatformPayload {
    const details = post.platformDetails?.facebook || getRawPlatformData(post, "facebook");
    const entry: ZernioPlatformPayload = {
        platform: "facebook",
        accountId: account.zernioAccountId,
    };

    if (details.customContent) {
        entry.customContent = details.customContent;
    }

    const psData: Record<string, any> = {};

    if (details.contentType && details.contentType !== "feed") {
        psData.contentType = details.contentType;
    }
    if (details.title) psData.title = details.title;
    const firstComment = details.firstComment || post.firstComment;
    if (firstComment && typeof firstComment === "string" && firstComment.trim() && details.contentType !== "story") {
        psData.firstComment = firstComment.trim();
    }
    if (details.pageId) psData.pageId = details.pageId;
    if (details.carouselCards && details.carouselCards.length > 0) {
        psData.carouselCards = details.carouselCards;
    }
    if (details.carouselLink) psData.carouselLink = details.carouselLink;
    if (details.draft) psData.draft = true;

    if (Object.keys(psData).length > 0) {
        entry.platformSpecificData = psData;
    }

    return entry;
}

export function normalizeFacebookError(error: any): string | null {
    const msg = defaultNormalizeError(error);
    if (!msg) return null;

    if (/page/i.test(msg) && /permission/i.test(msg)) {
        return "Facebook error: Insufficient permissions for the selected Facebook Page. Please reconnect the account.";
    }
    if (/expired|revoked|invalid_token|unauthorized/i.test(msg) || error?.response?.status === 401) {
        return "Facebook account token expired or revoked. Please visit Channels & Accounts to reconnect your Facebook account.";
    }

    return msg;
}

// Functional Platform Adapter
export const facebookAdapter: PlatformAdapter = {
    platformId: "facebook",
    displayName: "Facebook",
    getCapabilities: () => CAPABILITIES,
    validatePost: validateFacebookPostContent,
    filterMediaItems: filterFacebookMedia,
    extractPlatformDetails: extractFacebookDetails,
    buildZernioPlatformEntry: buildFacebookZernioEntry,
    normalizeError: normalizeFacebookError,
};

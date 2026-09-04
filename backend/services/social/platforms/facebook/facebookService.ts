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
    maxMediaCount: 10,
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
    const rawData = (getRawPlatformData(input, "facebook") || {}) as FacebookPlatformData;

    const contentType = rawData.contentType || "feed";
    const imageCount = mediaItems.filter((m) => m.type === "image").length;
    const videoCount = mediaItems.filter((m) => m.type === "video").length;

    // 1. General media rules
    if (imageCount > 0 && videoCount > 0) {
        errors.push("Facebook does not allow mixing images and videos in the same post.");
    }
    if (videoCount > 1) {
        errors.push("Facebook posts only support up to 1 video.");
    }
    if (imageCount > 10) {
        errors.push("Facebook posts support a maximum of 10 images.");
    }

    // 2. Reel requirements
    if (contentType === "reel") {
        if (videoCount === 0) {
            errors.push("Facebook Reels require a video file.");
        }
        if (imageCount > 0) {
            errors.push("Facebook Reels do not support images; only a single vertical video is permitted.");
        }
        if (videoCount > 1) {
            errors.push("Facebook Reels only support 1 video.");
        }
    }

    // 3. Story requirements
    if (contentType === "story") {
        if (mediaItems.length === 0) {
            errors.push("Facebook Stories require an image or video file.");
        }
        if (mediaItems.length > 1) {
            errors.push("Facebook Stories only support 1 image or 1 video.");
        }
        if (rawData.draft || rawData.facebookSettings?.draft) {
            errors.push("Draft mode is not supported for Facebook Stories.");
        }
        if (input.content && input.content.trim()) {
            warnings.push("Text captions are not displayed on Facebook Stories.");
        }
        if (input.firstComment && input.firstComment.trim()) {
            warnings.push("Facebook Stories do not support first comments.");
        }
    }

    // 4. Carousel requirements
    const carouselCards = rawData.carouselCards || rawData.facebookSettings?.carouselCards;
    if (carouselCards && carouselCards.length > 0) {
        if (contentType === "story" || contentType === "reel") {
            errors.push("Facebook Carousels cannot be combined with Stories or Reels.");
        }
        if (videoCount > 0) {
            errors.push("Facebook Carousel posts only support images, not videos.");
        }
        if (carouselCards.length < 2 || carouselCards.length > 10) {
            errors.push("Facebook Carousel requires between 2 and 10 cards.");
        }
        if (imageCount > 0 && carouselCards.length !== imageCount) {
            errors.push("Number of Facebook carousel cards must match the number of attached images.");
        }
    }

    // 5. Large Text Format Preset (Colored Background)
    const presetId = rawData.textFormatPresetId || rawData.facebookSettings?.textFormatPresetId;
    if (presetId) {
        if (contentType === "story" || contentType === "reel") {
            errors.push("Colored background text format presets are only supported for feed posts.");
        }
        if (mediaItems.length > 0) {
            errors.push("Colored background text format presets are only available for text-only posts.");
        }
        if (carouselCards && carouselCards.length > 0) {
            errors.push("Colored background text format presets cannot be used with carousels.");
        }
        if (!input.content || !input.content.trim()) {
            errors.push("Post content cannot be empty when using a colored background text preset.");
        }
        if (input.content && input.content.length > 130) {
            warnings.push("Facebook composer recommends keeping colored background text under 130 characters.");
        }
    }

    // 6. Geo-restriction rules
    if (rawData.geoRestriction?.countries) {
        if (!Array.isArray(rawData.geoRestriction.countries)) {
            errors.push("geoRestriction.countries must be an array of country codes.");
        } else {
            if (rawData.geoRestriction.countries.length > 25) {
                errors.push("Facebook supports up to 25 country codes for geo-restriction.");
            }
            if (contentType === "story") {
                errors.push("Facebook Stories do not support geo-restriction.");
            }
            const invalidCodes = rawData.geoRestriction.countries.filter(
                (c) => typeof c !== "string" || !/^[A-Za-z]{2}$/.test(c.trim())
            );
            if (invalidCodes.length > 0) {
                errors.push(`Invalid country code(s): ${invalidCodes.join(", ")}. Use uppercase ISO 3166-1 alpha-2 codes (e.g. US, GB, CA).`);
            }
        }
    }

    // 7. Draft + First Comment warning
    const isDraft = Boolean(rawData.draft || rawData.facebookSettings?.draft);
    const hasFirstComment = Boolean(input.firstComment?.trim() || rawData.firstComment?.trim());
    if (isDraft && hasFirstComment && contentType !== "story") {
        warnings.push("First comment is skipped when Facebook Publishing Tools draft mode is enabled.");
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

export function filterFacebookMedia(mediaItems: MediaItem[]): MediaItem[] {
    const hasVideo = mediaItems.some((m) => m.type === "video");
    if (hasVideo) {
        // Facebook only supports 1 video
        return mediaItems.filter((m) => m.type === "video").slice(0, 1);
    }
    // Up to 10 images
    return mediaItems.filter((m) => m.type === "image").slice(0, 10);
}

export function extractFacebookDetails(postData: any): Record<string, any> {
    const raw = (getRawPlatformData(postData, "facebook") || {}) as FacebookPlatformData;
    const isDraft = raw.draft !== undefined ? raw.draft : (raw.facebookSettings?.draft || false);
    const carouselCards = raw.carouselCards || raw.facebookSettings?.carouselCards;
    const carouselLink = raw.carouselLink || raw.facebookSettings?.carouselLink;
    const textFormatPresetId = raw.textFormatPresetId || raw.facebookSettings?.textFormatPresetId;

    return {
        status: "pending",
        customContent: raw.customContent,
        contentType: raw.contentType || "feed",
        title: raw.title,
        firstComment: raw.firstComment || postData.firstComment,
        pageId: raw.pageId,
        carouselCards,
        carouselLink,
        draft: isDraft,
        textFormatPresetId,
        geoRestriction: raw.geoRestriction,
    };
}

export function buildFacebookZernioEntry(account: any, post: any): ZernioPlatformPayload {
    const details = post.platformDetails?.facebook || getRawPlatformData(post, "facebook") || {};
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
    if (details.title && details.contentType === "reel") {
        psData.title = details.title;
    }

    const isDraft = Boolean(details.draft || details.facebookSettings?.draft);
    const firstComment = details.firstComment || post.firstComment;
    if (firstComment && typeof firstComment === "string" && firstComment.trim() && details.contentType !== "story" && !isDraft) {
        psData.firstComment = firstComment.trim();
    }

    if (details.pageId) {
        psData.pageId = details.pageId;
    }

    // Encapsulate feed post options inside facebookSettings per Zernio spec
    const fbSettings: Record<string, any> = {};
    if (isDraft) {
        fbSettings.draft = true;
    }
    const carouselCards = details.carouselCards || details.facebookSettings?.carouselCards;
    if (Array.isArray(carouselCards) && carouselCards.length > 0) {
        fbSettings.carouselCards = carouselCards;
    }
    const carouselLink = details.carouselLink || details.facebookSettings?.carouselLink;
    if (carouselLink) {
        fbSettings.carouselLink = carouselLink;
    }
    const presetId = details.textFormatPresetId || details.facebookSettings?.textFormatPresetId;
    if (presetId) {
        fbSettings.textFormatPresetId = String(presetId);
    }

    if (Object.keys(fbSettings).length > 0) {
        psData.facebookSettings = fbSettings;
    }

    // Geo-restriction
    if (details.geoRestriction?.countries && Array.isArray(details.geoRestriction.countries) && details.geoRestriction.countries.length > 0) {
        psData.geoRestriction = {
            countries: details.geoRestriction.countries.map((c: string) => c.toUpperCase().trim())
        };
    }

    if (Object.keys(psData).length > 0) {
        entry.platformSpecificData = psData;
    }

    return entry;
}

export function normalizeFacebookError(error: any): string | null {
    const msg = defaultNormalizeError(error);
    if (!msg) return null;

    if (/4\s*mb|smaller than 4\s*mb|exceeds actual size/i.test(msg)) {
        return "Facebook error: Photos must be under 4 MB and saved as JPG or PNG.";
    }
    if (/missing or invalid image|could not process image/i.test(msg)) {
        return "Facebook error: Image file is invalid or corrupt. Please ensure it is a public URL under 4 MB.";
    }
    if (/unable to fetch video|couldn't download the video/i.test(msg)) {
        return "Facebook error: Facebook servers could not download the video from the provided URL. Ensure the URL is public and direct.";
    }
    if (/confirm your identity|security check/i.test(msg)) {
        return "Facebook security check: Please log into Facebook, visit your Page, and complete identity verification before publishing.";
    }
    if (/max retries reached|publishing failed due to max/i.test(msg)) {
        return "Facebook error: Publishing failed after maximum retries. Please retry in a few moments.";
    }
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

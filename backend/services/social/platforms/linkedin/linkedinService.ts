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
import { LinkedInPlatformData } from "./linkedinTypes.js";

const CAPABILITIES: PlatformCapabilities = {
    platformId: "linkedin",
    displayName: "LinkedIn",
    maxCharacters: 3000,
    supportedMediaTypes: ["image", "video", "document"],
    maxMediaCount: 20,
    supportsFirstComment: true,
    supportsLinkPreviewToggle: true,
    supportsPolls: false,
    supportsThreads: false,
    supportsStories: false,
    supportsReels: false,
    supportsCustomTitle: true,
};

export function validateLinkedInPostContent(input: PostValidationInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const mediaItems = input.mediaItems || [];
    const videoCount = mediaItems.filter((i) => i.type === "video").length;
    const imageCount = mediaItems.filter((i) => i.type === "image").length;

    if (videoCount > 1) {
        errors.push("LinkedIn allows a maximum of 1 video per post.");
    }
    if (videoCount === 1 && imageCount > 0) {
        errors.push("LinkedIn cannot mix video and images in a single post.");
    }
    if (imageCount > 20) {
        errors.push(`LinkedIn allows a maximum of 20 images per post. (Found ${imageCount})`);
    }

    const rawData = getRawPlatformData(input, "linkedin") as LinkedInPlatformData;
    const firstComment = rawData?.firstComment || input.firstComment;

    // Reach tip: if external URL in content, suggest first comment
    const content = rawData?.customContent || input.content || "";
    if (/https?:\/\/[^\s]+/i.test(content) && !firstComment) {
        warnings.push("LinkedIn suppresses posts with external links in the body. Consider putting the link in the First Comment to preserve reach.");
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

export function filterLinkedInMedia(mediaItems: MediaItem[]): MediaItem[] {
    const videos = mediaItems.filter((m) => m.type === "video");
    const images = mediaItems.filter((m) => m.type === "image");

    if (videos.length > 0) {
        return [videos[0]];
    }
    return images.slice(0, 20);
}

export function extractLinkedInDetails(postData: any): Record<string, any> {
    const raw = getRawPlatformData(postData, "linkedin") as LinkedInPlatformData;
    return {
        status: "pending",
        customContent: raw.customContent,
        firstComment: raw.firstComment || postData.firstComment,
        disableLinkPreview: raw.disableLinkPreview !== undefined ? raw.disableLinkPreview : postData.disableLinkPreview,
        documentTitle: raw.documentTitle,
        organizationUrn: raw.organizationUrn,
        reshareUrl: raw.reshareUrl,
    };
}

export function buildLinkedInZernioEntry(account: any, post: any): ZernioPlatformPayload {
    const details = post.platformDetails?.linkedin || getRawPlatformData(post, "linkedin");
    const entry: ZernioPlatformPayload = {
        platform: "linkedin",
        accountId: account.zernioAccountId,
    };

    if (details.customContent) {
        entry.customContent = details.customContent;
    }

    const psData: Record<string, any> = {};

    const firstComment = details.firstComment || post.firstComment;
    if (firstComment && typeof firstComment === "string" && firstComment.trim()) {
        psData.firstComment = firstComment.trim();
    }

    const disableLinkPreview = details.disableLinkPreview !== undefined ? details.disableLinkPreview : post.disableLinkPreview;
    if (disableLinkPreview) {
        psData.disableLinkPreview = true;
    }

    if (details.documentTitle) psData.documentTitle = details.documentTitle;
    if (details.organizationUrn) psData.organizationUrn = details.organizationUrn;
    if (details.reshareUrl) psData.reshareUrl = details.reshareUrl;

    if (Object.keys(psData).length > 0) {
        entry.platformSpecificData = psData;
    }

    return entry;
}

export function normalizeLinkedInError(error: any): string | null {
    const msg = defaultNormalizeError(error);
    const statusCode = error?.response?.status;

    // 1. Detect LinkedIn 422 Duplicate Content error
    if (statusCode === 422 || /duplicate/i.test(msg || "") || /urn:li:share/i.test(msg || "")) {
        return "LinkedIn duplicate content error (422): LinkedIn rejected this post because identical or very similar content was recently posted. Please modify the text meaningfully before rescheduling.";
    }

    // 2. Detect Token Expiration
    if (statusCode === 401 || /expired|revoked|invalid_token|unauthorized/i.test(msg || "")) {
        return "LinkedIn account token expired or revoked. Please visit Channels & Accounts to reconnect your LinkedIn account.";
    }

    return msg;
}

// Functional Platform Adapter
export const linkedinAdapter: PlatformAdapter = {
    platformId: "linkedin",
    displayName: "LinkedIn",
    getCapabilities: () => CAPABILITIES,
    validatePost: validateLinkedInPostContent,
    filterMediaItems: filterLinkedInMedia,
    extractPlatformDetails: extractLinkedInDetails,
    buildZernioPlatformEntry: buildLinkedInZernioEntry,
    normalizeError: normalizeLinkedInError,
};

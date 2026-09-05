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
import { InstagramPlatformData, InstagramUserTag } from "./instagramTypes.js";

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

// Regex to detect cloud storage links that return HTML instead of raw media
const CLOUD_STORAGE_REGEX = /drive\.google\.com|dropbox\.com|onedrive\.live\.com|1drv\.ms|sharepoint\.com|icloud\.com/i;

export function validateInstagramPostContent(input: PostValidationInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const mediaItems: MediaItem[] = (input.mediaItems || (input as any).media || []) as MediaItem[];
    const rawData = (getRawPlatformData(input, "instagram") || {}) as InstagramPlatformData;
    const contentType = rawData.contentType || "feed";

    // 1. Media Requirement: Instagram strictly requires media for all posts
    if (mediaItems.length === 0) {
        errors.push("Instagram requires at least one image or video (media required). Text-only posts are not supported by Instagram.");
    }

    // 2. Cloud Storage Check (Google Drive, Dropbox, OneDrive, iCloud)
    for (const item of mediaItems) {
        if (item.url && CLOUD_STORAGE_REGEX.test(item.url)) {
            errors.push("Instagram cannot fetch media from Google Drive, Dropbox, OneDrive, or iCloud links because they return HTML pages. Please upload the file directly or use a direct CDN URL.");
            break;
        }
    }

    const hasVideo = mediaItems.some((m) => m.type === "video");
    const videoCount = mediaItems.filter((m) => m.type === "video").length;
    const imageCount = mediaItems.filter((m) => m.type === "image").length;

    // 3. Story Constraints
    if (contentType === "story") {
        if (mediaItems.length > 1) {
            errors.push(`Instagram Stories only support 1 image or 1 video. (Found ${mediaItems.length} items)`);
        }
        if (rawData.isPaidPartnership || (rawData.brandedContentSponsors && rawData.brandedContentSponsors.length > 0)) {
            errors.push("Paid partnership labels and branded content sponsors are not supported on Instagram Stories.");
        }
        if (rawData.locationId) {
            errors.push("Location tags are not supported on Instagram Stories.");
        }
        if (rawData.collaborators && rawData.collaborators.length > 0) {
            errors.push("Collaborators cannot be tagged on Instagram Stories.");
        }
        if (rawData.audioConfiguration) {
            errors.push("Catalog audio tracks cannot be attached to Instagram Stories (Reels only).");
        }
        if (input.content && input.content.trim()) {
            warnings.push("Text captions are not displayed on Instagram Stories.");
        }
        if (input.firstComment && input.firstComment.trim()) {
            warnings.push("First comments are not supported on Instagram Stories.");
        }
    }

    // 4. Reel Constraints
    if (contentType === "reel") {
        if (!hasVideo && mediaItems.length > 0) {
            errors.push("Instagram Reels require a video file.");
        }
        if (videoCount > 1 || imageCount > 0) {
            errors.push("Instagram Reels only support a single video. Use a feed carousel if you have multiple media items.");
        }
    }

    // 5. Feed & Carousel Constraints
    if (contentType === "feed") {
        if (mediaItems.length > 10) {
            errors.push(`Instagram carousel supports a maximum of 10 items. (Found ${mediaItems.length})`);
        }
        if (mediaItems.length > 1) {
            warnings.push("For best results in Instagram Carousels, ensure all items share the same aspect ratio. The first item sets the ratio.");
        }
    }

    // 6. Collaborators Limit (max 3 public professional accounts)
    if (rawData.collaborators && Array.isArray(rawData.collaborators)) {
        if (rawData.collaborators.length > 3) {
            errors.push("Instagram allows a maximum of 3 collaborators per post.");
        }
        for (const collab of rawData.collaborators) {
            if (typeof collab !== "string" || !collab.trim()) {
                errors.push("Collaborator username cannot be empty.");
            }
        }
    }

    // 7. User Tags Validation
    if (rawData.userTags && Array.isArray(rawData.userTags)) {
        if (rawData.userTags.length > 20) {
            errors.push("Instagram allows a maximum of 20 user tags per post.");
        }
        for (const tag of rawData.userTags) {
            if (!tag.username || !tag.username.trim()) {
                errors.push("Instagram user tag requires a valid username.");
            }
            // Photo user tags on feed / carousel require (x, y) coordinates between 0.0 and 1.0
            if (contentType === "feed" && !hasVideo && (tag.x === undefined || tag.y === undefined)) {
                errors.push("Instagram photo user tags require (x, y) coordinates between 0.0 and 1.0.");
            }
            if (tag.x !== undefined && (tag.x < 0 || tag.x > 1)) {
                errors.push("Instagram user tag X coordinate must be between 0.0 and 1.0.");
            }
            if (tag.y !== undefined && (tag.y < 0 || tag.y > 1)) {
                errors.push("Instagram user tag Y coordinate must be between 0.0 and 1.0.");
            }
            if (tag.mediaIndex !== undefined && tag.mediaIndex < 0) {
                errors.push("Instagram user tag mediaIndex must be 0 or greater.");
            }
        }
    }

    // 8. Location Tag Validation (Facebook Page numeric ID only)
    if (rawData.locationId) {
        if (typeof rawData.locationId !== "string" || !/^\d+$/.test(rawData.locationId.trim())) {
            errors.push("Instagram locationId must be a numeric Facebook Page ID (digits only). Location place names are not supported by the API.");
        }
    }

    // 9. Branded Content Sponsors Validation (max 2)
    if (rawData.brandedContentSponsors && Array.isArray(rawData.brandedContentSponsors)) {
        if (rawData.brandedContentSponsors.length > 2) {
            errors.push("Instagram allows a maximum of 2 branded content sponsors.");
        }
    }

    // 10. Audio Configuration Validation (Reels only)
    if (rawData.audioConfiguration) {
        if (!rawData.audioConfiguration.audioId) {
            errors.push("Instagram audioConfiguration requires an audioId.");
        }
        if (contentType !== "reel" && !hasVideo) {
            errors.push("Instagram catalog audio can only be attached to Reels or video posts.");
        }
        if (rawData.audioConfiguration.audioVolume !== undefined) {
            if (rawData.audioConfiguration.audioVolume < 0 || rawData.audioConfiguration.audioVolume > 100) {
                errors.push("Audio volume must be between 0 and 100.");
            }
        }
        if (rawData.audioConfiguration.videoVolume !== undefined) {
            if (rawData.audioConfiguration.videoVolume < 0 || rawData.audioConfiguration.videoVolume > 100) {
                errors.push("Video volume must be between 0 and 100.");
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
    // Up to 10 items for carousels
    return mediaItems.slice(0, 10);
}

export function extractInstagramDetails(postData: any): Record<string, any> {
    const raw = (getRawPlatformData(postData, "instagram") || {}) as InstagramPlatformData;
    const thumb = raw.instagramThumbnail || raw.reelCover;

    return {
        status: "pending",
        customContent: raw.customContent,
        contentType: raw.contentType || "feed",
        shareToFeed: raw.shareToFeed !== undefined ? raw.shareToFeed : true,
        collaborators: raw.collaborators,
        firstComment: raw.firstComment || postData.firstComment,
        userTags: raw.userTags,
        reelCover: thumb,
        instagramThumbnail: thumb,
        thumbOffset: raw.thumbOffset ?? 0,
        audioName: raw.audioName,
        audioConfiguration: raw.audioConfiguration,
        muteAudio: Boolean(raw.muteAudio),
        isAiGenerated: Boolean(raw.isAiGenerated),
        isPaidPartnership: Boolean(raw.isPaidPartnership || (raw.brandedContentSponsors && raw.brandedContentSponsors.length > 0)),
        brandedContentSponsors: raw.brandedContentSponsors,
        commentsEnabled: raw.commentsEnabled !== undefined ? raw.commentsEnabled : true,
        locationId: raw.locationId,
        trialParams: raw.trialParams,
    };
}

export function buildInstagramZernioEntry(account: any, post: any): ZernioPlatformPayload {
    const details = post.platformDetails?.instagram || getRawPlatformData(post, "instagram") || {};
    const entry: ZernioPlatformPayload = {
        platform: "instagram",
        accountId: account.zernioAccountId,
    };

    if (details.customContent) {
        entry.customContent = details.customContent;
    }

    const psData: Record<string, any> = {};

    // 1. Content Type (feed, reel, story)
    if (details.contentType) {
        psData.contentType = details.contentType;
    }

    // 2. Share to Feed (Reel only)
    if (details.shareToFeed !== undefined) {
        psData.shareToFeed = details.shareToFeed;
    }

    // 3. Collaborators (up to 3)
    if (details.collaborators && details.collaborators.length > 0 && details.contentType !== "story") {
        psData.collaborators = details.collaborators;
    }

    // 4. First Comment (feed & carousel only)
    const firstComment = details.firstComment || post.firstComment;
    if (firstComment && typeof firstComment === "string" && firstComment.trim() && details.contentType !== "story") {
        psData.firstComment = firstComment.trim();
    }

    // 5. User Tags (coordinates for images/stories; username only for reels/videos)
    if (details.userTags && details.userTags.length > 0) {
        psData.userTags = details.userTags.map((tag: InstagramUserTag) => {
            const cleanTag: Record<string, any> = { username: tag.username.replace(/^@/, "").trim() };
            if (tag.x !== undefined && tag.y !== undefined) {
                cleanTag.x = tag.x;
                cleanTag.y = tag.y;
            }
            if (tag.mediaIndex !== undefined) {
                cleanTag.mediaIndex = tag.mediaIndex;
            }
            return cleanTag;
        });
    }

    // 6. Custom Thumbnail & Offset (sets both instagramThumbnail for Zernio API and reelCover for backward-compatibility)
    const thumbnail = details.instagramThumbnail || details.reelCover;
    if (thumbnail) {
        psData.instagramThumbnail = thumbnail;
        psData.reelCover = thumbnail;
    }
    if (details.thumbOffset !== undefined && details.thumbOffset >= 0) {
        psData.thumbOffset = details.thumbOffset;
    }

    // 7. Audio Name (replaces "Original Audio" on Reels)
    if (details.audioName) {
        psData.audioName = details.audioName;
    }

    // 8. Catalog Audio Configuration (music track attachment)
    if (details.audioConfiguration?.audioId) {
        psData.audioConfiguration = {
            audioId: details.audioConfiguration.audioId,
            ...(details.audioConfiguration.audioVolume !== undefined ? { audioVolume: details.audioConfiguration.audioVolume } : {}),
            ...(details.audioConfiguration.videoVolume !== undefined ? { videoVolume: details.audioConfiguration.videoVolume } : {}),
        };
    }

    // 9. Mute Audio
    if (details.muteAudio) {
        psData.muteAudio = true;
    }

    // 10. AI-Generated Media Label
    if (details.isAiGenerated) {
        psData.isAiGenerated = true;
    }

    // 11. Paid Partnership & Branded Content Sponsors (not allowed on Stories)
    if (details.contentType !== "story") {
        if (details.isPaidPartnership) {
            psData.isPaidPartnership = true;
        }
        if (details.brandedContentSponsors && details.brandedContentSponsors.length > 0) {
            psData.brandedContentSponsors = details.brandedContentSponsors.map((s: string) => s.replace(/^@/, "").trim());
            psData.isPaidPartnership = true;
        }
    }

    // 12. Turn Off Comments (feed, reel, carousel)
    if (details.commentsEnabled !== undefined && details.contentType !== "story") {
        psData.commentsEnabled = details.commentsEnabled;
    }

    // 13. Location Tag (Facebook Page numeric ID; not allowed on Stories)
    if (details.locationId && details.contentType !== "story") {
        psData.locationId = details.locationId.trim();
    }

    // 14. Trial Params (Reels shown only to non-followers)
    if (details.trialParams?.graduationStrategy) {
        psData.trialParams = details.trialParams;
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
    if (/Cannot process video from this URL/i.test(msg) || /Google Drive|Dropbox|OneDrive/i.test(msg)) {
        return "Instagram error: Instagram cannot fetch videos from cloud sharing links (Google Drive, Dropbox, OneDrive). Please use direct CDN URLs or upload the file directly.";
    }
    if (/maximum of 100 posts/i.test(msg) || /100 posts per day/i.test(msg)) {
        return "Instagram rate limit reached: Maximum 100 posts per 24-hour rolling window across all content types.";
    }
    if (/automation detection/i.test(msg) || /blocked your request/i.test(msg)) {
        return "Instagram automation detection triggered. Please reduce posting frequency and vary content before retrying.";
    }
    if (/duplicate content/i.test(msg)) {
        return "Duplicate content detected on Instagram. Please modify the caption or media before retrying.";
    }
    if (/media fetch failed/i.test(msg)) {
        return "Instagram error: Failed to download media from provided URL. Please verify the URL is publicly accessible and returns raw media.";
    }
    if (/instagram_audio_requires_facebook_login/i.test(msg) || /audio requires facebook/i.test(msg)) {
        return "Catalog audio requires an Instagram account connected via Facebook Login. Please reconnect your account in Channels & Accounts choosing the Facebook Page option.";
    }
    if (/instagram_paid_partnership_requires_facebook_login/i.test(msg) || /paid partnership requires facebook/i.test(msg)) {
        return "The Paid Partnership label requires an Instagram account connected via Facebook Login. Please reconnect your account choosing the Facebook Page option.";
    }
    if (/rejected locationId/i.test(msg) || /Facebook Page has no location data/i.test(msg)) {
        return "Instagram rejected locationId: The specified Facebook Page has no location data or does not exist.";
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

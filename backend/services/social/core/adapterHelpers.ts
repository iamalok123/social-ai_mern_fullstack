import { MediaItem, ZernioPlatformPayload } from "./types.js";

/**
 * Extracts platform-specific data safely from either platformSpecificData[platformId]
 * or top-level platformSpecificData
 */
export function getRawPlatformData(postData: any, platformId: string): Record<string, any> {
    let psData = postData?.platformSpecificData;
    if (typeof psData === "string") {
        try {
            psData = JSON.parse(psData);
        } catch {
            psData = {};
        }
    }
    if (psData && typeof psData === "object") {
        return psData[platformId] || psData;
    }
    return {};
}

/**
 * Default media filter returns mediaItems up to maxCount
 */
export function defaultFilterMedia(mediaItems: MediaItem[], maxCount: number): MediaItem[] {
    return mediaItems.slice(0, maxCount);
}

/**
 * Default extraction of platform details to store in Post.platformDetails[platformId]
 */
export function defaultExtractPlatformDetails(postData: any, platformId: string): Record<string, any> {
    const raw = getRawPlatformData(postData, platformId);
    return {
        status: "pending",
        ...raw
    };
}

/**
 * Default builder for Zernio platform payload
 */
export function defaultBuildZernioEntry(account: any, post: any, platformId: string): ZernioPlatformPayload {
    const rawData = getRawPlatformData(post, platformId);
    const details = post.platformDetails?.[platformId] || {};
    const mergedData = { ...rawData, ...details };

    // Clean out internal MongoDB tracking fields from platformSpecificData
    const { status, publishedPostId, failedReason, publishedAt, ...cleanData } = mergedData;

    const payload: ZernioPlatformPayload = {
        platform: account.platform,
        accountId: account.zernioAccountId,
    };

    if (cleanData.customContent) {
        payload.customContent = cleanData.customContent;
    }

    if (Object.keys(cleanData).length > 0) {
        payload.platformSpecificData = cleanData;
    }

    return payload;
}

/**
 * Default error normalization from Axios / Zernio error responses
 */
export function defaultNormalizeError(error: any): string | null {
    const rawError =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (typeof error?.response?.data === "string" ? error.response.data : "") ||
        error?.message;

    if (!rawError) return null;
    return typeof rawError === "string" ? rawError : JSON.stringify(rawError);
}

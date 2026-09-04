/**
 * Frontend Scheduling & Platform Helper Utilities
 */

/**
 * Calculates Twitter / X weighted post length.
 * - Every http:// or https:// URL counts as exactly 23 characters.
 * - Basic Latin / standard ASCII characters (codePoint <= 4351) count as 1.
 * - Emojis and extended Unicode characters (codePoint > 4351) count as 2.
 */
export const calculateTwitterLength = (text: string): number => {
    if (!text) return 0;
    const urlRegex = /https?:\/\/[^\s]+/gi;
    const textWithoutUrls = text.replace(urlRegex, "");
    const urlMatches = text.match(urlRegex) || [];
    const urlLength = urlMatches.length * 23;

    let charLength = 0;
    for (const char of Array.from(textWithoutUrls)) {
        const codePoint = char.codePointAt(0) || 0;
        if (codePoint <= 4351) {
            charLength += 1;
        } else {
            charLength += 2;
        }
    }
    return charLength + urlLength;
};

/**
 * Returns dynamic media upload guidelines based on the selected platform(s).
 */
export const getMediaUploaderHint = (
    selectedPlatforms: string[],
    isTwitterSelected: boolean,
    isFacebookSelected: boolean,
    isInstagramSelected: boolean,
    isLinkedInSelected: boolean
): string => {
    if (isTwitterSelected) {
        return selectedPlatforms.length > 1
            ? "Twitter/X limit applies: up to 4 images (or 1 video)"
            : "Twitter/X supports up to 4 images (or 1 video)";
    }
    if (isFacebookSelected) {
        return selectedPlatforms.length > 1
            ? "Facebook limit applies: up to 10 images (under 4 MB) or 1 video"
            : "Facebook supports up to 10 images (JPEG, PNG, GIF) or 1 video";
    }
    if (isInstagramSelected) {
        return "Instagram requires media: up to 10 images or 1 video";
    }
    if (isLinkedInSelected) {
        return "LinkedIn supports up to 20 images (JPEG, PNG, GIF) or 1 video";
    }
    return "Supports images (JPEG, PNG, GIF) or video (MP4)";
};

/**
 * Returns the primary platform display name for modals and upload managers.
 */
export const getActivePlatformDisplayName = (
    isTwitterSelected: boolean,
    isFacebookSelected: boolean,
    isInstagramSelected: boolean,
    isLinkedInSelected: boolean
): string => {
    if (isTwitterSelected) return "Twitter/X";
    if (isFacebookSelected) return "Facebook";
    if (isInstagramSelected) return "Instagram";
    if (isLinkedInSelected) return "LinkedIn";
    return "Social";
};

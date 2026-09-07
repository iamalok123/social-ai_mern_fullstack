import type { SelectedAudioConfig } from "../Media/InstagramAudioModal";

export interface Post {
    _id: string;
    content: string;
    scheduledFor: string;
    status: "scheduled" | "published" | "failed";
    platforms: string[];
    mediaUrl?: string;
    mediaUrls?: string[];
    mediaType?: "image" | "video";
    failedReason?: string;
    createdAt?: string;
    updatedAt?: string;
    firstComment?: string;
    disableLinkPreview?: boolean;
    platformSpecificData?: Record<string, any>;
}

export interface PostThumbnailProps {
    mediaUrl: string;
    isVideo: boolean;
    count?: number;
    onClick: () => void;
}

export interface LinkedInOptions {
    firstComment: string;
    isFirstCommentRequired: boolean;
    disableLinkPreview: boolean;
}

export interface FacebookOptions {
    contentType: "feed" | "reel" | "story";
    title: string;
    draft: boolean;
    textPreset: string;
    geoCountries: string;
}

export interface InstagramOptions {
    contentType: "feed" | "reel" | "story";
    shareToFeed: boolean;
    audioConfig: SelectedAudioConfig | null;
    muteAudio: boolean;
    trial: boolean;
    trialGraduation: "SS_PERFORMANCE" | "MANUAL";
    thumbnail: string;
    thumbOffset: number;
    collaborators: string;
    locationId: string;
    paidPartnership: boolean;
    sponsors: string;
    commentsEnabled: boolean;
}

export interface AnalyticsData {
    impressions?: number;
    reach?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saved?: number;
    [key: string]: any;
}

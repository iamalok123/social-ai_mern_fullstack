export interface InstagramUserTag {
    username: string;
    x?: number;
    y?: number;
    mediaIndex?: number;
}

export interface InstagramAudioConfig {
    audioId: string;
    audioVolume?: number; // 0 - 100, default 100
    videoVolume?: number; // 0 - 100, default 100
}

export interface InstagramTrialParams {
    graduationStrategy: "MANUAL" | "SS_PERFORMANCE";
}

export interface InstagramPlatformData {
    customContent?: string;
    contentType?: "feed" | "reel" | "story";
    shareToFeed?: boolean;
    collaborators?: string[];
    firstComment?: string;
    userTags?: InstagramUserTag[];
    reelCover?: string;
    instagramThumbnail?: string;
    thumbOffset?: number; // Millisecond offset for thumbnail
    audioName?: string;
    audioConfiguration?: InstagramAudioConfig;
    muteAudio?: boolean;
    isAiGenerated?: boolean;
    isPaidPartnership?: boolean;
    brandedContentSponsors?: string[];
    commentsEnabled?: boolean;
    locationId?: string; // Facebook Page numeric ID
    trialParams?: InstagramTrialParams;
}

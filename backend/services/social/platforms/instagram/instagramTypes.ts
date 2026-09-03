export interface InstagramUserTag {
    username: string;
    x: number;
    y: number;
    mediaIndex?: number;
}

export interface InstagramPlatformData {
    customContent?: string;
    contentType?: "feed" | "reel" | "story";
    shareToFeed?: boolean;
    collaborators?: string[];
    firstComment?: string;
    userTags?: InstagramUserTag[];
    reelCover?: string;
    audioName?: string;
    isAiGenerated?: boolean;
}

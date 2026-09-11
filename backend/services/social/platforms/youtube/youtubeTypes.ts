export type YouTubeVisibility = "public" | "private" | "unlisted";

export interface YouTubePlatformData {
    title?: string;
    visibility?: YouTubeVisibility;
    categoryId?: string;
    madeForKids?: boolean;
    containsSyntheticMedia?: boolean;
    playlistId?: string;
    firstComment?: string;
    tags?: string[];
    thumbnail?: string;
    isShort?: boolean;
}

export interface YouTubePlaylist {
    id: string;
    title: string;
    privacy: string;
    itemCount: number;
}

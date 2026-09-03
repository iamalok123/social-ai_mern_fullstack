export interface MediaItem {
    url: string;
    type: "image" | "video";
    title?: string;
    altText?: string;
    thumbnail?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}

export interface PostValidationInput {
    content: string;
    mediaItems?: MediaItem[];
    platformSpecificData?: Record<string, any>;
    firstComment?: string;
    disableLinkPreview?: boolean;
}

export interface PlatformCapabilities {
    platformId: string;
    displayName: string;
    maxCharacters: number;
    supportedMediaTypes: Array<"image" | "video" | "document">;
    maxMediaCount: number;
    supportsFirstComment: boolean;
    supportsLinkPreviewToggle: boolean;
    supportsPolls: boolean;
    supportsThreads: boolean;
    supportsStories: boolean;
    supportsReels: boolean;
    supportsCustomTitle: boolean;
}

export interface ZernioPlatformPayload {
    platform: string;
    accountId: string;
    customContent?: string;
    customMedia?: Array<{ type?: "image" | "video" | "gif" | "document"; url?: string }>;
    scheduledFor?: string;
    platformSpecificData?: Record<string, any>;
}

export interface PlatformAdapter {
    readonly platformId: string;
    readonly displayName: string;
    getCapabilities(): PlatformCapabilities;
    validatePost(input: PostValidationInput): ValidationResult;
    filterMediaItems?(mediaItems: MediaItem[]): MediaItem[];
    extractPlatformDetails(postData: any): Record<string, any>;
    buildZernioPlatformEntry(account: any, post: any): ZernioPlatformPayload;
    normalizeError(error: any): string | null;
}


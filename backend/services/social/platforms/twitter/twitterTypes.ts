export interface TwitterPoll {
    options: string[];
    durationMinutes?: number;
}

export interface TwitterThreadItem {
    content?: string;
    mediaUrls?: string[];
}

export interface TwitterPlatformData {
    replyToTweetId?: string;
    quoteTweetId?: string;
    replySettings?: "following" | "mentionedUsers" | "subscribers" | "verified";
    threadItems?: TwitterThreadItem[];
    poll?: TwitterPoll;
    customContent?: string;
}

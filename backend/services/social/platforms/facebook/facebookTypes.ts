export interface FacebookCarouselCard {
    link: string;
    name?: string;
    description?: string;
}

export interface FacebookPlatformData {
    customContent?: string;
    contentType?: "feed" | "story" | "reel";
    title?: string;
    firstComment?: string;
    pageId?: string;
    carouselCards?: FacebookCarouselCard[];
    carouselLink?: string;
    draft?: boolean;
}

export interface FacebookCarouselCard {
    link: string;
    name?: string;
    description?: string;
}

export interface FacebookSettings {
    draft?: boolean;
    carouselCards?: FacebookCarouselCard[];
    carouselLink?: string;
    textFormatPresetId?: string;
}

export interface FacebookGeoRestriction {
    countries?: string[];
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
    textFormatPresetId?: string;
    geoRestriction?: FacebookGeoRestriction;
    facebookSettings?: FacebookSettings;
}

export interface InstagramAccountLike {
    loginMethod?: string;
    metadata?: {
        loginMethod?: string;
        selectedPageId?: string;
        selectedPageName?: string;
        [key: string]: any;
    };
    capabilities?: {
        catalogAudio?: boolean;
        paidPartnership?: boolean;
        [key: string]: any;
    };
    [key: string]: any;
}

export interface InstagramBadgeInfo {
    badgeText: string;
    isFacebookLogin: boolean;
    tooltip: string;
}

/**
 * Returns badge details and capabilities for an Instagram account based on connection method
 */
export function getInstagramBadgeInfo(account?: InstagramAccountLike | null): InstagramBadgeInfo {
    const isFacebookLogin =
        account?.loginMethod === "facebook_login" ||
        account?.metadata?.loginMethod === "facebook_login" ||
        Boolean(account?.metadata?.selectedPageId);

    if (isFacebookLogin) {
        const pageName = account?.metadata?.selectedPageName;
        return {
            badgeText: "Facebook Login",
            isFacebookLogin: true,
            tooltip: pageName
                ? `Connected via Facebook Page: ${pageName} (Supports Catalog Audio & Paid Partnerships)`
                : "Connected via Facebook Page Login (Supports Catalog Audio & Paid Partnerships)"
        };
    }

    return {
        badgeText: "Direct Login",
        isFacebookLogin: false,
        tooltip: "Connected via Direct Instagram Login"
    };
}

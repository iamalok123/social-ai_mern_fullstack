import React from "react";
import LinkedInOptionsCard from "./linkedin/LinkedInOptionsCard";
import FacebookOptionsCard from "./facebook/FacebookOptionsCard";
import InstagramOptionsCard from "./instagram/InstagramOptionsCard";
import YouTubeOptionsCard from "./youtube/YouTubeOptionsCard";
import type { SelectedAudioConfig } from "../../Media/InstagramAudioModal";

interface PlatformOptionsContainerProps {
    selectedPlatforms: string[];
    // LinkedIn props
    firstComment: string;
    onFirstCommentChange: (val: string) => void;
    isFirstCommentRequired: boolean;
    onFirstCommentRequiredChange: (val: boolean) => void;
    disableLinkPreview: boolean;
    onDisableLinkPreviewChange: (val: boolean) => void;
    isLinkedinCollapsed: boolean;
    onToggleLinkedinCollapse: () => void;

    // Facebook props
    facebookContentType: "feed" | "reel" | "story";
    onFacebookContentTypeChange: (val: "feed" | "reel" | "story") => void;
    facebookTitle: string;
    onFacebookTitleChange: (val: string) => void;
    facebookDraft: boolean;
    onFacebookDraftChange: (val: boolean) => void;
    facebookTextPreset: string;
    onFacebookTextPresetChange: (val: string) => void;
    facebookGeoCountries: string;
    onFacebookGeoCountriesChange: (val: string) => void;
    hasMedia: boolean;
    isFacebookCollapsed: boolean;
    onToggleFacebookCollapse: () => void;

    // Instagram props
    instagramContentType: "feed" | "reel" | "story";
    onInstagramContentTypeChange: (val: "feed" | "reel" | "story") => void;
    instagramShareToFeed: boolean;
    onInstagramShareToFeedChange: (val: boolean) => void;
    instagramAudioConfig: SelectedAudioConfig | null;
    onInstagramAudioConfigChange: (val: SelectedAudioConfig | null) => void;
    onOpenAudioModal: () => void;
    instagramMuteAudio: boolean;
    onInstagramMuteAudioChange: (val: boolean) => void;
    instagramTrial: boolean;
    onInstagramTrialChange: (val: boolean) => void;
    instagramTrialGraduation: "SS_PERFORMANCE" | "MANUAL";
    onInstagramTrialGraduationChange: (val: "SS_PERFORMANCE" | "MANUAL") => void;
    instagramThumbnail: string;
    onInstagramThumbnailChange: (val: string) => void;
    instagramThumbOffset: number;
    onInstagramThumbOffsetChange: (val: number) => void;
    instagramCollaborators: string;
    onInstagramCollaboratorsChange: (val: string) => void;
    instagramLocationId: string;
    onInstagramLocationIdChange: (val: string) => void;
    instagramPaidPartnership: boolean;
    onInstagramPaidPartnershipChange: (val: boolean) => void;
    instagramSponsors: string;
    onInstagramSponsorsChange: (val: string) => void;
    instagramCommentsEnabled: boolean;
    onInstagramCommentsEnabledChange: (val: boolean) => void;
    isInstagramViaFacebook: boolean;
    isInstagramCollapsed: boolean;
    onToggleInstagramCollapse: () => void;

    // YouTube props
    youtubeTitle: string;
    onYoutubeTitleChange: (val: string) => void;
    youtubeVisibility: "public" | "private" | "unlisted";
    onYoutubeVisibilityChange: (val: "public" | "private" | "unlisted") => void;
    youtubeCategoryId: string;
    onYoutubeCategoryIdChange: (val: string) => void;
    youtubeMadeForKids: boolean;
    onYoutubeMadeForKidsChange: (val: boolean) => void;
    youtubeContainsSyntheticMedia: boolean;
    onYoutubeContainsSyntheticMediaChange: (val: boolean) => void;
    youtubePlaylistId: string;
    onYoutubePlaylistIdChange: (val: string) => void;
    youtubePlaylists: Array<{ id: string; title: string; itemCount?: number }>;
    isLoadingPlaylists?: boolean;
    onRefreshPlaylists?: () => void;
    youtubeFirstComment: string;
    onYoutubeFirstCommentChange: (val: string) => void;
    youtubeCustomThumbnail: string;
    onYoutubeCustomThumbnailChange: (val: string) => void;
    youtubeIsShort: boolean;
    hasVideo: boolean;
    isYoutubeCollapsed: boolean;
    onToggleYoutubeCollapse: () => void;
}

export const PlatformOptionsContainer: React.FC<PlatformOptionsContainerProps> = ({
    selectedPlatforms,
    // LinkedIn
    firstComment,
    onFirstCommentChange,
    isFirstCommentRequired,
    onFirstCommentRequiredChange,
    disableLinkPreview,
    onDisableLinkPreviewChange,
    isLinkedinCollapsed,
    onToggleLinkedinCollapse,

    // Facebook
    facebookContentType,
    onFacebookContentTypeChange,
    facebookTitle,
    onFacebookTitleChange,
    facebookDraft,
    onFacebookDraftChange,
    facebookTextPreset,
    onFacebookTextPresetChange,
    facebookGeoCountries,
    onFacebookGeoCountriesChange,
    hasMedia,
    isFacebookCollapsed,
    onToggleFacebookCollapse,

    // Instagram
    instagramContentType,
    onInstagramContentTypeChange,
    instagramShareToFeed,
    onInstagramShareToFeedChange,
    instagramAudioConfig,
    onInstagramAudioConfigChange,
    onOpenAudioModal,
    instagramMuteAudio,
    onInstagramMuteAudioChange,
    instagramTrial,
    onInstagramTrialChange,
    instagramTrialGraduation,
    onInstagramTrialGraduationChange,
    instagramThumbnail,
    onInstagramThumbnailChange,
    instagramThumbOffset,
    onInstagramThumbOffsetChange,
    instagramCollaborators,
    onInstagramCollaboratorsChange,
    instagramLocationId,
    onInstagramLocationIdChange,
    instagramPaidPartnership,
    onInstagramPaidPartnershipChange,
    instagramSponsors,
    onInstagramSponsorsChange,
    instagramCommentsEnabled,
    onInstagramCommentsEnabledChange,
    isInstagramViaFacebook,
    isInstagramCollapsed,
    onToggleInstagramCollapse,

    // YouTube
    youtubeTitle,
    onYoutubeTitleChange,
    youtubeVisibility,
    onYoutubeVisibilityChange,
    youtubeCategoryId,
    onYoutubeCategoryIdChange,
    youtubeMadeForKids,
    onYoutubeMadeForKidsChange,
    youtubeContainsSyntheticMedia,
    onYoutubeContainsSyntheticMediaChange,
    youtubePlaylistId,
    onYoutubePlaylistIdChange,
    youtubePlaylists,
    isLoadingPlaylists,
    onRefreshPlaylists,
    youtubeFirstComment,
    onYoutubeFirstCommentChange,
    youtubeCustomThumbnail,
    onYoutubeCustomThumbnailChange,
    youtubeIsShort,
    hasVideo,
    isYoutubeCollapsed,
    onToggleYoutubeCollapse,
}) => {
    return (
        <div className="space-y-4">
            {/* YouTube Options Card */}
            {selectedPlatforms.includes("youtube") && (
                <YouTubeOptionsCard
                    title={youtubeTitle}
                    onTitleChange={onYoutubeTitleChange}
                    visibility={youtubeVisibility}
                    onVisibilityChange={onYoutubeVisibilityChange}
                    categoryId={youtubeCategoryId}
                    onCategoryIdChange={onYoutubeCategoryIdChange}
                    madeForKids={youtubeMadeForKids}
                    onMadeForKidsChange={onYoutubeMadeForKidsChange}
                    containsSyntheticMedia={youtubeContainsSyntheticMedia}
                    onContainsSyntheticMediaChange={onYoutubeContainsSyntheticMediaChange}
                    playlistId={youtubePlaylistId}
                    onPlaylistIdChange={onYoutubePlaylistIdChange}
                    playlists={youtubePlaylists}
                    isLoadingPlaylists={isLoadingPlaylists}
                    onRefreshPlaylists={onRefreshPlaylists}
                    firstComment={youtubeFirstComment}
                    onFirstCommentChange={onYoutubeFirstCommentChange}
                    isShort={youtubeIsShort}
                    customThumbnail={youtubeCustomThumbnail}
                    onCustomThumbnailChange={onYoutubeCustomThumbnailChange}
                    hasVideo={hasVideo}
                    isCollapsed={isYoutubeCollapsed}
                    onToggleCollapse={onToggleYoutubeCollapse}
                />
            )}

            {/* LinkedIn Growth Features Card */}
            {selectedPlatforms.includes("linkedin") && (
                <LinkedInOptionsCard
                    firstComment={firstComment}
                    onFirstCommentChange={onFirstCommentChange}
                    isFirstCommentRequired={isFirstCommentRequired}
                    onFirstCommentRequiredChange={onFirstCommentRequiredChange}
                    disableLinkPreview={disableLinkPreview}
                    onDisableLinkPreviewChange={onDisableLinkPreviewChange}
                    isCollapsed={isLinkedinCollapsed}
                    onToggleCollapse={onToggleLinkedinCollapse}
                />
            )}

            {/* Facebook Page Options Card */}
            {selectedPlatforms.includes("facebook") && (
                <FacebookOptionsCard
                    contentType={facebookContentType}
                    onContentTypeChange={onFacebookContentTypeChange}
                    title={facebookTitle}
                    onTitleChange={onFacebookTitleChange}
                    draft={facebookDraft}
                    onDraftChange={onFacebookDraftChange}
                    textPreset={facebookTextPreset}
                    onTextPresetChange={onFacebookTextPresetChange}
                    geoCountries={facebookGeoCountries}
                    onGeoCountriesChange={onFacebookGeoCountriesChange}
                    hasMedia={hasMedia}
                    isCollapsed={isFacebookCollapsed}
                    onToggleCollapse={onToggleFacebookCollapse}
                />
            )}

            {/* Instagram Options Card */}
            {selectedPlatforms.includes("instagram") && (
                <InstagramOptionsCard
                    contentType={instagramContentType}
                    onContentTypeChange={onInstagramContentTypeChange}
                    shareToFeed={instagramShareToFeed}
                    onShareToFeedChange={onInstagramShareToFeedChange}
                    audioConfig={instagramAudioConfig}
                    onAudioConfigChange={onInstagramAudioConfigChange}
                    onOpenAudioModal={onOpenAudioModal}
                    muteAudio={instagramMuteAudio}
                    onMuteAudioChange={onInstagramMuteAudioChange}
                    trial={instagramTrial}
                    onTrialChange={onInstagramTrialChange}
                    trialGraduation={instagramTrialGraduation}
                    onTrialGraduationChange={onInstagramTrialGraduationChange}
                    thumbnail={instagramThumbnail}
                    onThumbnailChange={onInstagramThumbnailChange}
                    thumbOffset={instagramThumbOffset}
                    onThumbOffsetChange={onInstagramThumbOffsetChange}
                    collaborators={instagramCollaborators}
                    onCollaboratorsChange={onInstagramCollaboratorsChange}
                    locationId={instagramLocationId}
                    onLocationIdChange={onInstagramLocationIdChange}
                    paidPartnership={instagramPaidPartnership}
                    onPaidPartnershipChange={onInstagramPaidPartnershipChange}
                    sponsors={instagramSponsors}
                    onSponsorsChange={onInstagramSponsorsChange}
                    commentsEnabled={instagramCommentsEnabled}
                    onCommentsEnabledChange={onInstagramCommentsEnabledChange}
                    isInstagramViaFacebook={isInstagramViaFacebook}
                    isCollapsed={isInstagramCollapsed}
                    onToggleCollapse={onToggleInstagramCollapse}
                />
            )}
        </div>
    );
};

export default PlatformOptionsContainer;

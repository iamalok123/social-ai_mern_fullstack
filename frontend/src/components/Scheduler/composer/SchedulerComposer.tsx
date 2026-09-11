import React from "react";
import { ArrowRightIcon } from "lucide-react";
import ComposerHeader from "./ComposerHeader";
import ContentEditor from "./ContentEditor";
import MediaUploader from "./MediaUploader";
import DateTimePicker from "./DateTimePicker";
import PlatformOptionsContainer from "../platforms/PlatformOptionsContainer";
import type { SelectedAudioConfig } from "../../Media/InstagramAudioModal";

interface SchedulerComposerProps {
    selectedPlatforms: string[];
    onTogglePlatform: (platformId: string) => void;

    // Content Editor
    content: string;
    onContentChange: (val: string) => void;
    onMoveLinkToFirstComment: () => void;

    // Media Uploader
    allPreviewMediaUrls: string[];
    hasVideo: boolean;
    activeMediaType: "image" | "video" | null;
    mediaFiles: File[];
    existingMediaUrls: string[];
    maxAllowedImages: number;
    mediaUploaderHint: string;
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onRemoveFile: (index: number) => void;
    onRemoveExistingMedia: (index: number) => void;
    onAddFiles: (files: FileList | File[]) => void;
    onOpenMediaModal: () => void;

    // Date Time
    scheduledDate: string;
    onScheduledDateChange: (val: string) => void;
    scheduledTime: string;
    onScheduledTimeChange: (val: string) => void;

    // LinkedIn
    firstComment: string;
    onFirstCommentChange: (val: string) => void;
    isFirstCommentRequired: boolean;
    onFirstCommentRequiredChange: (val: boolean) => void;
    disableLinkPreview: boolean;
    onDisableLinkPreviewChange: (val: boolean) => void;
    isLinkedinCollapsed: boolean;
    onToggleLinkedinCollapse: () => void;

    // Facebook
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
    isFacebookCollapsed: boolean;
    onToggleFacebookCollapse: () => void;

    // Instagram
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

    // YouTube
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
    isYoutubeCollapsed: boolean;
    onToggleYoutubeCollapse: () => void;

    // Submission
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export const SchedulerComposer: React.FC<SchedulerComposerProps> = ({
    selectedPlatforms,
    onTogglePlatform,
    content,
    onContentChange,
    onMoveLinkToFirstComment,
    allPreviewMediaUrls,
    hasVideo,
    activeMediaType,
    mediaFiles,
    existingMediaUrls,
    maxAllowedImages,
    mediaUploaderHint,
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onRemoveFile,
    onRemoveExistingMedia,
    onAddFiles,
    onOpenMediaModal,
    scheduledDate,
    onScheduledDateChange,
    scheduledTime,
    onScheduledTimeChange,
    firstComment,
    onFirstCommentChange,
    isFirstCommentRequired,
    onFirstCommentRequiredChange,
    disableLinkPreview,
    onDisableLinkPreviewChange,
    isLinkedinCollapsed,
    onToggleLinkedinCollapse,
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
    isFacebookCollapsed,
    onToggleFacebookCollapse,
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
    isYoutubeCollapsed,
    onToggleYoutubeCollapse,
    onSubmit,
    loading,
}) => {
    const hasMedia = mediaFiles.length > 0 || existingMediaUrls.length > 0;

    return (
        <div
            className={`w-full transition-all duration-200 ${
                selectedPlatforms.length > 0 ? "flex-1 max-w-2xl" : "w-full max-w-3xl mx-auto"
            }`}
        >
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs">
                {/* Header */}
                <ComposerHeader
                    selectedPlatforms={selectedPlatforms}
                    onTogglePlatform={onTogglePlatform}
                />

                <form className="space-y-4" onSubmit={onSubmit}>
                    {/* 2-Column Main Form Body */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <ContentEditor
                            content={content}
                            onChange={onContentChange}
                            selectedPlatforms={selectedPlatforms}
                            firstComment={firstComment}
                            onMoveLinkToFirstComment={onMoveLinkToFirstComment}
                        />

                        <div className="md:col-span-5 flex flex-col justify-between gap-3">
                            <MediaUploader
                                allPreviewMediaUrls={allPreviewMediaUrls}
                                hasVideo={hasVideo}
                                activeMediaType={activeMediaType}
                                mediaFiles={mediaFiles}
                                existingMediaUrls={existingMediaUrls}
                                maxAllowedImages={maxAllowedImages}
                                mediaUploaderHint={mediaUploaderHint}
                                isDragging={isDragging}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                onRemoveFile={onRemoveFile}
                                onRemoveExistingMedia={onRemoveExistingMedia}
                                onAddFiles={onAddFiles}
                                onOpenMediaModal={onOpenMediaModal}
                            />

                            <DateTimePicker
                                scheduledDate={scheduledDate}
                                onDateChange={onScheduledDateChange}
                                scheduledTime={scheduledTime}
                                onTimeChange={onScheduledTimeChange}
                            />
                        </div>
                    </div>

                    {/* Platform Options Container */}
                    <PlatformOptionsContainer
                        selectedPlatforms={selectedPlatforms}
                        firstComment={firstComment}
                        onFirstCommentChange={onFirstCommentChange}
                        isFirstCommentRequired={isFirstCommentRequired}
                        onFirstCommentRequiredChange={onFirstCommentRequiredChange}
                        disableLinkPreview={disableLinkPreview}
                        onDisableLinkPreviewChange={onDisableLinkPreviewChange}
                        isLinkedinCollapsed={isLinkedinCollapsed}
                        onToggleLinkedinCollapse={onToggleLinkedinCollapse}
                        facebookContentType={facebookContentType}
                        onFacebookContentTypeChange={onFacebookContentTypeChange}
                        facebookTitle={facebookTitle}
                        onFacebookTitleChange={onFacebookTitleChange}
                        facebookDraft={facebookDraft}
                        onFacebookDraftChange={onFacebookDraftChange}
                        facebookTextPreset={facebookTextPreset}
                        onFacebookTextPresetChange={onFacebookTextPresetChange}
                        facebookGeoCountries={facebookGeoCountries}
                        onFacebookGeoCountriesChange={onFacebookGeoCountriesChange}
                        hasMedia={hasMedia}
                        hasVideo={hasVideo}
                        isFacebookCollapsed={isFacebookCollapsed}
                        onToggleFacebookCollapse={onToggleFacebookCollapse}
                        instagramContentType={instagramContentType}
                        onInstagramContentTypeChange={onInstagramContentTypeChange}
                        instagramShareToFeed={instagramShareToFeed}
                        onInstagramShareToFeedChange={onInstagramShareToFeedChange}
                        instagramAudioConfig={instagramAudioConfig}
                        onInstagramAudioConfigChange={onInstagramAudioConfigChange}
                        onOpenAudioModal={onOpenAudioModal}
                        instagramMuteAudio={instagramMuteAudio}
                        onInstagramMuteAudioChange={onInstagramMuteAudioChange}
                        instagramTrial={instagramTrial}
                        onInstagramTrialChange={onInstagramTrialChange}
                        instagramTrialGraduation={instagramTrialGraduation}
                        onInstagramTrialGraduationChange={onInstagramTrialGraduationChange}
                        instagramThumbnail={instagramThumbnail}
                        onInstagramThumbnailChange={onInstagramThumbnailChange}
                        instagramThumbOffset={instagramThumbOffset}
                        onInstagramThumbOffsetChange={onInstagramThumbOffsetChange}
                        instagramCollaborators={instagramCollaborators}
                        onInstagramCollaboratorsChange={onInstagramCollaboratorsChange}
                        instagramLocationId={instagramLocationId}
                        onInstagramLocationIdChange={onInstagramLocationIdChange}
                        instagramPaidPartnership={instagramPaidPartnership}
                        onInstagramPaidPartnershipChange={onInstagramPaidPartnershipChange}
                        instagramSponsors={instagramSponsors}
                        onInstagramSponsorsChange={onInstagramSponsorsChange}
                        instagramCommentsEnabled={instagramCommentsEnabled}
                        onInstagramCommentsEnabledChange={onInstagramCommentsEnabledChange}
                        isInstagramViaFacebook={isInstagramViaFacebook}
                        isInstagramCollapsed={isInstagramCollapsed}
                        onToggleInstagramCollapse={onToggleInstagramCollapse}
                        youtubeTitle={youtubeTitle}
                        onYoutubeTitleChange={onYoutubeTitleChange}
                        youtubeVisibility={youtubeVisibility}
                        onYoutubeVisibilityChange={onYoutubeVisibilityChange}
                        youtubeCategoryId={youtubeCategoryId}
                        onYoutubeCategoryIdChange={onYoutubeCategoryIdChange}
                        youtubeMadeForKids={youtubeMadeForKids}
                        onYoutubeMadeForKidsChange={onYoutubeMadeForKidsChange}
                        youtubeContainsSyntheticMedia={youtubeContainsSyntheticMedia}
                        onYoutubeContainsSyntheticMediaChange={onYoutubeContainsSyntheticMediaChange}
                        youtubePlaylistId={youtubePlaylistId}
                        onYoutubePlaylistIdChange={onYoutubePlaylistIdChange}
                        youtubePlaylists={youtubePlaylists}
                        isLoadingPlaylists={isLoadingPlaylists}
                        onRefreshPlaylists={onRefreshPlaylists}
                        youtubeFirstComment={youtubeFirstComment}
                        onYoutubeFirstCommentChange={onYoutubeFirstCommentChange}
                        youtubeCustomThumbnail={youtubeCustomThumbnail}
                        onYoutubeCustomThumbnailChange={onYoutubeCustomThumbnailChange}
                        youtubeIsShort={youtubeIsShort}
                        isYoutubeCollapsed={isYoutubeCollapsed}
                        onToggleYoutubeCollapse={onToggleYoutubeCollapse}
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 transition-all text-white text-sm rounded-xl cursor-pointer font-semibold shadow-md shadow-red-500/20 disabled:opacity-50 mt-1 active:scale-[0.99]"
                    >
                        {loading ? (
                            <>
                                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Scheduling...
                            </>
                        ) : (
                            <>
                                Schedule Post
                                <ArrowRightIcon className="size-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SchedulerComposer;

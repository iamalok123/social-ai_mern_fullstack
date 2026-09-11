import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { PLATFORMS } from "../../../assets/assets";
import TwitterPostPreview from "../../Media/Twitter";
import LinkedInPostPreview from "../../Media/Linkedin";
import FacebookPostPreview from "../../Media/Facebook";
import InstagramPostPreview from "../../Media/Instagram";
import YouTubePostPreview from "../../Media/YouTube";
import type { SelectedAudioConfig } from "../../Media/InstagramAudioModal";

interface SchedulerLivePreviewProps {
    selectedPlatforms: string[];
    activePreviewIndex: number;
    onPrevPreview: () => void;
    onNextPreview: () => void;
    onSelectPreviewIndex: (index: number) => void;
    content: string;
    previewMediaUrl: string | null;
    allPreviewMediaUrls: string[];
    activeMediaType: "image" | "video" | null;
    user: any;

    // Platform specific
    firstComment: string;
    disableLinkPreview: boolean;
    onOpenMediaModal: () => void;

    facebookContentType: "feed" | "reel" | "story";
    facebookTitle: string;
    facebookDraft: boolean;
    facebookTextPreset: string;

    instagramContentType: "feed" | "reel" | "story";
    instagramCollaborators: string;
    instagramLocationId: string;
    instagramPaidPartnership: boolean;
    instagramSponsors: string;
    instagramAudioConfig: SelectedAudioConfig | null;
    instagramMuteAudio: boolean;
    instagramTrial: boolean;
    instagramCommentsEnabled: boolean;

    // YouTube
    youtubeTitle?: string;
    youtubeVisibility?: "public" | "private" | "unlisted";
    youtubeIsShort?: boolean;
    youtubeFirstComment?: string;
    youtubeCustomThumbnail?: string;
    youtubeMadeForKids?: boolean;
    youtubeContainsSyntheticMedia?: boolean;
}

export const SchedulerLivePreview: React.FC<SchedulerLivePreviewProps> = ({
    selectedPlatforms,
    activePreviewIndex,
    onPrevPreview,
    onNextPreview,
    onSelectPreviewIndex,
    content,
    previewMediaUrl,
    allPreviewMediaUrls,
    activeMediaType,
    user,
    firstComment,
    disableLinkPreview,
    onOpenMediaModal,
    facebookContentType,
    facebookTitle,
    facebookDraft,
    facebookTextPreset,
    instagramContentType,
    instagramCollaborators,
    instagramLocationId,
    instagramPaidPartnership,
    instagramSponsors,
    instagramAudioConfig,
    instagramMuteAudio,
    instagramTrial,
    instagramCommentsEnabled,
    youtubeTitle,
    youtubeVisibility,
    youtubeIsShort,
    youtubeFirstComment,
    youtubeCustomThumbnail,
    youtubeMadeForKids,
    youtubeContainsSyntheticMedia,
}) => {
    if (selectedPlatforms.length === 0) return null;

    const currentPlatformId =
        selectedPlatforms[activePreviewIndex] || selectedPlatforms[0] || "twitter";
    const currentPlatformMeta =
        PLATFORMS.find((p) => p.id === currentPlatformId) || PLATFORMS[0];

    return (
        <div className="w-full lg:w-auto flex flex-col items-center shrink-0 lg:sticky lg:top-6 transition-all duration-300 animate-in fade-in slide-in-from-right-4">
            <div className="w-full max-w-md flex items-center justify-between mb-1.5 px-1">
                {/* Left Title + Current Platform Badge */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        Live Preview
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 px-2 py-0.5 rounded-full">
                        <span className="size-1.5 rounded-full bg-sky-500 animate-pulse" />
                        {currentPlatformMeta.name}
                    </span>
                </div>

                {/* Right Controls: < > Buttons for navigating multiple selected previews */}
                {selectedPlatforms.length > 1 && (
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                        <button
                            type="button"
                            onClick={onPrevPreview}
                            title="Previous preview platform"
                            className="p-0.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        >
                            <ChevronLeftIcon className="size-3.5" />
                        </button>
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400 px-1">
                            {activePreviewIndex + 1} / {selectedPlatforms.length}
                        </span>
                        <button
                            type="button"
                            onClick={onNextPreview}
                            title="Next preview platform"
                            className="p-0.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        >
                            <ChevronRightIcon className="size-3.5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Platform Pills bar if multiple platforms selected */}
            {selectedPlatforms.length > 1 && (
                <div className="w-full max-w-md flex items-center gap-1.5 mb-2 overflow-x-auto pb-0.5">
                    {selectedPlatforms.map((pId, idx) => {
                        const pMeta = PLATFORMS.find((p) => p.id === pId);
                        const Icon = pMeta?.icon;
                        const isActive = idx === activePreviewIndex;
                        return (
                            <button
                                key={pId}
                                type="button"
                                onClick={() => onSelectPreviewIndex(idx)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                                    isActive
                                        ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-xs"
                                        : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                                }`}
                            >
                                {Icon && <Icon className="size-3" />}
                                <span>{pMeta?.name || pId}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Selected Platform Preview Component */}
            <div className="w-full flex justify-center">
                {currentPlatformId === "twitter" && (
                    <TwitterPostPreview
                        content={content}
                        mediaUrl={previewMediaUrl}
                        mediaUrls={allPreviewMediaUrls}
                        mediaType={activeMediaType}
                        user={user}
                    />
                )}
                {currentPlatformId === "linkedin" && (
                    <LinkedInPostPreview
                        content={content}
                        mediaUrl={previewMediaUrl}
                        mediaUrls={allPreviewMediaUrls}
                        mediaType={activeMediaType}
                        user={user}
                        firstComment={firstComment}
                        disableLinkPreview={disableLinkPreview}
                        onOpenMediaModal={onOpenMediaModal}
                    />
                )}
                {currentPlatformId === "facebook" && (
                    <FacebookPostPreview
                        content={content}
                        mediaUrl={previewMediaUrl}
                        mediaUrls={allPreviewMediaUrls}
                        mediaType={activeMediaType}
                        user={user}
                        firstComment={firstComment}
                        contentType={facebookContentType}
                        title={facebookTitle}
                        draft={facebookDraft}
                        textFormatPresetId={facebookTextPreset}
                    />
                )}
                {currentPlatformId === "instagram" && (
                    <InstagramPostPreview
                        content={content}
                        mediaUrl={previewMediaUrl}
                        mediaUrls={allPreviewMediaUrls}
                        mediaType={activeMediaType}
                        user={user}
                        contentType={instagramContentType}
                        collaborators={
                            instagramCollaborators
                                ? instagramCollaborators
                                      .split(",")
                                      .map((c) => c.trim().replace(/^@/, ""))
                                      .filter(Boolean)
                                : []
                        }
                        locationId={instagramLocationId}
                        isPaidPartnership={instagramPaidPartnership}
                        brandedContentSponsors={
                            instagramSponsors
                                ? instagramSponsors
                                      .split(",")
                                      .map((s) => s.trim().replace(/^@/, ""))
                                      .filter(Boolean)
                                : []
                        }
                        audioTitle={instagramAudioConfig?.audioTitle}
                        artistName={instagramAudioConfig?.artistName}
                        muteAudio={instagramMuteAudio}
                        isTrial={instagramTrial}
                        commentsEnabled={instagramCommentsEnabled}
                    />
                )}
                {currentPlatformId === "youtube" && (
                    <YouTubePostPreview
                        content={content}
                        mediaUrl={previewMediaUrl}
                        mediaUrls={allPreviewMediaUrls}
                        mediaType={activeMediaType}
                        user={user}
                        title={youtubeTitle}
                        visibility={youtubeVisibility}
                        isShort={youtubeIsShort}
                        firstComment={youtubeFirstComment}
                        customThumbnail={youtubeCustomThumbnail}
                        madeForKids={youtubeMadeForKids}
                        containsSyntheticMedia={youtubeContainsSyntheticMedia}
                    />
                )}
            </div>
        </div>
    );
};

export default SchedulerLivePreview;

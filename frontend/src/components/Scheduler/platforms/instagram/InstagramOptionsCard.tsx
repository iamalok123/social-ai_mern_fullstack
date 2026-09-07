import React from "react";
import { InfoIcon, MusicIcon, SparklesIcon, MapPinIcon, ZapIcon } from "lucide-react";
import { PLATFORMS } from "../../../../assets/assets";
import type { SelectedAudioConfig } from "../../../Media/InstagramAudioModal";
import PlatformCardWrapper from "../common/PlatformCardWrapper";

interface InstagramOptionsCardProps {
    contentType: "feed" | "reel" | "story";
    onContentTypeChange: (val: "feed" | "reel" | "story") => void;
    shareToFeed: boolean;
    onShareToFeedChange: (val: boolean) => void;
    audioConfig: SelectedAudioConfig | null;
    onAudioConfigChange: (val: SelectedAudioConfig | null) => void;
    onOpenAudioModal: () => void;
    muteAudio: boolean;
    onMuteAudioChange: (val: boolean) => void;
    trial: boolean;
    onTrialChange: (val: boolean) => void;
    trialGraduation: "SS_PERFORMANCE" | "MANUAL";
    onTrialGraduationChange: (val: "SS_PERFORMANCE" | "MANUAL") => void;
    thumbnail: string;
    onThumbnailChange: (val: string) => void;
    thumbOffset: number;
    onThumbOffsetChange: (val: number) => void;
    collaborators: string;
    onCollaboratorsChange: (val: string) => void;
    locationId: string;
    onLocationIdChange: (val: string) => void;
    paidPartnership: boolean;
    onPaidPartnershipChange: (val: boolean) => void;
    sponsors: string;
    onSponsorsChange: (val: string) => void;
    commentsEnabled: boolean;
    onCommentsEnabledChange: (val: boolean) => void;
    isInstagramViaFacebook: boolean;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const InstagramOptionsCard: React.FC<InstagramOptionsCardProps> = ({
    contentType,
    onContentTypeChange,
    shareToFeed,
    onShareToFeedChange,
    audioConfig,
    onAudioConfigChange,
    onOpenAudioModal,
    muteAudio,
    onMuteAudioChange,
    trial,
    onTrialChange,
    trialGraduation,
    onTrialGraduationChange,
    thumbnail,
    onThumbnailChange,
    thumbOffset,
    onThumbOffsetChange,
    collaborators,
    onCollaboratorsChange,
    locationId,
    onLocationIdChange,
    paidPartnership,
    onPaidPartnershipChange,
    sponsors,
    onSponsorsChange,
    commentsEnabled,
    onCommentsEnabledChange,
    isInstagramViaFacebook,
    isCollapsed,
    onToggleCollapse,
}) => {
    const InstagramIcon = PLATFORMS.find((p) => p.id === "instagram")?.icon;

    const badge = isInstagramViaFacebook ? (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 flex items-center gap-1">
            <ZapIcon className="size-2.5" /> Facebook Login (Full Tools)
        </span>
    ) : (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/60">
            Direct Login
        </span>
    );

    return (
        <PlatformCardWrapper
            platformId="instagram"
            title="Instagram Options"
            badge={badge}
            icon={InstagramIcon}
            iconBgClass="bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600"
            borderColorClass="border-slate-200/80 dark:border-zinc-800"
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
        >
            {/* Post Format Selector */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Publishing Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: "feed", label: "Feed / Carousel", desc: "Up to 10 images/videos" },
                        { id: "reel", label: "Reel", desc: "Video up to 90s" },
                        { id: "story", label: "Story", desc: "24h • 1 item • No caption" },
                    ].map((fmt) => (
                        <button
                            key={fmt.id}
                            type="button"
                            onClick={() => onContentTypeChange(fmt.id as any)}
                            className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                                contentType === fmt.id
                                    ? "bg-pink-50 dark:bg-pink-950/50 border-pink-400 dark:border-pink-600 text-pink-900 dark:text-pink-100 shadow-2xs"
                                    : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700"
                            }`}
                        >
                            <div className="text-xs font-bold">{fmt.label}</div>
                            <div className="text-[10px] text-slate-500 dark:text-zinc-400">
                                {fmt.desc}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Story Info Banner */}
            {contentType === "story" && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 animate-in fade-in flex items-start gap-2">
                    <InfoIcon className="size-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <span>
                        Instagram Stories display for 24 hours. Stories accept exactly 1 image or
                        video. Captions, first comments, paid partnerships, and catalog audio are not
                        displayed on Stories.
                    </span>
                </div>
            )}

            {/* Reel Specific Controls */}
            {contentType === "reel" && (
                <div className="space-y-3 pt-1 animate-in fade-in">
                    {/* Share to Feed Toggle */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={shareToFeed}
                                onChange={(e) => onShareToFeedChange(e.target.checked)}
                                className="rounded border-slate-300 dark:border-zinc-700 text-pink-600 focus:ring-pink-500 size-3.5"
                            />
                            <span className="font-medium">Also share Reel to Main Profile Grid</span>
                        </label>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                            Default: Yes
                        </span>
                    </div>

                    {/* Catalog Audio Picker */}
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 shrink-0">
                                <MusicIcon className="size-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {audioConfig?.audioTitle || "Reel Catalog Audio / Music"}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                    {audioConfig
                                        ? `${
                                              audioConfig.artistName
                                                  ? `${audioConfig.artistName} • `
                                                  : ""
                                          }Music: ${audioConfig.audioVolume}% | Video: ${
                                              audioConfig.videoVolume
                                          }%`
                                        : "Search & attach licensed music track"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            {audioConfig && (
                                <button
                                    type="button"
                                    onClick={() => onAudioConfigChange(null)}
                                    className="px-2 py-1 text-[10px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
                                >
                                    Remove
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onOpenAudioModal}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-pink-600 hover:bg-pink-500 text-white shadow-xs transition-colors cursor-pointer"
                            >
                                {audioConfig ? "Change Track" : "Add Music"}
                            </button>
                        </div>
                    </div>

                    {/* Mute Original Video Audio */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={muteAudio}
                                onChange={(e) => onMuteAudioChange(e.target.checked)}
                                className="rounded border-slate-300 dark:border-zinc-700 text-pink-600 focus:ring-pink-500 size-3.5"
                            />
                            <span className="font-medium">Mute original video audio track</span>
                        </label>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                            Keeps only catalog music
                        </span>
                    </div>

                    {/* Trial Reel Toggle (Non-followers only) */}
                    <div className="p-3 rounded-xl border border-purple-200/70 dark:border-purple-900/50 bg-purple-50/20 dark:bg-purple-950/10 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs text-purple-900 dark:text-purple-200 cursor-pointer select-none font-semibold">
                                <input
                                    type="checkbox"
                                    checked={trial}
                                    onChange={(e) => onTrialChange(e.target.checked)}
                                    className="rounded border-purple-300 dark:border-purple-700 text-purple-600 focus:ring-purple-500 size-3.5"
                                />
                                <span className="flex items-center gap-1">
                                    <SparklesIcon className="size-3 text-purple-500" />
                                    Test on Non-Followers (Trial Reel)
                                </span>
                            </label>
                            <span className="text-[10px] text-purple-700 dark:text-purple-300">
                                Growth Experiment
                            </span>
                        </div>
                        {trial && (
                            <div className="flex items-center gap-3 pt-1 text-xs">
                                <span className="text-[11px] text-slate-600 dark:text-zinc-400">
                                    Graduation Strategy:
                                </span>
                                <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                                    <input
                                        type="radio"
                                        name="trialGrad"
                                        checked={trialGraduation === "SS_PERFORMANCE"}
                                        onChange={() => onTrialGraduationChange("SS_PERFORMANCE")}
                                        className="accent-purple-600"
                                    />
                                    <span>Performance-based</span>
                                </label>
                                <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                                    <input
                                        type="radio"
                                        name="trialGrad"
                                        checked={trialGraduation === "MANUAL"}
                                        onChange={() => onTrialGraduationChange("MANUAL")}
                                        className="accent-purple-600"
                                    />
                                    <span>Manual</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Custom Thumbnail URL & Offset */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                Cover Image URL{" "}
                                <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={thumbnail}
                                onChange={(e) => onThumbnailChange(e.target.value)}
                                placeholder="https://.../cover.jpg"
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                Video Frame Offset (ms){" "}
                                <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="500"
                                value={thumbOffset || ""}
                                onChange={(e) => onThumbOffsetChange(Number(e.target.value))}
                                placeholder="e.g. 2500"
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Feed / Carousel Thumbnail */}
            {contentType === "feed" && (
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Custom Thumbnail URL{" "}
                        <span className="text-slate-400 font-normal">(for video in feed)</span>
                    </label>
                    <input
                        type="text"
                        value={thumbnail}
                        onChange={(e) => onThumbnailChange(e.target.value)}
                        placeholder="https://.../thumb.jpg"
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                    />
                </div>
            )}

            {/* Collaborators & Location Tagging (Not on Story) */}
            {contentType !== "story" && (
                <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Collaborators{" "}
                                    <span className="text-slate-400 font-normal">(max 3)</span>
                                </label>
                                <span className="text-[10px] text-slate-400">comma-separated</span>
                            </div>
                            <input
                                type="text"
                                value={collaborators}
                                onChange={(e) => onCollaboratorsChange(e.target.value)}
                                placeholder="@partner1, @brand"
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                                    <MapPinIcon className="size-3 text-rose-500" /> Location ID
                                </label>
                                <span className="text-[10px] text-slate-400">FB Page Numeric ID</span>
                            </div>
                            <input
                                type="text"
                                value={locationId}
                                onChange={(e) => onLocationIdChange(e.target.value)}
                                placeholder="e.g. 104768392892900"
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                            />
                        </div>
                    </div>

                    {/* Paid Partnership Section */}
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none font-semibold">
                                <input
                                    type="checkbox"
                                    checked={paidPartnership}
                                    onChange={(e) => onPaidPartnershipChange(e.target.checked)}
                                    className="rounded border-slate-300 dark:border-zinc-700 text-pink-600 focus:ring-pink-500 size-3.5"
                                />
                                <span>Paid Partnership / Branded Content Label</span>
                            </label>
                            {!isInstagramViaFacebook && (
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                    Requires Facebook Page Login
                                </span>
                            )}
                        </div>
                        {paidPartnership && (
                            <div className="pt-1 animate-in fade-in">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                    Sponsor Handles{" "}
                                    <span className="text-slate-400 font-normal">
                                        (max 2 brands, comma-separated)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={sponsors}
                                    onChange={(e) => onSponsorsChange(e.target.value)}
                                    placeholder="@brand1, @brand2"
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                                />
                            </div>
                        )}
                    </div>

                    {/* Turn off Comments Toggle */}
                    <div className="flex items-center justify-between pt-0.5">
                        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={!commentsEnabled}
                                onChange={(e) => onCommentsEnabledChange(!e.target.checked)}
                                className="rounded border-slate-300 dark:border-zinc-700 text-pink-600 focus:ring-pink-500 size-3.5"
                            />
                            <span className="font-medium">Turn off comments for this post</span>
                        </label>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                            Comments enabled by default
                        </span>
                    </div>
                </div>
            )}
        </PlatformCardWrapper>
    );
};

export default InstagramOptionsCard;

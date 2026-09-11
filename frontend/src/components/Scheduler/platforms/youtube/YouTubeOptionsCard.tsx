import React from "react";
import {
    SparklesIcon,
    AlertCircleIcon,
    RefreshCwIcon,
    ShieldAlertIcon,
    BotIcon,
    FilmIcon,
    ZapIcon,
    ListVideoIcon,
    ImageIcon,
} from "lucide-react";
import { PLATFORMS } from "../../../../assets/assets";
import PlatformCardWrapper from "../common/PlatformCardWrapper";

interface YouTubePlaylist {
    id: string;
    title: string;
    privacy?: string;
    itemCount?: number;
}

interface YouTubeOptionsCardProps {
    title: string;
    onTitleChange: (val: string) => void;
    visibility: "public" | "private" | "unlisted";
    onVisibilityChange: (val: "public" | "private" | "unlisted") => void;
    categoryId: string;
    onCategoryIdChange: (val: string) => void;
    madeForKids: boolean;
    onMadeForKidsChange: (val: boolean) => void;
    containsSyntheticMedia: boolean;
    onContainsSyntheticMediaChange: (val: boolean) => void;
    playlistId: string;
    onPlaylistIdChange: (val: string) => void;
    playlists: YouTubePlaylist[];
    isLoadingPlaylists?: boolean;
    onRefreshPlaylists?: () => void;
    firstComment: string;
    onFirstCommentChange: (val: string) => void;
    isShort: boolean;
    customThumbnail: string;
    onCustomThumbnailChange: (val: string) => void;
    hasVideo: boolean;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const CATEGORIES = [
    { id: "22", name: "People & Blogs (Default)" },
    { id: "27", name: "Education" },
    { id: "28", name: "Science & Technology" },
    { id: "24", name: "Entertainment" },
    { id: "1", name: "Film & Animation" },
    { id: "10", name: "Music" },
    { id: "20", name: "Gaming" },
    { id: "26", name: "Howto & Style" },
    { id: "25", name: "News & Politics" },
    { id: "17", name: "Sports" },
    { id: "23", name: "Comedy" },
];

export const YouTubeOptionsCard: React.FC<YouTubeOptionsCardProps> = ({
    title,
    onTitleChange,
    visibility,
    onVisibilityChange,
    categoryId,
    onCategoryIdChange,
    madeForKids,
    onMadeForKidsChange,
    containsSyntheticMedia,
    onContainsSyntheticMediaChange,
    playlistId,
    onPlaylistIdChange,
    playlists,
    isLoadingPlaylists = false,
    onRefreshPlaylists,
    firstComment,
    onFirstCommentChange,
    isShort,
    customThumbnail,
    onCustomThumbnailChange,
    hasVideo,
    isCollapsed,
    onToggleCollapse,
}) => {
    const YouTubeIcon = PLATFORMS.find((p) => p.id === "youtube")?.icon;

    const shortBadge = isShort ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
            <ZapIcon className="size-3 fill-current" />
            <span>Short (9:16)</span>
        </span>
    ) : hasVideo ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
            <FilmIcon className="size-3" />
            <span>Video (16:9)</span>
        </span>
    ) : null;

    return (
        <PlatformCardWrapper
            platformId="youtube"
            title="YouTube Options"
            subtitle="1 Video required • Up to 5,000 char description"
            badge={shortBadge}
            icon={YouTubeIcon}
            iconBgClass="bg-[#FF0000]"
            borderColorClass="border-red-200/80 dark:border-red-950/80"
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
        >
            {/* Video Title Input */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        Video Title
                    </label>
                    <span
                        className={`text-[11px] font-mono ${
                            title.length > 100
                                ? "text-red-500 font-bold"
                                : "text-slate-400 dark:text-zinc-500"
                        }`}
                    >
                        {title.length}/100
                    </span>
                </div>
                <input
                    type="text"
                    maxLength={100}
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Enter video title (defaults to first line of caption)..."
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
            </div>

            {/* Visibility & Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Visibility */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                        Visibility
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                        {(["public", "unlisted", "private"] as const).map((vis) => (
                            <button
                                key={vis}
                                type="button"
                                onClick={() => onVisibilityChange(vis)}
                                className={`py-1.5 px-2 rounded-xl text-xs font-medium capitalize border transition-all cursor-pointer text-center ${
                                    visibility === vis
                                        ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold shadow-2xs"
                                        : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700"
                                }`}
                            >
                                {vis}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                        Category
                    </label>
                    <select
                        value={categoryId}
                        onChange={(e) => onCategoryIdChange(e.target.value)}
                        className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Playlist Selector */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <ListVideoIcon className="size-3.5 text-slate-500 dark:text-zinc-400" />
                        <span>Add to Playlist (Optional)</span>
                    </label>
                    {onRefreshPlaylists && (
                        <button
                            type="button"
                            onClick={onRefreshPlaylists}
                            disabled={isLoadingPlaylists}
                            title="Refresh YouTube Playlists"
                            className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            <RefreshCwIcon className={`size-3 ${isLoadingPlaylists ? "animate-spin" : ""}`} />
                            <span>Refresh</span>
                        </button>
                    )}
                </div>
                <select
                    value={playlistId}
                    onChange={(e) => onPlaylistIdChange(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
                >
                    <option value="">None (Don't add to playlist)</option>
                    {playlists.map((pl) => (
                        <option key={pl.id} value={pl.id}>
                            {pl.title} {pl.itemCount !== undefined ? `(${pl.itemCount} videos)` : ""}
                        </option>
                    ))}
                </select>
            </div>

            {/* Custom Thumbnail (Only for Long-Form, disabled for Shorts) */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Custom Thumbnail (16:9, max 2MB)
                </label>
                {isShort ? (
                    <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                        <AlertCircleIcon className="size-4 shrink-0 mt-0.5 text-amber-500" />
                        <span>YouTube does not support custom thumbnails for Shorts via the API. YouTube will auto-select a frame.</span>
                    </div>
                ) : (
                    <div>
                        <div className="relative">
                            <input
                                type="url"
                                value={customThumbnail}
                                onChange={(e) => onCustomThumbnailChange(e.target.value)}
                                placeholder="Enter public image URL (JPEG, PNG, max 2 MB)..."
                                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            />
                            <ImageIcon className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-1">
                            Requires phone-verified channel (youtube.com/verify). Max 2 MB, 1280x720 recommended.
                        </p>
                    </div>
                )}
            </div>

            {/* Compliance & Disclosures: Made for Kids (COPPA) & AI Synthetic Media */}
            <div className="space-y-2 pt-1 border-t border-slate-200/70 dark:border-zinc-800/70">
                {/* COPPA Made for Kids */}
                <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-zinc-200">
                            <ShieldAlertIcon className="size-3.5 text-amber-500" />
                            <span>Made for Kids (COPPA)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                            Marks video as child-directed. Permanently disables comments, notifications, personalized ads, and cards.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                        <input
                            type="checkbox"
                            checked={madeForKids}
                            onChange={(e) => onMadeForKidsChange(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-amber-500" />
                    </label>
                </div>

                {/* AI / Synthetic Media Disclosure */}
                <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-zinc-200">
                            <BotIcon className="size-3.5 text-red-500" />
                            <span>Altered or Synthetic Content</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
                            Discloses that content is meaningfully altered or generated with AI. YouTube may add an informational label.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                        <input
                            type="checkbox"
                            checked={containsSyntheticMedia}
                            onChange={(e) => onContainsSyntheticMediaChange(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-red-500" />
                    </label>
                </div>
            </div>

            {/* Pinned First Comment */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <SparklesIcon className="size-3.5 text-red-500" />
                        <span>Pinned First Comment (Max 10,000 characters)</span>
                    </label>
                    <span
                        className={`text-[11px] font-mono ${
                            firstComment.length > 10000
                                ? "text-red-500 font-bold"
                                : "text-slate-400 dark:text-zinc-500"
                        }`}
                    >
                        {firstComment.length}/10,000
                    </span>
                </div>
                <textarea
                    rows={2}
                    maxLength={10000}
                    value={firstComment}
                    onChange={(e) => onFirstCommentChange(e.target.value)}
                    placeholder="Write a comment to be posted and pinned automatically upon video release..."
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-y"
                />
            </div>
        </PlatformCardWrapper>
    );
};

export default YouTubeOptionsCard;

import React, { useState } from "react";
import {
    ThumbsUpIcon,
    ThumbsDownIcon,
    Share2Icon,
    DownloadIcon,
    MoreHorizontalIcon,
    MessageSquareIcon,
    PlayIcon,
    PinIcon,
    SparklesIcon,
} from "lucide-react";
import { SiYoutube } from "@icons-pack/react-simple-icons";

export interface YouTubePostPreviewProps {
    content: string;
    mediaUrl?: string | null;
    mediaUrls?: string[] | null;
    mediaItems?: { url: string; type?: "image" | "video" | string }[] | null;
    mediaType?: "image" | "video" | null;
    user?: {
        name?: string;
        email?: string;
        picture?: string;
    } | null;
    title?: string;
    visibility?: "public" | "private" | "unlisted";
    isShort?: boolean;
    firstComment?: string;
    customThumbnail?: string;
    madeForKids?: boolean;
    containsSyntheticMedia?: boolean;
}

export const YouTubePostPreview: React.FC<YouTubePostPreviewProps> = ({
    content,
    mediaUrl,
    mediaUrls,
    mediaItems,
    mediaType: _mediaType,
    user,
    title,
    visibility = "public",
    isShort = false,
    firstComment,
    customThumbnail,
    madeForKids,
    containsSyntheticMedia,
}) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const displayName = user?.name || "My YouTube Channel";
    const userAvatar = user?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FF0000&color=fff&bold=true`;

    // Extract video URL
    const allMediaUrls: string[] = [];
    if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
        allMediaUrls.push(...mediaUrls.filter(Boolean));
    } else if (Array.isArray(mediaItems) && mediaItems.length > 0) {
        allMediaUrls.push(...mediaItems.map((i) => i.url).filter(Boolean));
    } else if (mediaUrl) {
        allMediaUrls.push(mediaUrl);
    }

    const videoSrc = allMediaUrls[0] || "";
    const activeThumbnail = customThumbnail || "";

    // Formatted text renderer for description/content
    const renderFormattedText = (text: string) => {
        if (!text?.trim()) {
            return (
                <span className="text-slate-400 dark:text-zinc-500 italic">
                    Add a description to tell viewers about your video...
                </span>
            );
        }

        const lines = text.split("\n");
        return lines.map((line, lineIdx) => {
            const tokens = line.split(/(\s+)/);
            return (
                <span key={lineIdx}>
                    {tokens.map((tok, tokIdx) => {
                        if (/^https?:\/\//i.test(tok)) {
                            return (
                                <span key={tokIdx} className="text-blue-600 dark:text-blue-400 hover:underline">
                                    {tok}
                                </span>
                            );
                        }
                        if (/^#[a-zA-Z0-9_]+/i.test(tok)) {
                            return (
                                <span key={tokIdx} className="text-blue-600 dark:text-blue-400 font-medium">
                                    {tok}
                                </span>
                            );
                        }
                        return tok;
                    })}
                    {lineIdx < lines.length - 1 && <br />}
                </span>
            );
        });
    };

    // YouTube Shorts View Mode
    if (isShort) {
        return (
            <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-black text-white shadow-xl flex flex-col relative aspect-9/16 max-h-145 select-none">
                {/* Shorts Top Bar */}
                <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3.5 bg-linear-to-b from-black/80 via-black/40 to-transparent">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/90 text-[10px] font-black tracking-wider uppercase text-white shadow-xs">
                            <SiYoutube className="size-3" /> Shorts
                        </span>
                        <span className="text-[10px] font-semibold text-white/80 capitalize">
                            • {visibility}
                        </span>
                    </div>
                    {containsSyntheticMedia && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/80 text-[10px] font-medium backdrop-blur-xs">
                            <SparklesIcon className="size-2.5" /> Altered
                        </span>
                    )}
                </div>

                {/* Video / Player Area */}
                <div className="relative flex-1 w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                    {videoSrc ? (
                        <video
                            src={videoSrc}
                            controls={false}
                            autoPlay={false}
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-500 bg-zinc-900/60">
                            <SiYoutube className="size-12 text-red-500/40 mb-2" />
                            <p className="text-xs font-semibold text-zinc-400">Attach a vertical video (9:16)</p>
                            <p className="text-[11px] text-zinc-500 mt-1">Shorts duration must be 3 minutes or less</p>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Shorts Right Floating Action Rail */}
                <div className="absolute right-2.5 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
                    <div className="flex flex-col items-center gap-1">
                        <div className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/60 transition-colors">
                            <ThumbsUpIcon className="size-5" />
                        </div>
                        <span className="text-[10px] font-semibold">Like</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/60 transition-colors">
                            <ThumbsDownIcon className="size-5" />
                        </div>
                        <span className="text-[10px] font-semibold">Dislike</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/60 transition-colors">
                            <MessageSquareIcon className="size-5" />
                        </div>
                        <span className="text-[10px] font-semibold">Comment</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="size-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/60 transition-colors">
                            <Share2Icon className="size-5" />
                        </div>
                        <span className="text-[10px] font-semibold">Share</span>
                    </div>
                </div>

                {/* Shorts Bottom Overlay Info */}
                <div className="absolute bottom-0 inset-x-0 z-20 p-3.5 pr-14 flex flex-col gap-2">
                    {/* Channel line */}
                    <div className="flex items-center gap-2">
                        <img
                            src={userAvatar}
                            alt={displayName}
                            className="size-8 rounded-full object-cover ring-2 ring-white/20"
                        />
                        <span className="text-xs font-bold truncate text-white drop-shadow-xs">
                            @{displayName.toLowerCase().replace(/\s+/g, "")}
                        </span>
                        <button
                            type="button"
                            className="px-3 py-1 rounded-full bg-white text-black text-[11px] font-bold tracking-tight shrink-0 shadow-xs"
                        >
                            Subscribe
                        </button>
                    </div>

                    {/* Video Title & Caption */}
                    <div>
                        <h4 className="text-xs font-bold line-clamp-2 text-white drop-shadow-xs mb-0.5">
                            {title?.trim() || "Untitled Short"}
                        </h4>
                        <p className="text-[11px] text-zinc-200 line-clamp-2 drop-shadow-xs">
                            {content?.trim() || "Short description & hashtags appear here..."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Standard Long-Form YouTube Video View Mode
    return (
        <div className="w-full max-w-md rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 shadow-sm flex flex-col transition-all">
            {/* Top Video Player Container (16:9 Aspect Ratio) */}
            <div className="relative w-full aspect-video bg-zinc-900 flex items-center justify-center overflow-hidden group">
                {activeThumbnail ? (
                    <img
                        src={activeThumbnail}
                        alt="Custom Thumbnail"
                        className="w-full h-full object-cover"
                    />
                ) : videoSrc ? (
                    <video
                        src={videoSrc}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
                        <div className="size-12 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center mb-2">
                            <PlayIcon className="size-6 fill-current translate-x-0.5" />
                        </div>
                        <p className="text-xs font-semibold text-zinc-300">Upload a video to preview playback</p>
                        <p className="text-[11px] text-zinc-500 mt-1">Formats: MP4, MOV, WebM, AVI, FLV</p>
                    </div>
                )}

                {/* Duration / Format Badge Overlay */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-[10px] font-mono font-bold text-white">
                    HD
                </div>

                {/* Visibility Badge Overlay */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[10px] font-medium text-white/90">
                    <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="capitalize">{visibility}</span>
                </div>
            </div>

            {/* Video Metadata & Actions */}
            <div className="p-3.5 flex flex-col gap-3">
                {/* Video Title */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {title?.trim() || "Add video title (up to 100 characters)"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                        <span>0 views</span>
                        <span>•</span>
                        <span>Scheduled</span>
                        {containsSyntheticMedia && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-indigo-500 font-medium">
                                    <SparklesIcon className="size-2.5" /> Altered/Synthetic
                                </span>
                            </>
                        )}
                        {madeForKids && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                    Made for kids
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Channel Bar: Avatar, Channel Name, Subscribe Button */}
                <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <img
                            src={userAvatar}
                            alt={displayName}
                            className="size-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-zinc-800"
                        />
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {displayName}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                1.2K subscribers
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold tracking-tight shrink-0 transition-colors shadow-xs"
                    >
                        Subscribe
                    </button>
                </div>

                {/* YouTube Action Buttons Pill Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <div className="flex items-center bg-slate-100 dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 shrink-0">
                        <button
                            type="button"
                            className="flex items-center gap-1.5 px-3 py-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-l-full font-medium transition-colors"
                        >
                            <ThumbsUpIcon className="size-3.5" />
                            <span>Like</span>
                        </button>
                        <span className="w-px h-3.5 bg-slate-200 dark:bg-zinc-700" />
                        <button
                            type="button"
                            className="px-2.5 py-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-r-full transition-colors"
                        >
                            <ThumbsDownIcon className="size-3.5" />
                        </button>
                    </div>

                    <button
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-medium hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
                    >
                        <Share2Icon className="size-3.5" />
                        <span>Share</span>
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-medium hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
                    >
                        <DownloadIcon className="size-3.5" />
                        <span>Download</span>
                    </button>

                    <button
                        type="button"
                        className="p-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors shrink-0 ml-auto"
                    >
                        <MoreHorizontalIcon className="size-3.5" />
                    </button>
                </div>

                {/* Description Box (Collapsible) */}
                <div
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                    className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 text-xs leading-relaxed cursor-pointer hover:bg-slate-200/70 dark:hover:bg-zinc-800/60 transition-colors"
                >
                    <div className="font-semibold text-slate-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                        <span>Description</span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                            {isDescriptionExpanded ? "Show less" : "...more"}
                        </span>
                    </div>
                    <div className={`text-slate-800 dark:text-zinc-300 whitespace-pre-wrap wrap-break-word ${isDescriptionExpanded ? "" : "line-clamp-2"}`}>
                        {renderFormattedText(content)}
                    </div>
                </div>

                {/* Pinned First Comment Teaser */}
                {firstComment?.trim() && (
                    <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-[11px]">
                            <PinIcon className="size-3" />
                            <span>Pinned by {displayName}</span>
                        </div>
                        <div className="flex items-start gap-2 pt-0.5">
                            <img
                                src={userAvatar}
                                alt={displayName}
                                className="size-6 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div className="min-w-0">
                                <span className="font-bold text-[11px] text-slate-800 dark:text-zinc-200 mr-1.5">
                                    @{displayName.toLowerCase().replace(/\s+/g, "")}
                                </span>
                                <span className="text-[11px] text-slate-600 dark:text-zinc-400 whitespace-pre-wrap wrap-break-word">
                                    {firstComment}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YouTubePostPreview;

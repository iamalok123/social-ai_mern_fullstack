import React from "react";
import {
    ThumbsUpIcon,
    MessageCircleIcon,
    Share2Icon,
    GlobeIcon,
    MoreHorizontalIcon,
    ChevronDownIcon,
    VideoIcon,
    ClockIcon,
} from "lucide-react";

export interface FacebookUser {
    name?: string;
    email?: string;
    picture?: string;
}

export interface FacebookLinkPreview {
    domain?: string;
    tagline?: string;
    actionText?: string;
    url?: string;
}

export interface FacebookProps {
    content?: string;
    mediaUrl?: string | string[] | null;
    mediaUrls?: string[];
    mediaType?: "image" | "video" | null;
    user?: FacebookUser | null;
    linkPreview?: FacebookLinkPreview | null;
    firstComment?: string;
    contentType?: "feed" | "story" | "reel";
    title?: string;
    draft?: boolean;
    textFormatPresetId?: string;
}

const PRESET_STYLES: Record<string, string> = {
    "1": "bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white",
    "2": "bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 text-white",
    "3": "bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 text-white",
    "4": "bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 text-white",
    "5": "bg-gradient-to-tr from-slate-900 via-purple-950 to-slate-900 text-white",
    ocean: "bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 text-white",
    sunset: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white",
    emerald: "bg-gradient-to-tr from-emerald-500 to-teal-700 text-white",
    midnight: "bg-gradient-to-tr from-slate-900 via-zinc-900 to-slate-950 text-white",
    fire: "bg-gradient-to-tr from-orange-500 to-red-600 text-white",
};

export const FacebookPostPreview: React.FC<FacebookProps> = ({
    content = "",
    mediaUrl,
    mediaUrls,
    mediaType,
    user,
    linkPreview,
    firstComment,
    contentType = "feed",
    title,
    draft,
    textFormatPresetId,
}) => {
    const displayName = user?.name || "Facebook Page";

    const getMediaList = (): string[] => {
        const list: string[] = [];
        if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
            list.push(...mediaUrls.filter(Boolean));
        } else if (Array.isArray(mediaUrl)) {
            list.push(...mediaUrl.filter(Boolean));
        } else if (typeof mediaUrl === "string" && mediaUrl.trim() !== "") {
            list.push(mediaUrl);
        }
        return list;
    };

    const mediaList = getMediaList();

    const isVideo = mediaType === "video" || (
        mediaType !== "image" && mediaList.length > 0 && (
            /\.(mp4|webm|mov|ogg|mkv)$/i.test(mediaList[0] || "") ||
            (mediaList[0] || "").includes("/video/upload/") ||
            (mediaList[0] || "").startsWith("blob:")
        )
    );

    const isPresetActive = Boolean(
        textFormatPresetId &&
        PRESET_STYLES[textFormatPresetId] &&
        mediaList.length === 0 &&
        contentType === "feed"
    );

    const renderFormattedContent = (text: string) => {
        if (!text.trim()) {
            return (
                <span className="text-slate-400 dark:text-zinc-500 italic">
                    What's on your mind? (Type your post content to preview live...)
                </span>
            );
        }

        const lines = text.split("\n");
        return lines.map((line, lineIdx) => {
            const tokens = line.split(/(\s+)/);
            return (
                <React.Fragment key={lineIdx}>
                    {tokens.map((token, tokenIdx) => {
                        if (token.match(/^(https?:\/\/[^\s]+)/gi)) {
                            return (
                                <a
                                    key={tokenIdx}
                                    href={token}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sky-500 font-semibold hover:underline break-all"
                                >
                                    {token.length > 35 ? `${token.slice(0, 32)}...` : token}
                                </a>
                            );
                        } else if (token.match(/^([@#][\w_]+)/gi)) {
                            return (
                                <span
                                    key={tokenIdx}
                                    className="text-sky-500 font-semibold hover:underline cursor-pointer"
                                >
                                    {token}
                                </span>
                            );
                        }
                        return token;
                    })}
                    {lineIdx < lines.length - 1 && <br />}
                </React.Fragment>
            );
        });
    };

    const renderMediaGrid = (items: string[]) => {
        if (items.length === 0) return null;

        if (isVideo) {
            const isVertical = contentType === "reel" || contentType === "story";
            return (
                <div className={`relative w-full ${isVertical ? "aspect-9/16 max-h-120" : "aspect-video"} bg-black flex items-center justify-center overflow-hidden`}>
                    <video src={items[0]} controls className="w-full h-full object-cover" />
                    {contentType === "reel" && (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold rounded-md flex items-center gap-1">
                            <VideoIcon className="size-3" />
                            Reel
                        </div>
                    )}
                </div>
            );
        }

        if (items.length === 1) {
            return (
                <div className="w-full bg-slate-100 dark:bg-zinc-800 flex justify-center overflow-hidden">
                    <img src={items[0]} alt="Facebook Post Media" className="w-full max-h-96 object-cover" />
                </div>
            );
        }

        if (items.length === 2) {
            return (
                <div className="grid grid-cols-2 gap-0.5 w-full h-64 bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <img src={items[0]} alt="Media 1" className="w-full h-full object-cover" />
                    <img src={items[1]} alt="Media 2" className="w-full h-full object-cover" />
                </div>
            );
        }

        if (items.length === 3) {
            return (
                <div className="grid grid-cols-2 gap-0.5 w-full h-72 bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                    <img src={items[0]} alt="Media 1" className="w-full h-full object-cover" />
                    <div className="flex flex-col gap-0.5 h-full">
                        <img src={items[1]} alt="Media 2" className="w-full h-35.75 object-cover" />
                        <img src={items[2]} alt="Media 3" className="w-full h-35.75 object-cover" />
                    </div>
                </div>
            );
        }

        // 4 or more photos (up to 10)
        const displayed = items.slice(0, 4);
        const extraCount = items.length - 4;
        return (
            <div className="grid grid-cols-2 gap-0.5 w-full h-80 bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                {displayed.map((url, idx) => (
                    <div key={idx} className="relative w-full h-full overflow-hidden">
                        <img src={url} alt={`Facebook Post Media ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 3 && extraCount > 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold backdrop-blur-xs select-none">
                                +{extraCount}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-md text-slate-900 dark:text-zinc-100 font-sans transition-all overflow-hidden text-left">
            {/* Top Author Header */}
            <div className="p-4 pb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                    {user?.picture ? (
                        <img
                            src={user.picture}
                            alt={displayName}
                            className="size-11 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-700"
                        />
                    ) : (
                        <div className="size-11 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight truncate">
                                {displayName}
                            </span>
                            {draft && (
                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-1.5 py-0.2 rounded">
                                    Draft
                                </span>
                            )}
                            {contentType === "reel" && (
                                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 px-1.5 py-0.2 rounded flex items-center gap-1">
                                    <VideoIcon className="size-2.5" /> Reel
                                </span>
                            )}
                            {contentType === "story" && (
                                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 px-1.5 py-0.2 rounded flex items-center gap-1">
                                    <ClockIcon className="size-2.5" /> Story
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                            <span>Facebook Page</span>
                            <span>•</span>
                            <GlobeIcon className="size-3" />
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className="text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <MoreHorizontalIcon className="size-4.5" />
                </button>
            </div>

            {/* Reel Title (if provided) */}
            {contentType === "reel" && title && title.trim() && (
                <div className="px-4 py-1 text-xs font-bold text-slate-700 dark:text-zinc-300">
                    🎬 {title.trim()}
                </div>
            )}

            {/* Post Content Body or Large Text Format Preset */}
            {isPresetActive ? (
                <div className={`w-full min-h-55 p-6 flex items-center justify-center text-center font-bold text-lg sm:text-xl leading-snug drop-shadow-md select-none ${PRESET_STYLES[textFormatPresetId!]}`}>
                    <span>{content || "What's on your mind?"}</span>
                </div>
            ) : (
                <div className="px-4 py-2 text-sm leading-relaxed text-slate-800 dark:text-zinc-100 whitespace-pre-wrap wrap-break-word">
                    {renderFormattedContent(content)}
                </div>
            )}

            {/* Media Area (Single or Multi-Image Collage) */}
            {!isPresetActive && mediaList.length > 0 && (
                <div className="mt-2 border-t border-slate-200 dark:border-zinc-800">
                    {renderMediaGrid(mediaList)}
                </div>
            )}

            {/* Website Banner Callout */}
            {!isPresetActive && (linkPreview || mediaList.length > 0) && (
                <div className="bg-slate-100 dark:bg-zinc-800/80 p-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {linkPreview?.domain || "websitename.com"}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                            {linkPreview?.tagline || "tagline goes here"}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="shrink-0 text-xs font-semibold text-slate-800 dark:text-zinc-100 border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                    >
                        <span>{linkPreview?.actionText || "Learn more"}</span>
                    </button>
                </div>
            )}

            {/* Engagement Stats Bar */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center -space-x-1">
                        <div className="size-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <ThumbsUpIcon className="size-2.5 fill-current" />
                        </div>
                        <div className="size-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                            <svg className="size-2.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">4,220</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hover:underline cursor-pointer">57 Comments</span>
                    <span className="hover:underline cursor-pointer">117 Shares</span>
                </div>
            </div>

            <div className="mx-4 border-t border-slate-200 dark:border-zinc-800" />

            {/* Action Bar */}
            <div className="px-2 py-1 flex items-center justify-between text-slate-600 dark:text-zinc-400 text-xs font-semibold">
                <div className="flex items-center gap-1">
                    <button type="button" className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                        <ThumbsUpIcon className="size-4" />
                        <span>Like</span>
                    </button>
                    <button type="button" className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                        <MessageCircleIcon className="size-4" />
                        <span>Comment</span>
                    </button>
                    <button type="button" className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                        <Share2Icon className="size-4" />
                        <span>Share</span>
                    </button>
                </div>

                {/* Profile Identity Avatar Dropdown */}
                <div className="flex items-center gap-1 p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer transition-colors">
                    {user?.picture ? (
                        <img src={user.picture} alt={displayName} className="size-6 rounded-full object-cover" />
                    ) : (
                        <div className="size-6 rounded-full bg-slate-700 text-white font-bold text-[10px] flex items-center justify-center">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <ChevronDownIcon className="size-3 text-slate-500" />
                </div>
            </div>

            {/* Auto-posted First Comment Live Preview */}
            {firstComment && firstComment.trim() && contentType !== "story" && !draft && (
                <div className="bg-slate-50/90 dark:bg-zinc-950/70 border-t border-slate-200 dark:border-zinc-800 p-3.5 animate-in fade-in duration-200">
                    <div className="flex items-start gap-2.5">
                        {user?.picture ? (
                            <img
                                src={user.picture}
                                alt={displayName}
                                className="size-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-700"
                            />
                        ) : (
                            <div className="size-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="bg-slate-100 dark:bg-zinc-800 rounded-2xl px-3 py-2 shadow-2xs">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <span className="font-semibold text-xs text-slate-900 dark:text-white leading-tight">
                                        {displayName}
                                    </span>
                                    <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-900">
                                        Auto 1st Comment
                                    </span>
                                </div>
                                <div className="text-xs text-slate-800 dark:text-zinc-200 whitespace-pre-wrap wrap-break-word">
                                    {renderFormattedContent(firstComment)}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-zinc-400 mt-1 pl-2 font-medium">
                                <span className="hover:underline cursor-pointer">Like</span>
                                <span>•</span>
                                <span className="hover:underline cursor-pointer">Reply</span>
                                <span>•</span>
                                <span>Just now</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const FacebookPreview = FacebookPostPreview;
export default FacebookPostPreview;
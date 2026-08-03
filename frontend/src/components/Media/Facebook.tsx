import React from "react";
import {
    ThumbsUpIcon,
    MessageCircleIcon,
    Share2Icon,
    GlobeIcon,
    MoreHorizontalIcon,
    ChevronDownIcon,
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
    user?: FacebookUser | null;
    linkPreview?: FacebookLinkPreview | null;
}

export const FacebookPostPreview: React.FC<FacebookProps> = ({
    content = "",
    mediaUrl,
    mediaUrls,
    user,
    linkPreview
}) => {
    const displayName = user?.name || "Vedant Mahajan";

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
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight truncate">
                            {displayName}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                            <span>Sponsored</span>
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

            {/* Post Content Body */}
            <div className="px-4 py-2 text-sm leading-relaxed text-slate-800 dark:text-zinc-100 whitespace-pre-wrap wrap-break-word">
                {renderFormattedContent(content)}
            </div>

            {/* Media Area */}
            {mediaList.length > 0 && (
                <div className="mt-2 bg-slate-100 dark:bg-zinc-800 border-t border-slate-200 dark:border-zinc-800">
                    {mediaList[0].match(/\.(mp4|webm|ogg)$/i) || (mediaList[0].startsWith("blob:") && mediaList[0].includes("video")) ? (
                        <video src={mediaList[0]} controls className="w-full aspect-video object-cover" />
                    ) : (
                        <img src={mediaList[0]} alt="Facebook Post Media" className="w-full max-h-96 object-cover" />
                    )}
                </div>
            )}

            {/* Website Banner Callout (Matching Facebook Ad reference photo) */}
            {(linkPreview || mediaList.length > 0) && (
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
                        <span>{linkPreview?.actionText || "learn more"}</span>
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

            {/* Action Bar with user avatar dropdown */}
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

                {/* Profile Identity Avatar Dropdown (Matching Facebook reference UI) */}
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
        </div>
    );
};

export const FacebookPreview = FacebookPostPreview;
export default FacebookPostPreview;
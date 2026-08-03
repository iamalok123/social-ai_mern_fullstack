import React from "react";
import {
    ThumbsUpIcon,
    MessageSquareIcon,
    Repeat2Icon,
    SendIcon,
    GlobeIcon,
    MoreHorizontalIcon,
    PlusIcon,
    ExternalLinkIcon
} from "lucide-react";

export interface LinkedInUser {
    name?: string;
    email?: string;
    picture?: string;
    headline?: string;
}

export interface LinkedInLinkPreview {
    domain?: string;
    title?: string;
    tagline?: string;
    actionText?: string;
    url?: string;
}

export interface LinkedInProps {
    content?: string;
    mediaUrl?: string | string[] | null;
    mediaUrls?: string[];
    user?: LinkedInUser | null;
    linkPreview?: LinkedInLinkPreview | null;
}

export type LinkedInPostPreviewProps = LinkedInProps;

// LinkedIn Reaction Badge Component (Like, Heart, Celebrate)
const LinkedInReactions = () => (
    <div className="flex items-center -space-x-1.5 shrink-0">
        {/* Like Badge (Blue) */}
        <div className="size-4.5 rounded-full bg-[#0a66c2] text-white flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 z-3">
            <ThumbsUpIcon className="size-2.5 fill-current" />
        </div>
        {/* Heart Badge (Red/Pink) */}
        <div className="size-4.5 rounded-full bg-rose-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 z-2">
            <svg className="size-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </div>
        {/* Celebrate Badge (Green/Teal) */}
        <div className="size-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 z-1">
            <svg className="size-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
        </div>
    </div>
);

export const LinkedInPostPreview: React.FC<LinkedInProps> = ({
    content = "",
    mediaUrl,
    mediaUrls,
    user,
    linkPreview
}) => {
    const displayName = user?.name || "Vedant Mahajan";
    const userHeadline = user?.headline || "Software Engineer | Full Stack & AI Solutions";

    // Normalize media inputs into an array of image/video URLs
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

    // Highlights URLs, @mentions, and #hashtags in LinkedIn Blue (#0a66c2 / sky-600)
    const renderFormattedContent = (text: string) => {
        if (!text.trim()) {
            return (
                <span className="text-slate-400 dark:text-zinc-500 italic">
                    What do you want to talk about? (Type your post content to preview live...)
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
                                    className="text-sky-600 dark:text-sky-400 font-semibold hover:underline break-all"
                                >
                                    {token.length > 35 ? `${token.slice(0, 32)}...` : token}
                                </a>
                            );
                        } else if (token.match(/^([@#][\w_]+)/gi)) {
                            return (
                                <span
                                    key={tokenIdx}
                                    className="text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
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

    // Helper for multi-image grid layout
    const renderMediaGrid = () => {
        if (mediaList.length === 0) return null;

        if (mediaList.length === 1) {
            const single = mediaList[0];
            const isVideo = single.match(/\.(mp4|webm|ogg)$/i) || (single.startsWith("blob:") && single.includes("video"));

            return (
                <div className="w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                    {isVideo ? (
                        <video src={single} controls className="w-full aspect-video object-cover" />
                    ) : (
                        <img
                            src={single}
                            alt="Post media preview"
                            className="w-full max-h-96 object-cover"
                        />
                    )}
                </div>
            );
        }

        if (mediaList.length === 2) {
            return (
                <div className="grid grid-cols-2 gap-0.5 overflow-hidden bg-slate-100 dark:bg-zinc-800">
                    {mediaList.map((url, idx) => (
                        <img key={idx} src={url} alt={`Media ${idx + 1}`} className="w-full h-56 object-cover" />
                    ))}
                </div>
            );
        }

        if (mediaList.length === 3) {
            return (
                <div className="grid grid-cols-3 gap-0.5 overflow-hidden bg-slate-100 dark:bg-zinc-800">
                    <img src={mediaList[0]} alt="Media 1" className="col-span-2 w-full h-64 object-cover" />
                    <div className="flex flex-col gap-0.5">
                        <img src={mediaList[1]} alt="Media 2" className="w-full h-31.75 object-cover" />
                        <img src={mediaList[2]} alt="Media 3" className="w-full h-31.75 object-cover" />
                    </div>
                </div>
            );
        }

        // 4 or more images
        const displayImages = mediaList.slice(0, 4);
        const remaining = mediaList.length - 4;

        return (
            <div className="grid grid-cols-2 gap-0.5 overflow-hidden bg-slate-100 dark:bg-zinc-800">
                {displayImages.map((url, idx) => (
                    <div key={idx} className="relative h-44 w-full">
                        <img src={url} alt={`Media ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 3 && remaining > 0 && (
                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white font-bold text-xl backdrop-blur-xs">
                                +{remaining}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-md text-slate-900 dark:text-zinc-100 font-sans transition-all overflow-hidden text-left">
            {/* Top Author Header Bar */}
            <div className="p-4 pb-2 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 overflow-hidden">
                    {user?.picture ? (
                        <img
                            src={user.picture}
                            alt={displayName}
                            className="size-12 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-700"
                        />
                    ) : (
                        <div className="size-12 rounded-full bg-linear-to-tr from-[#0a66c2] to-blue-700 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight truncate">
                                {displayName}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                                • 1st
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 truncate leading-tight mt-0.5">
                            {userHeadline}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                            <span>1h</span>
                            <span>•</span>
                            <GlobeIcon className="size-3" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        className="hidden sm:flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
                    >
                        <PlusIcon className="size-3.5" />
                        <span>Follow</span>
                    </button>
                    <button
                        type="button"
                        className="text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <MoreHorizontalIcon className="size-4.5" />
                    </button>
                </div>
            </div>

            {/* Post Text Content Body */}
            <div className="px-4 py-2 text-sm leading-relaxed text-slate-800 dark:text-zinc-100 whitespace-pre-wrap wrap-break-word">
                {renderFormattedContent(content)}
            </div>

            {/* Media Area (Images / Multi-Image Grid / Videos) */}
            {mediaList.length > 0 && (
                <div className="mt-2 border-y border-slate-100 dark:border-zinc-800/80">
                    {renderMediaGrid()}
                </div>
            )}

            {/* Link Preview Callout Banner (If provided or if link preview is set) */}
            {linkPreview && (
                <div className="border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 p-3 flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {linkPreview.domain || "websitename.com"}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                            {linkPreview.tagline || linkPreview.title || "tagline goes here"}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="shrink-0 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-300 dark:border-zinc-600 px-3 py-1 rounded-md transition-colors flex items-center gap-1"
                    >
                        <span>{linkPreview.actionText || "Learn more"}</span>
                        <ExternalLinkIcon className="size-3" />
                    </button>
                </div>
            )}

            {/* Reactions & Stats Bar */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                    <LinkedInReactions />
                    <span className="ml-1 hover:text-sky-600 hover:underline cursor-pointer">
                        511
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="hover:text-sky-600 hover:underline cursor-pointer">
                        57 comments
                    </span>
                    <span>•</span>
                    <span className="hover:text-sky-600 hover:underline cursor-pointer">
                        117 reposts
                    </span>
                </div>
            </div>

            {/* Divider Line */}
            <div className="mx-4 border-t border-slate-200 dark:border-zinc-800" />

            {/* Action Bar Buttons: Like, Comment, Repost, Send */}
            <div className="px-2 py-1 flex items-center justify-around text-slate-600 dark:text-zinc-400 text-xs font-semibold">
                {/* Like Button */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                >
                    <ThumbsUpIcon className="size-4" />
                    <span>Like</span>
                </button>

                {/* Comment Button */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                    <MessageSquareIcon className="size-4" />
                    <span>Comment</span>
                </button>

                {/* Repost Button */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                    <Repeat2Icon className="size-4" />
                    <span>Repost</span>
                </button>

                {/* Send Button */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                    <SendIcon className="size-4" />
                    <span>Send</span>
                </button>
            </div>
        </div>
    );
};

export const LinkedInPreview = LinkedInPostPreview;

export default LinkedInPostPreview;
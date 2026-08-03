import React from "react";
import {
    MessageCircleIcon,
    Repeat2Icon,
    HeartIcon,
    BarChart2Icon,
    BookmarkIcon,
    ShareIcon,
    MoreHorizontalIcon
} from "lucide-react";

interface TwitterProps {
    content: string;
    mediaUrl?: string | null;
    user?: {
        name?: string;
        email?: string;
        picture?: string;
    } | null;
}

export type XProps = TwitterProps;

const VerifiedBadge = () => (
    <svg className="size-4.5 text-sky-500 fill-current inline-block ml-1 shrink-0" viewBox="0 0 24 24">
        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4zM9.9 16.85l-3.5-3.5 1.41-1.41 2.09 2.09 5.68-5.68 1.41 1.41-7.09 7.09z" />
    </svg>
);

export const TwitterPostPreview: React.FC<TwitterProps> = ({ content, mediaUrl, user }) => {
    const displayName = user?.name || "Vedant Mahajan";
    const username = user?.name
        ? `@${user.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`
        : "@vedx09";

    // Formats post body text to detect and highlight URLs, @mentions, and #hashtags in Twitter Sky Blue
    const renderFormattedContent = (text: string) => {
        if (!text.trim()) {
            return (
                <span className="text-slate-400 dark:text-zinc-500 italic">
                    What is happening?! (Write your post content to preview it live...)
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
                                    className="text-sky-500 hover:underline break-all"
                                >
                                    {token.length > 30 ? `${token.slice(0, 27)}...` : token}
                                </a>
                            );
                        } else if (token.match(/^([@#][\w_]+)/gi)) {
                            return (
                                <span key={tokenIdx} className="text-sky-500 hover:underline cursor-pointer">
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
        <div className="w-full max-w-md bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg text-slate-900 dark:text-white transition-all font-sans text-left">
            {/* Top Author Bar */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                    {user?.picture ? (
                        <img
                            src={user.picture}
                            alt={displayName}
                            className="size-10 sm:size-11 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-800"
                        />
                    ) : (
                        <div className="size-10 sm:size-11 rounded-full bg-linear-to-tr from-sky-500 to-blue-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1 min-w-0">
                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                                {displayName}
                            </span>
                            <VerifiedBadge />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 truncate">
                            <span>{username}</span>
                            <span>·</span>
                            <span>12h</span>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className="text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
                >
                    <MoreHorizontalIcon className="size-4.5" />
                </button>
            </div>

            {/* Post Content */}
            <div className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-900 dark:text-zinc-100 whitespace-pre-wrap wrap-break-word">
                {renderFormattedContent(content)}
            </div>

            {/* Media Attachment (If Image/Video attached) */}
            {mediaUrl && (
                <div className="mt-3.5 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 shadow-xs">
                    {mediaUrl.match(/\.(mp4|webm|ogg)$/i) || mediaUrl.startsWith("blob:") && mediaUrl.includes("video") ? (
                        <video src={mediaUrl} controls className="w-full aspect-video object-cover" />
                    ) : (
                        <img
                            src={mediaUrl}
                            alt="Post media preview"
                            className="w-full max-h-80 object-cover"
                        />
                    )}
                </div>
            )}

            {/* Bottom Engagement Action Bar */}
            <div className="mt-4 pt-2 flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs sm:text-sm max-w-sm">
                {/* Reply */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 hover:text-sky-500 transition-colors group cursor-pointer"
                >
                    <div className="p-2 rounded-full group-hover:bg-sky-500/10 transition-colors">
                        <MessageCircleIcon className="size-4 sm:size-4.5" />
                    </div>
                    <span>49</span>
                </button>

                {/* Retweet */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 hover:text-green-500 transition-colors group cursor-pointer"
                >
                    <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                        <Repeat2Icon className="size-4 sm:size-4.5" />
                    </div>
                    <span>37</span>
                </button>

                {/* Like */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 hover:text-pink-500 transition-colors group cursor-pointer"
                >
                    <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                        <HeartIcon className="size-4 sm:size-4.5" />
                    </div>
                    <span>907</span>
                </button>

                {/* Views / Analytics */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 hover:text-sky-500 transition-colors group cursor-pointer"
                >
                    <div className="p-2 rounded-full group-hover:bg-sky-500/10 transition-colors">
                        <BarChart2Icon className="size-4 sm:size-4.5" />
                    </div>
                    <span>33K</span>
                </button>

                {/* Bookmark & Share */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="hover:text-sky-500 p-2 rounded-full hover:bg-sky-500/10 transition-colors cursor-pointer"
                    >
                        <BookmarkIcon className="size-4 sm:size-4.5" />
                    </button>
                    <button
                        type="button"
                        className="hover:text-sky-500 p-2 rounded-full hover:bg-sky-500/10 transition-colors cursor-pointer"
                    >
                        <ShareIcon className="size-4 sm:size-4.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const XPostPreview = TwitterPostPreview;

export default TwitterPostPreview;
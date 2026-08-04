import React from "react";
import {
    HeartIcon,
    MessageCircleIcon,
    SendIcon,
    BookmarkIcon,
    MoreHorizontalIcon
} from "lucide-react";

export interface InstagramUser {
    name?: string;
    email?: string;
    picture?: string;
}

export interface InstagramProps {
    content?: string;
    mediaUrl?: string | string[] | null;
    mediaUrls?: string[];
    user?: InstagramUser | null;
}

export const InstagramPostPreview: React.FC<InstagramProps> = ({
    content = "",
    mediaUrl,
    mediaUrls,
    user
}) => {
    const displayName = user?.name || "Vedant Mahajan";
    const username = user?.name
        ? user.name.toLowerCase().replace(/[^a-z0-9]/g, "")
        : "quotes_off_us";

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
                    Write a caption for your post...
                </span>
            );
        }

        const lines = text.split("\n");
        return lines.map((line, lineIdx) => {
            const tokens = line.split(/(\s+)/);
            return (
                <React.Fragment key={lineIdx}>
                    {tokens.map((token, tokenIdx) => {
                        if (token.match(/^([@#][\w_]+)/gi)) {
                            return (
                                <span
                                    key={tokenIdx}
                                    className="text-sky-600 dark:text-sky-400 font-semibold cursor-pointer hover:underline"
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
        <div className="w-full max-w-77.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-md text-slate-900 dark:text-zinc-100 font-sans transition-all overflow-hidden text-left">
            {/* Top Author Header (Matching Instagram Mockup) */}
            <div className="px-2.5 py-1.5 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="p-0.5 rounded-full bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
                        {user?.picture ? (
                            <img
                                src={user.picture}
                                alt={displayName}
                                className="size-7 rounded-full object-cover border-2 border-white dark:border-zinc-900"
                            />
                        ) : (
                            <div className="size-7 rounded-full bg-slate-900 dark:bg-zinc-800 text-white font-bold text-[11px] flex items-center justify-center border-2 border-white dark:border-zinc-900">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[11px] text-slate-900 dark:text-white truncate leading-tight">
                            {username}
                        </span>
                        <span className="text-[9px] text-slate-500 dark:text-zinc-400 leading-tight">
                            Sponsored 🌐
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        className="bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                    >
                        Follow
                    </button>
                    <button type="button" className="text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5 rounded-full">
                        <MoreHorizontalIcon className="size-3.5" />
                    </button>
                </div>
            </div>

            {/* Media Area */}
            <div className="w-full aspect-square max-h-44 sm:max-h-48 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                {mediaList.length > 0 ? (
                    mediaList[0].match(/\.(mp4|webm|ogg)$/i) || (mediaList[0].startsWith("blob:") && mediaList[0].includes("video")) ? (
                        <video src={mediaList[0]} controls className="w-full h-full object-cover" />
                    ) : (
                        <img src={mediaList[0]} alt="Instagram Post Media" className="w-full h-full object-cover" />
                    )
                ) : (
                    <div className="p-3 text-center text-slate-400 dark:text-zinc-500 text-[11px] italic">
                        No image or video attached. Upload media to preview Instagram post layout.
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="px-2.5 py-1.5 pb-0.5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-800 dark:text-zinc-200">
                    <button type="button" className="hover:text-rose-500 transition-colors cursor-pointer">
                        <HeartIcon className="size-4" />
                    </button>
                    <button type="button" className="hover:text-sky-500 transition-colors cursor-pointer">
                        <MessageCircleIcon className="size-4" />
                    </button>
                    <button type="button" className="hover:text-sky-500 transition-colors cursor-pointer">
                        <SendIcon className="size-4" />
                    </button>
                </div>
                <button type="button" className="text-slate-800 dark:text-zinc-200 hover:text-amber-500 transition-colors cursor-pointer">
                    <BookmarkIcon className="size-4" />
                </button>
            </div>

            {/* Likes count / Social proof line */}
            <div className="px-2.5 text-[11px] font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <div className="size-3.5 rounded-full bg-slate-300 dark:bg-zinc-700 shrink-0" />
                <span>Liked by <strong className="font-semibold">user</strong> and <strong className="font-semibold">2,368 others</strong></span>
            </div>

            {/* Caption & Hashtags */}
            <div className="px-2.5 pt-0.5 text-[11px] leading-snug text-slate-800 dark:text-zinc-100">
                <span className="font-bold mr-1 text-slate-900 dark:text-white">{username}</span>
                {renderFormattedContent(content)}
            </div>

            {/* Comments count link */}
            <div className="px-2.5 pt-0.5 text-[10px] text-slate-400 dark:text-zinc-500 hover:text-slate-600 cursor-pointer">
                View all 45 comments
            </div>

            {/* Time Ago Footer */}
            <div className="px-2.5 pt-0.5 pb-2 text-[9px] uppercase font-medium text-slate-400 dark:text-zinc-500">
                21 hours ago
            </div>
        </div>
    );
};

export const InstagramPreview = InstagramPostPreview;
export default InstagramPostPreview;
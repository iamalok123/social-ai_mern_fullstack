import React from "react";
import { PLATFORMS } from "../../../assets/assets";
import {
    CalendarIcon,
    ClockIcon,
    Trash2Icon,
    Loader2Icon,
    CheckCircle2Icon,
    AlertCircleIcon,
    TimerIcon,
    ImageIcon,
    FilmIcon,
    BarChart3Icon,
} from "lucide-react";
import type { Post } from "../types";
import PostThumbnail from "../common/PostThumbnail";

interface PostHistoryCardProps {
    post: Post;
    isExpanded: boolean;
    onToggleExpand: (id: string) => void;
    onPreviewMedia: (media: { url: string; type: "image" | "video" }) => void;
    onDeleteUpcoming?: (post: Post) => void;
    deletingId?: string | null;
    onViewAnalytics?: (postId: string) => void;
    onReEdit?: (post: Post) => void;
    formatRelativeSchedule: (dateString: string) => string;
}

export const PostHistoryCard: React.FC<PostHistoryCardProps> = ({
    post,
    isExpanded,
    onToggleExpand,
    onPreviewMedia,
    onDeleteUpcoming,
    deletingId,
    onViewAnalytics,
    onReEdit,
    formatRelativeSchedule,
}) => {
    const isLongText = (post.content || "").length > 140;
    const firstMediaUrl = post.mediaUrl || (Array.isArray(post.mediaUrls) ? post.mediaUrls[0] : "");
    const isVideo =
        post.mediaType === "video" ||
        (firstMediaUrl &&
            (/\.(mp4|webm|mov|mkv|ogg)$/i.test(firstMediaUrl) ||
                firstMediaUrl.includes("/video/upload/")));
    const mediaCount =
        Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0
            ? post.mediaUrls.length
            : post.mediaUrl
            ? 1
            : 0;

    const borderColor =
        post.status === "failed"
            ? "border-rose-200 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-600"
            : post.status === "scheduled"
            ? "border-slate-200/80 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-500/40"
            : "border-slate-200/80 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-500/40";

    return (
        <div
            className={`group relative bg-slate-50/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 p-4 rounded-2xl transition-all duration-150 border shadow-2xs hover:shadow-xs flex flex-col gap-3 ${borderColor}`}
        >
            {/* Top Row: Platforms + Status / Action */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                    {post.platforms?.map((pl: string) => {
                        const meta = PLATFORMS.find((p) => p.id === pl);
                        if (!meta) return null;
                        const Icon = meta.icon;
                        return (
                            <span
                                key={pl}
                                title={meta.name || pl}
                                className="p-1 rounded-lg bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-2xs inline-flex items-center justify-center"
                            >
                                <Icon className="size-3.5" />
                            </span>
                        );
                    })}
                </div>

                <div className="flex items-center gap-1.5">
                    {post.status === "scheduled" && (
                        <>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                                <TimerIcon className="size-3 animate-pulse text-amber-500" />
                                <span>{formatRelativeSchedule(post.scheduledFor)}</span>
                            </span>

                            {onDeleteUpcoming && (
                                <button
                                    type="button"
                                    onClick={() => onDeleteUpcoming(post)}
                                    disabled={deletingId === post._id}
                                    title="Cancel & Delete upcoming post"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
                                >
                                    {deletingId === post._id ? (
                                        <Loader2Icon className="size-3.5 animate-spin text-red-500" />
                                    ) : (
                                        <Trash2Icon className="size-3.5" />
                                    )}
                                </button>
                            )}
                        </>
                    )}

                    {post.status === "published" && (
                        <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                                <CheckCircle2Icon className="size-3 text-emerald-500" />
                                <span>Published</span>
                            </span>
                            {onViewAnalytics && (
                                <button
                                    type="button"
                                    onClick={() => onViewAnalytics(post._id)}
                                    title="View Post Performance Analytics"
                                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                                >
                                    <BarChart3Icon className="size-3 text-pink-500" />
                                    <span>Analytics</span>
                                </button>
                            )}
                        </div>
                    )}

                    {post.status === "failed" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                            <AlertCircleIcon className="size-3 text-rose-500" />
                            <span>Failed</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Middle Row: Content & Thumbnail */}
            <div className="flex items-start justify-between gap-3 min-w-0">
                <div className="flex-1 min-w-0">
                    <p
                        className={`text-xs sm:text-sm text-slate-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap ${
                            !isExpanded && isLongText ? "line-clamp-3" : ""
                        }`}
                    >
                        {post.content}
                    </p>
                    {isLongText && (
                        <button
                            type="button"
                            onClick={() => onToggleExpand(post._id)}
                            className="mt-1 text-[11px] font-semibold text-red-500 dark:text-red-400 hover:underline cursor-pointer"
                        >
                            {isExpanded ? "Show less" : "Show full text"}
                        </button>
                    )}
                </div>

                {firstMediaUrl && (
                    <PostThumbnail
                        mediaUrl={firstMediaUrl}
                        isVideo={Boolean(isVideo)}
                        count={mediaCount}
                        onClick={() =>
                            onPreviewMedia({
                                url: firstMediaUrl,
                                type: isVideo ? "video" : "image",
                            })
                        }
                    />
                )}
            </div>

            {/* Failure Reason Alert Banner for Failed Posts */}
            {post.status === "failed" && (
                <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2 min-w-0">
                        <AlertCircleIcon className="size-4 shrink-0 mt-0.5 text-rose-500" />
                        <div className="flex-1 min-w-0">
                            <span className="font-bold text-[11px] uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-0.5">
                                Failure Reason
                            </span>
                            <p className="wrap-break-word leading-relaxed text-xs">
                                {post.failedReason ||
                                    "The social platform API rejected this post. Check duplicate content, rate limits, or media requirements."}
                            </p>
                        </div>
                    </div>
                    {onReEdit && (
                        <button
                            type="button"
                            onClick={() => onReEdit(post)}
                            className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
                            title="Edit and retry scheduling"
                        >
                            Re-edit
                        </button>
                    )}
                </div>
            )}

            {/* Bottom Row: Date & Media info */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 text-[11px] text-slate-400 dark:text-zinc-500">
                <div className="flex items-center gap-1.5">
                    {post.status === "scheduled" ? (
                        <>
                            <CalendarIcon className="size-3.5 text-amber-500/80" />
                            <span>
                                {new Date(post.scheduledFor).toLocaleString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </>
                    ) : post.status === "published" ? (
                        <>
                            <ClockIcon className="size-3.5 text-emerald-500/80" />
                            <span>
                                {new Date(post.updatedAt || post.createdAt || "").toLocaleString(
                                    undefined,
                                    {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </span>
                        </>
                    ) : (
                        <>
                            <CalendarIcon className="size-3.5 text-slate-400" />
                            <span>
                                {new Date(post.scheduledFor || post.createdAt || "").toLocaleString(
                                    undefined,
                                    {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </span>
                        </>
                    )}
                </div>

                {firstMediaUrl && (
                    <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-zinc-400">
                        {isVideo ? <FilmIcon className="size-3" /> : <ImageIcon className="size-3" />}
                        <span className="capitalize">
                            {isVideo
                                ? "video"
                                : mediaCount > 1
                                ? `${mediaCount} images`
                                : "image"}
                        </span>
                    </span>
                )}
            </div>
        </div>
    );
};

export default PostHistoryCard;

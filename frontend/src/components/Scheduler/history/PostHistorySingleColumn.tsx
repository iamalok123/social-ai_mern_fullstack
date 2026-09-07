import React from "react";
import { ClockIcon, SendIcon, AlertCircleIcon } from "lucide-react";
import type { Post } from "../types";
import PostHistoryCard from "./PostHistoryCard";

interface PostHistorySingleColumnProps {
    filter: "scheduled" | "published" | "failed";
    posts: Post[];
    expandedPostIds: string[];
    onToggleExpand: (id: string) => void;
    onPreviewMedia: (media: { url: string; type: "image" | "video" }) => void;
    onDeleteUpcoming: (post: Post) => void;
    deletingId: string | null;
    onViewAnalytics: (postId: string) => void;
    onReEdit: (post: Post) => void;
    formatRelativeSchedule: (dateString: string) => string;
}

export const PostHistorySingleColumn: React.FC<PostHistorySingleColumnProps> = ({
    filter,
    posts,
    expandedPostIds,
    onToggleExpand,
    onPreviewMedia,
    onDeleteUpcoming,
    deletingId,
    onViewAnalytics,
    onReEdit,
    formatRelativeSchedule,
}) => {
    return (
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                    {filter === "scheduled" && <ClockIcon className="size-4 text-amber-500" />}
                    {filter === "published" && <SendIcon className="size-4 text-emerald-500" />}
                    {filter === "failed" && <AlertCircleIcon className="size-4 text-rose-500" />}
                    <span>
                        {filter} Posts ({posts.length})
                    </span>
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-slate-400 dark:text-zinc-500 flex flex-col items-center justify-center gap-2">
                        <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                            No {filter} posts found
                        </p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostHistoryCard
                            key={post._id}
                            post={post}
                            isExpanded={expandedPostIds.includes(post._id)}
                            onToggleExpand={onToggleExpand}
                            onPreviewMedia={onPreviewMedia}
                            onDeleteUpcoming={filter === "scheduled" ? onDeleteUpcoming : undefined}
                            deletingId={deletingId}
                            onViewAnalytics={filter === "published" ? onViewAnalytics : undefined}
                            onReEdit={filter === "failed" ? onReEdit : undefined}
                            formatRelativeSchedule={formatRelativeSchedule}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default PostHistorySingleColumn;

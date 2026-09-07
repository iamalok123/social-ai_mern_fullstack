import { useState } from "react";
import { ClockIcon, SendIcon, AlertCircleIcon, SearchIcon, XIcon } from "lucide-react";
import type { Post } from "../types";
import PostHistoryDualColumn from "./PostHistoryDualColumn";
import PostHistorySingleColumn from "./PostHistorySingleColumn";

interface PostHistoryTabProps {
    posts: Post[];
    expandedPostIds: string[];
    onToggleExpand: (id: string) => void;
    onPreviewMedia: (media: { url: string; type: "image" | "video" }) => void;
    onDeleteUpcoming: (post: Post) => void;
    deletingId: string | null;
    onViewAnalytics: (postId: string) => void;
    onReEdit: (post: Post) => void;
    formatRelativeSchedule: (dateString: string) => string;
    onCreatePostClick: () => void;
}

export const PostHistoryTab: React.FC<PostHistoryTabProps> = ({
    posts,
    expandedPostIds,
    onToggleExpand,
    onPreviewMedia,
    onDeleteUpcoming,
    deletingId,
    onViewAnalytics,
    onReEdit,
    formatRelativeSchedule,
    onCreatePostClick,
}) => {
    const [historyFilter, setHistoryFilter] = useState<"all" | "scheduled" | "published" | "failed">("all");
    const [historySearch, setHistorySearch] = useState("");

    const scheduled = posts.filter((p) => p.status === "scheduled");
    const published = posts.filter((p) => p.status === "published");
    const failed = posts.filter((p) => p.status === "failed");

    const getFilteredPosts = (list: Post[]) => {
        if (!historySearch.trim()) return list;
        const query = historySearch.toLowerCase();
        return list.filter(
            (p) =>
                p.content?.toLowerCase().includes(query) ||
                p.platforms?.some((pl: string) => pl.toLowerCase().includes(query))
        );
    };

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Header Controls: Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-zinc-800">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                        type="button"
                        onClick={() => setHistoryFilter("all")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            historyFilter === "all"
                                ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-2xs"
                                : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                        }`}
                    >
                        All Posts
                        <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200">
                            {posts.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setHistoryFilter("scheduled")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                            historyFilter === "scheduled"
                                ? "bg-amber-500 text-white border-amber-500 shadow-2xs"
                                : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-800/60"
                        }`}
                    >
                        <ClockIcon className="size-3" />
                        Upcoming
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                            {scheduled.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setHistoryFilter("published")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                            historyFilter === "published"
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                                : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-800/60"
                        }`}
                    >
                        <SendIcon className="size-3" />
                        Published
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                            {published.length}
                        </span>
                    </button>

                    {failed.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setHistoryFilter("failed")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                                historyFilter === "failed"
                                ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                                : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-rose-300"
                            }`}
                        >
                            <AlertCircleIcon className="size-3" />
                            Failed
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold">
                                {failed.length}
                            </span>
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search post content..."
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-red-400 dark:focus:border-red-500/50 transition-colors shadow-2xs"
                    />
                    {historySearch && (
                        <button
                            type="button"
                            onClick={() => setHistorySearch("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer"
                        >
                            <XIcon className="size-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* VIEW 1: Dual Column Split View */}
            {historyFilter === "all" ? (
                <PostHistoryDualColumn
                    scheduled={getFilteredPosts(scheduled)}
                    published={getFilteredPosts(published)}
                    expandedPostIds={expandedPostIds}
                    onToggleExpand={onToggleExpand}
                    onPreviewMedia={onPreviewMedia}
                    onDeleteUpcoming={onDeleteUpcoming}
                    deletingId={deletingId}
                    formatRelativeSchedule={formatRelativeSchedule}
                    onCreatePostClick={onCreatePostClick}
                />
            ) : (
                /* VIEW 2: Filtered Single Column Feed */
                <PostHistorySingleColumn
                    filter={historyFilter}
                    posts={getFilteredPosts(posts.filter((p) => p.status === historyFilter))}
                    expandedPostIds={expandedPostIds}
                    onToggleExpand={onToggleExpand}
                    onPreviewMedia={onPreviewMedia}
                    onDeleteUpcoming={onDeleteUpcoming}
                    deletingId={deletingId}
                    onViewAnalytics={onViewAnalytics}
                    onReEdit={onReEdit}
                    formatRelativeSchedule={formatRelativeSchedule}
                />
            )}
        </div>
    );
};

export default PostHistoryTab;

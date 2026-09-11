import React from "react";
import { CalendarDaysIcon, SendIcon, ClockIcon, PlusCircleIcon } from "lucide-react";
import type { Post } from "../types";
import PostHistoryCard from "./PostHistoryCard";

interface PostHistoryDualColumnProps {
    scheduled: Post[];
    published: Post[];
    expandedPostIds: string[];
    onToggleExpand: (id: string) => void;
    onPreviewMedia: (media: { url: string; type: "image" | "video" }) => void;
    onDeleteUpcoming: (post: Post) => void;
    deletingId: string | null;
    onEditYoutubeDescription?: (post: Post) => void;
    formatRelativeSchedule: (dateString: string) => string;
    onCreatePostClick: () => void;
}

export const PostHistoryDualColumn: React.FC<PostHistoryDualColumnProps> = ({
    scheduled,
    published,
    expandedPostIds,
    onToggleExpand,
    onPreviewMedia,
    onDeleteUpcoming,
    deletingId,
    onEditYoutubeDescription,
    formatRelativeSchedule,
    onCreatePostClick,
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Left Column: Upcoming / Scheduled Posts */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                            <CalendarDaysIcon className="size-4" />
                        </div>
                        <div>
                            <h3 className="text-slate-900 dark:text-white text-sm font-bold">Upcoming Posts</h3>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                                Scheduled to publish automatically
                            </p>
                        </div>
                    </div>
                    <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60">
                        {scheduled.length}
                    </span>
                </div>

                <div className="p-4 flex-1 overflow-y-auto max-h-160 space-y-3.5">
                    {scheduled.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 dark:text-zinc-500 flex flex-col items-center justify-center gap-2">
                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-500 border border-slate-200/60 dark:border-zinc-800">
                                <ClockIcon className="size-6" />
                            </div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                                No upcoming posts scheduled
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 max-w-xs">
                                Compose a new post to schedule it for automatic publishing.
                            </p>
                            <button
                                type="button"
                                onClick={onCreatePostClick}
                                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                            >
                                <PlusCircleIcon className="size-3.5" />
                                Create a Post
                            </button>
                        </div>
                    ) : (
                        scheduled.map((post) => (
                            <PostHistoryCard
                                key={post._id}
                                post={post}
                                isExpanded={expandedPostIds.includes(post._id)}
                                onToggleExpand={onToggleExpand}
                                onPreviewMedia={onPreviewMedia}
                                onDeleteUpcoming={onDeleteUpcoming}
                                deletingId={deletingId}
                                formatRelativeSchedule={formatRelativeSchedule}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Right Column: Published Posts (NO DELETE BUTTON) */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                            <SendIcon className="size-4" />
                        </div>
                        <div>
                            <h3 className="text-slate-900 dark:text-white text-sm font-bold">Published Posts</h3>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                                Successfully broadcasted posts
                            </p>
                        </div>
                    </div>
                    <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60">
                        {published.length}
                    </span>
                </div>

                <div className="p-4 flex-1 overflow-y-auto max-h-160 space-y-3.5">
                    {published.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 dark:text-zinc-500 flex flex-col items-center justify-center gap-2">
                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-500 border border-slate-200/60 dark:border-zinc-800">
                                <SendIcon className="size-6" />
                            </div>
                            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">
                                No published posts yet
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 max-w-xs">
                                Posts published by the scheduler will appear here.
                            </p>
                        </div>
                    ) : (
                        published.map((post) => (
                            <PostHistoryCard
                                key={post._id}
                                post={post}
                                isExpanded={expandedPostIds.includes(post._id)}
                                onToggleExpand={onToggleExpand}
                                onPreviewMedia={onPreviewMedia}
                                onEditYoutubeDescription={onEditYoutubeDescription}
                                formatRelativeSchedule={formatRelativeSchedule}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostHistoryDualColumn;

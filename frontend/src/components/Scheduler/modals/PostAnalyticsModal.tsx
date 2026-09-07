import React from "react";
import { BarChart3Icon, XIcon, Loader2Icon } from "lucide-react";
import type { AnalyticsData } from "../types";

interface PostAnalyticsModalProps {
    postId: string | null;
    analyticsData: AnalyticsData | null;
    loading: boolean;
    onClose: () => void;
}

export const PostAnalyticsModal: React.FC<PostAnalyticsModalProps> = ({
    postId,
    analyticsData,
    loading,
    onClose,
}) => {
    if (!postId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div
                className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-xl bg-linear-to-tr from-yellow-500 via-pink-600 to-purple-700 flex items-center justify-center text-white shadow-xs">
                            <BarChart3Icon className="size-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post Performance</h3>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">Real-time engagement analytics</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                    >
                        <XIcon className="size-4" />
                    </button>
                </div>

                <div className="mt-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2Icon className="size-6 animate-spin text-pink-500" />
                            <span className="text-xs text-slate-500 mt-2">Loading performance metrics...</span>
                        </div>
                    ) : analyticsData ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Impressions</span>
                                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                    {analyticsData.impressions?.toLocaleString() ?? 0}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Reach</span>
                                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                    {analyticsData.reach?.toLocaleString() ?? 0}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Likes</span>
                                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                    {analyticsData.likes?.toLocaleString() ?? 0}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Comments</span>
                                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                    {analyticsData.comments?.toLocaleString() ?? 0}
                                </div>
                            </div>
                            {analyticsData.shares !== undefined && (
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Shares</span>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                        {analyticsData.shares?.toLocaleString() ?? 0}
                                    </div>
                                </div>
                            )}
                            {analyticsData.saved !== undefined && (
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Saved</span>
                                    <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                        {analyticsData.saved?.toLocaleString() ?? 0}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-6 text-center text-xs text-slate-500">
                            No analytics metrics available yet for this post.
                        </div>
                    )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostAnalyticsModal;

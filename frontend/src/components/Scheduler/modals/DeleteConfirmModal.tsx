import React from "react";
import { Trash2Icon, Loader2Icon } from "lucide-react";
import type { Post } from "../types";

interface DeleteConfirmModalProps {
    post: Post | null;
    deletingId: string | null;
    onClose: () => void;
    onConfirm: (postId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    post,
    deletingId,
    onClose,
    onConfirm,
}) => {
    if (!post) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
                <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 shrink-0">
                        <Trash2Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Cancel Upcoming Post?
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                            This upcoming post will be removed from your queue and will NOT be published to your connected social accounts.
                        </p>
                    </div>
                </div>

                {/* Post snippet */}
                <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/70 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-300 max-h-24 overflow-y-auto italic line-clamp-3">
                    &ldquo;{post.content}&rdquo;
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deletingId === post._id}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-800"
                    >
                        Keep Post
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(post._id)}
                        disabled={deletingId === post._id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                        {deletingId === post._id ? (
                            <>
                                <Loader2Icon className="size-3.5 animate-spin" />
                                Canceling...
                            </>
                        ) : (
                            <>
                                <Trash2Icon className="size-3.5" />
                                Cancel & Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;

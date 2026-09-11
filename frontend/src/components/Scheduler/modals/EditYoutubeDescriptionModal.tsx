import React, { useState, useEffect } from "react";
import { XIcon, Loader2Icon, SparklesIcon, AlertCircleIcon } from "lucide-react";
import { SiYoutube } from "@icons-pack/react-simple-icons";
import { toast } from "sonner";
import { api } from "../../../api/axios";
import type { Post } from "../types";

interface EditYoutubeDescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
    onSuccess: (updatedPostId: string, newContent: string) => void;
}

export const EditYoutubeDescriptionModal: React.FC<EditYoutubeDescriptionModalProps> = ({
    isOpen,
    onClose,
    post,
    onSuccess,
}) => {
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (post) {
            setDescription(post.content || "");
        }
    }, [post]);

    if (!isOpen || !post) return null;

    const charCount = description.length;
    const isOverLimit = charCount > 5000;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isOverLimit) {
            toast.error("Description exceeds the 5,000 character limit.");
            return;
        }

        // Sanitize: strip angle brackets (< and >)
        const sanitized = description.replace(/[<>]/g, "");

        setSaving(true);
        try {
            const { data } = await api.post(`/api/posts/${post._id}/youtube/edit`, {
                content: sanitized,
            });

            toast.success(data?.message || "YouTube video description updated successfully!");
            onSuccess(post._id, sanitized);
            onClose();
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Failed to update YouTube description";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs">
                            <SiYoutube className="size-4 fill-current" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Edit YouTube Description
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                Updates the description of the live published YouTube video
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                        <XIcon className="size-4" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSave} className="p-5 flex-1 flex flex-col min-h-0 space-y-4">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-400 flex items-start gap-2">
                        <AlertCircleIcon className="size-4 text-red-500 shrink-0 mt-0.5" />
                        <span>
                            YouTube allows updating video descriptions without changing the video URL.
                            Angle brackets (<code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-zinc-800">&lt;</code> and <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-zinc-800">&gt;</code>) are stripped automatically.
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                Video Description
                            </label>
                            <span
                                className={`text-[11px] font-mono ${
                                    isOverLimit
                                        ? "text-red-500 font-bold"
                                        : "text-slate-400 dark:text-zinc-500"
                                }`}
                            >
                                {charCount}/5,000
                            </span>
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={8}
                            placeholder="Enter new video description..."
                            className="w-full flex-1 min-h-40 text-xs sm:text-sm p-3 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-y"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving || isOverLimit}
                            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2Icon className="size-3.5 animate-spin" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="size-3.5" />
                                    <span>Save Description</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditYoutubeDescriptionModal;

import React from "react";
import { ZapIcon, ArrowRightIcon, AlertCircleIcon } from "lucide-react";
import { calculateTwitterLength } from "../../../utils/schedulerUtils";

interface ContentEditorProps {
    content: string;
    onChange: (val: string) => void;
    selectedPlatforms: string[];
    firstComment: string;
    onMoveLinkToFirstComment: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
    content,
    onChange,
    selectedPlatforms,
    firstComment,
    onMoveLinkToFirstComment,
}) => {
    const isTwitterSelected = selectedPlatforms.includes("twitter");
    const isLinkedInSelected = selectedPlatforms.includes("linkedin");
    const isFacebookSelected = selectedPlatforms.includes("facebook");
    const twitterLength = calculateTwitterLength(content);

    return (
        <div className="md:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    Content
                </label>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {/* LinkedIn Hook & Fold Indicator */}
                    {isLinkedInSelected &&
                        (content.length <= 210 ? (
                            <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                                title="LinkedIn Feed Hook: The first ~210 characters appear before the '...see more' fold. Make your hook engaging!"
                            >
                                👁️ Hook: {content.length}/210 visible
                            </span>
                        ) : (
                            <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60"
                                title="210 characters appear before the fold. The rest will be hidden behind '...see more'."
                            >
                                📜 210 visible (+{content.length - 210} behind 'see more')
                            </span>
                        ))}

                    {/* Character Count Badges */}
                    {isTwitterSelected ? (
                        <div className="flex items-center gap-1.5">
                            {/https?:\/\/[^\s]+/i.test(content) && (
                                <span
                                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800"
                                    title="URLs count as 23 characters on X"
                                >
                                    URLs = 23 chars
                                </span>
                            )}
                            <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-md border transition-colors ${
                                    twitterLength > 280
                                        ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse"
                                        : twitterLength > 250
                                        ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                                        : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                                }`}
                                title={
                                    isLinkedInSelected
                                        ? "Twitter limit (280) applies because Twitter is selected alongside LinkedIn"
                                        : "Twitter/X weighted character count"
                                }
                            >
                                𝕏 {twitterLength}/280
                            </span>
                        </div>
                    ) : isLinkedInSelected ? (
                        <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md border transition-colors ${
                                content.length > 3000
                                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse"
                                    : content.length > 2800
                                    ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                                    : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                            }`}
                            title="LinkedIn supports up to 3,000 characters for both free and premium accounts"
                        >
                            in {content.length}/3,000
                        </span>
                    ) : isFacebookSelected ? (
                        <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md border transition-colors ${
                                content.length > 63206
                                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse"
                                    : content.length > 480
                                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                    : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                            }`}
                            title="Facebook limit: 63,206 chars (truncated at ~480 with 'See more')"
                        >
                            f {content.length > 480 ? `${content.length} (truncates at ~480)` : `${content.length}/63k`}
                        </span>
                    ) : (
                        <span
                            className={`text-xs font-medium ${
                                content.length > 2800
                                    ? "text-red-500 dark:text-red-400"
                                    : "text-slate-400 dark:text-zinc-500"
                            }`}
                        >
                            {content.length}/3,000
                        </span>
                    )}
                </div>
            </div>

            {/* LinkedIn Link Reach Penalty Warning Callout with One-Click Move */}
            {isLinkedInSelected && /https?:\/\/[^\s]+/i.test(content) && !firstComment && (
                <div className="mb-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-between gap-2.5 text-xs text-amber-900 dark:text-amber-200 shadow-2xs animate-in fade-in">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <ZapIcon className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="truncate leading-tight">
                            <strong>Reach Tip:</strong> LinkedIn suppresses link posts by 40-50%. Move link to First Comment.
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onMoveLinkToFirstComment}
                        className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-800/80 hover:bg-amber-300 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                        <span>Move to 1st Comment</span>
                        <ArrowRightIcon className="size-3" />
                    </button>
                </div>
            )}

            <textarea
                required
                placeholder="What do you want to share today?"
                className={`w-full h-56 md:h-64 px-4 py-3 bg-slate-50 dark:bg-zinc-900/60 border rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-zinc-500 outline-none resize-none transition-colors overflow-y-auto leading-relaxed ${
                    (isTwitterSelected && twitterLength > 280) ||
                    (isLinkedInSelected && content.length > 3000)
                        ? "border-rose-400 dark:border-rose-600 focus:border-rose-500"
                        : "border-slate-200 dark:border-zinc-800 focus:border-red-400 dark:focus:border-red-500/50"
                }`}
                value={content}
                onChange={(e) => onChange(e.target.value)}
            />
            {isTwitterSelected && twitterLength > 280 && (
                <p className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1.5 flex items-center gap-1.5">
                    <AlertCircleIcon className="size-3.5 shrink-0" />
                    Content exceeds Twitter/X 280 character limit by {twitterLength - 280} char(s).
                </p>
            )}
            {!isTwitterSelected && isLinkedInSelected && content.length > 3000 && (
                <p className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1.5 flex items-center gap-1.5">
                    <AlertCircleIcon className="size-3.5 shrink-0" />
                    Content exceeds LinkedIn 3,000 character limit by {content.length - 3000} char(s).
                </p>
            )}
        </div>
    );
};

export default ContentEditor;

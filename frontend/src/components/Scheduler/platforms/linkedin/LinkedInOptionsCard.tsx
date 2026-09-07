import React from "react";
import { InfoIcon, ZapIcon } from "lucide-react";
import { PLATFORMS } from "../../../../assets/assets";
import PlatformCardWrapper from "../common/PlatformCardWrapper";

interface LinkedInOptionsCardProps {
    firstComment: string;
    onFirstCommentChange: (val: string) => void;
    isFirstCommentRequired: boolean;
    onFirstCommentRequiredChange: (val: boolean) => void;
    disableLinkPreview: boolean;
    onDisableLinkPreviewChange: (val: boolean) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const LinkedInOptionsCard: React.FC<LinkedInOptionsCardProps> = ({
    firstComment,
    onFirstCommentChange,
    isFirstCommentRequired,
    onFirstCommentRequiredChange,
    disableLinkPreview,
    onDisableLinkPreviewChange,
    isCollapsed,
    onToggleCollapse,
}) => {
    const LinkedinIcon = PLATFORMS.find((p) => p.id === "linkedin")?.icon;

    return (
        <PlatformCardWrapper
            platformId="linkedin"
            title="LinkedIn Growth Features"
            subtitle="Max 3,000 chars • Up to 20 images"
            icon={LinkedinIcon}
            iconBgClass="bg-[#0a66c2]"
            borderColorClass="border-sky-200/80 dark:border-sky-950/80"
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
        >
            {/* First Comment Field */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 group relative">
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                            Auto "First Comment"
                        </label>
                        {/* Info Circle with rich hover tooltip */}
                        <div className="relative group/tip cursor-help inline-flex items-center">
                            <InfoIcon className="size-3.5 text-slate-400 hover:text-sky-500 transition-colors" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tip:flex flex-col w-72 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-50 pointer-events-none leading-relaxed border border-slate-700">
                                <span className="font-bold text-sky-300 mb-1 flex items-center gap-1">
                                    <ZapIcon className="size-3" />
                                    Algorithm Optimization
                                </span>
                                LinkedIn suppresses posts with external links in the caption by 40-50%.
                                Putting links in the First Comment bypasses this suppression and
                                maintains full organic reach.
                            </div>
                        </div>
                    </div>

                    {/* Optional vs Compulsory Toggle */}
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={isFirstCommentRequired}
                            onChange={(e) => onFirstCommentRequiredChange(e.target.checked)}
                            className="rounded border-slate-300 dark:border-zinc-700 text-sky-600 focus:ring-sky-500 size-3"
                        />
                        <span>Make required for this post</span>
                    </label>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={firstComment}
                        onChange={(e) => onFirstCommentChange(e.target.value)}
                        placeholder="e.g. 🔗 Read the full guide here: https://example.com/guide"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-sky-400 dark:focus:border-sky-500/50 transition-colors shadow-2xs"
                    />
                </div>
            </div>

            {/* Disable Link Preview Checkbox */}
            <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={disableLinkPreview}
                        onChange={(e) => onDisableLinkPreviewChange(e.target.checked)}
                        className="rounded border-slate-300 dark:border-zinc-700 text-sky-600 focus:ring-sky-500 size-3.5"
                    />
                    <span className="font-medium">Disable automatic URL preview card</span>
                </label>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                    Suppresses large link thumbnail card
                </span>
            </div>
        </PlatformCardWrapper>
    );
};

export default LinkedInOptionsCard;

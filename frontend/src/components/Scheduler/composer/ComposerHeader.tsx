import React from "react";
import { PLATFORMS } from "../../../assets/assets";

interface ComposerHeaderProps {
    selectedPlatforms: string[];
    onTogglePlatform: (platformId: string) => void;
}

export const ComposerHeader: React.FC<ComposerHeaderProps> = ({
    selectedPlatforms,
    onTogglePlatform,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-zinc-800/80 mb-4">
            <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Compose Post
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Create and schedule content across your connected platforms
                </p>
            </div>

            {/* Platform Selector: Icons Only */}
            <div className="flex items-center gap-1.5 shrink-0" title="Select target platforms">
                {PLATFORMS.map((p) => {
                    const active = selectedPlatforms.includes(p.id);
                    return (
                        <button
                            key={p.id}
                            type="button"
                            title={p.name || p.id}
                            onClick={() => onTogglePlatform(p.id)}
                            className={`p-2 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-center ${
                                active
                                    ? "bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 scale-105 shadow-xs"
                                    : "border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 hover:text-slate-700 dark:hover:text-zinc-300"
                            }`}
                        >
                            <p.icon className="size-4" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ComposerHeader;

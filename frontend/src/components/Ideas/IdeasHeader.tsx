import React from "react";
import { LightbulbIcon, SparklesIcon, PlusIcon } from "lucide-react";

interface IdeasHeaderProps {
    totalIdeasCount: number;
    onOpenAiBrainstorm: () => void;
    onNewIdea: () => void;
}

export const IdeasHeader: React.FC<IdeasHeaderProps> = ({
    totalIdeasCount,
    onOpenAiBrainstorm,
    onNewIdea,
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-zinc-800/80">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-linear-to-br from-orange-500/10 via-amber-500/10 to-red-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
                        <LightbulbIcon className="size-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Content Ideas Hub
                            </h2>
                            <span className="bg-linear-to-r from-orange-500/10 to-red-500/10 text-orange-600 dark:text-orange-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-orange-500/20">
                                {totalIdeasCount} Active Ideas
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                            Brainstorm, organize, generate with AI, and schedule engaging social media posts.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
                {/* AI Idea Generator Button */}
                <button
                    onClick={onOpenAiBrainstorm}
                    className="group relative inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-zinc-100 bg-linear-to-r from-emerald-500/10 via-purple-500/10 to-orange-500/10 hover:from-emerald-500/20 hover:via-purple-500/20 hover:to-orange-500/20 border border-slate-300/80 dark:border-zinc-700/80 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
                >
                    <SparklesIcon className="size-4 text-emerald-500 group-hover:rotate-12 transition-transform duration-300" />
                    <span>AI Brainstorm</span>
                </button>

                {/* New Idea Primary Button */}
                <button
                    onClick={onNewIdea}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-linear-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:via-amber-600 hover:to-red-600 rounded-xl shadow-md hover:shadow-orange-500/20 transition-all duration-200 cursor-pointer active:scale-95"
                >
                    <PlusIcon className="size-4 stroke-[2.5]" />
                    <span>New Idea</span>
                </button>
            </div>
        </div>
    );
};

export default IdeasHeader;

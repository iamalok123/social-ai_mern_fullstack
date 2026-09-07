import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PlusCircleIcon, HistoryIcon } from "lucide-react";

interface HeaderActionsPortalProps {
    activeTab: "create" | "history";
    onTabChange: (tab: "create" | "history") => void;
    postsCount: number;
}

export const HeaderActionsPortal: React.FC<HeaderActionsPortalProps> = ({
    activeTab,
    onTabChange,
    postsCount,
}) => {
    const [headerActionsEl, setHeaderActionsEl] = useState<HTMLElement | null>(() => {
        return typeof document !== "undefined" ? document.getElementById("header-actions") : null;
    });

    useEffect(() => {
        if (!headerActionsEl) {
            setHeaderActionsEl(document.getElementById("header-actions"));
        }
    }, [headerActionsEl]);

    const buttonsContent = (
        <div className="flex bg-slate-100 dark:bg-zinc-900/80 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
            <button
                type="button"
                onClick={() => onTabChange("create")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "create"
                        ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
                <PlusCircleIcon className="size-3.5 sm:size-4" />
                Create Post
            </button>
            <button
                type="button"
                onClick={() => onTabChange("history")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "history"
                        ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
                <HistoryIcon className="size-3.5 sm:size-4" />
                Post History
                <span className="ml-1 text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-700/60 text-slate-700 dark:text-zinc-300 font-bold">
                    {postsCount}
                </span>
            </button>
        </div>
    );

    if (headerActionsEl) {
        return createPortal(buttonsContent, headerActionsEl);
    }

    return (
        <div className="flex items-center justify-end pb-2">
            {buttonsContent}
        </div>
    );
};

export default HeaderActionsPortal;

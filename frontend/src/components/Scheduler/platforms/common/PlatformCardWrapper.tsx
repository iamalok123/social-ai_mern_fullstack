import React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";

interface PlatformCardWrapperProps {
    platformId: string;
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;
    icon?: React.ElementType;
    iconBgClass?: string;
    borderColorClass?: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    children: React.ReactNode;
}

export const PlatformCardWrapper: React.FC<PlatformCardWrapperProps> = ({
    platformId,
    title,
    subtitle,
    badge,
    icon: Icon,
    iconBgClass = "bg-slate-800 text-white",
    borderColorClass = "border-slate-200/80 dark:border-zinc-800",
    isCollapsed,
    onToggleCollapse,
    children,
}) => {
    return (
        <div
            data-platform={platformId}
            className={`p-4 rounded-2xl bg-slate-50/90 dark:bg-zinc-900/60 border ${borderColorClass} shadow-2xs animate-in fade-in transition-all duration-200 ${
                isCollapsed ? "" : "space-y-3.5"
            }`}
        >
            <div
                className={`flex items-center justify-between gap-2 ${
                    isCollapsed ? "" : "border-b border-slate-200/70 dark:border-zinc-800/70 pb-2.5"
                }`}
            >
                <div className="flex items-center gap-2">
                    <span
                        className={`size-5 rounded-md ${iconBgClass} flex items-center justify-center text-white shadow-2xs shrink-0`}
                    >
                        {Icon && <Icon className="size-3 text-white" />}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                        {title}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {badge}
                    {subtitle && (
                        <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 hidden sm:inline">
                            {subtitle}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="p-1 rounded-lg hover:bg-slate-200/70 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                        title={isCollapsed ? `Expand ${title}` : `Shrink ${title}`}
                        aria-label={isCollapsed ? `Expand ${title}` : `Shrink ${title}`}
                    >
                        {isCollapsed ? (
                            <ChevronDownIcon className="size-4" />
                        ) : (
                            <ChevronUpIcon className="size-4" />
                        )}
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <div className="space-y-3.5 animate-in fade-in duration-150">
                    {children}
                </div>
            )}
        </div>
    );
};

export default PlatformCardWrapper;

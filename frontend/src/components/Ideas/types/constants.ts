import { LayersIcon, ClockIcon, CheckCircle2Icon } from "lucide-react";
import type { Column, ColumnMeta } from "./idea";

export const COLUMN_CONFIG: Record<string, ColumnMeta> = {
    backlog: {
        accentColor: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30 dark:border-indigo-500/20",
        badgeClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20",
        icon: LayersIcon,
    },
    in_progress: {
        accentColor: "from-amber-500/20 to-orange-500/20 border-amber-500/30 dark:border-amber-500/20",
        badgeClass: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
        icon: ClockIcon,
    },
    ready: {
        accentColor: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 dark:border-emerald-500/20",
        badgeClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
        icon: CheckCircle2Icon,
    },
};

export const INITIAL_COLUMNS: Column[] = [
    {
        id: "backlog",
        title: "Backlog",
        ideas: [],
    },
    {
        id: "in_progress",
        title: "In Progress",
        ideas: [],
    },
    {
        id: "ready",
        title: "Ready to Post",
        ideas: [],
    },
];

export const LOCAL_STORAGE_KEY = "social_ai_ideas_columns_v3";

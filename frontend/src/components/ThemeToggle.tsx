import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            type="button"
            className="relative flex items-center w-13 h-7 rounded-full p-1 bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 transition-colors duration-300 cursor-pointer shrink-0 focus:outline-none"
            aria-label="Toggle theme"
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            <span
                className={`flex items-center justify-center size-5 rounded-full bg-white dark:bg-orange-500 shadow-sm transition-transform duration-300 transform ${
                    isDark ? "translate-x-6" : "translate-x-0"
                }`}
            >
                {isDark ? (
                    <MoonIcon className="size-3 text-white fill-white" />
                ) : (
                    <SunIcon className="size-3 text-amber-500 fill-amber-500" />
                )}
            </span>
        </button>
    );
}

import React from "react";
import { GlobeIcon } from "lucide-react";
import { PLATFORMS } from "../../../../assets/assets";
import PlatformCardWrapper from "../common/PlatformCardWrapper";

interface FacebookOptionsCardProps {
    contentType: "feed" | "reel" | "story";
    onContentTypeChange: (val: "feed" | "reel" | "story") => void;
    title: string;
    onTitleChange: (val: string) => void;
    draft: boolean;
    onDraftChange: (val: boolean) => void;
    textPreset: string;
    onTextPresetChange: (val: string) => void;
    geoCountries: string;
    onGeoCountriesChange: (val: string) => void;
    hasMedia: boolean;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const FacebookOptionsCard: React.FC<FacebookOptionsCardProps> = ({
    contentType,
    onContentTypeChange,
    title,
    onTitleChange,
    draft,
    onDraftChange,
    textPreset,
    onTextPresetChange,
    geoCountries,
    onGeoCountriesChange,
    hasMedia,
    isCollapsed,
    onToggleCollapse,
}) => {
    const FacebookIcon = PLATFORMS.find((p) => p.id === "facebook")?.icon;

    return (
        <PlatformCardWrapper
            platformId="facebook"
            title="Facebook Page Options"
            subtitle="Pages Only • Up to 10 images • 1 video"
            icon={FacebookIcon}
            iconBgClass="bg-[#1877F2]"
            borderColorClass="border-blue-200/80 dark:border-blue-950/80"
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
        >
            {/* Post Format Selector */}
            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                    Publishing Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: "feed", label: "Feed Post", desc: "Standard feed" },
                        { id: "reel", label: "Reel", desc: "Short video" },
                        { id: "story", label: "Story", desc: "24h ephemeral" },
                    ].map((fmt) => (
                        <button
                            key={fmt.id}
                            type="button"
                            onClick={() => onContentTypeChange(fmt.id as any)}
                            className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                                contentType === fmt.id
                                    ? "bg-blue-50 dark:bg-blue-950/50 border-blue-400 dark:border-blue-600 text-blue-900 dark:text-blue-100 shadow-2xs"
                                    : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700"
                            }`}
                        >
                            <div className="text-xs font-bold">{fmt.label}</div>
                            <div className="text-[10px] text-slate-500 dark:text-zinc-400">
                                {fmt.desc}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Reel Title Field */}
            {contentType === "reel" && (
                <div className="animate-in fade-in">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                        Reel Title{" "}
                        <span className="text-slate-400 font-normal">(separate from caption)</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="e.g. Behind the scenes 🎬"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-blue-400 dark:focus:border-blue-500/50 transition-colors shadow-2xs"
                    />
                </div>
            )}

            {/* Draft Mode Toggle */}
            {contentType !== "story" && (
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={draft}
                            onChange={(e) => onDraftChange(e.target.checked)}
                            className="rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 size-3.5"
                        />
                        <span className="font-medium">Save as draft in Facebook Publishing Tools</span>
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                        Review on Meta before live
                    </span>
                </div>
            )}

            {/* Large Text Colored Background Preset */}
            {contentType === "feed" && !hasMedia && (
                <div className="pt-1 animate-in fade-in">
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                            Large Text Colored Background Preset
                        </label>
                        {textPreset && (
                            <button
                                type="button"
                                onClick={() => onTextPresetChange("")}
                                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            >
                                Clear preset
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {[
                            { id: "", name: "Default", bg: "bg-slate-200 dark:bg-zinc-800" },
                            {
                                id: "ocean",
                                name: "Ocean",
                                bg: "bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700",
                            },
                            {
                                id: "sunset",
                                name: "Sunset",
                                bg: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600",
                            },
                            {
                                id: "emerald",
                                name: "Emerald",
                                bg: "bg-gradient-to-tr from-emerald-500 to-teal-700",
                            },
                            {
                                id: "midnight",
                                name: "Midnight",
                                bg: "bg-gradient-to-tr from-slate-900 via-zinc-900 to-slate-950",
                            },
                            {
                                id: "fire",
                                name: "Fire",
                                bg: "bg-gradient-to-tr from-orange-500 to-red-600",
                            },
                        ].map((preset) => (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => onTextPresetChange(preset.id)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                    textPreset === preset.id
                                        ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 shadow-xs"
                                        : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                                }`}
                            >
                                <span className={`size-3 rounded-full ${preset.bg} shrink-0`} />
                                <span className="text-slate-700 dark:text-zinc-300 text-[11px]">
                                    {preset.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Country Geo-Restriction */}
            {contentType !== "story" && (
                <div className="pt-1">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                            <GlobeIcon className="size-3 text-slate-400" />
                            Country Geo-Restriction{" "}
                            <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                            ISO-2 codes
                        </span>
                    </div>
                    <input
                        type="text"
                        value={geoCountries}
                        onChange={(e) => onGeoCountriesChange(e.target.value)}
                        placeholder="e.g. US, GB, CA (up to 25 codes)"
                        className="w-full px-3.5 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-blue-400 dark:focus:border-blue-500/50 transition-colors shadow-2xs"
                    />
                </div>
            )}
        </PlatformCardWrapper>
    );
};

export default FacebookOptionsCard;

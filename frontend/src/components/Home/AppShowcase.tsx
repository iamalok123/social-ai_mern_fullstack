import { useState } from "react";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Lightbulb,
    Wand2,
    Clock,
    CheckCircle2,
    Share2,
    Send,
    Plus,
    UploadCloud,
    Sparkles,
    ChevronDown,
    GripVertical,
    Zap,
    ArrowRight
} from "lucide-react";

// Platform Icon Components matching actual brand SVGs
function InstagramIcon({ className = "size-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function FacebookIcon({ className = "size-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function LinkedInIcon({ className = "size-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
        </svg>
    );
}

function TwitterXIcon({ className = "size-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

type TabType = "dashboard" | "scheduler" | "accounts" | "ideas" | "composer";

export default function AppShowcase() {
    const [activeTab, setActiveTab] = useState<TabType>("scheduler");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter", "linkedin"]);

    const togglePlatform = (id: string) => {
        if (selectedPlatforms.includes(id)) {
            setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
        } else {
            setSelectedPlatforms([...selectedPlatforms, id]);
        }
    };

    return (
        <section className="relative py-12 lg:py-20 overflow-hidden bg-slate-900/5 dark:bg-black/60 transition-colors">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
                        <Sparkles className="size-3.5 fill-orange-500 text-orange-500" />
                        Live Product Experience
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight">
                        See <span className="text-orange-500 italic">Social AI</span> in Action
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
                        Explore the real interface. Switch between tabs below to experience our Dashboard, AI Composer, Scheduler, and Ideas Hub.
                    </p>

                    {/* Quick Tab Switcher Pills */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                        {[
                            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                            { id: "scheduler", label: "Scheduler", icon: Calendar },
                            { id: "accounts", label: "Accounts", icon: Users },
                            { id: "composer", label: "AI Composer", icon: Wand2 },
                            { id: "ideas", label: "Ideas Hub", icon: Lightbulb },
                        ].map((t) => {
                            const Icon = t.icon;
                            const isActive = activeTab === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id as TabType)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                                        isActive
                                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                                            : "bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 hover:border-orange-500/40 dark:hover:text-white"
                                    }`}
                                >
                                    <Icon className="size-3.5 sm:size-4" />
                                    <span>{t.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* App Window Container Frame */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Ambient Glows behind browser window */}
                    <div className="absolute -inset-1 bg-linear-to-r from-orange-500/30 via-amber-500/20 to-rose-500/30 rounded-3xl blur-2xl opacity-60 dark:opacity-80" />

                    <div className="relative bg-[#0d0d0d] dark:bg-black rounded-2xl sm:rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden transition-all duration-300">
                        {/* Browser Chrome Controls Bar */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#161616] border-b border-zinc-800/90 text-xs select-none">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors" />
                                <div className="size-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
                                <div className="size-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
                            </div>

                            {/* URL Address Bar */}
                            <div className="flex-1 max-w-xs sm:max-w-md mx-4 bg-[#0a0a0a] border border-zinc-800/80 rounded-lg px-3 py-1 text-[11px] text-zinc-400 font-mono text-center truncate flex items-center justify-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>https://app.socialai.io/{activeTab}</span>
                            </div>

                            <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider hidden sm:block">
                                Live Mockup
                            </div>
                        </div>

                        {/* Main App Layout Body */}
                        <div className="flex min-h-115 sm:min-h-130 text-zinc-100 bg-black font-sans">
                            {/* Left App Sidebar */}
                            <div className="w-16 sm:w-52 border-r border-zinc-900 bg-[#090909] p-3 sm:p-4 flex flex-col justify-between shrink-0">
                                <div>
                                    {/* App Brand Header */}
                                    <div className="flex items-center gap-2.5 mb-6 px-1">
                                        <div className="size-7 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/30">
                                            <Zap className="size-4 fill-white" />
                                        </div>
                                        <span className="font-bold text-base tracking-tight text-white hidden sm:block">
                                            Social AI
                                        </span>
                                    </div>

                                    {/* Sidebar Menu Section */}
                                    <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-2 px-2 hidden sm:block">
                                        Menu
                                    </div>

                                    <nav className="space-y-1">
                                        {[
                                            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                                            { id: "accounts", label: "Accounts", icon: Users },
                                            { id: "scheduler", label: "Scheduler", icon: Calendar },
                                            { id: "ideas", label: "Ideas", icon: Lightbulb },
                                            { id: "composer", label: "AI Composer", icon: Wand2 },
                                        ].map((item) => {
                                            const Icon = item.icon;
                                            const isActive = activeTab === item.id;
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => setActiveTab(item.id as TabType)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer relative ${
                                                        isActive
                                                            ? "bg-zinc-900 text-orange-400 border border-orange-500/30 shadow-xs"
                                                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                                                    }`}
                                                >
                                                    {isActive && (
                                                        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-orange-500" />
                                                    )}
                                                    <Icon className={`size-4 shrink-0 ${isActive ? "text-orange-500" : ""}`} />
                                                    <span className="hidden sm:block truncate">{item.label}</span>
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>

                                {/* User Profile Footer */}
                                <div className="pt-4 border-t border-zinc-900 flex items-center gap-2.5 px-1">
                                    <div className="size-7 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                        A
                                    </div>
                                    <div className="hidden sm:block truncate text-left">
                                        <div className="text-xs font-semibold text-zinc-200 truncate">alokhotta</div>
                                        <div className="text-[10px] text-zinc-500 truncate">alokhotta@gmail.com</div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 bg-[#050505] p-4 sm:p-6 overflow-y-auto max-h-140">
                                {/* ---------------- TAB 1: DASHBOARD ---------------- */}
                                {activeTab === "dashboard" && (
                                    <div className="space-y-6 animate-fadeIn duration-300">
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                                Welcome to Social AI
                                            </h3>
                                            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                                                Here's what is happening with your social accounts today.
                                            </p>
                                        </div>

                                        {/* Stat Cards Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                            {/* Card 1 */}
                                            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="size-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                                                        <Clock className="size-4" />
                                                    </div>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                                        +2 Today
                                                    </span>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="text-2xl sm:text-3xl font-black text-white">0</div>
                                                    <div className="text-xs text-zinc-400 mt-1 font-medium">Scheduled Posts</div>
                                                </div>
                                            </div>

                                            {/* Card 2 */}
                                            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="size-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                                                        <CheckCircle2 className="size-4" />
                                                    </div>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                                        All Time
                                                    </span>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="text-2xl sm:text-3xl font-black text-white">1</div>
                                                    <div className="text-xs text-zinc-400 mt-1 font-medium">Published Posts</div>
                                                </div>
                                            </div>

                                            {/* Card 3 */}
                                            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="size-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                                                        <Share2 className="size-4" />
                                                    </div>
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                                        Active
                                                    </span>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="text-2xl sm:text-3xl font-black text-white">0</div>
                                                    <div className="text-xs text-zinc-400 mt-1 font-medium">Connected Accounts</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Activity Card */}
                                        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-sm font-bold text-white">Recent Activity</h4>
                                                <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-md font-mono">1 events</span>
                                            </div>

                                            <div className="bg-black/60 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                                                        <Send className="size-4" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">Published</span>
                                                            <span className="text-xs font-medium text-zinc-200">Published post to linkedin</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-zinc-500 shrink-0 font-mono">7/29/2026, 2:20:05 PM</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ---------------- TAB 2: SCHEDULER ---------------- */}
                                {activeTab === "scheduler" && (
                                    <div className="space-y-5 animate-fadeIn duration-300">
                                        <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-white">Post Scheduler</h3>
                                                <p className="text-xs text-zinc-400">Manage and automate your social presence</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
                                                <button className="px-3 py-1 rounded-lg bg-zinc-800 text-white font-semibold flex items-center gap-1.5 shadow-xs">
                                                    <Plus className="size-3.5" />
                                                    <span>Create Post</span>
                                                </button>
                                                <button className="px-3 py-1 rounded-lg text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                                                    <span>Post History</span>
                                                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full">1</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Compose Post Card Container */}
                                        <div className="max-w-2xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl">
                                            <h4 className="text-base font-bold text-white mb-1">Compose Post</h4>
                                            <p className="text-xs text-zinc-400 mb-4">Create and schedule content across your connected platforms</p>

                                            <div className="space-y-4">
                                                {/* Platforms pills */}
                                                <div>
                                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Platforms</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[
                                                            { id: "twitter", name: "Twitter / X", icon: TwitterXIcon },
                                                            { id: "linkedin", name: "LinkedIn", icon: LinkedInIcon },
                                                            { id: "facebook", name: "Facebook", icon: FacebookIcon },
                                                            { id: "instagram", name: "Instagram", icon: InstagramIcon },
                                                        ].map((p) => {
                                                            const Icon = p.icon;
                                                            const isSelected = selectedPlatforms.includes(p.id);
                                                            return (
                                                                <button
                                                                    key={p.id}
                                                                    onClick={() => togglePlatform(p.id)}
                                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                                                        isSelected
                                                                            ? "bg-orange-500/20 border-orange-500 text-orange-400 shadow-xs"
                                                                            : "bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                                                    }`}
                                                                >
                                                                    <Icon className="size-3.5" />
                                                                    <span>{p.name}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Content textarea */}
                                                <div>
                                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Content</label>
                                                    <div className="relative">
                                                        <textarea
                                                            rows={3}
                                                            placeholder="What do you want to share today?"
                                                            className="w-full bg-black/60 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/60 transition-colors resize-none"
                                                            defaultValue="🚀 Excited to announce our new AI social scheduling features! Simplify your workflow and boost engagement effortlessly. #SocialAI #TechLaunch"
                                                        />
                                                        <span className="absolute bottom-2.5 right-3 text-[10px] text-zinc-500 font-mono">132/280</span>
                                                    </div>
                                                </div>

                                                {/* Media Upload & Date/Time Row */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Media Attachments</label>
                                                        <div className="border border-dashed border-zinc-800 hover:border-orange-500/40 rounded-xl p-4 text-center bg-black/30 cursor-pointer transition-colors">
                                                            <UploadCloud className="size-5 text-zinc-500 mx-auto mb-1" />
                                                            <span className="text-[11px] text-zinc-400 font-medium block">Click to upload image or video</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Date</label>
                                                            <input
                                                                type="text"
                                                                defaultValue="08/15/2026"
                                                                className="w-full bg-black/60 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Time</label>
                                                            <input
                                                                type="text"
                                                                defaultValue="09:00 AM"
                                                                className="w-full bg-black/60 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Submit Button */}
                                                <button className="w-full mt-2 bg-linear-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all">
                                                    <span>Schedule Post</span>
                                                    <ArrowRight className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ---------------- TAB 3: ACCOUNTS ---------------- */}
                                {activeTab === "accounts" && (
                                    <div className="space-y-5 animate-fadeIn duration-300">
                                        <div className="pb-2 border-b border-zinc-900">
                                            <h3 className="text-base sm:text-lg font-bold text-white">Social Accounts</h3>
                                            <p className="text-xs text-zinc-400">Manage and automate your social presence</p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-1">Channels & Accounts</h4>
                                            <p className="text-xs text-zinc-400 mb-4">Connect your social media accounts to start scheduling posts (0 of 4 connected)</p>

                                            <div className="space-y-3">
                                                {[
                                                    { name: "Facebook", desc: "Manage your pages and profile", icon: FacebookIcon, color: "bg-[#1877F2]" },
                                                    { name: "Instagram", desc: "Share photos, reels and stories", icon: InstagramIcon, color: "bg-gradient-to-tr from-amber-500 to-pink-500" },
                                                    { name: "LinkedIn", desc: "Publish to your profile & company pages", icon: LinkedInIcon, color: "bg-[#0A66C2]" },
                                                    { name: "Twitter / X", desc: "Post tweets, threads, and media", icon: TwitterXIcon, color: "bg-black border border-zinc-700" },
                                                ].map((acc) => {
                                                    const Icon = acc.icon;
                                                    return (
                                                        <div
                                                            key={acc.name}
                                                            className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`size-10 rounded-xl ${acc.color} text-white p-2.5 flex items-center justify-center shadow-md`}>
                                                                    <Icon className="size-5" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="text-xs sm:text-sm font-bold text-white">{acc.name}</h5>
                                                                    <p className="text-[11px] text-zinc-400">{acc.desc}</p>
                                                                </div>
                                                            </div>
                                                            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-colors">
                                                                <Plus className="size-3.5" />
                                                                <span>Connect</span>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ---------------- TAB 4: AI COMPOSER ---------------- */}
                                {activeTab === "composer" && (
                                    <div className="space-y-6 animate-fadeIn duration-300">
                                        {/* Header */}
                                        <div className="text-center py-1">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-orange-500/15 via-amber-500/10 to-rose-500/15 border border-orange-500/30 text-orange-400 text-[11px] font-bold tracking-wider uppercase mb-2 shadow-sm shadow-orange-500/10">
                                                <Sparkles className="size-3.5 text-orange-400 fill-orange-400" />
                                                <span>Next-Gen AI Content Studio</span>
                                            </div>
                                            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                                                What should we <span className="bg-linear-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-transparent italic">create today?</span>
                                            </h3>
                                        </div>

                                        {/* Ultra-Premium AI Input Form Card */}
                                        <div className="max-w-2xl mx-auto bg-linear-to-b from-zinc-900/95 via-[#0c0c0e] to-zinc-950/95 border border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(249,115,22,0.15)] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/20 transition-all duration-500" />

                                            <textarea
                                                rows={3}
                                                placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)"
                                                className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none resize-none font-medium leading-relaxed"
                                                defaultValue="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)"
                                            />

                                            <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <button className="bg-black/70 border border-zinc-800 hover:border-zinc-700 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer">
                                                            <span>Professional</span>
                                                            <ChevronDown className="size-3 text-zinc-400" />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-zinc-800/80">
                                                        <span className="text-xs text-zinc-300 font-semibold">AI Image</span>
                                                        <div className="w-8 h-4 rounded-full bg-linear-to-r from-red-600 to-orange-500 p-0.5 flex items-center justify-end cursor-pointer shadow-xs">
                                                            <div className="size-3 rounded-full bg-white shadow-md" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <button className="bg-linear-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                                                    <Sparkles className="size-3.5 fill-white text-white" />
                                                    <span>Generate</span>
                                                    <ArrowRight className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Recent Generations Cards Section */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3.5">
                                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    <Clock className="size-3.5 text-orange-400" />
                                                    <span>Recent AI Generations</span>
                                                </h4>
                                                <span className="text-[10px] text-zinc-400 bg-zinc-800/90 px-2.5 py-0.5 rounded-full font-mono border border-zinc-700/60">
                                                    2 total
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                {/* Card 1 */}
                                                <div className="bg-linear-to-b from-zinc-900/90 via-black to-zinc-950/90 border border-zinc-800/90 hover:border-orange-500/40 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 group">
                                                    <div>
                                                        <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2 font-mono">
                                                            <span>8/4/2026</span>
                                                            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full font-bold">
                                                                Professional
                                                            </span>
                                                        </div>
                                                        <h5 className="text-xs font-bold text-zinc-100 line-clamp-2 mb-3 group-hover:text-orange-400 transition-colors leading-snug">
                                                            🚀 Comprehensive Guide & Deep Dive: The Ultimate Fitness Brand Masterclass...
                                                        </h5>

                                                        <div className="h-28 rounded-xl bg-linear-to-br from-indigo-950 via-purple-950 to-slate-950 border border-zinc-800 flex flex-col items-center justify-center text-center p-3 mb-3.5 relative overflow-hidden group-hover:border-purple-500/40 transition-colors">
                                                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)]" />
                                                            <span className="relative text-[10px] font-black text-purple-200 tracking-widest uppercase drop-shadow-md border border-purple-500/30 px-3 py-1 rounded-lg bg-purple-950/40">
                                                                Fitness Brand Masterclass
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button className="w-full bg-zinc-800/80 hover:bg-linear-to-r hover:from-orange-500 hover:to-amber-500 text-zinc-200 hover:text-white font-bold text-[11px] py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                                                        <Calendar className="size-3.5" />
                                                        <span>Schedule Post</span>
                                                    </button>
                                                </div>

                                                {/* Card 2 */}
                                                <div className="bg-linear-to-b from-zinc-900/90 via-black to-zinc-950/90 border border-zinc-800/90 hover:border-orange-500/40 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 group">
                                                    <div>
                                                        <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2 font-mono">
                                                            <span>7/29/2026</span>
                                                            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full font-bold">
                                                                Professional
                                                            </span>
                                                        </div>
                                                        <h5 className="text-xs font-bold text-zinc-100 line-clamp-2 mb-3 group-hover:text-orange-400 transition-colors leading-snug">
                                                            ⚡ Key insights on The advantages of transformers architecture: 1. Built with...
                                                        </h5>

                                                        <div className="h-28 rounded-xl bg-linear-to-br from-slate-950 via-zinc-900 to-orange-950/40 border border-zinc-800 flex flex-col items-center justify-center text-center p-3 mb-3.5 relative overflow-hidden group-hover:border-orange-500/40 transition-colors">
                                                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.15)_0%,transparent_70%)]" />
                                                            <Sparkles className="size-6 text-orange-400 mb-1 animate-pulse" />
                                                            <span className="relative text-[10px] font-black text-orange-200 tracking-wider uppercase">
                                                                Transformers Architecture
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button className="w-full bg-zinc-800/80 hover:bg-linear-to-r hover:from-orange-500 hover:to-amber-500 text-zinc-200 hover:text-white font-bold text-[11px] py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                                                        <Calendar className="size-3.5" />
                                                        <span>Schedule Post</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ---------------- TAB 5: IDEAS HUB ---------------- */}
                                {activeTab === "ideas" && (
                                    <div className="space-y-5 animate-fadeIn duration-300">
                                        <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                                    <span>Content Ideas Hub</span>
                                                    <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold">
                                                        5 Active Ideas
                                                    </span>
                                                </h3>
                                                <p className="text-xs text-zinc-400">Brainstorm, organize, generate with AI, and schedule posts.</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                                                    <Sparkles className="size-3.5 text-emerald-400" />
                                                    <span className="hidden sm:inline">AI Brainstorm</span>
                                                </button>
                                                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1">
                                                    <Plus className="size-3.5" />
                                                    <span>New Idea</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Kanban Columns */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                            {/* Column 1: Backlog */}
                                            <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-3">
                                                <div className="flex items-center justify-between mb-3 px-1">
                                                    <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                                                        <span className="size-2 rounded-full bg-blue-500" />
                                                        Backlog
                                                    </span>
                                                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-mono">3</span>
                                                </div>

                                                <div className="space-y-2.5">
                                                    <div className="bg-zinc-900 border border-zinc-800/90 rounded-xl p-3 shadow-xs">
                                                        <h5 className="text-xs font-bold text-zinc-200 mb-1 leading-snug">
                                                            The Ultimate SaaS Product Masterclass for Every One
                                                        </h5>
                                                        <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                                                            A comprehensive guide outlining how Every One can maximize efficiency...
                                                        </p>
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Guide</span>
                                                            <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Growth</span>
                                                            <span className="text-[9px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded">AI Generated</span>
                                                        </div>
                                                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                                                            <GripVertical className="size-3.5 text-zinc-600" />
                                                            <span className="text-[10px] font-bold text-orange-400 flex items-center gap-1 cursor-pointer">
                                                                Compose <ArrowRight className="size-2.5" />
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-zinc-900 border border-zinc-800/90 rounded-xl p-3 shadow-xs">
                                                        <h5 className="text-xs font-bold text-zinc-200 mb-1 leading-snug">
                                                            How SaaS Productivity Tool Solves Top Pain Points
                                                        </h5>
                                                        <p className="text-[11px] text-zinc-400 line-clamp-1 mb-2">
                                                            An engaging educational carousel...
                                                        </p>
                                                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                                                            <GripVertical className="size-3.5 text-zinc-600" />
                                                            <span className="text-[10px] font-bold text-orange-400 flex items-center gap-1 cursor-pointer">
                                                                Compose <ArrowRight className="size-2.5" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Column 2: In Progress */}
                                            <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-3">
                                                <div className="flex items-center justify-between mb-3 px-1">
                                                    <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                                                        <span className="size-2 rounded-full bg-amber-500" />
                                                        In Progress
                                                    </span>
                                                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-mono">1</span>
                                                </div>

                                                <div className="bg-zinc-900 border border-zinc-800/90 rounded-xl p-3 shadow-xs">
                                                    <h5 className="text-xs font-bold text-zinc-200 mb-1 leading-snug">
                                                        Behind-the-Scenes: A Day in the Life with E-Commerce
                                                    </h5>
                                                    <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                                                        Authentic storytelling post demonstrating value, values...
                                                    </p>
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Storytelling</span>
                                                        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Brand</span>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                                                        <GripVertical className="size-3.5 text-zinc-600" />
                                                        <span className="text-[10px] font-bold text-orange-400 flex items-center gap-1 cursor-pointer">
                                                            Compose <ArrowRight className="size-2.5" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Column 3: Ready to Post */}
                                            <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-3">
                                                <div className="flex items-center justify-between mb-3 px-1">
                                                    <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                                                        <span className="size-2 rounded-full bg-emerald-500" />
                                                        Ready to Post
                                                    </span>
                                                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-mono">1</span>
                                                </div>

                                                <div className="bg-zinc-900 border border-zinc-800/90 rounded-xl p-3 shadow-xs">
                                                    <h5 className="text-xs font-bold text-zinc-200 mb-1 leading-snug">
                                                        The Ultimate Fitness Brand Masterclass for Remote Devs
                                                    </h5>
                                                    <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                                                        A comprehensive guide outlining how Remote Developers can...
                                                    </p>
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Guide</span>
                                                        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Growth</span>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                                                        <GripVertical className="size-3.5 text-zinc-600" />
                                                        <span className="text-[10px] font-bold text-orange-400 flex items-center gap-1 cursor-pointer">
                                                            Compose <ArrowRight className="size-2.5" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

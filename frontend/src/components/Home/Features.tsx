import { Zap, Sparkles, Check, ChevronDown, TrendingUp, Share2 } from "lucide-react";

function InstagramIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function FacebookIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function TikTokIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.74V16a7 7 0 1 1-7-7c.34 0 .67.03 1 .08V12z" />
        </svg>
    );
}

function LinkedInIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
        </svg>
    );
}

function TwitterXIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function YouTubeIcon({ className = "size-3.5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

export default function Features() {
    return (
        <section id="features" className="py-24 bg-slate-50/70 dark:bg-black transition-colors overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="mb-4 inline-flex items-center gap-1.5 bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-sm">
                        <Zap className="size-3.5 text-orange-500 fill-orange-500" />
                        Everything you need
                    </div>
                    <h2 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight text-slate-900 dark:text-white">
                        Automate your entire{" "}
                        <span className="text-orange-500 italic">social media workflow</span>
                    </h2>
                    <p className="mt-4 text-slate-600 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                        From content creation to scheduling — Social AI handles it all so you can focus on growing your brand.
                    </p>
                </div>

                {/* 2x2 Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Card 1: Smart Scheduling */}
                    <div className="group relative bg-linear-to-b from-orange-500/3 to-slate-50/50 dark:from-orange-500/10 dark:to-zinc-950/80 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/30 dark:hover:border-orange-500/40 transition-all duration-300">
                        {/* Text Top-Left */}
                        <div className="mb-6 z-10">
                            <h3 className="text-slate-900 dark:text-white text-xl sm:text-2xl font-semibold tracking-tight">Smart Scheduling</h3>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Post at the best times for maximum reach</p>
                        </div>

                        {/* Graphic Area */}
                        <div className="relative w-full h-55 sm:h-60 flex items-center justify-center pt-2">
                            {/* Schedule Content Form Mock */}
                            <div className="w-[88%] sm:w-[80%] max-w-77.5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800/90 shadow-md p-4 sm:p-5 transform -translate-x-3 translate-y-3 group-hover:scale-[1.02] transition-transform duration-300">
                                <h4 className="text-slate-800 dark:text-zinc-100 font-bold text-sm sm:text-base mb-3">Schedule Content</h4>
                                <div className="space-y-2.5 text-xs">
                                    <div>
                                        <label className="block text-[10px] font-medium text-slate-400 dark:text-zinc-500 mb-1 uppercase tracking-wider">Content Type</label>
                                        <div className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 rounded-lg px-3 py-1.5 text-slate-700 dark:text-zinc-200 font-medium">
                                            Carousel
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-slate-400 dark:text-zinc-500 mb-1 uppercase tracking-wider">Campaign</label>
                                        <div className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 rounded-lg px-3 py-1.5 text-slate-400 dark:text-zinc-400 flex items-center justify-between">
                                            <span>Select Campaign</span>
                                            <ChevronDown className="size-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-slate-400 dark:text-zinc-500 mb-1 uppercase tracking-wider">Caption</label>
                                        <div className="w-full bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 rounded-lg px-3 py-1.5 text-slate-400 dark:text-zinc-500">
                                            Add Description
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badges */}
                            {/* Top Badge: Scheduled at 09:00 AM */}
                            <div className="absolute top-1 right-2 sm:right-6 bg-white dark:bg-zinc-900 border border-orange-300 dark:border-orange-500/60 text-orange-600 dark:text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/10 flex items-center gap-1.5 backdrop-blur-md group-hover:-translate-y-1 transition-transform duration-300">
                                <span className="text-slate-600 dark:text-zinc-300">Scheduled at 09:00 AM</span>
                                <div className="size-4 rounded-full border border-orange-500 text-orange-500 flex items-center justify-center">
                                    <Check className="size-2.5 stroke-3" />
                                </div>
                            </div>

                            {/* Middle Badge: Scheduled Success */}
                            <div className="absolute top-[40%] right-4 sm:right-10 bg-white dark:bg-zinc-900 border border-orange-300 dark:border-orange-500/60 text-orange-600 dark:text-orange-400 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg shadow-orange-500/10 flex items-center gap-1.5 backdrop-blur-md group-hover:translate-x-1 transition-transform duration-300">
                                <span>Scheduled Success</span>
                                <div className="size-4 rounded-full bg-orange-500 text-white flex items-center justify-center">
                                    <Check className="size-2.5 stroke-3" />
                                </div>
                            </div>

                            {/* Floating Social Icons */}
                            <div className="absolute bottom-6 left-12 bg-linear-to-tr from-amber-500 to-pink-500 p-1.5 rounded-xl shadow-md text-white group-hover:rotate-6 transition-transform">
                                <InstagramIcon className="size-3.5" />
                            </div>
                            <div className="absolute bottom-2 right-24 bg-black dark:bg-zinc-800 p-1.5 rounded-xl shadow-md text-white border border-zinc-700 group-hover:-rotate-6 transition-transform">
                                <TikTokIcon className="size-3.5" />
                            </div>
                            <div className="absolute bottom-10 right-4 bg-blue-600 p-1.5 rounded-xl shadow-md text-white group-hover:scale-110 transition-transform">
                                <FacebookIcon className="size-3.5" />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Deep Analytics */}
                    <div className="group relative bg-linear-to-b from-orange-500/3 to-slate-50/50 dark:from-orange-500/10 dark:to-zinc-950/80 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/30 dark:hover:border-orange-500/40 transition-all duration-300">
                        {/* Text Top-Left */}
                        <div className="mb-6 z-10">
                            <h3 className="text-slate-900 dark:text-white text-xl sm:text-2xl font-semibold tracking-tight">Deep Analytics</h3>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Track performance & audience insights</p>
                        </div>

                        {/* Chart Graphic Area */}
                        <div className="relative w-full h-55 sm:h-60 flex items-end justify-center pb-2">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 180" fill="none">
                                <defs>
                                    <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>

                                {/* Area Fill */}
                                <path
                                    d="M 10 140 L 60 115 L 100 135 L 150 70 L 190 100 L 260 55 L 290 20 L 330 35 L 390 15 L 390 170 L 10 170 Z"
                                    fill="url(#analyticsGradient)"
                                />

                                {/* Main Line */}
                                <path
                                    d="M 10 140 L 60 115 L 100 135 L 150 70 L 190 100 L 260 55 L 290 20 L 330 35 L 390 15"
                                    stroke="#f97316"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="drop-shadow-[0_4px_10px_rgba(249,115,22,0.4)]"
                                />

                                {/* Peak Dot Glow */}
                                <circle cx="260" cy="55" r="5" fill="#f97316" className="animate-pulse" />
                                <circle cx="260" cy="55" r="9" stroke="#f97316" strokeWidth="2" strokeOpacity="0.5" />
                            </svg>

                            {/* Floating Pill Badge: +40% growth */}
                            <div className="absolute top-[32%] right-[22%] sm:right-[26%] bg-orange-500 text-white font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-2xl shadow-lg shadow-orange-500/40 flex items-center gap-1.5 transform group-hover:scale-105 transition-all duration-300">
                                <TrendingUp className="size-3.5 stroke-[2.5]" />
                                <span>+40% growth</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Multi-Platform Sync */}
                    <div className="group relative bg-linear-to-b from-orange-500/3 to-slate-50/50 dark:from-orange-500/10 dark:to-zinc-950/80 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/30 dark:hover:border-orange-500/40 transition-all duration-300">
                        {/* Social Media Cluster Graphic Area */}
                        <div className="relative w-full h-55 sm:h-60 flex items-center justify-center">
                            {/* Ambient Glows */}
                            <div className="absolute size-44 rounded-full bg-orange-500/10 dark:bg-orange-500/15 blur-xl" />
                            <div className="absolute top-4 right-10 size-24 rounded-full bg-amber-400/5 blur-lg" />

                            {/* Connecting Dotted Ring */}
                            <div className="absolute size-40 rounded-full border-2 border-dashed border-orange-400/20 dark:border-orange-500/20 animate-[spin_40s_linear_infinite]" />

                            {/* Top Left: Instagram */}
                            <div className="absolute top-3 left-14 sm:left-18 size-12 sm:size-13 rounded-2xl bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white p-2.5 shadow-lg shadow-rose-500/20 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                <InstagramIcon className="size-6" />
                            </div>

                            {/* Top Right: LinkedIn */}
                            <div className="absolute top-4 right-16 sm:right-20 size-11 sm:size-12 rounded-2xl bg-[#0A66C2] text-white p-2.5 shadow-lg shadow-blue-500/20 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                                <LinkedInIcon className="size-5" />
                            </div>

                            {/* Center Main Hub Badge */}
                            <div className="relative size-24 sm:size-28 rounded-full bg-linear-to-tr from-orange-500 to-amber-500 text-white ring-4 ring-orange-500/20 dark:ring-orange-500/30 p-1 shadow-2xl z-10 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <div className="size-full rounded-full bg-linear-to-br from-orange-500 to-amber-600 flex flex-col items-center justify-center gap-1 border border-white/20">
                                    <Share2 className="size-7 stroke-[2.2]" />
                                    <span className="text-[10px] font-bold tracking-wider uppercase">Social Hub</span>
                                </div>
                            </div>

                            {/* Middle Right: Twitter / X */}
                            <div className="absolute top-1/2 -translate-y-1/2 right-6 sm:right-10 size-11 sm:size-12 rounded-2xl bg-black dark:bg-zinc-800 text-white border border-zinc-700/80 p-2.5 shadow-lg flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                <TwitterXIcon className="size-5" />
                            </div>

                            {/* Bottom Right: YouTube */}
                            <div className="absolute bottom-4 right-14 sm:right-18 size-12 sm:size-13 rounded-2xl bg-[#FF0000] text-white p-2.5 shadow-lg shadow-red-500/20 flex items-center justify-center group-hover:translate-y-1 transition-transform">
                                <YouTubeIcon className="size-6" />
                            </div>

                            {/* Bottom Left: TikTok */}
                            <div className="absolute bottom-5 left-16 sm:left-20 size-11 sm:size-12 rounded-2xl bg-black dark:bg-zinc-800 text-white border border-zinc-700/80 p-2.5 shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                <TikTokIcon className="size-5" />
                            </div>

                            {/* Far Left: Facebook */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-10 size-11 sm:size-12 rounded-2xl bg-[#1877F2] text-white p-2.5 shadow-lg shadow-blue-500/20 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                                <FacebookIcon className="size-5" />
                            </div>
                        </div>

                        {/* Text Bottom-Right */}
                        <div className="mt-6 text-right z-10">
                            <h3 className="text-slate-900 dark:text-white text-xl sm:text-2xl font-semibold tracking-tight">Multi-Platform Sync</h3>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Publish and manage all your accounts in one unified place.</p>
                        </div>
                    </div>

                    {/* Card 4: Content Ideas */}
                    <div className="group relative bg-linear-to-b from-orange-500/3 to-slate-50/50 dark:from-orange-500/10 dark:to-zinc-950/80 bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/30 dark:hover:border-orange-500/40 transition-all duration-300">
                        {/* Prompt Bubble Graphic Area */}
                        <div className="relative w-full h-55 sm:h-60 flex items-center justify-center">
                            {/* Layered Card Backdrops */}
                            <div className="absolute top-2 left-6 right-6 h-28 bg-slate-200/40 dark:bg-zinc-800/30 rounded-2xl transform -rotate-1" />
                            <div className="absolute top-6 left-10 right-10 h-24 bg-orange-100/30 dark:bg-orange-950/20 rounded-2xl transform rotate-1" />

                            {/* Main Chat/Prompt Bubble Card */}
                            <div className="relative w-[92%] sm:w-[88%] bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl transition-transform duration-300 group-hover:-translate-y-1">
                                <p className="text-slate-700 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed font-medium">
                                    Please help me to make a catchy caption for the grand opening of my new dimsum stall, highlighting freshness, taste, and inviting people to visit.
                                </p>

                                {/* Action Pill Button at Bottom Right */}
                                <div className="mt-4 flex justify-end">
                                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-1.5 cursor-pointer transform hover:scale-105 transition-all duration-200">
                                        <Sparkles className="size-3.5 fill-white text-white" />
                                        <span>Generate With AI</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Text Bottom-Right */}
                        <div className="mt-6 text-right z-10">
                            <h3 className="text-slate-900 dark:text-white text-xl sm:text-2xl font-semibold tracking-tight">Content Ideas</h3>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">AI-assisted captions & hashtag suggestions</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}



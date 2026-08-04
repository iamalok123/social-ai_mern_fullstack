import { Sparkles, Link as LinkIcon, Plus, CheckCircle2, Calendar, Image as ImageIcon, TrendingUp } from "lucide-react";

// Platform Icon Components
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

function TikTokIcon({ className = "size-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.74V16a7 7 0 1 1-7-7c.34 0 .67.03 1 .08V12z" />
        </svg>
    );
}

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 sm:py-28 bg-white dark:bg-black transition-colors duration-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
                    {/* How It Works Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-medium mb-5">
                        <Sparkles className="size-3.5 text-orange-500" />
                        <span>How It Works</span>
                    </div>

                    {/* Main Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-slate-900 dark:text-white leading-tight">
                        Manage Smarter in 3 Easy Steps
                    </h2>

                    {/* Description */}
                    <p className="mt-4 text-slate-500 dark:text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        Connect, Schedule, and track your content effortlessly—so you can focus on growing your audience.
                    </p>
                </div>

                {/* 3-Step Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-8 lg:gap-10">
                    
                    {/* CARD 1: Connect Accounts */}
                    <div className="group flex flex-col">
                        {/* Visual Container */}
                        <div className="relative w-full h-67.5 sm:h-72.5 rounded-3xl bg-linear-to-b from-orange-500/10 via-amber-500/5 to-slate-50/60 dark:from-orange-500/15 dark:via-zinc-900/80 dark:to-zinc-950/90 border border-slate-200/80 dark:border-zinc-800/80 p-6 flex items-center justify-center overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-500/30 transition-all duration-300">
                            
                            {/* Ambient Radial Glow */}
                            <div className="absolute size-44 rounded-full bg-orange-500/15 dark:bg-orange-500/20 blur-2xl pointer-events-none" />

                            {/* Top Left: TikTok Icon */}
                            <div className="absolute top-8 left-10 sm:left-12 size-11 sm:size-12 rounded-2xl bg-black text-white p-2.5 shadow-lg shadow-black/20 flex items-center justify-center transform -rotate-12 group-hover:-translate-y-1.5 transition-transform duration-300">
                                <TikTokIcon className="size-6" />
                            </div>

                            {/* Top Center: Facebook Icon */}
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 size-11 sm:size-12 rounded-2xl bg-blue-600 text-white p-2.5 shadow-lg shadow-blue-600/20 flex items-center justify-center transform translate-y-1 group-hover:-translate-y-1 transition-transform duration-300">
                                <FacebookIcon className="size-6" />
                            </div>

                            {/* Top Right: Instagram Icon */}
                            <div className="absolute top-8 right-10 sm:right-12 size-11 sm:size-12 rounded-2xl bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white p-2.5 shadow-lg shadow-rose-500/20 flex items-center justify-center transform rotate-12 group-hover:-translate-y-1.5 transition-transform duration-300">
                                <InstagramIcon className="size-6" />
                            </div>

                            {/* Center Main Hub Connected Button */}
                            <div className="relative size-20 sm:size-22 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 text-white p-4 shadow-2xl ring-8 ring-orange-500/20 dark:ring-orange-500/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 z-10">
                                <LinkIcon className="size-8 stroke-[2.2]" />
                            </div>

                            {/* Overlay Badge at Bottom Center */}
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 shrink-0">
                                <div className="bg-white dark:bg-zinc-900 border border-orange-500/30 dark:border-orange-500/40 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full shadow-lg shadow-orange-500/10 flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap">
                                    <span>Account Connected</span>
                                    <CheckCircle2 className="size-4 fill-orange-500 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Text Header & Subtitle */}
                        <div className="mt-6 text-center">
                            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                Connect Accounts
                            </h3>
                            <p className="mt-1.5 text-slate-500 dark:text-zinc-400 text-sm sm:text-base">
                                Link your social media profiles in seconds
                            </p>
                        </div>
                    </div>

                    {/* CARD 2: Plan & Schedule */}
                    <div className="group flex flex-col">
                        {/* Visual Container */}
                        <div className="relative w-full h-67.5 sm:h-72.5 rounded-3xl bg-linear-to-b from-orange-500/10 via-amber-500/5 to-slate-50/60 dark:from-orange-500/15 dark:via-zinc-900/80 dark:to-zinc-950/90 border border-slate-200/80 dark:border-zinc-800/80 p-4 sm:p-5 flex items-start justify-center overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-500/30 transition-all duration-300">
                            
                            {/* Mock Calendar Window UI */}
                            <div className="w-full bg-white dark:bg-zinc-900/90 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-3.5 sm:p-4 shadow-sm transform group-hover:-translate-y-1 transition-transform duration-300">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Creator Post Schedule</h4>
                                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">8 posts scheduled</p>
                                    </div>
                                    <div className="px-2.5 py-1 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-semibold flex items-center gap-1">
                                        <Plus className="size-3" />
                                        <span>Add Schedule</span>
                                    </div>
                                </div>

                                {/* Timeline Schedule List */}
                                <div className="mt-3 space-y-2 text-[10px] sm:text-xs">
                                    {/* Slot 1 */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 dark:text-zinc-500 font-mono text-[10px]">09:15</span>
                                        <div className="h-px flex-1 bg-slate-100 dark:bg-zinc-800" />
                                    </div>

                                    {/* Schedule Item 1 */}
                                    <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="size-7 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                                                <ImageIcon className="size-3.5" />
                                            </div>
                                            <div className="truncate">
                                                <p className="font-semibold text-slate-900 dark:text-zinc-200 truncate">Skincare Reel for New Vitamin C...</p>
                                                <p className="text-[9px] text-slate-500 dark:text-zinc-400">Jane Doe · Instagram, TikTok</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400 shrink-0 ml-1">09:30</span>
                                    </div>

                                    {/* Slot 2 */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 dark:text-zinc-500 font-mono text-[10px]">09:45</span>
                                        <div className="h-px flex-1 bg-slate-100 dark:bg-zinc-800" />
                                    </div>

                                    {/* Schedule Item 2 */}
                                    <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/50 rounded-xl p-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="size-7 rounded-lg bg-slate-200/60 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                                                <Calendar className="size-3.5" />
                                            </div>
                                            <p className="font-medium text-slate-800 dark:text-zinc-300 truncate">Protein Bar, Endorsement</p>
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 shrink-0 ml-1">09:55</span>
                                    </div>
                                </div>
                            </div>

                            {/* Overlay Badge at Bottom Center */}
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 shrink-0">
                                <div className="bg-orange-500 text-white px-5 py-2 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap">
                                    <span>Yay! Content Scheduled</span>
                                </div>
                            </div>
                        </div>

                        {/* Text Header & Subtitle */}
                        <div className="mt-6 text-center">
                            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                Plan & Schedule
                            </h3>
                            <p className="mt-1.5 text-slate-500 dark:text-zinc-400 text-sm sm:text-base">
                                Organize posts with our intuitive calendar
                            </p>
                        </div>
                    </div>

                    {/* CARD 3: Analyze & Improve */}
                    <div className="group flex flex-col">
                        {/* Visual Container */}
                        <div className="relative w-full h-67.5 sm:h-72.5 rounded-3xl bg-linear-to-b from-orange-500/10 via-amber-500/5 to-slate-50/60 dark:from-orange-500/15 dark:via-zinc-900/80 dark:to-zinc-950/90 border border-slate-200/80 dark:border-zinc-800/80 p-4 sm:p-5 flex items-center justify-center overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-500/30 transition-all duration-300">
                            
                            {/* Layer 1 (Back Card): Demographics Bar Chart */}
                            <div className="absolute top-5 left-4 right-10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xs rounded-2xl border border-slate-200/70 dark:border-zinc-800 p-3 shadow-xs transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-800 dark:text-zinc-300">Know Who's Following You?</span>
                                    <span className="text-[9px] text-slate-400 dark:text-zinc-500">Visit Distribution</span>
                                </div>
                                {/* Bar chart mock lines */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[9px] text-slate-400">
                                        <span className="w-6">35-44</span>
                                        <div className="h-2 rounded-full bg-orange-500/80 w-3/4" />
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] text-slate-400">
                                        <span className="w-6">25-34</span>
                                        <div className="h-2 rounded-full bg-orange-500 w-full" />
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] text-slate-400">
                                        <span className="w-6">18-24</span>
                                        <div className="h-2 rounded-full bg-orange-400/70 w-1/2" />
                                    </div>
                                </div>
                            </div>

                            {/* Layer 2 (Front Card): Performance Radar Graphic */}
                            <div className="relative z-10 top-4 left-3 w-[88%] bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-3.5 shadow-lg transform group-hover:scale-[1.02] transition-transform duration-300">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">Content Performance Distribution</span>
                                    <TrendingUp className="size-3.5 text-orange-500" />
                                </div>

                                {/* Radar / Spider Graph SVG */}
                                <div className="relative h-28 w-full flex items-center justify-center">
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 200 110">
                                        {/* Background Web Polygons */}
                                        <polygon points="100,10 160,35 160,85 100,105 40,85 40,35" fill="none" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" strokeWidth="1" />
                                        <polygon points="100,25 145,43 145,77 100,90 55,77 55,43" fill="none" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" strokeWidth="1" />
                                        <polygon points="100,40 130,52 130,70 100,75 70,70 70,52" fill="none" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" strokeWidth="1" />

                                        {/* Web Axis Lines */}
                                        <line x1="100" y1="10" x2="100" y2="105" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" strokeWidth="1" />
                                        <line x1="40" y1="35" x2="160" y2="85" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" strokeWidth="1" />
                                        <line x1="40" y1="85" x2="160" y2="35" stroke="currentColor" className="text-slate-200 dark:text-zinc-800" strokeWidth="1" />

                                        {/* Active Data Area 1 (Orange Gradient) */}
                                        <polygon points="100,18 152,40 138,80 100,95 50,75 62,40" fill="rgba(249,115,22,0.25)" stroke="#f97316" strokeWidth="2" />
                                        
                                        {/* Active Data Area 2 (Purple Overlay) */}
                                        <polygon points="100,30 140,50 150,78 100,85 65,70 75,48" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />

                                        {/* Point Dots */}
                                        <circle cx="100" cy="18" r="3" fill="#f97316" />
                                        <circle cx="152" cy="40" r="3" fill="#f97316" />
                                        <circle cx="138" cy="80" r="3" fill="#f97316" />
                                        <circle cx="100" cy="95" r="3" fill="#f97316" />
                                        <circle cx="50" cy="75" r="3" fill="#f97316" />
                                        <circle cx="62" cy="40" r="3" fill="#f97316" />

                                        {/* Labels */}
                                        <text x="100" y="7" textAnchor="middle" className="text-[7px] fill-slate-400 dark:fill-zinc-500 font-medium">Feed</text>
                                        <text x="167" y="36" textAnchor="start" className="text-[7px] fill-slate-400 dark:fill-zinc-500 font-medium">Stories</text>
                                        <text x="167" y="87" textAnchor="start" className="text-[7px] fill-slate-400 dark:fill-zinc-500 font-medium">Live</text>
                                        <text x="100" y="112" textAnchor="middle" className="text-[7px] fill-slate-400 dark:fill-zinc-500 font-medium">Reels</text>
                                        <text x="32" y="87" textAnchor="end" className="text-[7px] fill-slate-400 dark:fill-zinc-500 font-medium">Engagement</text>
                                        <text x="32" y="36" textAnchor="end" className="text-[7px] fill-slate-400 dark:fill-zinc-500 font-medium">Ads</text>
                                    </svg>

                                    {/* Mini Legend Pill */}
                                    <div className="absolute bottom-1 right-1 bg-white/90 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded-md text-[8px] font-semibold text-slate-700 dark:text-zinc-200 shadow-2xs">
                                        <span className="text-orange-500 font-bold">5 Posts Published</span>
                                        <span className="block text-[7px] text-emerald-500 font-normal">+12% from last month</span>
                                    </div>
                                </div>
                            </div>

                            {/* Overlay Badge at Bottom Center */}
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 shrink-0">
                                <div className="bg-white dark:bg-zinc-900 border border-orange-500/30 dark:border-orange-500/40 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full shadow-lg shadow-orange-500/10 flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-tight whitespace-nowrap">
                                    <span>20% Account Reach</span>
                                </div>
                            </div>
                        </div>

                        {/* Text Header & Subtitle */}
                        <div className="mt-6 text-center">
                            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                Analyze & Improve
                            </h3>
                            <p className="mt-1.5 text-slate-500 dark:text-zinc-400 text-sm sm:text-base">
                                Optimize your content with real data
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

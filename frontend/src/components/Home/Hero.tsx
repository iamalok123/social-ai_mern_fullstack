import { Link } from "react-router-dom";
import { Zap, Play, Plus, ThumbsUp, Calendar, Image as ImageIcon, CheckCircle2 } from "lucide-react";

// Platform Icon Components
function InstagramIcon({ className = "size-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function FacebookIcon({ className = "size-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function TikTokIcon({ className = "size-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.74V16a7 7 0 1 1-7-7c.34 0 .67.03 1 .08V12z" />
        </svg>
    );
}

function LinkedInIcon({ className = "size-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
        </svg>
    );
}

function TwitterXIcon({ className = "size-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function YouTubeIcon({ className = "size-5" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

export default function Hero() {
    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden transition-colors duration-200 pt-28 sm:pt-32 md:pt-36 lg:pt-32 pb-16 lg:pb-24 bg-white dark:bg-black">
            
            {/* Edge-to-Edge Full Screen Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_100%_95%_at_50%_50%,#000_90%,transparent_100%)] pointer-events-none" />


            {/* Vivid Radial Orange Glow Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-362.5 h-162.5 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.35)_0%,rgba(249,115,22,0.12)_50%,transparent_75%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.48)_0%,rgba(249,115,22,0.18)_50%,transparent_75%)] pointer-events-none blur-3xl" />

            {/* Floating Ambient Glowing Particles */}
            <div className="absolute top-28 left-[8%] size-3 rounded-full bg-orange-500/80 blur-xs animate-pulse pointer-events-none" />
            <div className="absolute top-44 right-[10%] size-3 rounded-full bg-amber-400/90 blur-xs animate-pulse pointer-events-none" />
            <div className="absolute bottom-16 left-[18%] size-2.5 rounded-full bg-orange-400/80 blur-2xs pointer-events-none" />

            {/* Main Responsive Container */}
            <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-55">
                    
                    {/* LEFT COLUMN: Content, Headline & CTAs */}
                    <div className="w-full lg:w-auto lg:max-w-xl text-center lg:text-left pt-2 lg:pt-0 shrink-0">
                        {/* Top Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-semibold mb-5 backdrop-blur-md shadow-xs">
                            <Zap className="size-3.5 fill-orange-500 text-orange-500" />
                            <span>From Planning to Publishing—All in One Place</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                            Manage All Your <br />
                            Social Media{" "}
                            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 dark:from-orange-400 dark:via-amber-400 dark:to-orange-500 inline-block drop-shadow-xs">
                                in One Place
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="mt-5 text-slate-600 dark:text-zinc-300 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
                            Plan, schedule, and analyze content with ease—boost your brand&apos;s presence without the overwhelm.
                        </p>

                        {/* Call to Action Buttons */}
                        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                            {/* Start Free Trial Button */}
                            <Link
                                to="/login"
                                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold px-7 py-3 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-white/10 hover:scale-[1.02] transition-all text-sm sm:text-base cursor-pointer text-center"
                            >
                                Start Free Trial
                            </Link>

                            {/* Watch Demo Button */}
                            <a
                                href="#how-it-works"
                                className="w-full sm:w-auto bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-7 py-3 rounded-2xl shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-all inline-flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                            >
                                <Play className="size-4 fill-white text-white" />
                                <span>Watch Demo</span>
                            </a>
                        </div>

                        {/* Trust Micro-Text */}
                        <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                <span>No credit card required</span>
                            </div>
                            <span className="hidden sm:inline text-slate-300 dark:text-zinc-700">•</span>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                                <span>7-Day free trial</span>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Schedule Card Wrapper with Attached Social Icons */}
                    <div className="w-full lg:w-auto relative flex items-center justify-center shrink-0">
                        
                        {/* Glow Aura directly behind Schedule Card */}
                        <div className="absolute inset-0 bg-linear-to-tr from-orange-500/35 via-amber-500/25 to-transparent blur-3xl rounded-full pointer-events-none" />

                        {/* SCHEDULE CARD RELATIVE CONTAINER */}
                        <div className="relative w-full max-w-md lg:max-w-lg">

                            {/* FLOATING SOCIAL ICONS TIGHTLY WRAPPED AROUND THE CARD */}

                            {/* 1. TOP-LEFT: Instagram + 10K Likes Badge */}
                            <div className="hidden sm:flex items-center gap-2 absolute -top-4 -left-3 lg:-left-5 z-30 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                                <div className="size-11 lg:size-12 rounded-2xl bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white p-2 shadow-xl shadow-rose-500/30 flex items-center justify-center">
                                    <InstagramIcon className="size-5" />
                                </div>
                                <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 px-3 py-1.5 rounded-2xl shadow-xl text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                                    <span>10K Likes</span>
                                    <ThumbsUp className="size-3.5 fill-orange-500 text-orange-500" />
                                </div>
                            </div>

                            {/* 2. TOP-RIGHT: TikTok Badge */}
                            <div className="hidden sm:flex items-center justify-center absolute -top-4 -right-2 lg:-right-4 z-30 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                                <div className="size-10 rounded-2xl bg-black text-white p-2 shadow-xl shadow-black/40 flex items-center justify-center border border-zinc-800">
                                    <TikTokIcon className="size-4.5" />
                                </div>
                            </div>

                            {/* 3. MIDDLE-RIGHT: LinkedIn Badge */}
                            <div className="hidden sm:flex items-center justify-center absolute top-1/2 -translate-y-1/2 -right-3 lg:-right-5 z-30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="size-10 rounded-2xl bg-blue-600 text-white p-2 shadow-xl shadow-blue-600/35 flex items-center justify-center">
                                    <LinkedInIcon className="size-4.5" />
                                </div>
                            </div>

                            {/* 4. BOTTOM-LEFT: YouTube Badge */}
                            <div className="hidden sm:flex items-center justify-center absolute -bottom-4 -left-2 lg:-left-4 z-30 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="size-10 rounded-2xl bg-red-600 text-white p-2 shadow-xl shadow-red-600/35 flex items-center justify-center">
                                    <YouTubeIcon className="size-4.5" />
                                </div>
                            </div>

                            {/* 5. BOTTOM-RIGHT: Twitter/X + Facebook + Follow Badge */}
                            <div className="hidden sm:flex flex-col items-end gap-1.5 absolute -bottom-4 -right-3 lg:-right-5 z-30 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                                <div className="flex items-center gap-1.5">
                                    <div className="size-9 rounded-2xl bg-slate-900 dark:bg-zinc-800 text-white p-2 shadow-xl flex items-center justify-center border border-slate-700 dark:border-zinc-700">
                                        <TwitterXIcon className="size-4" />
                                    </div>
                                    <div className="size-9 rounded-2xl bg-blue-500 text-white p-2 shadow-xl shadow-blue-500/30 flex items-center justify-center">
                                        <FacebookIcon className="size-4.5" />
                                    </div>
                                </div>
                                <div className="bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold px-3.5 py-1 rounded-2xl shadow-xl shadow-orange-500/30 flex items-center gap-1 text-xs cursor-pointer hover:scale-105 transition-transform">
                                    <span>Follow</span>
                                    <Plus className="size-3 stroke-3" />
                                </div>
                            </div>

                            {/* MAIN CENTER DASHBOARD SCHEDULE CARD */}
                            <div className="relative z-20 w-full bg-white dark:bg-zinc-900/95 rounded-3xl border border-slate-200/80 dark:border-zinc-800 p-5 sm:p-6 shadow-2xl shadow-orange-500/20 text-left transform hover:-translate-y-1 transition-transform duration-300 backdrop-blur-md">
                                
                                {/* Card Header */}
                                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-zinc-800/80">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                            Creator Post Schedule
                                        </h3>
                                        <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                                            8 posts scheduled
                                        </p>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold flex items-center gap-1.5">
                                        <Plus className="size-3.5" />
                                        <span>Add Schedule</span>
                                    </div>
                                </div>

                                {/* Schedule Timeline List */}
                                <div className="mt-3.5 space-y-2.5">
                                    {/* Time Slot 1 */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 dark:text-zinc-500 font-mono text-xs">09:15</span>
                                        <div className="h-px flex-1 bg-slate-100 dark:bg-zinc-800" />
                                    </div>

                                    {/* Scheduled Post Card 1 */}
                                    <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="size-8 sm:size-9 rounded-xl bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                                                <ImageIcon className="size-4" />
                                            </div>
                                            <div className="truncate">
                                                <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-zinc-200 truncate">
                                                    Skincare Reel for New Vitamin C...
                                                </h4>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                    Jane Doe · Instagram, TikTok
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 shrink-0 ml-2">
                                            09:30
                                        </span>
                                    </div>

                                    {/* Time Slot 2 */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 dark:text-zinc-500 font-mono text-xs">09:45</span>
                                        <div className="h-px flex-1 bg-slate-100 dark:bg-zinc-800" />
                                    </div>

                                    {/* Scheduled Post Card 2 */}
                                    <div className="bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/50 rounded-2xl p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="size-8 sm:size-9 rounded-xl bg-slate-200/60 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 flex items-center justify-center shrink-0">
                                                <Calendar className="size-4" />
                                            </div>
                                            <div className="truncate">
                                                <h4 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-zinc-300 truncate">
                                                    Protein Bar, Endorsement
                                                </h4>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                    Emily Erren · Instagram
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 shrink-0 ml-2">
                                            09:55
                                        </span>
                                    </div>
                                </div>

                                {/* Bottom Overlay Pill Badge */}
                                <div className="mt-4 text-center">
                                    <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-2xl border border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs sm:text-sm shadow-xs">
                                        <span>Yay! Content Scheduled</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

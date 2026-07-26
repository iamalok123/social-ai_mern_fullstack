import { Link } from "react-router-dom";
import { ArrowRightIcon, DotIcon } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden transition-colors">
            {/* Subtle grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[56px_56px] pointer-events-none" />

            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-140 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.28)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-12 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-orange-950/40 border border-red-100 dark:border-orange-900/50 text-red-500 dark:text-orange-400 text-sm px-3.5 py-1.5 rounded-full mb-8">
                    <span className="size-1.5 bg-red-400 dark:bg-orange-400 rounded-full" />
                    AI-Powered Social Media Automation
                </div>

                {/* Headline */}
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-slate-900 dark:text-white">
                    Schedule smarter.
                    <br />
                    <span className="text-red-400 dark:text-orange-500 italic">Grow faster.</span>
                </h1>

                {/* Subheadline */}
                <p className="mt-7 text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto">Social AI lets you create, schedule, and auto-engage across all your social platforms — powered by AI that writes your captions and replies for you.</p>

                {/* CTAs */}
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link to="/login" className="bg-red-500 dark:bg-orange-600 text-white rounded-full font-medium hover:bg-red-600 dark:hover:bg-orange-500 hover:shadow-[0_8px_24px_rgba(239,68,68,0.35)] dark:hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)] inline-flex items-center gap-2 text-[15px] px-8 py-3.5 w-full sm:w-auto justify-center transition-all">
                        Start for free <ArrowRightIcon className="size-4" />
                    </Link>
                    <a href="#how-it-works" className="bg-transparent dark:bg-zinc-900 text-[#333] dark:text-zinc-200 border-[1.5px] border-black/10 dark:border-zinc-800 rounded-full font-medium hover:bg-black/5 dark:hover:bg-zinc-800 inline-flex items-center gap-2 text-[15px] px-8 py-3.5 w-full sm:w-auto backdrop-blur justify-center transition-all">
                        See how it works
                    </a>
                </div>

                <p className="mt-5 text-xs text-gray-400 dark:text-zinc-500">No credit card required · Free forever plan available</p>
            </div>

            {/* Dashboard mockup */}
            <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pb-0">
                <div className="rounded-t-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 border-b-0">
                    {/* Browser chrome */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#f0f0f0] dark:bg-zinc-900 border-b border-black/6 dark:border-zinc-800">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        <div className="flex-1 mx-4 rounded-md h-5 max-w-xs bg-white/80 dark:bg-black/80" />
                    </div>

                    {/* Mock content */}
                    <div className="p-6 bg-[#f7f7f7] dark:bg-black">
                        {/* Stat row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                            {[
                                { val: "12", label: "Scheduled" },
                                { val: "48", label: "Published" },
                                { val: "4", label: "Accounts" },
                                { val: "3", label: "AI Rules" },
                            ].map((s) => (
                                <div key={s.label} className="rounded-xl p-4 bg-white dark:bg-zinc-950 border border-black/6 dark:border-zinc-800">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{s.val}</div>
                                    <div className="text-xs text-gray-400 dark:text-zinc-400 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Activity list */}
                        <div className="rounded-xl p-4 space-y-3 bg-white dark:bg-zinc-950 border border-black/6 dark:border-zinc-800">
                            <div className="text-[10px] font-semibold text-gray-400 dark:text-orange-400/80 uppercase tracking-widest mb-3">Recent Activity</div>
                            {[
                                { text: "Post published to LinkedIn & Twitter", time: "2m ago" },
                                { text: "AI replied to 3 comments", time: "15m ago" },
                                { text: "New post scheduled for tomorrow 9am", time: "1h ago" },
                            ].map((item) => (
                                <div key={item.text} className="flex items-center gap-3">
                                    <DotIcon className="size-5 text-gray-300 dark:text-orange-500/50" />
                                    <span className="text-sm text-gray-600 dark:text-zinc-300 flex-1">{item.text}</span>
                                    <span className="text-xs text-gray-400 dark:text-zinc-500 shrink-0">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

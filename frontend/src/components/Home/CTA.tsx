import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-20 bg-white dark:bg-black transition-colors">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <div className="relative rounded-3xl overflow-hidden p-14 sm:p-20 text-center bg-linear-to-br from-red-50 to-red-100/60 dark:from-zinc-950 dark:to-zinc-900 border border-red-500/15 dark:border-orange-500/20 shadow-sm transition-all">
                    {/* Glow blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(239,68,68,0.1)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(249,115,22,0.15)_0%,transparent_70%)]" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(239,68,68,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(249,115,22,0.1)_0%,transparent_70%)]" />

                    <div className="relative">
                        <div className="mb-6 inline-flex items-center gap-1.5 bg-red-500/10 dark:bg-orange-500/10 border border-red-500/15 dark:border-orange-500/20 text-red-500 dark:text-orange-400 text-[11px] font-medium tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">Ready to grow?</div>
                        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight font-medium text-gray-900 dark:text-white">
                            Automate your social
                            <br />
                            <span className="text-red-400 dark:text-orange-500 italic">media today</span>
                        </h2>
                        <p className="mt-6 text-gray-500 dark:text-zinc-400 max-w-lg mx-auto text-lg">Join thousands of creators and marketers who trust Social AI to grow their audience on autopilot.</p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link to="/login" className="bg-red-500 dark:bg-orange-600 text-white rounded-full font-semibold hover:bg-red-600 dark:hover:bg-orange-500 hover:shadow-[0_8px_24px_rgba(239,68,68,0.35)] dark:hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)] inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center transition-all">
                                Get Started Free <ArrowRightIcon className="size-4" />
                            </Link>
                            <a href="#pricing" className="bg-transparent dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-300 dark:border-zinc-800 rounded-full font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center transition-all">
                                View Pricing
                            </a>
                        </div>

                        <p className="mt-6 text-xs text-gray-400 dark:text-zinc-500">No credit card required · Cancel anytime</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

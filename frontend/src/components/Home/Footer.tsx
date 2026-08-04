import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        toast.success("Thank you for subscribing to our newsletter!");
        setEmail("");
    };

    return (
        <footer className="w-full bg-white dark:bg-black border-t border-slate-200/80 dark:border-zinc-800/80 text-slate-800 dark:text-zinc-200 transition-colors pt-14 pb-8 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
                {/* Header Row: Branding Left, Tagline Right */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8">
                    {/* Brand Logo & Name */}
                    <Link to="/" onClick={() => scrollTo(0, 0)} className="flex items-center gap-3 shrink-0 group">
                        <img src="/logo.svg" alt="Social AI Logo" className="size-8 group-hover:scale-105 transition-transform" />
                        <span className="text-2xl font-bold font-serif tracking-tight text-slate-900 dark:text-white">
                            Social AI
                        </span>
                    </Link>

                    {/* Tagline / Description */}
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md leading-relaxed md:text-right font-normal">
                        Building smarter social media scheduling solutions for businesses worldwide. Stay connected with us for updates and insights.
                    </p>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-slate-200/70 dark:bg-zinc-800/80 mb-10" />

                {/* Main 5-Column Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-10 pb-2 sm:pb-3">
                    {/* Column 1: Quick Links */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                            <li><Link to="/" onClick={() => scrollTo(0, 0)} className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link></li>
                            <li><a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a></li>
                            <li><Link to="/ideas" className="hover:text-slate-900 dark:hover:text-white transition-colors">Blogs</Link></li>
                            <li><a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Column 2: Resource */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                            Resource
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Guided & Tutorials</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Case Studies</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">API Documentation</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Community Forum</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                            Company
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Our Story</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Leadership Team</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">News</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Investor Relation</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Support */}
                    <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                            Support
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact Support</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Live Chat Support</a></li>
                        </ul>
                    </div>

                    {/* Column 5 & 6: Join Our Newsletter */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                            Join Our Newsletter
                        </h4>
                        <form onSubmit={handleSubscribe} className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800 focus-within:border-orange-500 dark:focus-within:border-orange-500 transition-all shadow-xs">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full px-3 py-1.5 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>

                {/* Giant Typography Background Watermark */}
                <div className="relative py-0 flex items-center justify-center overflow-hidden select-none pointer-events-none -my-2 sm:-my-4">
                    <span className="text-[4.5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] font-black tracking-tighter leading-none text-slate-200/60 dark:text-zinc-900/80 transition-colors lowercase">
                        socialai
                    </span>
                </div>

                {/* Bottom Bar Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-200/60 dark:border-zinc-800/60 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                    <div>Social AI {new Date().getFullYear()}</div>
                    <div>© Copyright Social AI. All rights reserved.</div>
                </div>
            </div>
        </footer>
    );
}

import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[94%] max-w-6xl lg:max-w-7xl transition-all duration-200">
            {/* Dark Capsule Rectangle Container */}
            <nav className="w-full bg-zinc-950/95 dark:bg-black/95 backdrop-blur-xl border border-zinc-800/90 rounded-full px-5 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between shadow-2xl shadow-black/60 transition-all duration-200">
                
                {/* Brand Logo & Name */}
                <Link to="/" onClick={() => scrollTo(0, 0)} className="flex items-center gap-2.5 shrink-0 group">
                    <img src="/logo.svg" alt="Social AI Logo" className="size-7 group-hover:scale-105 transition-transform" />
                    <span className="text-lg sm:text-xl font-bold font-serif tracking-tight text-white">
                        Social AI
                    </span>
                </Link>

                {/* Highly Visible Nav Links */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-zinc-200">
                    <a href="#features" className="hover:text-orange-400 transition-colors">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:text-orange-400 transition-colors">
                        How it works
                    </a>
                    <a href="#pricing" className="hover:text-orange-400 transition-colors">
                        Pricing
                    </a>
                    <a href="#testimonials" className="hover:text-orange-400 transition-colors">
                        Testimonials
                    </a>
                    <a href="#faq" className="hover:text-orange-400 transition-colors">
                        FAQ
                    </a>
                </div>

                {/* Right Actions: Theme Toggle & CTA Button */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <ThemeToggle />

                    {user ? (
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-all cursor-pointer"
                        >
                            <span>Go to Dashboard</span>
                            <ArrowRightIcon className="size-3.5" />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link
                                to="/login"
                                className="text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white hidden sm:block transition-colors px-2"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-all cursor-pointer"
                            >
                                <span>Get Started</span>
                                <ArrowRightIcon className="size-3.5" />
                            </Link>
                        </div>
                    )}
                </div>

            </nav>
        </header>
    );
}

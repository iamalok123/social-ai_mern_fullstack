import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/90 backdrop-blur-lg border-b border-slate-100 dark:border-zinc-800 transition-colors">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link to="/" onClick={() => scrollTo(0, 0)} className="flex items-center gap-2 ">
                    <img src="/logo.svg" alt="logo" className="size-7" />
                    <span className="text-xl lg:text-2xl font-medium font-serif text-slate-800 dark:text-white">Social AI</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm text-slate-500 dark:text-zinc-400">
                    <a href="#features" className="hover:text-slate-900 dark:hover:text-orange-400 transition-colors">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-orange-400 transition-colors">
                        How it works
                    </a>
                    <a href="#pricing" className="hover:text-slate-900 dark:hover:text-orange-400 transition-colors">
                        Pricing
                    </a>
                </div>

                <div className="flex items-center gap-4 sm:gap-5">
                    <ThemeToggle />

                    {user ? (
                        <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium bg-red-500 hover:bg-red-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white px-4 py-2 rounded-full shadow-sm transition-all">
                            Go to Dashboard <ArrowRightIcon className="size-3.5" />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3.5 sm:gap-5">
                            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-orange-400 hidden sm:block transition-colors">
                                Sign In
                            </Link>
                            <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium bg-red-500 hover:bg-red-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white px-4 py-2 rounded-full shadow-sm hover:shadow-orange-500/20 transition-all">
                                Get Started <ArrowRightIcon className="size-3.5" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

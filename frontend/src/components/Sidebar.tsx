import { CalendarDaysIcon, LayoutDashboardIcon, LogOutIcon, UsersIcon, Wand2Icon, XIcon, KeyRoundIcon, Menu, LightbulbIcon } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.tsx";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const navItems = [
        { name: "Dashboard", icon: LayoutDashboardIcon, path: "/dashboard" },
        { name: "Accounts", icon: UsersIcon, path: "/accounts" },
        { name: "Scheduler", icon: CalendarDaysIcon, path: "/schedule" },
        { name: "Ideas", icon: LightbulbIcon, path: "/ideas" },
        { name: "AI Composer", icon: Wand2Icon, path: "/ai-composer" },
    ];

    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [imgError, setImgError] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setImgError(false);
    }, [user?.picture]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChangePasswordClick = () => {
        setShowUserMenu(false);
        setIsOpen(false);
        if (user?.authProvider === "google") {
            toast.info("Password change is unavailable for Google authenticated accounts.");
            navigate("/change-password");
        } else {
            navigate("/change-password");
        }
    };

    return (
        <div className={`fixed ${isOpen ? "translate-x-0" : "-translate-x-full"} inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col h-full transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 shrink-0`}>

            {/* Logo Header */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 shrink-0">
                <div className="flex items-center gap-2.5">
                    <img
                        src="/logo.svg"
                        alt="logo"
                        className="size-7"
                    />
                    <span className="text-xl font-medium font-serif text-slate-900 dark:text-white tracking-tight">
                        Social AI
                    </span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    aria-label="Close sidebar"
                >
                    <XIcon className="size-5" />
                </button>
            </div>

            {/* Navigation Body */}
            <div className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
                {/* Nav Section Label */}
                <div className="px-3">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                        MENU
                    </span>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.path === "/dashboard"}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 relative ${isActive
                                        ? "bg-red-50/80 text-red-600 font-medium dark:bg-orange-500/15 dark:text-orange-400"
                                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100/70 dark:hover:bg-zinc-800/60"
                                    }`}
                            >
                                <item.icon className={`${isActive ? "text-red-500 dark:text-orange-400" : "text-slate-400 dark:text-zinc-400"} size-4.5 shrink-0`} />
                                <span>{item.name}</span>
                                {isActive && (
                                    <span className="ml-auto w-1 h-5 rounded-full bg-red-500 dark:bg-orange-500 shrink-0" />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Footer Section: User Profile & Popover Dropdown Menu */}
            <div className="p-3 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0 mt-auto relative" ref={menuRef}>
                
                {/* User Menu Popover */}
                {showUserMenu && (
                    <div className="absolute bottom-full mb-2 left-3 right-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                        {/* Header User Badge */}
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 mb-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name || "Guest User"}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0 ${
                                    user?.authProvider === "google"
                                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                }`}>
                                    {user?.authProvider === "google" ? "Google Account" : "Email Account"}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{user?.email || ""}</p>
                        </div>

                        {/* Change Password Option */}
                        <button
                            onClick={handleChangePasswordClick}
                            className="flex items-center gap-2.5 px-2.5 py-2 w-full rounded-xl text-xs text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-left font-medium"
                        >
                            <KeyRoundIcon className="size-4 text-orange-500 shrink-0" />
                            <span>Change Password</span>
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-zinc-800 my-1" />

                        {/* Sign Out Option */}
                        <button
                            onClick={() => {
                                setShowUserMenu(false);
                                logout();
                                setIsOpen(false);
                                navigate("/");
                            }}
                            className="flex items-center gap-2.5 px-2.5 py-2 w-full rounded-xl text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-left font-medium"
                        >
                            <LogOutIcon className="size-4 shrink-0" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                )}

                {/* User Card Trigger Button */}
                <div
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer group"
                    title="User account settings"
                >
                    {user?.picture && !imgError ? (
                        <img
                            src={user.picture}
                            alt={user.name || "User"}
                            referrerPolicy="no-referrer"
                            onError={() => setImgError(true)}
                            className="size-8.5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-zinc-700 shadow-xs"
                        />
                    ) : (
                        <div className="size-8.5 rounded-full bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-xs">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-orange-500 transition-colors">{user?.name || "Guest User"}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{user?.email || "Signed Out"}</p>
                    </div>
                    <div className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700/60 text-slate-400 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors shrink-0">
                        <Menu className="size-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

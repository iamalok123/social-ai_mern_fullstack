import React from "react";
import { XIcon, CameraIcon, ZapIcon, CheckCircle2Icon, ArrowRightIcon, SparklesIcon } from "lucide-react";

interface InstagramConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectOption: (loginMethod: "instagram_login" | "facebook_login") => void;
    isConnecting?: boolean;
}

export const InstagramConnectModal: React.FC<InstagramConnectModalProps> = ({
    isOpen,
    onClose,
    onSelectOption,
    isConnecting = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-zinc-800/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-yellow-500 via-pink-600 to-purple-700 flex items-center justify-center text-white shadow-xs">
                                <CameraIcon className="size-4" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Connect Your Instagram
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                            Select an authorization method based on the features you need.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isConnecting}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50"
                    >
                        <XIcon className="size-4" />
                    </button>
                </div>

                {/* Options List */}
                <div className="mt-5 space-y-4">
                    {/* Option 1: Direct Instagram Login (Recommended) */}
                    <div
                        onClick={() => !isConnecting && onSelectOption("instagram_login")}
                        className="group relative p-4 rounded-xl border-2 border-orange-500/80 bg-orange-50/30 dark:bg-orange-950/10 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-500 text-white shadow-xs">
                            <SparklesIcon className="size-3" />
                            <span>Recommended</span>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">
                                <CameraIcon className="size-5" />
                            </div>
                            <div className="flex-1 pr-16">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                    Direct Instagram Login
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-zinc-300 mt-0.5">
                                    Fastest setup. Direct Instagram authentication with no Facebook Page required.
                                </p>
                                <ul className="mt-2.5 space-y-1">
                                    <li className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                                        <CheckCircle2Icon className="size-3.5 text-emerald-500 shrink-0" />
                                        <span>Feed posts, Reels, Stories & Carousels</span>
                                    </li>
                                    <li className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                                        <CheckCircle2Icon className="size-3.5 text-emerald-500 shrink-0" />
                                        <span>Post analytics & Turn off comments toggle</span>
                                    </li>
                                    <li className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                                        <CheckCircle2Icon className="size-3.5 text-emerald-500 shrink-0" />
                                        <span>User tags & Collaborator invitations</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-orange-200/50 dark:border-orange-900/40 flex items-center justify-between text-xs font-semibold text-orange-600 dark:text-orange-400">
                            <span>Connect directly with Instagram</span>
                            <ArrowRightIcon className="size-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Option 2: Instagram via Facebook Page (Advanced) */}
                    <div
                        onClick={() => !isConnecting && onSelectOption("facebook_login")}
                        className="group relative p-4 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                                <ZapIcon className="size-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        Instagram via Facebook Page
                                    </h4>
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                                        Advanced
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-zinc-300 mt-0.5">
                                    Authorize through your linked Facebook Page to unlock Instagram Graph API commercial features.
                                </p>
                                <ul className="mt-2.5 space-y-1">
                                    <li className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                                        <CheckCircle2Icon className="size-3.5 text-blue-500 shrink-0" />
                                        <span>All standard publishing features included</span>
                                    </li>
                                    <li className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                                        <CheckCircle2Icon className="size-3.5 text-blue-500 shrink-0" />
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                            Licensed Catalog Audio / Music for Reels
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                                        <CheckCircle2Icon className="size-3.5 text-blue-500 shrink-0" />
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                            "Paid Partnership with @brand" sponsor labels
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <span>Connect via Facebook Page</span>
                            <ArrowRightIcon className="size-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 text-center mt-4">
                    You can switch or reconnect anytime from the Channels & Accounts page.
                </p>
            </div>
        </div>
    );
};

export default InstagramConnectModal;

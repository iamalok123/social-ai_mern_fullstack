import { CheckCircleIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import { PLATFORMS } from "../../assets/assets";

interface PlatformPickerModelProps {
    connectedIds: string[];
    connecting: string | null;
    onClose: () => void;
    onConnect: (platform: string) => void;
}

const PlatformPickerModel = ({ connectedIds, connecting, onClose, onConnect }: PlatformPickerModelProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur transition-colors h-full">
            <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-zinc-800 transition-colors overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800/80">
                    <h3 className="text-slate-800 dark:text-white font-medium text-base">Choose a Platform</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer"
                    >
                        <XIcon className="size-4" />
                    </button>
                </div>

                {/* Platform List */}
                <div className="p-6 flex flex-col gap-2.5">
                    {PLATFORMS.map((p) => {
                        const isConnected = connectedIds.includes(p.id);
                        const isConnecting = connecting === p.id;
                        return (
                            <button
                                key={p.id}
                                disabled={isConnected || isConnecting}
                                onClick={() => onConnect(p.id)}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${isConnected
                                    ? "border-red-200 bg-red-50 dark:bg-orange-500/10 dark:border-orange-500/20 cursor-default"
                                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 dark:bg-zinc-900/80 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 cursor-pointer"
                                    } ${isConnecting && "opacity-60"}`}
                            >
                                {/* Icon */}
                                <div className="p-2 shrink-0">
                                    <p.icon className={`size-5 ${isConnected ? "text-red-600 dark:text-orange-400" : "text-slate-500 dark:text-zinc-400"}`} />
                                </div>

                                {/* Label */}
                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-medium ${isConnected ? "text-red-700 dark:text-orange-300" : "text-slate-800 dark:text-white"}`}>
                                        {p.name}
                                    </div>

                                    <div className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                                        {isConnected ? "Already Connected" : p.description}
                                    </div>
                                </div>

                                {/* Status */}
                                {isConnected &&
                                    <CheckCircleIcon className="size-4 text-red-500 dark:text-orange-400 shrink-0" />
                                }
                                {isConnecting &&
                                    <div className="size-4 border-2 border-red-600 dark:border-orange-500 border-t-transparent rounded-full animate-spin shrink-0" />
                                }
                                {!isConnected && !isConnecting &&
                                    <ExternalLinkIcon className="size-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
                                }
                            </button>
                        )
                    })}
                </div>

            </div>
        </div >
    )
}

export default PlatformPickerModel

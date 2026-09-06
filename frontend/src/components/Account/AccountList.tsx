import { CheckIcon, Loader2Icon, PlusIcon, UnplugIcon, AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { PLATFORMS } from "../../assets/assets";
import { getInstagramBadgeInfo } from "../../utils/accountUtils";

interface AccountListProps {
    accounts: any[];
    connecting: string | null;
    onConnect: (platformId: string) => Promise<void>;
    onDisconnect: (accountId: string) => Promise<void>;
}

const AccountList = ({ accounts, connecting, onConnect, onDisconnect }: AccountListProps) => {
    const handleDisconnect = async (accountId: string) => {
        const confirm = window.confirm("Are you sure you want to disconnect this account?");
        if (!confirm) return;
        await onDisconnect(accountId);
    };

    // 1. Identify platforms that have any connected or disconnected account
    const existingPlatformIds = new Set(accounts.map((acc) => acc.platform));

    // Existing rows: sorted alphabetically by platform name
    const existingRows = accounts
        .map((acc) => {
            const meta = PLATFORMS.find((p) => p.id === acc.platform) || {
                id: acc.platform,
                name: acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1),
                icon: PlusIcon,
                description: "Connected account",
                color: "#f97316",
            };
            const isConnected = acc.status === "connected";
            const isDisconnected = acc.status === "disconnected";

            return {
                key: acc._id,
                platformId: acc.platform,
                name: meta.name,
                meta,
                account: acc,
                isConnected,
                isDisconnected,
                handle: acc.handle,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    // Unconnected rows: sorted alphabetically by platform name
    const unconnectedRows = PLATFORMS
        .filter((p) => !existingPlatformIds.has(p.id))
        .map((p) => ({
            key: p.id,
            platformId: p.id,
            name: p.name,
            meta: p,
            account: null,
            isConnected: false,
            isDisconnected: false,
            handle: null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Connected & active accounts at the top, followed by disconnected, then unconnected
    const allRows = [...existingRows, ...unconnectedRows];

    return (
        <div className="space-y-3">
            {allRows.map((row) => {
                const IconComponent = row.meta.icon;
                const isConnecting = connecting === row.platformId;

                return (
                    <div
                        key={row.key}
                        className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 transition-all hover:bg-slate-50/60 dark:hover:bg-zinc-900/60 shadow-2xs"
                    >
                        {/* Channel Icon & Info */}
                        <div className="flex items-center gap-3.5 min-w-0">
                            <span className="relative flex items-center justify-center shrink-0">
                                {/* Brand Color Badge Box */}
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-xs"
                                    style={{ backgroundColor: row.meta.color || "#475569" }}
                                >
                                    <IconComponent className="h-5 w-5 fill-current" />
                                </div>

                                {/* Connection Status Indicator Badge */}
                                <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-zinc-950 p-0.5 shadow-xs">
                                    {row.isConnected ? (
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                                    ) : row.isDisconnected ? (
                                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/20 animate-pulse" />
                                    ) : (
                                        <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-800 text-[9px] font-bold text-slate-500 dark:text-zinc-400">
                                            +
                                        </div>
                                    )}
                                </div>
                            </span>

                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                        {row.name}
                                    </span>
                                    {row.isConnected && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50 shrink-0">
                                            <CheckIcon className="size-3" />
                                            Connected
                                        </span>
                                    )}
                                    {row.isConnected && row.platformId === "instagram" && (() => {
                                        const badge = getInstagramBadgeInfo(row.account);
                                        return badge.isFacebookLogin ? (
                                            <span
                                                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 shrink-0"
                                                title={badge.tooltip}
                                            >
                                                {badge.badgeText}
                                            </span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/60 shrink-0"
                                                title={badge.tooltip}
                                            >
                                                {badge.badgeText}
                                            </span>
                                        );
                                    })()}
                                    {row.isDisconnected && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60 shrink-0">
                                            <AlertTriangleIcon className="size-3" />
                                            Token Expired
                                        </span>
                                    )}
                                </div>

                                <span className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                                    {row.isConnected || row.isDisconnected
                                        ? row.handle
                                            ? row.handle.startsWith("@")
                                                ? row.handle
                                                : `@${row.handle}`
                                            : "Connected profile"
                                        : row.meta.description}
                                </span>
                            </div>
                        </div>

                        {/* Action Button: Disconnect or Reconnect or Connect */}
                        <div className="flex items-center gap-2">
                            {row.isDisconnected ? (
                                <>
                                    <button
                                        disabled={isConnecting}
                                        onClick={() => onConnect(row.platformId)}
                                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5 justify-center disabled:opacity-60"
                                    >
                                        {isConnecting ? (
                                            <Loader2Icon className="size-3.5 animate-spin" />
                                        ) : (
                                            <RefreshCwIcon className="size-3.5" />
                                        )}
                                        <span>Reconnect</span>
                                    </button>
                                    <button
                                        onClick={() => handleDisconnect(row.account._id)}
                                        className="p-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                                        title="Remove disconnected account"
                                    >
                                        <UnplugIcon className="size-3.5" />
                                    </button>
                                </>
                            ) : row.isConnected ? (
                                <button
                                    onClick={() => handleDisconnect(row.account._id)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/70 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 dark:border-red-900/60 transition-all cursor-pointer flex items-center gap-1.5 min-w-25 justify-center"
                                >
                                    <UnplugIcon className="size-3.5" />
                                    <span>Disconnect</span>
                                </button>
                            ) : (
                                <button
                                    disabled={isConnecting}
                                    onClick={() => onConnect(row.platformId)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-sm shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-1.5 min-w-25 justify-center disabled:opacity-60"
                                >
                                    {isConnecting ? (
                                        <>
                                            <Loader2Icon className="size-3.5 animate-spin" />
                                            <span>Connecting</span>
                                        </>
                                    ) : (
                                        <>
                                            <PlusIcon className="size-3.5" />
                                            <span>Connect</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AccountList;

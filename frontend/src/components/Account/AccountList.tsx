import { AlertCircleIcon, CheckCircleIcon, PlusIcon, UnplugIcon } from "lucide-react";
import { PLATFORMS } from "../../assets/assets";

interface AccountListProps {
    accounts: any[];
    onDisconnect: (accountId: string) => Promise<void>;
}

const AccountList = ({ accounts, onDisconnect }: AccountListProps) => {
    const handleDisconnect = async (accountId: string) => {
        const confirm = window.confirm("Are you sure you want to disconnect this account?");
        if (!confirm) return;
        await onDisconnect(accountId)
    }

    if (accounts.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center py-20 px-6 transition-colors">
                <div className="size-14 bg-slate-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 dark:border-zinc-800">
                    <PlusIcon className="size-6 text-slate-500 dark:text-zinc-400 opacity-50" />
                </div>
                <p className="text-slate-700 dark:text-zinc-200 text-lg font-medium">No accounts connected</p>
                <p className="text-sm text-slate-400 dark:text-zinc-400 mt-1 max-w-xs text-center">
                    Connect your first social platform to start scheduling and automating your content.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account, index) => {
                const meta = PLATFORMS.find((p) => p.id === account.platform);
                if (!meta) return null;

                return (
                    <div
                        key={index}
                        className="group bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-xs"
                    >
                        <div className="size-12 bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                            <meta.icon className="size-6 text-slate-500 dark:text-zinc-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="text-slate-900 dark:text-white font-medium text-sm truncate">{account.handle}</div>
                            <div className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                                {meta.name}
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            {account.status === 'connected' ? (
                                <>
                                    <CheckCircleIcon className="size-4 text-emerald-500 dark:text-emerald-400" />
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Connected</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircleIcon className="size-4 text-amber-500 dark:text-amber-400" />
                                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Disconnected</span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => handleDisconnect(account._id)}
                            title="Disconnect Account"
                            className="ml-2 p-1.5 rounded-lg text-slate-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer"
                        >
                            <UnplugIcon className="size-4" />
                        </button>

                    </div>
                )
            })}
        </div>
    )
}

export default AccountList
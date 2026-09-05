import { useEffect, useState } from "react"
import AccountList from "../components/Account/AccountList"
import { toast } from "sonner"
import { api, API_PATHS } from "../api/axios"
import { PLATFORMS } from "../assets/assets"
import { AlertTriangleIcon } from "lucide-react"

import InstagramConnectModal from "../components/Account/InstagramConnectModal"

const Accounts = () => {
    const [accounts, setAccounts] = useState<any[]>([])
    const [connecting, setConnecting] = useState<string | null>(null)
    const [showInstagramModal, setShowInstagramModal] = useState<boolean>(false)

    const fetchAccounts = async (isSync = false, platform?: string | null, successMsg?: string) => {
        try {
            if (isSync) {
                const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social Media";
                toast.loading(`Syncing ${label} account...`, { id: "sync" });
                await api.get(API_PATHS.OAUTH.SYNC);
                toast.success(successMsg || "Accounts synced!", { id: "sync" });
            }

            const { data } = await api.get(API_PATHS.ACCOUNTS.GET_ALL);
            setAccounts(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch accounts");
        } finally {
            setConnecting(null);
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const connectedPlatform = params.get("connected");
        const connectedUsername = params.get("username");
        const syncNeeded = params.get("sync") === "true";
        const errorMsg = params.get("error");

        window.history.replaceState({}, document.title, window.location.pathname);

        if (connectedPlatform) {
            const label = connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1);
            const handle = connectedUsername ? ` (@${connectedUsername})` : ""
            fetchAccounts(true, connectedPlatform, `${label}${handle} connected!`)
        } else if (errorMsg) {
            toast.error(`Connection failed: ${decodeURIComponent(errorMsg)}`)
            fetchAccounts();
        } else if (syncNeeded) {
            fetchAccounts(true, null, "Accounts synced!")
        } else {
            fetchAccounts()
        }
    }, [])

    const triggerConnect = async (platformId: string, loginMethod?: string) => {
        setConnecting(platformId);
        try {
            const { data } = await api.get(API_PATHS.OAUTH.GET_CONNECT_URL(platformId, loginMethod));
            window.location.href = data.url;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || `Failed to connect ${platformId}`);
            setConnecting(null);
        }
    };

    const handleConnect = async (platformId: string) => {
        if (platformId === "instagram") {
            setShowInstagramModal(true);
            return;
        }
        await triggerConnect(platformId);
    };

    const handleInstagramModalSelect = async (loginMethod: "instagram_login" | "facebook_login") => {
        setShowInstagramModal(false);
        await triggerConnect("instagram", loginMethod);
    };

    const handleDisconnect = async (accountId: string) => {
        try {
            await api.delete(API_PATHS.ACCOUNTS.DELETE(accountId))
            toast.success("Account disconnected")
            await fetchAccounts()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to disconnect account")
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Channels & Accounts</h2>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">
                        Connect your social media accounts to start scheduling posts ({accounts.length} of {PLATFORMS.length} connected)
                    </p>
                </div>
            </div>

            {/* Proactive Disconnected Alert Banner */}
            {accounts.some((a) => a.status === "disconnected") && (
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-xs animate-in fade-in">
                    <AlertTriangleIcon className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                            Action Required: Social Account Token Expired
                        </h4>
                        <p className="text-xs text-amber-700 dark:text-amber-400/90 mt-0.5 leading-relaxed">
                            One or more accounts have an expired session or revoked token. Click "Reconnect" below to re-authorize and resume automated post publishing.
                        </p>
                    </div>
                </div>
            )}

            {/* Channels List with direct Connect & Disconnect buttons */}
            <AccountList
                accounts={accounts}
                connecting={connecting}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
            />

            {/* Instagram Connection Choice Modal */}
            <InstagramConnectModal
                isOpen={showInstagramModal}
                onClose={() => setShowInstagramModal(false)}
                onSelectOption={handleInstagramModalSelect}
                isConnecting={connecting === "instagram"}
            />
        </div>
    )
}

export default Accounts
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import AccountList from "../components/Account/AccountList"
import PlatformPickerModel from "../components/Account/PlatformPickerModel"
import { toast } from "sonner"
import { api, API_PATHS } from "../api/axios"
import { PLATFORMS } from "../assets/assets"

const Accounts = () => {
    const [accounts, setAccounts] = useState<any[]>([])
    const [connecting, setConnecting] = useState<string | null>(null)
    const [showPlatformPicker, setShowPlatformPicker] = useState(false)

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

    const handleConnect = async (platformId: string) => {
        setConnecting(platformId);
        try {
            const { data } = await api.get(API_PATHS.OAUTH.GET_CONNECT_URL(platformId));
            window.location.href = data.url;
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || `Failed to connect ${platformId}`)
            setConnecting(null)
        }
    }

    const handleDisconnect = async (accountId: string) => {
        try {
            await api.delete(API_PATHS.ACCOUNTS.DELETE(accountId))
            toast.success("Account disconnected")
            await fetchAccounts()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to disconnect account")
        }
    }

    const connectedIds = accounts.map((account) => account.platform);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
                <div>
                    <h2 className="text-xl font-medium text-slate-900 dark:text-white">Connected Accounts</h2>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">{accounts.length} of {PLATFORMS.length} platforms connected.</p>
                </div>
                <button
                    onClick={() => setShowPlatformPicker(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl font-medium shadow-md shadow-orange-500/20 transition-all cursor-pointer">
                    <PlusIcon className="size-4.5" />
                    <span>Connect Account</span>
                </button>
            </div>

            {/* Platform picker modal */}
            {showPlatformPicker &&
                <PlatformPickerModel
                    connectedIds={connectedIds}
                    connecting={connecting}
                    onClose={() => setShowPlatformPicker(false)}
                    onConnect={handleConnect}
                />
            }


            {/* Connected accounts List */}
            <AccountList accounts={accounts} onDisconnect={handleDisconnect} />
        </div>
    )
}

export default Accounts
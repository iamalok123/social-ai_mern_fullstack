import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { dummyAccountsData, PLATFORMS } from "../assets/assets"
import AccountList from "../components/Account/AccountList"
import PlatformPickerModel from "../components/Account/PlatformPickerModel"

const Accounts = () => {
    const [accounts, setAccounts] = useState<any[]>([])
    const [connecting, setConnecting] = useState<string | null>(null)
    const [showPlatformPicker, setShowPlatformPicker] = useState(false)

    const fetchAccounts = async (isSync = false, platform?: string | null, successMsg?: string) => {
        setAccounts(dummyAccountsData);
        console.log(isSync, platform, successMsg)
    }

    useEffect(() => {
        fetchAccounts()
    }, [])

    const handleConnect = async (platformId: string) => {
        setConnecting(platformId);
        setTimeout(() => {
            setConnecting(null)
            setAccounts((prev) => [...prev, dummyAccountsData[0]])
            setShowPlatformPicker(false)
        }, 1000)
    }

    const handleDisconnect = async (accountId: string) => {
        setAccounts(accounts.filter((a) => a._id !== accountId))
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
                    className="flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all cursor-pointer">
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
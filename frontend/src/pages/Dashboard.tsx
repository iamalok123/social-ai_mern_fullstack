import { ActivityIcon, CheckCircleIcon, ClockIcon, SendIcon, Share2Icon, TrendingUpIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { api, API_PATHS } from "../api/axios"

const Dashboard = () => {
    const [stats, setStats] = useState({ scheduled: 0, published: 0, connectedAccounts: 0 })
    const [activities, setActivities] = useState<any[]>([])

    const statCards = [
        {
            label: "Scheduled Posts",
            value: stats.scheduled,
            icon: ClockIcon,
            trend: "+2 Today"
        },
        {
            label: "Published Posts",
            value: stats.published,
            icon: CheckCircleIcon,
            trend: "All Time"
        },
        {
            label: "Connected Accounts",
            value: stats.connectedAccounts,
            icon: Share2Icon,
            trend: "Active"
        }
    ]

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [postsRes, accountsRes, activityRes] = await Promise.all([
                    api.get(API_PATHS.POSTS.GET_ALL), 
                    api.get(API_PATHS.ACCOUNTS.GET_ALL), 
                    api.get(API_PATHS.ACTIVITY.GET_ALL)
                ]);
                const posts = postsRes.data;
                setStats({
                    scheduled: posts.filter((p: any) => p.status === 'scheduled').length,
                    published: posts.filter((p: any) => p.status === 'published').length,
                    connectedAccounts: accountsRes.data.filter((a: any) => a.status === 'connected').length,
                })
                setActivities(activityRes.data)
            } catch (error: any) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchDashboardData();
    }, [])

    return (
        <div className="space-y-8">
            {/* Welcome Bar */}
            <div>
                <h2 className="text-2xl font-serif font-medium text-slate-900 dark:text-white">Welcome to Social AI</h2>
                <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Here&apos;s what is happening with your social accounts today.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {statCards.map((card) => {
                    const IconComponent = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-white dark:bg-zinc-950 relative border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-red-300 dark:hover:border-orange-500/40 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="size-10 rounded-xl bg-red-50 dark:bg-orange-500/10 border border-red-100 dark:border-orange-500/20 flex items-center justify-center text-red-500 dark:text-orange-400 group-hover:scale-105 transition-transform">
                                    <IconComponent className="size-5" />
                                </div>
                                <div className="text-xs text-red-500 dark:text-orange-400 font-medium flex items-center gap-1 bg-red-50 dark:bg-orange-500/10 border border-red-100 dark:border-orange-500/20 px-2.5 py-1 rounded-full">
                                    <TrendingUpIcon className="size-3" />
                                    {card.trend}
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                                {card.value}
                            </div>
                            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-1">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Activity Feed */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-zinc-800/80">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-800">
                        {activities.length} events
                    </span>
                </div>

                {activities.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-400 dark:text-zinc-500">
                        <div className="size-12 bg-slate-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-200/60 dark:border-zinc-800">
                            <ActivityIcon className="size-6 text-slate-400 dark:text-zinc-500" />
                        </div>
                        <p className="font-medium text-slate-700 dark:text-zinc-300">No activities yet</p>
                        <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">Connect accounts and schedule posts to see events here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                        {activities.map((activity) => (
                            <div key={activity._id || activity.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/70 dark:hover:bg-zinc-900/50 transition-colors">
                                <div className="size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-red-50 dark:bg-orange-500/10 text-red-500 dark:text-orange-400 border border-red-100 dark:border-orange-500/20">
                                    <SendIcon className="size-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-800">
                                            Published
                                        </span>
                                        <span className="text-xs text-slate-400 dark:text-zinc-500 shrink-0">
                                            {new Date(activity.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-zinc-300">{activity.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard

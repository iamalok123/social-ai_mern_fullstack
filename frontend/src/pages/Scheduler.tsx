import { useEffect, useState } from "react";
import { dummyPostsData, PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CalendarDaysIcon, CalendarIcon, ClockIcon, SendIcon, XIcon } from "lucide-react";

const Scheduler = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        setPosts(dummyPostsData);
    }

    useEffect(() => {
        (async () => await fetchPosts())();
        const interval = setInterval(async () => await fetchPosts(), 1000);
        return () => clearInterval(interval)
    }, [])

    const scheduled = posts.filter((p) => p.status === "scheduled")
    const published = posts.filter((p) => p.status === "published")

    const togglePlatform = (id: string) => {
        setSelectedPlatforms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
    }

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setPosts((prev) => [...prev, dummyPostsData[0]])
        }, 1000)
    }

    return (
        <div className="flex flex-col lg:flex-row gap-5 h-full">
            {/* Composer Pannel */}
            <div className="w-full lg:w-108 shrink-0">
                <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs">
                    <div>
                        <h2 className="text-lg font-medium text-slate-900 dark:text-white">Compose Post</h2>
                    </div>
                    <form
                        className="space-y-3 mt-3"
                        onSubmit={handleSchedule}
                    >
                        {/* Platforms */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Platforms</label>
                            <div className="flex flex-wrap gap-2">
                                {PLATFORMS.map((p) => {
                                    const active = selectedPlatforms.includes(p.id);
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => togglePlatform(p.id)}
                                            className={`flex items-center gap-1.5 p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${active ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 scale-103" : "border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"}`}
                                        >
                                            <p.icon className="size-4" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>


                        {/* Content */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Content</label>
                            <textarea
                                required
                                rows={3}
                                placeholder="What do you want to share today?"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-zinc-500 outline-none resize-none focus:border-red-400 dark:focus:border-red-500/50 transition-colors"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <div className={`text-right text-xs mt-0.5 font-medium ${content.length > 270 ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-zinc-500"}`}>
                                {content.length}/280
                            </div>
                        </div>


                        {/* Media upload */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Media (optional)</label>
                            {mediaFile ? (
                                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
                                    {mediaFile.type.startsWith("image/")
                                        ?
                                        <img src={URL.createObjectURL(mediaFile)} alt="preview" className="w-full h-28 object-cover" />
                                        :
                                        <video src={URL.createObjectURL(mediaFile)} className="w-full h-28 object-cover" controls />
                                    }
                                    <button type="button" onClick={() => setMediaFile(null)} className="absolute top-2 right-2 size-6 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer">
                                        <XIcon className="size-3" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex items-center justify-center gap-2 py-4 px-4 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-300 dark:hover:border-red-800/60 hover:bg-red-50/30 dark:hover:bg-red-950/20 transition-all group">
                                    <span className="text-xs text-slate-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                        Click to upload image or video
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        className="hidden"
                                        onChange={(e) => e.target.files?.[0] && setMediaFile(e.target.files[0])}
                                    />
                                </label>
                            )}
                        </div>


                        {/* Date & Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Date</label>
                                <div className="relative">
                                    <CalendarIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                                    <input type="date" required className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white text-xs outline-none focus:border-red-400 dark:focus:border-red-500/50 transition-colors" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Time</label>
                                <div className="relative">
                                    <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                                    <input type="time" required className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white text-xs outline-none focus:border-red-400 dark:focus:border-red-500/50 transition-colors" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                                </div>
                            </div>
                        </div>


                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 transition-all text-white text-sm rounded-lg cursor-pointer font-medium shadow-xs disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    Schedule Post
                                    <ArrowRightIcon className="size-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>


            {/* Queue Pannels */}
            <div className="flex flex-col gap-4 flex-1">
                {/* Upcoming */}
                <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 dark:border-zinc-800/80">
                        <CalendarDaysIcon className="size-4 text-zinc-500 dark:text-zinc-400" />
                        <h3 className="text-slate-900 dark:text-white text-sm font-semibold">Upcoming</h3>
                        <span className="ml-auto text-xs font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-zinc-800">{scheduled.length}</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/60">
                        {scheduled.length === 0 ? (
                            <div className="py-6 text-center text-slate-400 dark:text-zinc-500 text-sm">No posts scheduled yet</div>
                        ) : (
                            scheduled.map((post) => (
                                <div key={post._id} className="px-4 py-3 hover:bg-slate-50/60 dark:hover:bg-zinc-900/50 transition-colors">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex gap-1.5 items-center">
                                            {post.platforms.map((pl: string) => {
                                                const meta = PLATFORMS.find((p) => p.id === pl);
                                                return meta ? <meta.icon key={pl} className="size-3.5 text-slate-400 dark:text-zinc-500" /> : null
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {post.mediaType &&
                                                <span className="text-xs bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md font-semibold capitalize">
                                                    {post.mediaType}
                                                </span>
                                            }

                                            <span className="text-xs text-slate-400 dark:text-zinc-500">
                                                {new Date(post.scheduledFor).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 max-w-md">{post.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                

                {/* Published */}
                <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 dark:border-zinc-800/80">
                        <SendIcon className="size-4 text-zinc-500 dark:text-zinc-400" />
                        <h3 className="text-slate-900 dark:text-white text-sm font-semibold">Published</h3>
                        <span className="ml-auto text-xs font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-zinc-800">
                            {published.length}
                        </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/60">
                        {published.length === 0 ? (
                            <div className="py-6 text-center text-slate-400 dark:text-zinc-500 text-sm">No published posts yet</div>
                        ) : (
                            published.map((post) => (
                                <div key={post._id} className="px-4 py-3 hover:bg-slate-50/60 dark:hover:bg-zinc-900/50 transition-colors">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex gap-1.5 items-center">
                                            {post.platforms.map((pl: string) => {
                                                const meta = PLATFORMS.find((p) => p.id === pl);
                                                return meta ? <meta.icon key={pl} className="size-3.5 text-slate-400 dark:text-zinc-500" /> : null
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {post.mediaType &&
                                                <span className="text-xs bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md font-semibold capitalize">
                                                    {post.mediaType}
                                                </span>
                                            }

                                            <span className="text-xs text-slate-400 dark:text-zinc-500">
                                                {new Date(post.updatedAt).toLocaleString()}
                                            </span>
                                            <span className="text-xs font-bold bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/60 px-1.5 py-0.5 rounded-md">Published</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 max-w-4/5">{post.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Scheduler
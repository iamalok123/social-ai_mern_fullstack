import { useEffect, useState, useRef } from "react";
import { PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CalendarIcon, ClockIcon, HistoryIcon, Loader2Icon, TimerIcon, Wand2Icon, XIcon, ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import { api, API_PATHS } from "../api/axios";

const AIComposer = () => {
    const [prompt, setPrompt] = useState("");
    const [tone, setTone] = useState("Professional");
    const [generateImage, setGenerateImage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [generations, setGenerations] = useState<any[]>([]);

    const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);
    const toneDropdownRef = useRef<HTMLDivElement>(null);

    // Close tone dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toneDropdownRef.current && !toneDropdownRef.current.contains(event.target as Node)) {
                setIsToneDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scheduling state
    const [activeScheduler, setActiveScheduler] = useState<any>(null);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [scheduling, setScheduling] = useState(false);

    const fetchGenerations = async () => {
        try {
            const { data } = await api.get(API_PATHS.POSTS.GET_GENERATIONS)
            setGenerations(data)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    }

    const handleGenerate = async () => {
        if (!prompt) {
            toast.error("Please enter a prompt to generate post")
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post(API_PATHS.POSTS.GENERATE, { prompt, tone, generateImage });
            setGenerations([data, ...generations]);
            setActiveScheduler(data);
            toast.success("Post generated successfully");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSchedule = async () => {
        if (!activeScheduler) return;
        if (selectedPlatforms.length === 0) {
            toast.error("Select at least one platform");
            return;
        }
        if (!scheduledDate || !scheduledTime) {
            toast.error("Select date and time");
            return;
        }
        const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
        setScheduling(true);
        try {
            await api.post(API_PATHS.POSTS.SCHEDULE, {
                content: activeScheduler.content,
                mediaUrl: activeScheduler.mediaUrl,
                mediaType: activeScheduler.mediaType,
                platforms: selectedPlatforms,
                scheduledFor,
                status: "scheduled",
            });
            toast.success("AI Post scheduled!");
            setScheduledDate("");
            setScheduledTime("");
            setSelectedPlatforms([]);
            setActiveScheduler(null);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to schedule AI post. Please try again.");
        } finally {
            setScheduling(false);
        }
    }

    useEffect(() => {
        fetchGenerations();
    }, [])

    const tones = ["Professional", "Creative", "Funny", "Minimalist", "Excited"];


    return (
        <div className="max-w-3xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Input Section */}
            <div className="space-y-5 text-center mt-6">
                <h1 className="text-3xl font-medium text-slate-900 dark:text-white tracking-tight">
                    What should we create today?
                </h1>

                <div className="relative group mt-6 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs focus-within:border-red-400 dark:focus-within:border-red-500/50 transition">
                    <textarea
                        className="w-full px-6 pt-5 pb-16 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none transition resize-none h-36 text-sm leading-relaxed"
                        placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />

                    {/* Chat Bar Integrated Controls Toolbar */}
                    <div className="absolute bottom-3.5 left-5 right-5 flex items-center justify-between">
                        {/* Left Side: Custom Theme/Tone Dropdown */}
                        <div className="relative" ref={toneDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
                                className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 py-1.5 px-3 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-200/70 dark:hover:bg-zinc-800/80 transition-all shadow-xs"
                            >
                                <span>{tone}</span>
                                <ChevronDownIcon className={`w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 transition-transform duration-150 ${isToneDropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isToneDropdownOpen && (
                                <div className="absolute bottom-full mb-1.5 left-0 w-36 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-1 shadow-xl z-50 animate-in fade-in duration-150">
                                    {tones.map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => {
                                                setTone(t);
                                                setIsToneDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                                                tone === t
                                                    ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-semibold"
                                                    : "text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                            }`}
                                        >
                                            <span>{t}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Side: AI Image Toggle & Generate Button */}
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => setGenerateImage(!generateImage)}
                                className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 py-1.5 px-3 rounded-xl text-xs font-medium cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-800 transition"
                            >
                                <span>AI Image</span>
                                <div className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${generateImage ? "bg-red-500" : "bg-slate-300 dark:bg-zinc-700"}`}>
                                    <span className={`pointer-events-none size-3 transform translate-y-0.5 rounded-full bg-white transition ${generateImage ? "translate-x-3.5" : "translate-x-0.5"}`} />
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={loading}
                                className="bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-500 text-white flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer disabled:opacity-50 shadow-xs"
                            >
                                {loading ? (
                                    <>
                                        <Loader2Icon className="size-3.5 animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Generate</span>
                                        <ArrowRightIcon className="size-3.5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            {/* AI Generated Posts */}
            <div className="space-y-6 pt-12 border-t border-slate-200 dark:border-zinc-800">
                <div className="flex items-center justify-between text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                        <HistoryIcon className="size-5 text-slate-500 dark:text-zinc-400" />
                        <h2 className="text-xl font-medium">
                            Recent Generations
                        </h2>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-800 px-2.5 py-1 rounded-full">
                        {generations.length} total
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {generations.map((gen) => (
                        <div key={gen._id} className="group bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 hover:border-red-300 dark:hover:border-red-700/60 transition-all relative overflow-hidden shadow-xs">
                            <div className="flex flex-col h-full space-y-4">

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{new Date(gen.createdAt).toLocaleString()}</span>
                                    <span className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 px-2 py-0.5 rounded-md font-medium">{gen.tone}</span>
                                </div>

                                <p className="flex-1 text-sm text-slate-700 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                                    {gen.content}
                                </p>

                                {gen.mediaUrl && (
                                    <div>
                                        <img src={gen.mediaUrl} alt="Gen" className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity rounded-lg" />
                                    </div>
                                )}

                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        onClick={() => setActiveScheduler(gen)}
                                        className="flex-1 bg-slate-100 dark:bg-zinc-900 hover:bg-red-500 dark:hover:bg-red-600 border border-slate-200/60 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-white dark:hover:text-white text-xs py-2.5 rounded-lg font-medium transition-all cursor-pointer"
                                    >
                                        Schedule Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {
                        generations.length === 0 && (
                            <div className="col-span-full py-20 text-center space-y-2">
                                <div className="size-12 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400 dark:text-zinc-500">
                                    <Wand2Icon className="size-6" />
                                </div>
                                <p className="text-slate-400 dark:text-zinc-500 text-sm">No content generated yet. Try generating some content using the AI.</p>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* Scheduler Modal */}
            {activeScheduler && (
                <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">

                        <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                            <h3 className="text-slate-900 dark:text-white font-medium text-lg">Schedule Generation</h3>
                            <button onClick={() => setActiveScheduler(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors cursor-pointer">
                                <XIcon className="size-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-4">
                            <div className="bg-slate-50 dark:bg-zinc-900/60 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 space-y-4">
                                <p className="text-slate-800 dark:text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
                                    {activeScheduler.prompt}
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-zinc-900/60 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 space-y-4">
                                <p className="text-slate-800 dark:text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
                                    {activeScheduler.content}
                                </p>
                                {activeScheduler.mediaUrl && <img src={activeScheduler.mediaUrl} alt="preview" className="w-full aspect-video object-cover rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm" />}
                            </div>
                        </div>

                        <div className="px-8 border-t bg-slate-50/50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 py-6 space-y-6">
                            {/* Options */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-widest mb-3">Select Channels</label>
                                    <div className="flex flex-wrap gap-2">
                                        {PLATFORMS.map((p) => {
                                            const active = selectedPlatforms.includes(p.id);
                                            return (
                                                <button key={p.id} onClick={() => setSelectedPlatforms((prev) => (prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]))}
                                                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${active ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 scale-103" : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 hover:border-slate-300 dark:hover:border-zinc-700"}`}>
                                                    <p.icon className="size-4.5" />
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <CalendarIcon className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                                        <input
                                            type="date"
                                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-red-400 dark:focus:border-red-500/50 transition-all"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative">
                                        <ClockIcon className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                                        <input
                                            type="time"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-red-400 dark:focus:border-red-500/50 transition-all"
                                            value={scheduledTime}
                                            onChange={(e) => setScheduledTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSchedule}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white font-medium transition cursor-pointer shadow-xs disabled:opacity-50"
                            >
                                {scheduling ? (
                                    <Loader2Icon className="size-4 animate-spin" />
                                ) : (
                                    <TimerIcon className="size-4" />
                                )}
                                Schedule Post
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default AIComposer
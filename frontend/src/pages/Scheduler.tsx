import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { PLATFORMS } from "../assets/assets";
import { useAuth } from "../context/AuthContext";
import TwitterPostPreview from "../components/Media/Twitter";
import LinkedInPostPreview from "../components/Media/Linkedin";
import FacebookPostPreview from "../components/Media/Facebook";
import InstagramPostPreview from "../components/Media/Instagram";
import {
    ArrowRightIcon,
    CalendarDaysIcon,
    CalendarIcon,
    ClockIcon,
    PlusCircleIcon,
    HistoryIcon,
    SendIcon,
    XIcon,
    UploadCloudIcon,
    PlusIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "lucide-react";
import { toast } from "sonner";
import { api, API_PATHS } from "../api/axios";

const Scheduler = () => {
    const { user } = useAuth();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState<"create" | "history">("create");
    const [posts, setPosts] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [activePreviewIndex, setActivePreviewIndex] = useState(0);

    // Reset active preview index if it goes out of range
    useEffect(() => {
        if (activePreviewIndex >= selectedPlatforms.length && selectedPlatforms.length > 0) {
            setActivePreviewIndex(0);
        }
    }, [selectedPlatforms]);

    const currentPlatformId = selectedPlatforms.length > 0
        ? (selectedPlatforms[activePreviewIndex] || selectedPlatforms[0])
        : "twitter";

    const currentPlatformMeta = PLATFORMS.find((p) => p.id === currentPlatformId) || PLATFORMS[0];

    const handlePrevPreview = () => {
        if (selectedPlatforms.length <= 1) return;
        setActivePreviewIndex((prev) => (prev > 0 ? prev - 1 : selectedPlatforms.length - 1));
    };

    const handleNextPreview = () => {
        if (selectedPlatforms.length <= 1) return;
        setActivePreviewIndex((prev) => (prev < selectedPlatforms.length - 1 ? prev + 1 : 0));
    };

    // Attached image URLs from Idea card or URL input
    const [existingMediaUrls, setExistingMediaUrls] = useState<string[]>([]);
    // Newly uploaded File object
    const [mediaFile, setMediaFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Read location state when navigated from Kanban / Ideas board
    useEffect(() => {
        if (location.state) {
            const { content: stateContent, images, mediaUrl, title, description } = location.state as any;

            if (stateContent) {
                setContent(stateContent);
            } else if (title) {
                setContent(description ? `${title}\n\n${description}` : title);
            }

            const urls: string[] = [];
            if (Array.isArray(images)) {
                urls.push(...images.filter((img: any) => typeof img === "string" && img.trim().length > 0));
            }
            if (typeof mediaUrl === "string" && mediaUrl.trim() && !urls.includes(mediaUrl)) {
                urls.push(mediaUrl);
            }

            if (urls.length > 0) {
                setExistingMediaUrls(urls);
            }
        }
    }, [location.state]);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get(API_PATHS.POSTS.GET_ALL);
            setPosts(data);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        (async () => await fetchPosts())();
        const interval = setInterval(async () => await fetchPosts(), 10000);
        return () => clearInterval(interval);
    }, []);

    const scheduled = posts.filter((p) => p.status === "scheduled");
    const published = posts.filter((p) => p.status === "published");

    const previewMediaUrl = mediaFile
        ? URL.createObjectURL(mediaFile)
        : existingMediaUrls.length > 0
            ? existingMediaUrls[0]
            : null;

    const togglePlatform = (id: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleRemoveExistingMedia = (index: number) => {
        setExistingMediaUrls((prev) => prev.filter((_, i) => i !== index));
    };



    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPlatforms.length === 0) {
            toast.error("Select at least one platform");
            return;
        }
        if (!scheduledDate || !scheduledTime) {
            toast.error("Select date and time");
            return;
        }
        const hasMedia = mediaFile || existingMediaUrls.length > 0;
        if (selectedPlatforms.includes("instagram") && !hasMedia) {
            toast.error("Instagram requires an image or video");
            return;
        }

        const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
        const formData = new FormData();
        formData.append("content", content);
        formData.append("scheduledFor", scheduledFor);
        formData.append("status", "scheduled");
        formData.append("platforms", JSON.stringify(selectedPlatforms));

        if (mediaFile) {
            formData.append("media", mediaFile);
        } else if (existingMediaUrls.length > 0) {
            formData.append("mediaUrl", existingMediaUrls[0]);
            formData.append("mediaType", "image");
        }

        setLoading(true);
        try {
            await api.post(API_PATHS.POSTS.SCHEDULE, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Post scheduled successfully!");
            setContent("");
            setScheduledDate("");
            setScheduledTime("");
            setSelectedPlatforms([]);
            setMediaFile(null);
            setExistingMediaUrls([]);
            fetchPosts();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to schedule post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
            {/* Toggle Bar */}
            <div className="flex items-center justify-center border-b border-slate-200 dark:border-zinc-800 pb-4">
                <div className="flex bg-slate-100 dark:bg-zinc-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                    <button
                        type="button"
                        onClick={() => setActiveTab("create")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === "create"
                                ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                                : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        <PlusCircleIcon className="size-4" />
                        Create Post
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("history")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === "history"
                                ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                                : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        <HistoryIcon className="size-4" />
                        Post History
                        <span className="ml-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-700/60 text-slate-700 dark:text-zinc-300 font-bold">
                            {posts.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* TAB 1: CREATE POST */}
            {activeTab === "create" && (
                <div className={`w-full flex flex-col lg:flex-row items-start justify-center gap-6 transition-all duration-300 ${selectedPlatforms.includes("twitter") ? "" : "max-w-4xl mx-auto"}`}>
                    {/* Left Form Box */}
                    <div className={`w-full transition-all duration-300 ${selectedPlatforms.includes("twitter") ? "flex-1 max-w-2xl" : "max-w-4xl mx-auto"}`}>
                        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Compose Post</h2>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">Create and schedule content across your connected platforms</p>
                                </div>
                            </div>

                            <form className="space-y-3" onSubmit={handleSchedule}>
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
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer text-xs font-medium ${active ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 scale-102 shadow-xs" : "border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"}`}
                                                >
                                                    <p.icon className="size-3.5" />
                                                    <span className="capitalize">{p.name || p.id}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 2-Column Main Form Body */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Left Column: Content Textarea */}
                                    <div className="flex flex-col">
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Content</label>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder="What do you want to share today?"
                                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-zinc-500 outline-none resize-none focus:border-red-400 dark:focus:border-red-500/50 transition-colors flex-1"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                        <div className={`text-right text-xs mt-1 font-medium ${content.length > 270 ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-zinc-500"}`}>
                                            {content.length}/280
                                        </div>
                                    </div>

                                    {/* Right Column: Media Upload & Date/Time */}
                                    <div className="flex flex-col justify-between gap-3">
                                        {/* Media Upload Section */}
                                        <div className="flex-1 flex flex-col">
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                                                Media Attachments
                                            </label>

                                            {/* Display Pre-attached URLs and Newly Selected Files */}
                                            {(existingMediaUrls.length > 0 || mediaFile) ? (
                                                <div className="space-y-2 flex-1">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {/* Pre-existing / Loaded Image URLs */}
                                                        {existingMediaUrls.map((url, i) => (
                                                            <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 aspect-video shadow-xs">
                                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveExistingMedia(i)}
                                                                    className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                                                                    title="Remove image"
                                                                >
                                                                    <XIcon className="size-3" />
                                                                </button>
                                                            </div>
                                                        ))}

                                                        {/* Newly Uploaded File */}
                                                        {mediaFile && (
                                                            <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 aspect-video shadow-xs">
                                                                {mediaFile.type.startsWith("image/") ? (
                                                                    <img src={URL.createObjectURL(mediaFile)} alt="preview" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <video src={URL.createObjectURL(mediaFile)} className="w-full h-full object-cover" controls />
                                                                )}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setMediaFile(null)}
                                                                    className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                                                                    title="Remove file"
                                                                >
                                                                    <XIcon className="size-3" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action buttons to add MORE media */}
                                                    <div className="flex items-center gap-2 pt-1">
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            accept="image/*,video/*"
                                                            className="hidden"
                                                            onChange={(e) => e.target.files?.[0] && setMediaFile(e.target.files[0])}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                                                        >
                                                            <PlusIcon className="size-3.5" />
                                                            <span>Add File</span>
                                                        </button>

                                                    </div>
                                                </div>
                                            ) : (
                                                /* Empty state drop area */
                                                <div className="flex-1 flex flex-col gap-2">
                                                    <label className="flex-1 flex flex-col items-center justify-center gap-1.5 py-4 px-4 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-red-300 dark:hover:border-red-800/60 hover:bg-red-50/30 dark:hover:bg-red-950/20 transition-all group min-h-25">
                                                        <UploadCloudIcon className="size-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                                                        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                            Click to upload image or video
                                                        </span>
                                                        <input
                                                            type="file"
                                                            accept="image/*,video/*"
                                                            className="hidden"
                                                            onChange={(e) => e.target.files?.[0] && setMediaFile(e.target.files[0])}
                                                        />
                                                    </label>


                                                </div>
                                            )}
                                        </div>

                                        {/* Date & Time */}
                                        <div className="grid grid-cols-2 gap-2.5">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Date</label>
                                                <div className="relative">
                                                    <CalendarIcon className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                                                    <input type="date" required className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white text-xs outline-none focus:border-red-400 dark:focus:border-red-500/50 transition-colors" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Time</label>
                                                <div className="relative">
                                                    <ClockIcon className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                                                    <input type="time" required className="w-full pl-8 pr-2 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-white text-xs outline-none focus:border-red-400 dark:focus:border-red-500/50 transition-colors" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 transition-all text-white text-sm rounded-xl cursor-pointer font-semibold shadow-xs disabled:opacity-50 mt-1"
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

                    {/* Right Column: Unified Live Social Media Post Preview with Navigation (< >) */}
                    {selectedPlatforms.length > 0 && (
                        <div className="w-full lg:w-auto flex flex-col items-center shrink-0 lg:sticky lg:top-6 transition-all duration-300 animate-in fade-in slide-in-from-right-4">
                            <div className="w-full max-w-md flex items-center justify-between mb-1.5 px-1">
                                {/* Left Title + Current Platform Badge */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                                        Live Preview
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 px-2 py-0.5 rounded-full">
                                        <span className="size-1.5 rounded-full bg-sky-500 animate-pulse" />
                                        {currentPlatformMeta.name}
                                    </span>
                                </div>

                                {/* Right Controls: < > Buttons for navigating multiple selected previews */}
                                {selectedPlatforms.length > 1 && (
                                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-xs">
                                        <button
                                            type="button"
                                            onClick={handlePrevPreview}
                                            title="Previous preview platform"
                                            className="p-0.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                                        >
                                            <ChevronLeftIcon className="size-3.5" />
                                        </button>
                                        <span className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400 px-1">
                                            {activePreviewIndex + 1} / {selectedPlatforms.length}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleNextPreview}
                                            title="Next preview platform"
                                            className="p-0.5 rounded-lg text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                                        >
                                            <ChevronRightIcon className="size-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Optional Platform Pills bar if multiple platforms selected */}
                            {selectedPlatforms.length > 1 && (
                                <div className="w-full max-w-md flex items-center gap-1.5 mb-2 overflow-x-auto pb-0.5">
                                    {selectedPlatforms.map((pId, idx) => {
                                        const pMeta = PLATFORMS.find((p) => p.id === pId);
                                        const Icon = pMeta?.icon;
                                        const isActive = idx === activePreviewIndex;
                                        return (
                                            <button
                                                key={pId}
                                                type="button"
                                                onClick={() => setActivePreviewIndex(idx)}
                                                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                                                    isActive
                                                        ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-xs"
                                                        : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                                                }`}
                                            >
                                                {Icon && <Icon className="size-3" />}
                                                <span>{pMeta?.name || pId}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Selected Platform Preview Component */}
                            <div className="w-full flex justify-center">
                                {currentPlatformId === "twitter" && (
                                    <TwitterPostPreview content={content} mediaUrl={previewMediaUrl} user={user} />
                                )}
                                {currentPlatformId === "linkedin" && (
                                    <LinkedInPostPreview content={content} mediaUrl={previewMediaUrl} user={user} />
                                )}
                                {currentPlatformId === "facebook" && (
                                    <FacebookPostPreview content={content} mediaUrl={previewMediaUrl} user={user} />
                                )}
                                {currentPlatformId === "instagram" && (
                                    <InstagramPostPreview content={content} mediaUrl={previewMediaUrl} user={user} />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: POST HISTORY (2 Vertical Grids Side By Side) */}
            {activeTab === "history" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    {/* Upcoming Grid */}
                    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col">
                        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40">
                            <CalendarDaysIcon className="size-4 text-amber-500 dark:text-amber-400" />
                            <h3 className="text-slate-900 dark:text-white text-sm font-semibold">Upcoming Posts</h3>
                            <span className="ml-auto text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60">
                                {scheduled.length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto max-h-150 space-y-3 divide-y divide-slate-100 dark:divide-zinc-800/60">
                            {scheduled.length === 0 ? (
                                <div className="py-12 text-center text-slate-400 dark:text-zinc-500 text-sm">No posts scheduled yet</div>
                            ) : (
                                scheduled.map((post) => (
                                    <div key={post._id} className="pt-3 first:pt-0 hover:bg-slate-50/60 dark:hover:bg-zinc-900/50 p-3 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex gap-1.5 items-center">
                                                {post.platforms.map((pl: string) => {
                                                    const meta = PLATFORMS.find((p) => p.id === pl);
                                                    return meta ? <meta.icon key={pl} className="size-4 text-slate-600 dark:text-zinc-400" /> : null
                                                })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {post.mediaType &&
                                                    <span className="text-xs bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 px-2 py-0.5 rounded-md font-semibold capitalize">
                                                        {post.mediaType}
                                                    </span>
                                                }
                                                <span className="text-xs text-slate-400 dark:text-zinc-500">
                                                    {new Date(post.scheduledFor).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-zinc-300 line-clamp-3 whitespace-pre-wrap">{post.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Published Grid */}
                    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col">
                        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40">
                            <SendIcon className="size-4 text-emerald-500 dark:text-emerald-400" />
                            <h3 className="text-slate-900 dark:text-white text-sm font-semibold">Published Posts</h3>
                            <span className="ml-auto text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60">
                                {published.length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto max-h-150 space-y-3 divide-y divide-slate-100 dark:divide-zinc-800/60">
                            {published.length === 0 ? (
                                <div className="py-12 text-center text-slate-400 dark:text-zinc-500 text-sm">No published posts yet</div>
                            ) : (
                                published.map((post) => (
                                    <div key={post._id} className="pt-3 first:pt-0 hover:bg-slate-50/60 dark:hover:bg-zinc-900/50 p-3 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-zinc-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex gap-1.5 items-center">
                                                {post.platforms.map((pl: string) => {
                                                    const meta = PLATFORMS.find((p) => p.id === pl);
                                                    return meta ? <meta.icon key={pl} className="size-4 text-slate-600 dark:text-zinc-400" /> : null
                                                })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {post.mediaType &&
                                                    <span className="text-xs bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 px-2 py-0.5 rounded-md font-semibold capitalize">
                                                        {post.mediaType}
                                                    </span>
                                                }
                                                <span className="text-xs text-slate-400 dark:text-zinc-500">
                                                    {new Date(post.updatedAt).toLocaleString()}
                                                </span>
                                                <span className="text-xs font-bold bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/60 px-2 py-0.5 rounded-md">Published</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-zinc-300 line-clamp-3 whitespace-pre-wrap">{post.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Scheduler
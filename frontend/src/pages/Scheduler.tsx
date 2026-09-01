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
    ChevronRightIcon,
    ImageIcon,
    FilmIcon,
    Trash2Icon,
    PlayIcon,
    EyeIcon,
    Loader2Icon,
    CheckCircle2Icon,
    AlertCircleIcon,
    TimerIcon,
    SearchIcon
} from "lucide-react";
import { toast } from "sonner";
import { api, API_PATHS } from "../api/axios";

interface PostThumbnailProps {
    mediaUrl: string;
    isVideo: boolean;
    count?: number;
    onClick: () => void;
}

/**
 * Calculates Twitter/X weighted length according to Twitter API rules:
 * - Every http:// or https:// URL counts as exactly 23 characters.
 * - Basic Latin / standard ASCII characters (codePoint <= 4351) count as 1.
 * - Emojis and extended Unicode characters (codePoint > 4351) count as 2.
 */
export const calculateTwitterLength = (text: string): number => {
    if (!text) return 0;
    const urlRegex = /https?:\/\/[^\s]+/gi;
    const textWithoutUrls = text.replace(urlRegex, "");
    const urlMatches = text.match(urlRegex) || [];
    const urlLength = urlMatches.length * 23;

    let charLength = 0;
    for (const char of Array.from(textWithoutUrls)) {
        const codePoint = char.codePointAt(0) || 0;
        if (codePoint <= 4351) {
            charLength += 1;
        } else {
            charLength += 2;
        }
    }
    return charLength + urlLength;
};

const PostThumbnail = ({ mediaUrl, isVideo, count, onClick }: PostThumbnailProps) => {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div className="relative shrink-0 w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200/80 dark:border-zinc-800/80 bg-slate-100 dark:bg-zinc-900/90 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 p-1.5 text-center shadow-2xs">
                <ImageIcon className="size-4.5 mb-1 text-slate-400 dark:text-zinc-500" />
                <span className="text-[9px] font-medium leading-tight">Image offline</span>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="relative shrink-0 w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-950 cursor-pointer group/thumb shadow-2xs"
            title="Click to preview media"
        >
            {isVideo ? (
                <>
                    <video
                        src={mediaUrl}
                        className="w-full h-full object-cover pointer-events-none"
                        onError={() => setHasError(true)}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="p-1.5 rounded-full bg-white/90 text-slate-900 group-hover/thumb:scale-110 transition-transform">
                            <PlayIcon className="size-3 fill-current" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <img
                        src={mediaUrl}
                        alt=""
                        onError={() => setHasError(true)}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover/thumb:opacity-100">
                        <EyeIcon className="size-3.5 text-white" />
                    </div>
                </>
            )}

            {count && count > 1 && (
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold border border-white/20 shadow-xs">
                    +{count - 1}
                </div>
            )}
        </div>
    );
};

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

    // Attached image/video URLs from Idea card or URL input
    const [existingMediaUrls, setExistingMediaUrls] = useState<string[]>([]);
    // Newly uploaded File objects (up to 4 images or 1 video)
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [mediaFileUrls, setMediaFileUrls] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Manage blob object URLs lifecycle cleanly
    useEffect(() => {
        if (mediaFiles.length === 0) {
            setMediaFileUrls([]);
            return;
        }
        const urls = mediaFiles.map((f) => URL.createObjectURL(f));
        setMediaFileUrls(urls);
        return () => {
            urls.forEach((u) => URL.revokeObjectURL(u));
        };
    }, [mediaFiles]);

    // Read location state when navigated from Kanban / Ideas board or AI Composer
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

            setExistingMediaUrls(urls);
            setMediaFiles([]);
            setActiveTab("create");
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

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteConfirmPost, setDeleteConfirmPost] = useState<any | null>(null);
    const [previewModalMedia, setPreviewModalMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
    const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
    const [historyFilter, setHistoryFilter] = useState<"all" | "scheduled" | "published" | "failed">("all");
    const [historySearch, setHistorySearch] = useState("");

    const togglePostExpansion = (id: string) => {
        setExpandedPostIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const formatRelativeSchedule = (dateString: string) => {
        try {
            const target = new Date(dateString);
            const now = new Date();
            const diffMs = target.getTime() - now.getTime();

            if (diffMs <= 0) return "Due for publishing";
            
            const diffMins = Math.round(diffMs / 60000);
            if (diffMins < 60) return `in ${diffMins} min${diffMins !== 1 ? 's' : ''}`;
            
            const diffHours = Math.floor(diffMins / 60);
            const remainingMins = diffMins % 60;
            if (diffHours < 24) {
                return remainingMins > 0 ? `in ${diffHours}h ${remainingMins}m` : `in ${diffHours} hr${diffHours !== 1 ? 's' : ''}`;
            }
            
            const diffDays = Math.floor(diffHours / 24);
            return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
        } catch {
            return "";
        }
    };

    const handleDeletePost = async (postId: string) => {
        setDeletingId(postId);
        try {
            await api.delete(API_PATHS.POSTS.DELETE(postId));
            setPosts((prev) => prev.filter((p) => p._id !== postId));
            toast.success("Post deleted successfully");
            setDeleteConfirmPost(null);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to delete post");
        } finally {
            setDeletingId(null);
        }
    };

    const scheduled = posts.filter((p) => p.status === "scheduled");
    const published = posts.filter((p) => p.status === "published");
    const failed = posts.filter((p) => p.status === "failed");

    const getFilteredPosts = (list: any[]) => {
        if (!historySearch.trim()) return list;
        const query = historySearch.toLowerCase();
        return list.filter((p) => 
            p.content?.toLowerCase().includes(query) ||
            p.platforms?.some((pl: string) => pl.toLowerCase().includes(query))
        );
    };

    // Aggregate preview media URLs (all uploaded blobs + existing URLs)
    const allPreviewMediaUrls = [
        ...mediaFileUrls,
        ...existingMediaUrls
    ];

    const hasVideo = mediaFiles.some(f => f.type.startsWith("video/")) || 
                     existingMediaUrls.some(u => /\.(mp4|webm|mov|mkv|ogg)$/i.test(u) || u.includes("/video/upload/"));

    const activeMediaType: "image" | "video" | null = allPreviewMediaUrls.length === 0 
        ? null 
        : (hasVideo ? "video" : "image");

    const previewMediaUrl = allPreviewMediaUrls.length > 0 ? allPreviewMediaUrls[0] : null;

    const togglePlatform = (id: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleAddFiles = (newFiles: FileList | File[]) => {
        const fileArray = Array.from(newFiles);
        const validFiles = fileArray.filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));

        if (validFiles.length === 0) {
            toast.error("Please select valid image or video files.");
            return;
        }

        const isAddingVideo = validFiles.some(f => f.type.startsWith("video/"));
        if (isAddingVideo) {
            // Video takes all slots
            const videoFile = validFiles.find(f => f.type.startsWith("video/"))!;
            setMediaFiles([videoFile]);
            setExistingMediaUrls([]);
            toast.success(`Loaded video: ${videoFile.name}`);
            return;
        }

        if (hasVideo) {
            // Replace video with image(s)
            const imagesOnly = validFiles.filter(f => f.type.startsWith("image/")).slice(0, 4);
            setMediaFiles(imagesOnly);
            setExistingMediaUrls([]);
            toast.success(`Loaded ${imagesOnly.length} image(s)`);
            return;
        }

        const currentTotal = mediaFiles.length + existingMediaUrls.length;
        const availableSlots = Math.max(0, 4 - currentTotal);

        if (availableSlots <= 0) {
            toast.error("Maximum 4 images allowed per post.");
            return;
        }

        const imagesToAdd = validFiles.filter(f => f.type.startsWith("image/")).slice(0, availableSlots);
        setMediaFiles(prev => [...prev, ...imagesToAdd]);
        toast.success(`Added ${imagesToAdd.length} image(s)`);
    };

    const handleRemoveFile = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingMedia = (index: number) => {
        setExistingMediaUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleAddFiles(e.dataTransfer.files);
        }
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

        // Twitter character & URL length validation
        const isTwitterSelected = selectedPlatforms.includes("twitter");
        const twitterLength = calculateTwitterLength(content);
        if (isTwitterSelected && twitterLength > 280) {
            toast.error(`Post exceeds Twitter's 280 character limit (Current: ${twitterLength}/280). Please shorten your content.`);
            return;
        }

        const hasMedia = mediaFiles.length > 0 || existingMediaUrls.length > 0;
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

        // Append all uploaded files
        mediaFiles.forEach((file) => {
            formData.append("media", file);
        });

        // Append existing media URLs
        if (existingMediaUrls.length > 0) {
            formData.append("mediaUrls", JSON.stringify(existingMediaUrls));
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
            setMediaFiles([]);
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
                <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-6">
                    {/* Left Form Box */}
                    <div className={`w-full transition-all duration-200 ${selectedPlatforms.length > 0 ? "flex-1 max-w-2xl" : "w-full max-w-3xl mx-auto"}`}>
                        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xs">
                            {/* Card Header with Compose Post on Left & Platform Icons on Right (directly above Media Attachments) */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-zinc-800/80 mb-4">
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Compose Post</h2>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">Create and schedule content across your connected platforms</p>
                                </div>

                                {/* Platform Selector: Icons Only */}
                                <div className="flex items-center gap-1.5 shrink-0" title="Select target platforms">
                                    {PLATFORMS.map((p) => {
                                        const active = selectedPlatforms.includes(p.id);
                                        return (
                                            <button
                                                key={p.id}
                                                type="button"
                                                title={p.name || p.id}
                                                onClick={() => togglePlatform(p.id)}
                                                className={`p-2 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-center ${
                                                    active
                                                        ? "bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 scale-105 shadow-xs"
                                                        : "border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 hover:border-slate-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 hover:text-slate-700 dark:hover:text-zinc-300"
                                                }`}
                                            >
                                                <p.icon className="size-4" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={handleSchedule}>
                                {/* 2-Column Main Form Body */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    {/* Left Column: Content Textarea (Spacious, 7 cols) */}
                                    <div className="md:col-span-7 flex flex-col">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                                Content
                                            </label>
                                            <div className="flex items-center gap-2">
                                                {selectedPlatforms.includes("twitter") ? (
                                                    <div className="flex items-center gap-1.5">
                                                        {/https?:\/\/[^\s]+/i.test(content) && (
                                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800" title="URLs count as 23 characters on X">
                                                                URLs = 23 chars
                                                            </span>
                                                        )}
                                                        <span
                                                            className={`text-xs font-bold px-2 py-0.5 rounded-md border transition-colors ${
                                                                calculateTwitterLength(content) > 280
                                                                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse"
                                                                    : calculateTwitterLength(content) > 250
                                                                    ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                                                                    : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                                                            }`}
                                                            title="Twitter/X weighted character count (URLs = 23 chars, Emojis = 2 chars)"
                                                        >
                                                            𝕏 {calculateTwitterLength(content)}/280
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className={`text-xs font-medium ${content.length > 270 ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-zinc-500"}`}>
                                                        {content.length}/280
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <textarea
                                            required
                                            placeholder="What do you want to share today?"
                                            className={`w-full h-56 md:h-64 px-4 py-3 bg-slate-50 dark:bg-zinc-900/60 border rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-zinc-500 outline-none resize-none transition-colors overflow-y-auto leading-relaxed ${
                                                selectedPlatforms.includes("twitter") && calculateTwitterLength(content) > 280
                                                    ? "border-rose-400 dark:border-rose-600 focus:border-rose-500"
                                                    : "border-slate-200 dark:border-zinc-800 focus:border-red-400 dark:focus:border-red-500/50"
                                            }`}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                        {selectedPlatforms.includes("twitter") && calculateTwitterLength(content) > 280 && (
                                            <p className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1.5 flex items-center gap-1.5">
                                                <AlertCircleIcon className="size-3.5 shrink-0" />
                                                Content exceeds Twitter/X 280 character limit by {calculateTwitterLength(content) - 280} char(s).
                                            </p>
                                        )}
                                    </div>

                                    {/* Right Column: Media Upload & Date/Time (5 cols) */}
                                    <div className="md:col-span-5 flex flex-col justify-between gap-3">
                                        {/* Media Upload Section */}
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                                        Media Attachment
                                                    </label>
                                                    {allPreviewMediaUrls.length > 0 && (
                                                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                                                            {hasVideo ? "(1 video)" : `(${allPreviewMediaUrls.length}/4 images)`}
                                                        </span>
                                                    )}
                                                </div>
                                                {activeMediaType && (
                                                    <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500 dark:text-red-400 uppercase bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900/50">
                                                        {activeMediaType === "video" ? <FilmIcon className="size-3" /> : <ImageIcon className="size-3" />}
                                                        {activeMediaType}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Display Pre-attached URLs and Newly Selected Files */}
                                            {allPreviewMediaUrls.length > 0 ? (
                                                <div className="space-y-2 flex-1 flex flex-col justify-between">
                                                    {/* Media Gallery / Grid */}
                                                    <div className={`gap-2 h-44 overflow-y-auto p-0.5 ${allPreviewMediaUrls.length === 1 && hasVideo ? "flex items-center justify-center" : "grid grid-cols-2"}`}>
                                                        {/* Uploaded media files */}
                                                        {mediaFiles.map((file, i) => {
                                                            const isVid = file.type.startsWith("video/");
                                                            const blobUrl = mediaFileUrls[i];
                                                            return (
                                                                <div key={`file-${i}`} className={`relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs ${isVid ? "w-full h-full aspect-video" : "aspect-video"}`}>
                                                                    {isVid ? (
                                                                        <video src={blobUrl} controls playsInline className="w-full h-full object-contain bg-black" />
                                                                    ) : (
                                                                        <img src={blobUrl} alt={file.name} className="w-full h-full object-cover" />
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveFile(i)}
                                                                        className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer shadow-xs z-10"
                                                                        title="Remove file"
                                                                    >
                                                                        <XIcon className="size-3" />
                                                                    </button>
                                                                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 text-[9px] font-mono text-white max-w-28 truncate">
                                                                        {file.name}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}

                                                        {/* Pre-existing media URLs */}
                                                        {existingMediaUrls.map((url, i) => {
                                                            const isUrlVid = /\.(mp4|webm|mov|mkv|ogg)$/i.test(url) || url.includes("/video/upload/");
                                                            return (
                                                                <div key={`url-${i}`} className={`relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs ${isUrlVid ? "w-full h-full aspect-video" : "aspect-video"}`}>
                                                                    {isUrlVid ? (
                                                                        <video src={url} controls playsInline className="w-full h-full object-contain bg-black" />
                                                                    ) : (
                                                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveExistingMedia(i)}
                                                                        className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer shadow-xs z-10"
                                                                        title="Remove media"
                                                                    >
                                                                        <XIcon className="size-3" />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* File info and button to add more images */}
                                                    <div className="flex items-center justify-between gap-2 px-0.5 pt-0.5">
                                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                                                            {hasVideo ? "1 video attached (max 1)" : `${allPreviewMediaUrls.length}/4 image(s) attached`}
                                                        </span>
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            multiple
                                                            accept="image/*,video/*"
                                                            className="hidden"
                                                            onChange={(e) => e.target.files && handleAddFiles(e.target.files)}
                                                        />
                                                        {!hasVideo && allPreviewMediaUrls.length < 4 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer shrink-0 shadow-2xs"
                                                            >
                                                                <PlusIcon className="size-3" />
                                                                <span>Add Image</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                /* Empty state drag & drop area */
                                                <div
                                                    className="flex-1 flex flex-col justify-center"
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}
                                                >
                                                    <label className={`flex-1 flex flex-col items-center justify-center gap-2 py-6 px-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all group min-h-44 ${
                                                        isDragging
                                                            ? "border-red-500 bg-red-50/50 dark:bg-red-950/30 scale-[1.01]"
                                                            : "border-slate-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-700/60 hover:bg-red-50/20 dark:hover:bg-red-950/10"
                                                    }`}>
                                                        <div className="p-2.5 rounded-full bg-slate-100 dark:bg-zinc-900 group-hover:bg-red-100 dark:group-hover:bg-red-950/50 transition-colors border border-slate-200/60 dark:border-zinc-800">
                                                            <UploadCloudIcon className="size-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors block">
                                                                Click or drag & drop (up to 4 images or 1 video)
                                                            </span>
                                                            <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 block">
                                                                Twitter supports up to 4 images or 1 video (MP4, PNG, JPG)
                                                            </span>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*,video/*"
                                                            className="hidden"
                                                            onChange={(e) => e.target.files && handleAddFiles(e.target.files)}
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

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 transition-all text-white text-sm rounded-xl cursor-pointer font-semibold shadow-md shadow-red-500/20 disabled:opacity-50 mt-1 active:scale-[0.99]"
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
                                    <TwitterPostPreview content={content} mediaUrl={previewMediaUrl} mediaUrls={allPreviewMediaUrls} mediaType={activeMediaType} user={user} />
                                )}
                                {currentPlatformId === "linkedin" && (
                                    <LinkedInPostPreview content={content} mediaUrl={previewMediaUrl} mediaType={activeMediaType} user={user} />
                                )}
                                {currentPlatformId === "facebook" && (
                                    <FacebookPostPreview content={content} mediaUrl={previewMediaUrl} mediaType={activeMediaType} user={user} />
                                )}
                                {currentPlatformId === "instagram" && (
                                    <InstagramPostPreview content={content} mediaUrl={previewMediaUrl} mediaType={activeMediaType} user={user} />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: POST HISTORY */}
            {activeTab === "history" && (
                <div className="flex flex-col gap-5 w-full">
                    {/* Header Controls: Filter Pills & Search */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-zinc-800">
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                            <button
                                type="button"
                                onClick={() => setHistoryFilter("all")}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                                    historyFilter === "all"
                                        ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-2xs"
                                        : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                                }`}
                            >
                                All Posts
                                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-zinc-700 text-slate-800 dark:text-zinc-200">
                                    {posts.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setHistoryFilter("scheduled")}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                                    historyFilter === "scheduled"
                                        ? "bg-amber-500 text-white border-amber-500 shadow-2xs"
                                        : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-800/60"
                                }`}
                            >
                                <ClockIcon className="size-3" />
                                Upcoming
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                                    {scheduled.length}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setHistoryFilter("published")}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                                    historyFilter === "published"
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                                        : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-800/60"
                                }`}
                            >
                                <SendIcon className="size-3" />
                                Published
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                                    {published.length}
                                </span>
                            </button>

                            {failed.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setHistoryFilter("failed")}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                                        historyFilter === "failed"
                                            ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                                            : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-rose-300"
                                    }`}
                                >
                                    <AlertCircleIcon className="size-3" />
                                    Failed
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold">
                                        {failed.length}
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full sm:w-64">
                            <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search post content..."
                                value={historySearch}
                                onChange={(e) => setHistorySearch(e.target.value)}
                                className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-red-400 dark:focus:border-red-500/50 transition-colors shadow-2xs"
                            />
                            {historySearch && (
                                <button
                                    type="button"
                                    onClick={() => setHistorySearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 cursor-pointer"
                                >
                                    <XIcon className="size-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* VIEW 1: Dual Column Split View (when historyFilter === "all" and not searching) */}
                    {historyFilter === "all" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                            {/* Left Column: Upcoming / Scheduled Posts */}
                            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                                            <CalendarDaysIcon className="size-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-900 dark:text-white text-sm font-bold">Upcoming Posts</h3>
                                            <p className="text-[11px] text-slate-400 dark:text-zinc-500">Scheduled to publish automatically</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60">
                                        {scheduled.length}
                                    </span>
                                </div>

                                <div className="p-4 flex-1 overflow-y-auto max-h-160 space-y-3.5">
                                    {getFilteredPosts(scheduled).length === 0 ? (
                                        <div className="py-16 text-center text-slate-400 dark:text-zinc-500 flex flex-col items-center justify-center gap-2">
                                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-500 border border-slate-200/60 dark:border-zinc-800">
                                                <ClockIcon className="size-6" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">No upcoming posts scheduled</p>
                                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 max-w-xs">
                                                Compose a new post to schedule it for automatic publishing.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab("create")}
                                                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                                            >
                                                <PlusCircleIcon className="size-3.5" />
                                                Create a Post
                                            </button>
                                        </div>
                                    ) : (
                                        getFilteredPosts(scheduled).map((post) => {
                                            const isExpanded = expandedPostIds.includes(post._id);
                                            const isLongText = (post.content || "").length > 140;
                                            const firstMediaUrl = post.mediaUrl || (Array.isArray(post.mediaUrls) ? post.mediaUrls[0] : "");
                                            const isVideo = post.mediaType === "video" || (firstMediaUrl && (/\.(mp4|webm|mov|mkv|ogg)$/i.test(firstMediaUrl) || firstMediaUrl.includes("/video/upload/")));
                                            const mediaCount = Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0 ? post.mediaUrls.length : (post.mediaUrl ? 1 : 0);

                                            return (
                                                <div
                                                    key={post._id}
                                                    className="group relative bg-slate-50/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 p-4 rounded-2xl transition-all duration-150 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-500/40 shadow-2xs hover:shadow-xs flex flex-col gap-3"
                                                >
                                                    {/* Top Row: Platforms + Schedule Countdown + Cancel/Delete Action */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {post.platforms?.map((pl: string) => {
                                                                const meta = PLATFORMS.find((p) => p.id === pl);
                                                                if (!meta) return null;
                                                                const Icon = meta.icon;
                                                                return (
                                                                    <span
                                                                        key={pl}
                                                                        title={meta.name || pl}
                                                                        className="p-1 rounded-lg bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-2xs inline-flex items-center justify-center"
                                                                    >
                                                                        <Icon className="size-3.5" />
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>

                                                        <div className="flex items-center gap-1.5">
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                                                                <TimerIcon className="size-3 animate-pulse text-amber-500" />
                                                                <span>{formatRelativeSchedule(post.scheduledFor)}</span>
                                                            </span>

                                                            {/* Cancel / Delete Upcoming Post */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteConfirmPost(post)}
                                                                disabled={deletingId === post._id}
                                                                title="Cancel & Delete upcoming post"
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
                                                            >
                                                                {deletingId === post._id ? (
                                                                    <Loader2Icon className="size-3.5 animate-spin text-red-500" />
                                                                ) : (
                                                                    <Trash2Icon className="size-3.5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Middle Row: Content & Thumbnail */}
                                                    <div className="flex items-start justify-between gap-3 min-w-0">
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-xs sm:text-sm text-slate-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap ${!isExpanded && isLongText ? "line-clamp-3" : ""}`}>
                                                                {post.content}
                                                            </p>
                                                            {isLongText && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => togglePostExpansion(post._id)}
                                                                    className="mt-1 text-[11px] font-semibold text-red-500 dark:text-red-400 hover:underline cursor-pointer"
                                                                >
                                                                    {isExpanded ? "Show less" : "Show full text"}
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Thumbnail Preview */}
                                                        {firstMediaUrl && (
                                                            <PostThumbnail
                                                                mediaUrl={firstMediaUrl}
                                                                isVideo={Boolean(isVideo)}
                                                                count={mediaCount}
                                                                onClick={() => setPreviewModalMedia({ url: firstMediaUrl, type: isVideo ? "video" : "image" })}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Bottom Row: Scheduled Date */}
                                                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 text-[11px] text-slate-400 dark:text-zinc-500">
                                                        <div className="flex items-center gap-1.5">
                                                            <CalendarIcon className="size-3.5 text-amber-500/80" />
                                                            <span>{new Date(post.scheduledFor).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                                                        </div>

                                                        {firstMediaUrl && (
                                                            <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-zinc-400">
                                                                {isVideo ? <FilmIcon className="size-3" /> : <ImageIcon className="size-3" />}
                                                                <span className="capitalize">{isVideo ? "video" : (mediaCount > 1 ? `${mediaCount} images` : "image")}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Published Posts (NO DELETE BUTTON) */}
                            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs flex flex-col">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                                            <SendIcon className="size-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-900 dark:text-white text-sm font-bold">Published Posts</h3>
                                            <p className="text-[11px] text-slate-400 dark:text-zinc-500">Successfully broadcasted posts</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/60">
                                        {published.length}
                                    </span>
                                </div>

                                <div className="p-4 flex-1 overflow-y-auto max-h-160 space-y-3.5">
                                    {getFilteredPosts(published).length === 0 ? (
                                        <div className="py-16 text-center text-slate-400 dark:text-zinc-500 flex flex-col items-center justify-center gap-2">
                                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-500 border border-slate-200/60 dark:border-zinc-800">
                                                <SendIcon className="size-6" />
                                            </div>
                                            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">No published posts yet</p>
                                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 max-w-xs">
                                                Posts published by the scheduler will appear here.
                                            </p>
                                        </div>
                                    ) : (
                                        getFilteredPosts(published).map((post) => {
                                            const isExpanded = expandedPostIds.includes(post._id);
                                            const isLongText = (post.content || "").length > 140;
                                            const firstMediaUrl = post.mediaUrl || (Array.isArray(post.mediaUrls) ? post.mediaUrls[0] : "");
                                            const isVideo = post.mediaType === "video" || (firstMediaUrl && (/\.(mp4|webm|mov|mkv|ogg)$/i.test(firstMediaUrl) || firstMediaUrl.includes("/video/upload/")));
                                            const mediaCount = Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0 ? post.mediaUrls.length : (post.mediaUrl ? 1 : 0);

                                            return (
                                                <div
                                                    key={post._id}
                                                    className="group relative bg-slate-50/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 p-4 rounded-2xl transition-all duration-150 border border-slate-200/80 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-500/40 shadow-2xs hover:shadow-xs flex flex-col gap-3"
                                                >
                                                    {/* Top Row: Platforms + Published Badge (No delete button on published posts) */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {post.platforms?.map((pl: string) => {
                                                                const meta = PLATFORMS.find((p) => p.id === pl);
                                                                if (!meta) return null;
                                                                const Icon = meta.icon;
                                                                return (
                                                                    <span
                                                                        key={pl}
                                                                        title={meta.name || pl}
                                                                        className="p-1 rounded-lg bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-2xs inline-flex items-center justify-center"
                                                                    >
                                                                        <Icon className="size-3.5" />
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>

                                                        <div className="flex items-center gap-1.5">
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                                                                <CheckCircle2Icon className="size-3 text-emerald-500" />
                                                                <span>Published</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Middle Row: Content & Thumbnail */}
                                                    <div className="flex items-start justify-between gap-3 min-w-0">
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-xs sm:text-sm text-slate-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap ${!isExpanded && isLongText ? "line-clamp-3" : ""}`}>
                                                                {post.content}
                                                            </p>
                                                            {isLongText && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => togglePostExpansion(post._id)}
                                                                    className="mt-1 text-[11px] font-semibold text-red-500 dark:text-red-400 hover:underline cursor-pointer"
                                                                >
                                                                    {isExpanded ? "Show less" : "Show full text"}
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Thumbnail Preview */}
                                                        {firstMediaUrl && (
                                                            <PostThumbnail
                                                                mediaUrl={firstMediaUrl}
                                                                isVideo={Boolean(isVideo)}
                                                                count={mediaCount}
                                                                onClick={() => setPreviewModalMedia({ url: firstMediaUrl, type: isVideo ? "video" : "image" })}
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Bottom Row: Published Date */}
                                                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 text-[11px] text-slate-400 dark:text-zinc-500">
                                                        <div className="flex items-center gap-1.5">
                                                            <ClockIcon className="size-3.5 text-emerald-500/80" />
                                                            <span>{new Date(post.updatedAt || post.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                                                        </div>

                                                        {firstMediaUrl && (
                                                            <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-zinc-400">
                                                                {isVideo ? <FilmIcon className="size-3" /> : <ImageIcon className="size-3" />}
                                                                <span className="capitalize">{isVideo ? "video" : (mediaCount > 1 ? `${mediaCount} images` : "image")}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* VIEW 2: Filtered Single Feed (Upcoming Only, Published Only, or Failed Only) */
                        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-zinc-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                                    {historyFilter === "scheduled" && <ClockIcon className="size-4 text-amber-500" />}
                                    {historyFilter === "published" && <SendIcon className="size-4 text-emerald-500" />}
                                    {historyFilter === "failed" && <AlertCircleIcon className="size-4 text-rose-500" />}
                                    <span>{historyFilter} Posts ({getFilteredPosts(posts.filter((p) => p.status === historyFilter)).length})</span>
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {getFilteredPosts(posts.filter((p) => p.status === historyFilter)).length === 0 ? (
                                    <div className="col-span-full py-16 text-center text-slate-400 dark:text-zinc-500 flex flex-col items-center justify-center gap-2">
                                        <p className="text-xs font-semibold text-slate-600 dark:text-zinc-300">No {historyFilter} posts found</p>
                                    </div>
                                ) : (
                                    getFilteredPosts(posts.filter((p) => p.status === historyFilter)).map((post) => {
                                        const isExpanded = expandedPostIds.includes(post._id);
                                        const isLongText = (post.content || "").length > 140;
                                        const firstMediaUrl = post.mediaUrl || (Array.isArray(post.mediaUrls) ? post.mediaUrls[0] : "");
                                        const isVideo = post.mediaType === "video" || (firstMediaUrl && (/\.(mp4|webm|mov|mkv|ogg)$/i.test(firstMediaUrl) || firstMediaUrl.includes("/video/upload/")));
                                        const mediaCount = Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0 ? post.mediaUrls.length : (post.mediaUrl ? 1 : 0);

                                        return (
                                            <div
                                                key={post._id}
                                                className={`group relative bg-slate-50/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900 p-4 rounded-2xl transition-all duration-150 border shadow-2xs hover:shadow-xs flex flex-col gap-3 ${
                                                    post.status === "failed" 
                                                        ? "border-rose-200 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-600" 
                                                        : "border-slate-200/80 dark:border-zinc-800"
                                                }`}
                                            >
                                                {/* Top Row */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        {post.platforms?.map((pl: string) => {
                                                            const meta = PLATFORMS.find((p) => p.id === pl);
                                                            if (!meta) return null;
                                                            const Icon = meta.icon;
                                                            return (
                                                                <span
                                                                  key={pl}
                                                                  title={meta.name || pl}
                                                                  className="p-1 rounded-lg bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-2xs inline-flex items-center justify-center"
                                                                >
                                                                    <Icon className="size-3.5" />
                                                                </span>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        {post.status === "scheduled" && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
                                                                <TimerIcon className="size-3 animate-pulse text-amber-500" />
                                                                <span>{formatRelativeSchedule(post.scheduledFor)}</span>
                                                            </span>
                                                        )}
                                                        {post.status === "published" && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                                                                <CheckCircle2Icon className="size-3 text-emerald-500" />
                                                                <span>Published</span>
                                                            </span>
                                                        )}
                                                        {post.status === "failed" && (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                                                                <AlertCircleIcon className="size-3 text-rose-500" />
                                                                <span>Failed</span>
                                                            </span>
                                                        )}

                                                        {/* Only allow deleting upcoming/scheduled posts */}
                                                        {post.status === "scheduled" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteConfirmPost(post)}
                                                                disabled={deletingId === post._id}
                                                                title="Cancel & Delete Upcoming Post"
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
                                                            >
                                                                {deletingId === post._id ? (
                                                                    <Loader2Icon className="size-3.5 animate-spin text-red-500" />
                                                                ) : (
                                                                    <Trash2Icon className="size-3.5" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content & Media */}
                                                <div className="flex items-start justify-between gap-3 min-w-0">
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs sm:text-sm text-slate-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap ${!isExpanded && isLongText ? "line-clamp-3" : ""}`}>
                                                            {post.content}
                                                        </p>
                                                        {isLongText && (
                                                            <button
                                                                type="button"
                                                                onClick={() => togglePostExpansion(post._id)}
                                                                className="mt-1 text-[11px] font-semibold text-red-500 dark:text-red-400 hover:underline cursor-pointer"
                                                            >
                                                                {isExpanded ? "Show less" : "Show full text"}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {firstMediaUrl && (
                                                        <PostThumbnail
                                                            mediaUrl={firstMediaUrl}
                                                            isVideo={Boolean(isVideo)}
                                                            count={mediaCount}
                                                            onClick={() => setPreviewModalMedia({ url: firstMediaUrl, type: isVideo ? "video" : "image" })}
                                                        />
                                                    )}
                                                </div>

                                                {/* Failure Reason Alert Banner for Failed Posts */}
                                                {post.status === "failed" && (
                                                    <div className="p-3 rounded-xl bg-rose-50/90 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start justify-between gap-2.5">
                                                        <div className="flex items-start gap-2 min-w-0">
                                                            <AlertCircleIcon className="size-4 shrink-0 mt-0.5 text-rose-500" />
                                                            <div className="flex-1 min-w-0">
                                                                <span className="font-bold text-[11px] uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-0.5">
                                                                    Failure Reason
                                                                </span>
                                                                <p className="wrap-break-word leading-relaxed text-xs">
                                                                    {post.failedReason || "The social platform API rejected this post. Check duplicate content, rate limits, or media requirements."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setContent(post.content);
                                                                if (Array.isArray(post.platforms)) setSelectedPlatforms(post.platforms);
                                                                if (Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0) {
                                                                    setExistingMediaUrls(post.mediaUrls);
                                                                } else if (post.mediaUrl) {
                                                                    setExistingMediaUrls([post.mediaUrl]);
                                                                }
                                                                setActiveTab("create");
                                                                toast.success("Loaded failed post into Composer for editing");
                                                            }}
                                                            className="shrink-0 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
                                                            title="Edit and retry scheduling"
                                                        >
                                                            Re-edit
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Bottom Row */}
                                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-zinc-800/80 text-[11px] text-slate-400 dark:text-zinc-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarIcon className="size-3.5 text-slate-400" />
                                                        <span>{new Date(post.scheduledFor || post.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                                                    </div>

                                                    {firstMediaUrl && (
                                                        <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-zinc-400">
                                                            {isVideo ? <FilmIcon className="size-3" /> : <ImageIcon className="size-3" />}
                                                            <span className="capitalize">{isVideo ? "video" : (mediaCount > 1 ? `${mediaCount} images` : "image")}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL (FOR UPCOMING / SCHEDULED POSTS ONLY) */}
            {deleteConfirmPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 shrink-0">
                                <Trash2Icon className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Cancel Upcoming Post?
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                                    This upcoming post will be removed from your queue and will NOT be published to your connected social accounts.
                                </p>
                            </div>
                        </div>

                        {/* Post snippet */}
                        <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/70 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-300 max-h-24 overflow-y-auto italic line-clamp-3">
                            &ldquo;{deleteConfirmPost.content}&rdquo;
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmPost(null)}
                                disabled={deletingId === deleteConfirmPost._id}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-slate-200 dark:border-zinc-800"
                            >
                                Keep Post
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeletePost(deleteConfirmPost._id)}
                                disabled={deletingId === deleteConfirmPost._id}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                            >
                                {deletingId === deleteConfirmPost._id ? (
                                    <>
                                        <Loader2Icon className="size-3.5 animate-spin" />
                                        Canceling...
                                    </>
                                ) : (
                                    <>
                                        <Trash2Icon className="size-3.5" />
                                        Cancel & Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MEDIA LIGHTBOX PREVIEW MODAL */}
            {previewModalMedia && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
                    onClick={() => setPreviewModalMedia(null)}
                >
                    <div 
                        className="relative max-w-3xl max-h-[85vh] w-full flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewModalMedia(null)}
                            className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer z-30 shadow-md backdrop-blur-xs"
                            title="Close preview"
                        >
                            <XIcon className="size-4" />
                        </button>
                        
                        {previewModalMedia.type === "video" || /\.(mp4|webm|mov|mkv|ogg)$/i.test(previewModalMedia.url) || previewModalMedia.url.includes("/video/upload/") ? (
                            <video
                                src={previewModalMedia.url}
                                controls
                                autoPlay
                                playsInline
                                className="max-h-[80vh] w-auto max-w-full object-contain"
                            />
                        ) : (
                            <img
                                src={previewModalMedia.url}
                                alt="preview"
                                className="max-h-[80vh] w-auto max-w-full object-contain"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scheduler;
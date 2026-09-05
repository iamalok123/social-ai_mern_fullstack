import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { PLATFORMS } from "../assets/assets";
import { useAuth } from "../context/AuthContext";
import TwitterPostPreview from "../components/Media/Twitter";
import LinkedInPostPreview from "../components/Media/Linkedin";
import FacebookPostPreview from "../components/Media/Facebook";
import InstagramPostPreview from "../components/Media/Instagram";
import InstagramAudioModal, { type SelectedAudioConfig } from "../components/Media/InstagramAudioModal";
import MediaManagerModal from "../components/Media/MediaManagerModal";
import { calculateTwitterLength, getMediaUploaderHint, getActivePlatformDisplayName } from "../utils/schedulerUtils";
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
    SearchIcon,
    InfoIcon,
    ZapIcon,
    LayersIcon,
    GlobeIcon,
    BarChart3Icon,
    MusicIcon,
    SparklesIcon,
    MapPinIcon
} from "lucide-react";
import { toast } from "sonner";
import { api, API_PATHS } from "../api/axios";

interface PostThumbnailProps {
    mediaUrl: string;
    isVideo: boolean;
    count?: number;
    onClick: () => void;
}



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

    // LinkedIn-specific growth features
    const [firstComment, setFirstComment] = useState("");
    const [isFirstCommentRequired, setIsFirstCommentRequired] = useState(false);
    const [disableLinkPreview, setDisableLinkPreview] = useState(false);
    const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

    // Facebook-specific features
    const [facebookContentType, setFacebookContentType] = useState<"feed" | "reel" | "story">("feed");
    const [facebookTitle, setFacebookTitle] = useState("");
    const [facebookDraft, setFacebookDraft] = useState(false);
    const [facebookTextPreset, setFacebookTextPreset] = useState("");
    const [facebookGeoCountries, setFacebookGeoCountries] = useState("");

    // Instagram-specific features
    const [instagramContentType, setInstagramContentType] = useState<"feed" | "reel" | "story">("feed");
    const [instagramShareToFeed, setInstagramShareToFeed] = useState<boolean>(true);
    const [instagramAudioConfig, setInstagramAudioConfig] = useState<SelectedAudioConfig | null>(null);
    const [isAudioModalOpen, setIsAudioModalOpen] = useState<boolean>(false);
    const [instagramMuteAudio, setInstagramMuteAudio] = useState<boolean>(false);
    const [instagramTrial, setInstagramTrial] = useState<boolean>(false);
    const [instagramTrialGraduation, setInstagramTrialGraduation] = useState<"SS_PERFORMANCE" | "MANUAL">("SS_PERFORMANCE");
    const [instagramThumbnail, setInstagramThumbnail] = useState<string>("");
    const [instagramThumbOffset, setInstagramThumbOffset] = useState<number>(0);
    const [instagramCollaborators, setInstagramCollaborators] = useState<string>("");
    const [instagramLocationId, setInstagramLocationId] = useState<string>("");
    const [instagramPaidPartnership, setInstagramPaidPartnership] = useState<boolean>(false);
    const [instagramSponsors, setInstagramSponsors] = useState<string>("");
    const [instagramCommentsEnabled, setInstagramCommentsEnabled] = useState<boolean>(true);

    // Analytics Modal state
    const [analyticsModalPost, setAnalyticsModalPost] = useState<string | null>(null);
    const [analyticsData, setAnalyticsData] = useState<any | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);

    // Media Manager Modal state
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    const handleClearAllMedia = () => {
        setMediaFiles([]);
        setExistingMediaUrls([]);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch accounts to proactively check for disconnected/expired tokens
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data } = await api.get(API_PATHS.ACCOUNTS.GET_ALL);
                setConnectedAccounts(data);
            } catch (e) {
                console.warn("Could not fetch accounts for status checks", e);
            }
        };
        fetchAccounts();
    }, []);

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

    const isTwitterSelected = selectedPlatforms.includes("twitter");
    const isLinkedInSelected = selectedPlatforms.includes("linkedin");
    const isFacebookSelected = selectedPlatforms.includes("facebook");
    const isInstagramSelected = selectedPlatforms.includes("instagram");
    const maxAllowedImages = isTwitterSelected ? 4 : (isFacebookSelected || isInstagramSelected ? 10 : 20);

    const connectedInstagramAccount = connectedAccounts.find((a) => a.platform === "instagram");
    const isInstagramViaFacebook = connectedInstagramAccount?.loginMethod === "facebook_login";

    const mediaUploaderHint = getMediaUploaderHint(
        selectedPlatforms,
        isTwitterSelected,
        isFacebookSelected,
        isInstagramSelected,
        isLinkedInSelected
    );

    const handleViewAnalytics = async (postId: string) => {
        setLoadingAnalytics(true);
        setAnalyticsModalPost(postId);
        try {
            const { data } = await api.get(API_PATHS.POSTS.ANALYTICS(postId));
            setAnalyticsData(data?.data || data?.analytics || data);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch post analytics");
            setAnalyticsModalPost(null);
            setAnalyticsData(null);
        } finally {
            setLoadingAnalytics(false);
        }
    };

    const togglePlatform = (id: string) => {
        setSelectedPlatforms((prev) => {
            const isTurningOn = !prev.includes(id);
            const updated = isTurningOn ? [...prev, id] : prev.filter((p) => p !== id);

            if (isTurningOn && id === "twitter") {
                const currentImagesCount = (mediaFiles.length + existingMediaUrls.length);
                if (!hasVideo && currentImagesCount > 4) {
                    toast.warning(`Twitter/X allows a maximum of 4 images. You currently have ${currentImagesCount} images attached. Please remove excess images before scheduling to Twitter.`);
                }
            }
            if (isTurningOn && id === "facebook") {
                const currentImagesCount = (mediaFiles.length + existingMediaUrls.length);
                if (!hasVideo && currentImagesCount > 10) {
                    toast.warning(`Facebook allows a maximum of 10 images. You currently have ${currentImagesCount} images attached. Please remove excess images before scheduling to Facebook.`);
                }
            }
            return updated;
        });
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
            const imagesOnly = validFiles.filter(f => f.type.startsWith("image/")).slice(0, maxAllowedImages);
            setMediaFiles(imagesOnly);
            setExistingMediaUrls([]);
            toast.success(`Loaded ${imagesOnly.length} image(s)`);
            return;
        }

        const currentTotal = mediaFiles.length + existingMediaUrls.length;
        const availableSlots = Math.max(0, maxAllowedImages - currentTotal);

        if (availableSlots <= 0) {
            toast.error(isTwitterSelected ? "Maximum 4 images allowed per post on Twitter/X." : `Maximum ${maxAllowedImages} images allowed per post.`);
            return;
        }

        const imagesToAdd = validFiles.filter(f => f.type.startsWith("image/")).slice(0, availableSlots);
        setMediaFiles(prev => [...prev, ...imagesToAdd]);
        toast.success(`Added ${imagesToAdd.length} image(s)`);
    };

    const handleMoveLinkToFirstComment = () => {
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        const urls = content.match(urlRegex);
        if (!urls || urls.length === 0) return;
        const extractedUrl = urls[0];
        const newContent = content.replace(extractedUrl, "").replace(/\n\s*\n\s*\n/g, "\n\n").trim();
        setContent(newContent);
        setFirstComment(prev => prev ? `${prev}\n${extractedUrl}` : `🔗 ${extractedUrl}`);
        toast.success("Link moved to First Comment to avoid LinkedIn reach penalty!");
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

        // Check if any selected platform's account is in "disconnected" status
        const disconnectedSelected = selectedPlatforms.find((p) => {
            const acc = connectedAccounts.find((a) => a.platform === p);
            return acc && acc.status === "disconnected";
        });
        if (disconnectedSelected) {
            const pMeta = PLATFORMS.find(p => p.id === disconnectedSelected);
            toast.error(`Your ${pMeta?.name || disconnectedSelected} account has an expired session. Please visit Channels & Accounts to reconnect it before scheduling.`);
            return;
        }

        // Twitter character & URL length validation
        const twitterLength = calculateTwitterLength(content);
        if (isTwitterSelected && twitterLength > 280) {
            toast.error(`Post exceeds Twitter's 280 character limit (Current: ${twitterLength}/280). Please shorten your content.`);
            return;
        }

        // LinkedIn character limit validation (3,000 characters for both free and premium)
        if (isLinkedInSelected && content.length > 3000) {
            toast.error(`Post exceeds LinkedIn's 3,000 character limit (Current: ${content.length}/3,000). Please shorten your content.`);
            return;
        }

        if (isFirstCommentRequired && !firstComment.trim()) {
            toast.error("First Comment is marked as required for this LinkedIn post. Please enter first comment content.");
            return;
        }

        const totalImagesCount = mediaFiles.length + existingMediaUrls.length;
        if (isTwitterSelected && !hasVideo && totalImagesCount > 4) {
            toast.error(`Twitter/X only supports up to 4 images (You have ${totalImagesCount}). Please remove excess images before scheduling.`);
            return;
        }

        if (isFacebookSelected) {
            if (totalImagesCount > 0 && hasVideo) {
                toast.error("Facebook does not allow mixing images and videos in the same post.");
                return;
            }
            if (totalImagesCount > 10) {
                toast.error(`Facebook allows a maximum of 10 images (You have ${totalImagesCount}). Please remove excess images.`);
                return;
            }
            if (facebookContentType === "reel" && !hasVideo) {
                toast.error("Facebook Reels require a video file.");
                return;
            }
            if (facebookContentType === "story" && totalImagesCount === 0 && !hasVideo) {
                toast.error("Facebook Stories require an image or video.");
                return;
            }
        }

        const hasMedia = mediaFiles.length > 0 || existingMediaUrls.length > 0;
        const totalMediaCount = totalImagesCount + (hasVideo ? 1 : 0);

        // Check caption requirement (only single-platform Instagram stories can omit caption)
        const isSingleInstagramStory = selectedPlatforms.length === 1 && selectedPlatforms[0] === "instagram" && instagramContentType === "story";
        if (!content.trim() && !isSingleInstagramStory) {
            toast.error("Please enter post caption / content.");
            return;
        }

        if (isInstagramSelected) {
            if (!hasMedia) {
                toast.error("Instagram requires an image or video.");
                return;
            }
            if (instagramContentType === "story" && totalMediaCount > 1) {
                toast.error(`Instagram Stories only support 1 media item (You have ${totalMediaCount}). Please keep only 1 image or video.`);
                return;
            }
            if (instagramContentType === "reel" && !hasVideo) {
                toast.error("Instagram Reels require a video file.");
                return;
            }
            if (instagramContentType === "feed" && totalMediaCount > 10) {
                toast.error(`Instagram carousel allows a maximum of 10 items (You have ${totalMediaCount}).`);
                return;
            }
        }

        const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
        const formData = new FormData();
        formData.append("content", content);
        formData.append("scheduledFor", scheduledFor);
        formData.append("status", "scheduled");
        formData.append("platforms", JSON.stringify(selectedPlatforms));

        if (firstComment.trim()) {
            formData.append("firstComment", firstComment.trim());
        }
        if (disableLinkPreview) {
            formData.append("disableLinkPreview", "true");
        }

        // Platform-specific options
        const platformSpecificData: Record<string, any> = {};
        if (isFacebookSelected) {
            const fbData: Record<string, any> = {
                contentType: facebookContentType,
                draft: facebookDraft,
            };
            if (facebookContentType === "reel" && facebookTitle.trim()) {
                fbData.title = facebookTitle.trim();
            }
            if (facebookTextPreset.trim() && !hasMedia) {
                fbData.textFormatPresetId = facebookTextPreset.trim();
            }
            if (facebookGeoCountries.trim()) {
                const countries = facebookGeoCountries
                    .split(",")
                    .map((c) => c.trim().toUpperCase())
                    .filter((c) => /^[A-Z]{2}$/.test(c));
                if (countries.length > 0) {
                    fbData.geoRestriction = { countries };
                }
            }
            platformSpecificData.facebook = fbData;
        }

        if (isInstagramSelected) {
            const igData: Record<string, any> = {
                contentType: instagramContentType,
            };
            if (instagramContentType === "reel") {
                igData.shareToFeed = instagramShareToFeed;
                if (instagramThumbOffset > 0) {
                    igData.thumbOffset = instagramThumbOffset;
                }
                if (instagramAudioConfig) {
                    igData.audioConfiguration = {
                        audioId: instagramAudioConfig.audioId,
                        audioVolume: instagramAudioConfig.audioVolume,
                        videoVolume: instagramAudioConfig.videoVolume,
                    };
                }
                if (instagramMuteAudio) {
                    igData.muteAudio = true;
                }
                if (instagramTrial) {
                    igData.trialParams = {
                        graduationStrategy: instagramTrialGraduation,
                    };
                }
            }
            if (instagramThumbnail.trim()) {
                igData.instagramThumbnail = instagramThumbnail.trim();
                igData.reelCover = instagramThumbnail.trim();
            }
            if (instagramContentType !== "story") {
                if (instagramCollaborators.trim()) {
                    igData.collaborators = instagramCollaborators
                        .split(",")
                        .map((c) => c.trim().replace(/^@/, ""))
                        .filter(Boolean);
                }
                if (instagramLocationId.trim()) {
                    igData.locationId = instagramLocationId.trim();
                }
                if (instagramPaidPartnership) {
                    igData.isPaidPartnership = true;
                    if (instagramSponsors.trim()) {
                        igData.brandedContentSponsors = instagramSponsors
                            .split(",")
                            .map((s) => s.trim().replace(/^@/, ""))
                            .filter(Boolean);
                    }
                }
                if (!instagramCommentsEnabled) {
                    igData.commentsEnabled = false;
                }
            }
            platformSpecificData.instagram = igData;
        }

        if (Object.keys(platformSpecificData).length > 0) {
            formData.append("platformSpecificData", JSON.stringify(platformSpecificData));
        }

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
            setFirstComment("");
            setDisableLinkPreview(false);
            setIsFirstCommentRequired(false);
            setFacebookContentType("feed");
            setFacebookTitle("");
            setFacebookDraft(false);
            setFacebookTextPreset("");
            setFacebookGeoCountries("");
            setInstagramContentType("feed");
            setInstagramShareToFeed(true);
            setInstagramAudioConfig(null);
            setInstagramMuteAudio(false);
            setInstagramTrial(false);
            setInstagramTrialGraduation("SS_PERFORMANCE");
            setInstagramThumbnail("");
            setInstagramThumbOffset(0);
            setInstagramCollaborators("");
            setInstagramLocationId("");
            setInstagramPaidPartnership(false);
            setInstagramSponsors("");
            setInstagramCommentsEnabled(true);
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
                                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                                {/* LinkedIn Hook & Fold Indicator */}
                                                {selectedPlatforms.includes("linkedin") && (
                                                    content.length <= 210 ? (
                                                        <span
                                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                                                            title="LinkedIn Feed Hook: The first ~210 characters appear before the '...see more' fold. Make your hook engaging!"
                                                        >
                                                            👁️ Hook: {content.length}/210 visible
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60"
                                                            title="210 characters appear before the fold. The rest will be hidden behind '...see more'."
                                                        >
                                                            📜 210 visible (+{content.length - 210} behind 'see more')
                                                        </span>
                                                    )
                                                )}

                                                {/* Character Count Badges */}
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
                                                            title={selectedPlatforms.includes("linkedin") ? "Twitter limit (280) applies because Twitter is selected alongside LinkedIn" : "Twitter/X weighted character count"}
                                                        >
                                                            𝕏 {calculateTwitterLength(content)}/280
                                                        </span>
                                                    </div>
                                                ) : selectedPlatforms.includes("linkedin") ? (
                                                    <span
                                                        className={`text-xs font-bold px-2 py-0.5 rounded-md border transition-colors ${
                                                            content.length > 3000
                                                                ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse"
                                                                : content.length > 2800
                                                                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                                                                : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                                                        }`}
                                                        title="LinkedIn supports up to 3,000 characters for both free and premium accounts"
                                                    >
                                                        in {content.length}/3,000
                                                    </span>
                                                ) : selectedPlatforms.includes("facebook") ? (
                                                    <span
                                                        className={`text-xs font-bold px-2 py-0.5 rounded-md border transition-colors ${
                                                            content.length > 63206
                                                                ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse"
                                                                : content.length > 480
                                                                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                                                : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                                                        }`}
                                                        title="Facebook limit: 63,206 chars (truncated at ~480 with 'See more')"
                                                    >
                                                        f {content.length > 480 ? `${content.length} (truncates at ~480)` : `${content.length}/63k`}
                                                    </span>
                                                ) : (
                                                    <span className={`text-xs font-medium ${content.length > 2800 ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-zinc-500"}`}>
                                                        {content.length}/3,000
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* LinkedIn Link Reach Penalty Warning Callout with One-Click Move */}
                                        {selectedPlatforms.includes("linkedin") && /https?:\/\/[^\s]+/i.test(content) && !firstComment && (
                                            <div className="mb-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-between gap-2.5 text-xs text-amber-900 dark:text-amber-200 shadow-2xs animate-in fade-in">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <ZapIcon className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                                    <span className="truncate leading-tight">
                                                        <strong>Reach Tip:</strong> LinkedIn suppresses link posts by 40-50%. Move link to First Comment.
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleMoveLinkToFirstComment}
                                                    className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-800/80 hover:bg-amber-300 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                                                >
                                                    <span>Move to 1st Comment</span>
                                                    <ArrowRightIcon className="size-3" />
                                                </button>
                                            </div>
                                        )}

                                        <textarea
                                            required
                                            placeholder="What do you want to share today?"
                                            className={`w-full h-56 md:h-64 px-4 py-3 bg-slate-50 dark:bg-zinc-900/60 border rounded-xl text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-zinc-500 outline-none resize-none transition-colors overflow-y-auto leading-relaxed ${
                                                (selectedPlatforms.includes("twitter") && calculateTwitterLength(content) > 280) ||
                                                (selectedPlatforms.includes("linkedin") && content.length > 3000)
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
                                        {!selectedPlatforms.includes("twitter") && selectedPlatforms.includes("linkedin") && content.length > 3000 && (
                                            <p className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-1.5 flex items-center gap-1.5">
                                                <AlertCircleIcon className="size-3.5 shrink-0" />
                                                Content exceeds LinkedIn 3,000 character limit by {content.length - 3000} char(s).
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
                                                            {hasVideo ? "(1 video)" : `(${allPreviewMediaUrls.length}/${maxAllowedImages} images)`}
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
                                                    {/* Minimal Organized Media Display (Max 4 slots in composer) */}
                                                    {hasVideo ? (
                                                        <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs h-44 w-full flex items-center justify-center">
                                                            <video
                                                                src={allPreviewMediaUrls[0]}
                                                                controls
                                                                playsInline
                                                                className="w-full h-full object-contain bg-black"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (mediaFiles.length > 0) handleRemoveFile(0);
                                                                    else handleRemoveExistingMedia(0);
                                                                }}
                                                                className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer shadow-xs z-10"
                                                                title="Remove video"
                                                            >
                                                                <XIcon className="size-3" />
                                                            </button>
                                                        </div>
                                                    ) : allPreviewMediaUrls.length <= 4 ? (
                                                        <div className={`gap-2 h-44 p-0.5 ${
                                                            allPreviewMediaUrls.length === 1
                                                                ? "flex items-center justify-center"
                                                                : allPreviewMediaUrls.length === 2
                                                                ? "grid grid-cols-2"
                                                                : allPreviewMediaUrls.length === 3
                                                                ? "grid grid-cols-3"
                                                                : "grid grid-cols-2"
                                                        }`}>
                                                            {allPreviewMediaUrls.map((url, i) => {
                                                                const isUploadedFile = i < mediaFiles.length;
                                                                const fileName = isUploadedFile ? mediaFiles[i].name : `Image ${i + 1}`;

                                                                return (
                                                                    <div
                                                                        key={`media-slot-${i}`}
                                                                        className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs aspect-video w-full h-full"
                                                                    >
                                                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                                                        
                                                                        {/* Number Tag */}
                                                                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9px] font-mono text-white">
                                                                            #{i + 1}
                                                                        </span>

                                                                        {/* Remove Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (isUploadedFile) handleRemoveFile(i);
                                                                                else handleRemoveExistingMedia(i - mediaFiles.length);
                                                                            }}
                                                                            className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer shadow-xs z-10"
                                                                            title="Remove image"
                                                                        >
                                                                            <XIcon className="size-2.5" />
                                                                        </button>

                                                                        {/* Bottom filename tag */}
                                                                        <span className="absolute bottom-1 left-1 right-1 px-1 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white truncate pointer-events-none">
                                                                            {fileName}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        /* 5 or more images: Show 3 preview slots + 1 interactive "+{more}" slot */
                                                        <div className="grid grid-cols-2 gap-2 h-44 p-0.5">
                                                            {allPreviewMediaUrls.slice(0, 3).map((url, i) => {
                                                                const isUploadedFile = i < mediaFiles.length;
                                                                const fileName = isUploadedFile ? mediaFiles[i].name : `Image ${i + 1}`;

                                                                return (
                                                                    <div
                                                                        key={`media-top3-${i}`}
                                                                        className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs aspect-video w-full h-full"
                                                                    >
                                                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                                                        
                                                                        {/* Number Tag */}
                                                                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9px] font-mono text-white">
                                                                            #{i + 1}
                                                                        </span>

                                                                        {/* Remove Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (isUploadedFile) handleRemoveFile(i);
                                                                                else handleRemoveExistingMedia(i - mediaFiles.length);
                                                                            }}
                                                                            className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer shadow-xs z-10"
                                                                            title="Remove image"
                                                                        >
                                                                            <XIcon className="size-2.5" />
                                                                        </button>

                                                                        {/* Bottom filename tag */}
                                                                        <span className="absolute bottom-1 left-1 right-1 px-1 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white truncate pointer-events-none">
                                                                            {fileName}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}

                                                            {/* 4th Slot: Interactive "+{remaining}" Card */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsMediaModalOpen(true)}
                                                                className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs aspect-video w-full h-full cursor-pointer select-none text-left p-0 transition-all hover:ring-2 hover:ring-sky-500/50"
                                                                title={`Click to view all ${allPreviewMediaUrls.length} images & organize gallery`}
                                                            >
                                                                {/* Background blur of 4th image */}
                                                                <img
                                                                    src={allPreviewMediaUrls[3]}
                                                                    alt=""
                                                                    className="w-full h-full object-cover opacity-35 blur-[0.5px] group-hover:scale-105 transition-transform"
                                                                />
                                                                <div className="absolute inset-0 bg-slate-950/70 group-hover:bg-slate-950/80 flex flex-col items-center justify-center text-white transition-colors p-1">
                                                                    <span className="text-xl sm:text-2xl font-black text-white tracking-wide group-hover:scale-110 transition-transform">
                                                                        +{allPreviewMediaUrls.length - 3}
                                                                    </span>
                                                                    <span className="text-[10px] font-semibold text-sky-300 mt-0.5 flex items-center gap-1 opacity-90 group-hover:opacity-100">
                                                                        <LayersIcon className="size-3" />
                                                                        Manage All
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* File info bar and action buttons */}
                                                    <div className="flex items-center justify-between gap-1.5 px-0.5 pt-1">
                                                        <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium truncate">
                                                            {hasVideo
                                                                ? "1 video attached (max 1)"
                                                                : `${allPreviewMediaUrls.length} of ${maxAllowedImages} image(s)`}
                                                        </span>

                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            {!hasVideo && allPreviewMediaUrls.length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setIsMediaModalOpen(true)}
                                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-2xs"
                                                                >
                                                                    <LayersIcon className="size-3" />
                                                                    <span>Manage ({allPreviewMediaUrls.length})</span>
                                                                </button>
                                                            )}
                                                            <input
                                                                type="file"
                                                                ref={fileInputRef}
                                                                multiple
                                                                accept="image/*,video/*"
                                                                className="hidden"
                                                                onChange={(e) => e.target.files && handleAddFiles(e.target.files)}
                                                            />
                                                            {!hasVideo && allPreviewMediaUrls.length < maxAllowedImages && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-900/60 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-xs font-semibold text-sky-600 dark:text-sky-400 transition-colors cursor-pointer shrink-0 shadow-2xs"
                                                                >
                                                                    <PlusIcon className="size-3" />
                                                                    <span>Add</span>
                                                                </button>
                                                            )}
                                                        </div>
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
                                                                Click or drag & drop (up to {maxAllowedImages} images or 1 video)
                                                            </span>
                                                            <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 block">
                                                                {mediaUploaderHint}
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

                                {/* LinkedIn Growth Settings Card */}
                                {selectedPlatforms.includes("linkedin") && (
                                    <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-zinc-900/60 border border-sky-200/80 dark:border-sky-950/80 space-y-3.5 shadow-2xs animate-in fade-in">
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 dark:border-zinc-800/70 pb-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="px-1.5 py-0.5 rounded-md bg-[#0a66c2] text-white text-[10px] font-bold">in</span>
                                                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                                                    LinkedIn Growth Features
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                                Max 3,000 chars • Up to 20 images
                                            </span>
                                        </div>

                                        {/* First Comment Field */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-1.5 group relative">
                                                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                                                        Auto "First Comment"
                                                    </label>
                                                    {/* Info Circle with rich hover tooltip */}
                                                    <div className="relative group/tip cursor-help inline-flex items-center">
                                                        <InfoIcon className="size-3.5 text-slate-400 hover:text-sky-500 transition-colors" />
                                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tip:flex flex-col w-72 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-50 pointer-events-none leading-relaxed border border-slate-700">
                                                            <span className="font-bold text-sky-300 mb-1 flex items-center gap-1">
                                                                <ZapIcon className="size-3" />
                                                                Algorithm Optimization
                                                            </span>
                                                            LinkedIn suppresses posts with external links in the caption by 40-50%. Putting links in the First Comment bypasses this suppression and maintains full organic reach.
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Optional vs Compulsory Toggle */}
                                                <label className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={isFirstCommentRequired}
                                                        onChange={(e) => setIsFirstCommentRequired(e.target.checked)}
                                                        className="rounded border-slate-300 dark:border-zinc-700 text-sky-600 focus:ring-sky-500 size-3"
                                                    />
                                                    <span>Make required for this post</span>
                                                </label>
                                            </div>

                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={firstComment}
                                                    onChange={(e) => setFirstComment(e.target.value)}
                                                    placeholder="e.g. 🔗 Read the full guide here: https://example.com/guide"
                                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-sky-400 dark:focus:border-sky-500/50 transition-colors shadow-2xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Disable Link Preview Checkbox */}
                                        <div className="flex items-center justify-between pt-1">
                                            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={disableLinkPreview}
                                                    onChange={(e) => setDisableLinkPreview(e.target.checked)}
                                                    className="rounded border-slate-300 dark:border-zinc-700 text-sky-600 focus:ring-sky-500 size-3.5"
                                                />
                                                <span className="font-medium">Disable automatic URL preview card</span>
                                            </label>
                                            <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                Suppresses large link thumbnail card
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Facebook Page Options Card */}
                                {selectedPlatforms.includes("facebook") && (
                                    <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-zinc-900/60 border border-blue-200/80 dark:border-blue-950/80 space-y-3.5 shadow-2xs animate-in fade-in">
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 dark:border-zinc-800/70 pb-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-md bg-[#1877F2] text-white text-[10px] font-bold">f</span>
                                                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                                                    Facebook Page Options
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                                Pages Only • Up to 10 images • 1 video
                                            </span>
                                        </div>

                                        {/* Post Format Selector */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                                                Publishing Format
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { id: "feed", label: "Feed Post", desc: "Standard feed" },
                                                    { id: "reel", label: "Reel", desc: "Short video" },
                                                    { id: "story", label: "Story", desc: "24h ephemeral" },
                                                ].map((fmt) => (
                                                    <button
                                                        key={fmt.id}
                                                        type="button"
                                                        onClick={() => setFacebookContentType(fmt.id as any)}
                                                        className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                                                            facebookContentType === fmt.id
                                                                ? "bg-blue-50 dark:bg-blue-950/50 border-blue-400 dark:border-blue-600 text-blue-900 dark:text-blue-100 shadow-2xs"
                                                                : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700"
                                                        }`}
                                                    >
                                                        <div className="text-xs font-bold">{fmt.label}</div>
                                                        <div className="text-[10px] text-slate-500 dark:text-zinc-400">{fmt.desc}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Reel Title Field */}
                                        {facebookContentType === "reel" && (
                                            <div className="animate-in fade-in">
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                                    Reel Title <span className="text-slate-400 font-normal">(separate from caption)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={facebookTitle}
                                                    onChange={(e) => setFacebookTitle(e.target.value)}
                                                    placeholder="e.g. Behind the scenes 🎬"
                                                    className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-blue-400 dark:focus:border-blue-500/50 transition-colors shadow-2xs"
                                                />
                                            </div>
                                        )}

                                        {/* Draft Mode Toggle */}
                                        {facebookContentType !== "story" && (
                                            <div className="flex items-center justify-between pt-1">
                                                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                                                    <input
                                                        type="checkbox"
                                                        checked={facebookDraft}
                                                        onChange={(e) => setFacebookDraft(e.target.checked)}
                                                        className="rounded border-slate-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 size-3.5"
                                                    />
                                                    <span className="font-medium">Save as draft in Facebook Publishing Tools</span>
                                                </label>
                                                <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                    Review on Meta before live
                                                </span>
                                            </div>
                                        )}

                                        {/* Large Text Colored Background Preset */}
                                        {facebookContentType === "feed" && mediaFiles.length === 0 && existingMediaUrls.length === 0 && (
                                            <div className="pt-1 animate-in fade-in">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                                                        Large Text Colored Background Preset
                                                    </label>
                                                    {facebookTextPreset && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setFacebookTextPreset("")}
                                                            className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                                        >
                                                            Clear preset
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {[
                                                        { id: "", name: "Default", bg: "bg-slate-200 dark:bg-zinc-800" },
                                                        { id: "ocean", name: "Ocean", bg: "bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700" },
                                                        { id: "sunset", name: "Sunset", bg: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600" },
                                                        { id: "emerald", name: "Emerald", bg: "bg-gradient-to-tr from-emerald-500 to-teal-700" },
                                                        { id: "midnight", name: "Midnight", bg: "bg-gradient-to-tr from-slate-900 via-zinc-900 to-slate-950" },
                                                        { id: "fire", name: "Fire", bg: "bg-gradient-to-tr from-orange-500 to-red-600" },
                                                    ].map((preset) => (
                                                        <button
                                                            key={preset.id}
                                                            type="button"
                                                            onClick={() => setFacebookTextPreset(preset.id)}
                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                                                facebookTextPreset === preset.id
                                                                    ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 shadow-xs"
                                                                    : "border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                                                            }`}
                                                        >
                                                            <span className={`size-3 rounded-full ${preset.bg} shrink-0`} />
                                                            <span className="text-slate-700 dark:text-zinc-300 text-[11px]">{preset.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Country Geo-Restriction */}
                                        {facebookContentType !== "story" && (
                                            <div className="pt-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                                                        <GlobeIcon className="size-3 text-slate-400" />
                                                        Country Geo-Restriction <span className="text-slate-400 font-normal">(optional)</span>
                                                    </label>
                                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">ISO-2 codes</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={facebookGeoCountries}
                                                    onChange={(e) => setFacebookGeoCountries(e.target.value)}
                                                    placeholder="e.g. US, GB, CA (up to 25 codes)"
                                                    className="w-full px-3.5 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-blue-400 dark:focus:border-blue-500/50 transition-colors shadow-2xs"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Instagram Options Card */}
                                {isInstagramSelected && (
                                    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 space-y-3.5 animate-in fade-in">
                                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-zinc-800/60">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-lg bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-2xs">
                                                    ig
                                                </span>
                                                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                                                    Instagram Options
                                                </span>
                                            </div>
                                            {/* Connection Method Status Badge */}
                                            {connectedInstagramAccount?.loginMethod === "facebook_login" ? (
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 flex items-center gap-1">
                                                    <ZapIcon className="size-2.5" /> Facebook Connected (Full Tools)
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400">
                                                    Direct Login Active
                                                </span>
                                            )}
                                        </div>

                                        {/* Post Format Selector */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                                                Publishing Format
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {[
                                                    { id: "feed", label: "Feed / Carousel", desc: "Up to 10 images/videos" },
                                                    { id: "reel", label: "Reel", desc: "Video up to 90s" },
                                                    { id: "story", label: "Story", desc: "24h • 1 item • No caption" },
                                                ].map((fmt) => (
                                                    <button
                                                        key={fmt.id}
                                                        type="button"
                                                        onClick={() => setInstagramContentType(fmt.id as any)}
                                                        className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                                                            instagramContentType === fmt.id
                                                                ? "bg-pink-50 dark:bg-pink-950/50 border-pink-400 dark:border-pink-600 text-pink-900 dark:text-pink-100 shadow-2xs"
                                                                : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700"
                                                        }`}
                                                    >
                                                        <div className="text-xs font-bold">{fmt.label}</div>
                                                        <div className="text-[10px] text-slate-500 dark:text-zinc-400">{fmt.desc}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Story Info Banner */}
                                        {instagramContentType === "story" && (
                                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 animate-in fade-in flex items-start gap-2">
                                                <InfoIcon className="size-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                                                <span>
                                                    Instagram Stories display for 24 hours. Stories accept exactly 1 image or video. Captions, first comments, paid partnerships, and catalog audio are not displayed on Stories.
                                                </span>
                                            </div>
                                        )}

                                        {/* Reel Specific Controls */}
                                        {instagramContentType === "reel" && (
                                            <div className="space-y-3 pt-1 animate-in fade-in">
                                                {/* Share to Feed Toggle */}
                                                <div className="flex items-center justify-between">
                                                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={instagramShareToFeed}
                                                            onChange={(e) => setInstagramShareToFeed(e.target.checked)}
                                                            className="rounded border-slate-300 dark:border-zinc-700 text-pink-600 focus:ring-pink-500 size-3.5"
                                                        />
                                                        <span className="font-medium">Also share Reel to Main Profile Grid</span>
                                                    </label>
                                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                        Default: Yes
                                                    </span>
                                                </div>

                                                {/* Catalog Audio Picker */}
                                                <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 shrink-0">
                                                            <MusicIcon className="size-4" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                                {instagramAudioConfig?.audioTitle || "Reel Catalog Audio / Music"}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                                                {instagramAudioConfig
                                                                    ? `${instagramAudioConfig.artistName ? `${instagramAudioConfig.artistName} • ` : ""}Music: ${instagramAudioConfig.audioVolume}% | Video: ${instagramAudioConfig.videoVolume}%`
                                                                    : "Search & attach licensed music track"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        {instagramAudioConfig && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setInstagramAudioConfig(null)}
                                                                className="px-2 py-1 text-[10px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsAudioModalOpen(true)}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-pink-600 hover:bg-pink-500 text-white shadow-xs transition-colors cursor-pointer"
                                                        >
                                                            {instagramAudioConfig ? "Change Track" : "Add Music"}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Mute Original Video Audio */}
                                                <div className="flex items-center justify-between">
                                                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={instagramMuteAudio}
                                                            onChange={(e) => setInstagramMuteAudio(e.target.checked)}
                                                            className="rounded border-slate-300 dark:border-zinc-700 text-pink-600 focus:ring-pink-500 size-3.5"
                                                        />
                                                        <span className="font-medium">Mute original video audio track</span>
                                                    </label>
                                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                        Keeps only catalog music
                                                    </span>
                                                </div>

                                                {/* Trial Reel Toggle (Non-followers only) */}
                                                <div className="p-3 rounded-xl border border-purple-200/70 dark:border-purple-900/50 bg-purple-50/20 dark:bg-purple-950/10 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="flex items-center gap-2 text-xs text-purple-900 dark:text-purple-200 cursor-pointer select-none font-semibold">
                                                            <input
                                                                type="checkbox"
                                                                checked={instagramTrial}
                                                                onChange={(e) => setInstagramTrial(e.target.checked)}
                                                                className="rounded border-purple-300 dark:border-purple-700 text-purple-600 focus:ring-purple-500 size-3.5"
                                                            />
                                                            <span className="flex items-center gap-1">
                                                                <SparklesIcon className="size-3 text-purple-500" />
                                                                Test on Non-Followers (Trial Reel)
                                                            </span>
                                                        </label>
                                                        <span className="text-[10px] text-purple-700 dark:text-purple-300">
                                                            Growth Experiment
                                                        </span>
                                                    </div>
                                                    {instagramTrial && (
                                                        <div className="flex items-center gap-3 pt-1 text-xs">
                                                            <span className="text-[11px] text-slate-600 dark:text-zinc-400">Graduation Strategy:</span>
                                                            <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="trialGrad"
                                                                    checked={instagramTrialGraduation === "SS_PERFORMANCE"}
                                                                    onChange={() => setInstagramTrialGraduation("SS_PERFORMANCE")}
                                                                    className="accent-purple-600"
                                                                />
                                                                <span>Performance-based</span>
                                                            </label>
                                                            <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="trialGrad"
                                                                    checked={instagramTrialGraduation === "MANUAL"}
                                                                    onChange={() => setInstagramTrialGraduation("MANUAL")}
                                                                    className="accent-purple-600"
                                                                />
                                                                <span>Manual</span>
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Custom Thumbnail URL & Offset */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                                            Cover Image URL <span className="text-slate-400 font-normal">(optional)</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={instagramThumbnail}
                                                            onChange={(e) => setInstagramThumbnail(e.target.value)}
                                                            placeholder="https://.../cover.jpg"
                                                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                                            Video Frame Offset (ms) <span className="text-slate-400 font-normal">(optional)</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="500"
                                                            value={instagramThumbOffset || ""}
                                                            onChange={(e) => setInstagramThumbOffset(Number(e.target.value))}
                                                            placeholder="e.g. 2500"
                                                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Feed / Carousel Thumbnail */}
                                        {instagramContentType === "feed" && (
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                                    Custom Thumbnail URL <span className="text-slate-400 font-normal">(for video in feed)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={instagramThumbnail}
                                                    onChange={(e) => setInstagramThumbnail(e.target.value)}
                                                    placeholder="https://.../thumb.jpg"
                                                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                                                />
                                            </div>
                                        )}

                                        {/* Collaborators & Location Tagging (Not on Story) */}
                                        {instagramContentType !== "story" && (
                                            <div className="space-y-3 pt-1">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                                Collaborators <span className="text-slate-400 font-normal">(max 3)</span>
                                                            </label>
                                                            <span className="text-[10px] text-slate-400">comma-separated</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={instagramCollaborators}
                                                            onChange={(e) => setInstagramCollaborators(e.target.value)}
                                                            placeholder="@partner1, @brand"
                                                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                                                                <MapPinIcon className="size-3 text-rose-500" /> Location ID
                                                            </label>
                                                            <span className="text-[10px] text-slate-400">FB Page Numeric ID</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={instagramLocationId}
                                                            onChange={(e) => setInstagramLocationId(e.target.value)}
                                                            placeholder="e.g. 104768392892900"
                                                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Paid Partnership Section */}
                                                <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none font-semibold">
                                                            <input
                                                                type="checkbox"
                                                                checked={instagramPaidPartnership}
                                                                onChange={(e) => setInstagramPaidPartnership(e.target.checked)}
                                                                className="rounded border-slate-300 dark:border-zinc-700 text-pink-600 focus:ring-pink-500 size-3.5"
                                                            />
                                                            <span>Paid Partnership / Branded Content Label</span>
                                                        </label>
                                                        {!isInstagramViaFacebook && (
                                                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                                                Requires Facebook Page Login
                                                            </span>
                                                        )}
                                                    </div>
                                                    {instagramPaidPartnership && (
                                                        <div className="pt-1 animate-in fade-in">
                                                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                                                Sponsor Handles <span className="text-slate-400 font-normal">(max 2 brands, comma-separated)</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={instagramSponsors}
                                                                onChange={(e) => setInstagramSponsors(e.target.value)}
                                                                placeholder="@brand1, @brand2"
                                                                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 outline-none focus:border-pink-500 transition-colors shadow-2xs"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Turn off Comments Toggle */}
                                                <div className="flex items-center justify-between pt-0.5">
                                                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={!instagramCommentsEnabled}
                                                            onChange={(e) => setInstagramCommentsEnabled(!e.target.checked)}
                                                            className="rounded border-slate-300 dark:border-zinc-700 text-pink-600 focus:ring-pink-500 size-3.5"
                                                        />
                                                        <span className="font-medium">Turn off comments for this post</span>
                                                    </label>
                                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                        Comments enabled by default
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

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
                                    <LinkedInPostPreview
                                        content={content}
                                        mediaUrl={previewMediaUrl}
                                        mediaUrls={allPreviewMediaUrls}
                                        mediaType={activeMediaType}
                                        user={user}
                                        firstComment={firstComment}
                                        disableLinkPreview={disableLinkPreview}
                                        onOpenMediaModal={() => setIsMediaModalOpen(true)}
                                    />
                                )}
                                {currentPlatformId === "facebook" && (
                                    <FacebookPostPreview
                                        content={content}
                                        mediaUrl={previewMediaUrl}
                                        mediaUrls={allPreviewMediaUrls}
                                        mediaType={activeMediaType}
                                        user={user}
                                        firstComment={firstComment}
                                        contentType={facebookContentType}
                                        title={facebookTitle}
                                        draft={facebookDraft}
                                        textFormatPresetId={facebookTextPreset}
                                    />
                                )}
                                {currentPlatformId === "instagram" && (
                                    <InstagramPostPreview
                                        content={content}
                                        mediaUrl={previewMediaUrl}
                                        mediaUrls={allPreviewMediaUrls}
                                        mediaType={activeMediaType}
                                        user={user}
                                        contentType={instagramContentType}
                                        collaborators={instagramCollaborators ? instagramCollaborators.split(",").map(c => c.trim().replace(/^@/, "")).filter(Boolean) : []}
                                        locationId={instagramLocationId}
                                        isPaidPartnership={instagramPaidPartnership}
                                        brandedContentSponsors={instagramSponsors ? instagramSponsors.split(",").map(s => s.trim().replace(/^@/, "")).filter(Boolean) : []}
                                        audioTitle={instagramAudioConfig?.audioTitle}
                                        artistName={instagramAudioConfig?.artistName}
                                        muteAudio={instagramMuteAudio}
                                        isTrial={instagramTrial}
                                        commentsEnabled={instagramCommentsEnabled}
                                    />
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
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                                                                    <CheckCircle2Icon className="size-3 text-emerald-500" />
                                                                    <span>Published</span>
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleViewAnalytics(post._id)}
                                                                    title="View Post Performance Analytics"
                                                                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                                                                >
                                                                    <BarChart3Icon className="size-3 text-pink-500" />
                                                                    <span>Analytics</span>
                                                                </button>
                                                            </div>
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

            {/* Media Manager Gallery Modal Popup with Blur Background & Close Cross */}
            <MediaManagerModal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                mediaFiles={mediaFiles}
                mediaFileUrls={mediaFileUrls}
                existingMediaUrls={existingMediaUrls}
                onRemoveFile={handleRemoveFile}
                onRemoveExistingUrl={handleRemoveExistingMedia}
                onAddFiles={handleAddFiles}
                maxAllowed={maxAllowedImages}
                platformName={getActivePlatformDisplayName(
                    isTwitterSelected,
                    isFacebookSelected,
                    isInstagramSelected,
                    isLinkedInSelected
                )}
                onClearAll={handleClearAllMedia}
            />

            {/* Instagram Catalog Audio Modal */}
            <InstagramAudioModal
                isOpen={isAudioModalOpen}
                onClose={() => setIsAudioModalOpen(false)}
                onSelectAudio={(config) => setInstagramAudioConfig(config)}
                currentAudioConfig={instagramAudioConfig}
                accountId={connectedInstagramAccount?._id}
            />

            {/* Post Analytics Modal */}
            {analyticsModalPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
                    <div
                        className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <div className="size-8 rounded-xl bg-linear-to-tr from-yellow-500 via-pink-600 to-purple-700 flex items-center justify-center text-white shadow-xs">
                                    <BarChart3Icon className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post Performance</h3>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Real-time engagement analytics</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setAnalyticsModalPost(null);
                                    setAnalyticsData(null);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                            >
                                <XIcon className="size-4" />
                            </button>
                        </div>

                        <div className="mt-4">
                            {loadingAnalytics ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <Loader2Icon className="size-6 animate-spin text-pink-500" />
                                    <span className="text-xs text-slate-500 mt-2">Loading performance metrics...</span>
                                </div>
                            ) : analyticsData ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Impressions</span>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                            {analyticsData.impressions?.toLocaleString() ?? 0}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Reach</span>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                            {analyticsData.reach?.toLocaleString() ?? 0}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Likes</span>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                            {analyticsData.likes?.toLocaleString() ?? 0}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Comments</span>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                            {analyticsData.comments?.toLocaleString() ?? 0}
                                        </div>
                                    </div>
                                    {analyticsData.shares !== undefined && (
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                            <span className="text-[10px] uppercase font-bold text-slate-400">Shares</span>
                                            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                                {analyticsData.shares?.toLocaleString() ?? 0}
                                            </div>
                                        </div>
                                    )}
                                    {analyticsData.saved !== undefined && (
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-center">
                                            <span className="text-[10px] uppercase font-bold text-slate-400">Saved</span>
                                            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                                {analyticsData.saved?.toLocaleString() ?? 0}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-6 text-center text-xs text-slate-500">
                                    No analytics metrics available yet for this post.
                                </div>
                            )}
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
                            <button
                                onClick={() => {
                                    setAnalyticsModalPost(null);
                                    setAnalyticsData(null);
                                }}
                                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scheduler;
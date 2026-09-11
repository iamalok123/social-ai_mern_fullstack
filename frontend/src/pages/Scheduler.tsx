import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { PLATFORMS } from "../assets/assets";
import { useAuth } from "../context/AuthContext";
import InstagramAudioModal, { type SelectedAudioConfig } from "../components/Media/InstagramAudioModal";
import MediaManagerModal from "../components/Media/MediaManagerModal";
import { calculateTwitterLength, getMediaUploaderHint, getActivePlatformDisplayName } from "../utils/schedulerUtils";
import { getInstagramBadgeInfo } from "../utils/accountUtils";
import { toast } from "sonner";
import { api, API_PATHS } from "../api/axios";

import type { Post, AnalyticsData } from "../components/Scheduler/types";
import HeaderActionsPortal from "../components/Scheduler/HeaderActionsPortal";
import SchedulerComposer from "../components/Scheduler/composer/SchedulerComposer";
import SchedulerLivePreview from "../components/Scheduler/preview/SchedulerLivePreview";
import PostHistoryTab from "../components/Scheduler/history/PostHistoryTab";
import DeleteConfirmModal from "../components/Scheduler/modals/DeleteConfirmModal";
import PostAnalyticsModal from "../components/Scheduler/modals/PostAnalyticsModal";
import EditYoutubeDescriptionModal from "../components/Scheduler/modals/EditYoutubeDescriptionModal";
import MediaLightboxModal from "../components/Scheduler/modals/MediaLightboxModal";

const Scheduler = () => {
    const { user } = useAuth();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState<"create" | "history">("create");
    const [posts, setPosts] = useState<Post[]>([]);

    const [content, setContent] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [activePreviewIndex, setActivePreviewIndex] = useState(0);

    // Collapsible states for platform option cards
    const [isLinkedinCollapsed, setIsLinkedinCollapsed] = useState(false);
    const [isFacebookCollapsed, setIsFacebookCollapsed] = useState(false);
    const [isInstagramCollapsed, setIsInstagramCollapsed] = useState(false);
    const [isYoutubeCollapsed, setIsYoutubeCollapsed] = useState(false);

    // YouTube specific options state
    const [youtubeTitle, setYoutubeTitle] = useState("");
    const [youtubeVisibility, setYoutubeVisibility] = useState<"public" | "private" | "unlisted">("public");
    const [youtubeCategoryId, setYoutubeCategoryId] = useState("22");
    const [youtubeMadeForKids, setYoutubeMadeForKids] = useState(false);
    const [youtubeContainsSyntheticMedia, setYoutubeContainsSyntheticMedia] = useState(false);
    const [youtubePlaylistId, setYoutubePlaylistId] = useState("");
    const [youtubePlaylists, setYoutubePlaylists] = useState<Array<{ id: string; title: string; itemCount?: number }>>([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(false);
    const [youtubeFirstComment, setYoutubeFirstComment] = useState("");
    const [youtubeCustomThumbnail, setYoutubeCustomThumbnail] = useState("");
    const [youtubeIsShort, setYoutubeIsShort] = useState(false);
    const [editingYoutubePost, setEditingYoutubePost] = useState<Post | null>(null);

    // Reset active preview index if it goes out of range
    useEffect(() => {
        if (activePreviewIndex >= selectedPlatforms.length && selectedPlatforms.length > 0) {
            setActivePreviewIndex(0);
        }
    }, [selectedPlatforms, activePreviewIndex]);

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
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);

    // Media Manager Modal state
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    const handleClearAllMedia = () => {
        setMediaFiles([]);
        setExistingMediaUrls([]);
    };

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

    // Fetch YouTube Playlists when YouTube platform is selected
    const fetchYoutubePlaylists = useCallback(async () => {
        const ytAccount = connectedAccounts.find((a) => a.platform === "youtube" && a.status === "connected");
        if (!ytAccount) return;
        setLoadingPlaylists(true);
        try {
            const { data } = await api.get(`/api/accounts/${ytAccount._id}/youtube/playlists`);
            if (data?.playlists && Array.isArray(data.playlists)) {
                setYoutubePlaylists(data.playlists);
            }
        } catch (e) {
            console.warn("Could not fetch YouTube playlists", e);
        } finally {
            setLoadingPlaylists(false);
        }
    }, [connectedAccounts]);

    useEffect(() => {
        if (selectedPlatforms.includes("youtube")) {
            fetchYoutubePlaylists();
        }
    }, [selectedPlatforms, fetchYoutubePlaylists]);

    // Client-side auto-detection for YouTube Shorts vs Long-Form Video
    // (Duration <= 180s and vertical 9:16 aspect ratio / height > width)
    useEffect(() => {
        const videoFile = mediaFiles.find((f) => f.type.startsWith("video/"));
        const videoUrl = existingMediaUrls.find((u) => /\.(mp4|webm|mov|mkv|ogg)$/i.test(u) || u.includes("/video/upload/"));

        let objectUrlToRevoke: string | null = null;
        let testSrc = "";

        if (videoFile) {
            objectUrlToRevoke = URL.createObjectURL(videoFile);
            testSrc = objectUrlToRevoke;
        } else if (videoUrl) {
            testSrc = videoUrl;
        }

        if (!testSrc) {
            setYoutubeIsShort(false);
            return;
        }

        const videoEl = document.createElement("video");
        videoEl.preload = "metadata";
        videoEl.src = testSrc;

        videoEl.onloadedmetadata = () => {
            const duration = videoEl.duration;
            const width = videoEl.videoWidth;
            const height = videoEl.videoHeight;
            // Short: <= 180s and vertical (height > width)
            const isVertical = height > width;
            const isShortDetected = duration <= 180 && isVertical;
            setYoutubeIsShort(isShortDetected);

            if (objectUrlToRevoke) {
                URL.revokeObjectURL(objectUrlToRevoke);
            }
        };

        videoEl.onerror = () => {
            if (objectUrlToRevoke) {
                URL.revokeObjectURL(objectUrlToRevoke);
            }
        };

        return () => {
            if (objectUrlToRevoke) {
                URL.revokeObjectURL(objectUrlToRevoke);
            }
        };
    }, [mediaFiles, existingMediaUrls]);

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
    const [deleteConfirmPost, setDeleteConfirmPost] = useState<Post | null>(null);
    const [previewModalMedia, setPreviewModalMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
    const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);

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
    const isYouTubeSelected = selectedPlatforms.includes("youtube");
    const maxAllowedImages = isTwitterSelected ? 4 : (isFacebookSelected || isInstagramSelected ? 10 : 20);

    const connectedInstagramAccount = connectedAccounts.find((a) => a.platform === "instagram");
    const instagramBadge = getInstagramBadgeInfo(connectedInstagramAccount);
    const isInstagramViaFacebook = instagramBadge.isFacebookLogin;

    const mediaUploaderHint = getMediaUploaderHint(
        selectedPlatforms,
        isTwitterSelected,
        isFacebookSelected,
        isInstagramSelected,
        isLinkedInSelected,
        isYouTubeSelected
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
            if (isTurningOn && id === "youtube") {
                const currentImagesCount = (mediaFiles.length + existingMediaUrls.length);
                if (currentImagesCount > 0 && !hasVideo) {
                    toast.warning("YouTube only supports videos (MP4, MOV, WebM). Please remove attached images before publishing to YouTube.");
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
            const videoFile = validFiles.find(f => f.type.startsWith("video/"))!;
            setMediaFiles([videoFile]);
            setExistingMediaUrls([]);
            toast.success(`Loaded video: ${videoFile.name}`);
            return;
        }

        if (hasVideo) {
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

        if (isYouTubeSelected) {
            if (!hasVideo) {
                toast.error("YouTube requires a video file. Please attach a video.");
                return;
            }
            if (totalImagesCount > 0) {
                toast.error("YouTube does not support images. Please remove all images before scheduling.");
                return;
            }
            const totalVideoCount = (mediaFiles.filter((f) => f.type.startsWith("video/")).length) +
                (existingMediaUrls.filter((u) => /\.(mp4|webm|mov|mkv|ogg)$/i.test(u) || u.includes("/video/upload/")).length);
            if (totalVideoCount > 1) {
                toast.error("YouTube allows a maximum of 1 video per post.");
                return;
            }
            if (!youtubeTitle.trim()) {
                toast.error("YouTube video title is required.");
                return;
            }
            if (youtubeTitle.trim().length > 100) {
                toast.error(`YouTube video title exceeds 100 characters (Current: ${youtubeTitle.trim().length}/100).`);
                return;
            }
            if (content.length > 5000) {
                toast.error(`YouTube description exceeds 5,000 characters (Current: ${content.length}/5,000).`);
                return;
            }
            if (youtubeFirstComment.trim().length > 10000) {
                toast.error("YouTube first comment cannot exceed 10,000 characters.");
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

        if (isYouTubeSelected) {
            const ytData: Record<string, any> = {
                title: youtubeTitle.trim(),
                visibility: youtubeVisibility,
                categoryId: youtubeCategoryId,
                madeForKids: youtubeMadeForKids,
                containsSyntheticMedia: youtubeContainsSyntheticMedia,
                isShort: youtubeIsShort,
            };
            if (youtubePlaylistId) {
                ytData.playlistId = youtubePlaylistId;
            }
            if (youtubeFirstComment.trim()) {
                ytData.firstComment = youtubeFirstComment.trim();
            }
            if (youtubeCustomThumbnail.trim() && !youtubeIsShort) {
                ytData.thumbnail = youtubeCustomThumbnail.trim();
            }
            platformSpecificData.youtube = ytData;
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
            setYoutubeTitle("");
            setYoutubeVisibility("public");
            setYoutubeCategoryId("22");
            setYoutubeMadeForKids(false);
            setYoutubeContainsSyntheticMedia(false);
            setYoutubePlaylistId("");
            setYoutubeFirstComment("");
            setYoutubeCustomThumbnail("");
            setYoutubeIsShort(false);
            fetchPosts();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to schedule post");
        } finally {
            setLoading(false);
        }
    };

    const handleReEditFailedPost = (post: Post) => {
        setContent(post.content);
        if (Array.isArray(post.platforms)) setSelectedPlatforms(post.platforms);
        if (Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0) {
            setExistingMediaUrls(post.mediaUrls);
        } else if (post.mediaUrl) {
            setExistingMediaUrls([post.mediaUrl]);
        }
        setActiveTab("create");
        toast.success("Loaded failed post into Composer for editing");
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
            {/* Header Portal for Toggle Buttons */}
            <HeaderActionsPortal
                activeTab={activeTab}
                onTabChange={setActiveTab}
                postsCount={posts.length}
            />

            {/* TAB 1: CREATE POST */}
            {activeTab === "create" && (
                <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-6">
                    {/* Left Form Box */}
                    <SchedulerComposer
                        selectedPlatforms={selectedPlatforms}
                        onTogglePlatform={togglePlatform}
                        content={content}
                        onContentChange={setContent}
                        onMoveLinkToFirstComment={handleMoveLinkToFirstComment}
                        allPreviewMediaUrls={allPreviewMediaUrls}
                        hasVideo={hasVideo}
                        activeMediaType={activeMediaType}
                        mediaFiles={mediaFiles}
                        existingMediaUrls={existingMediaUrls}
                        maxAllowedImages={maxAllowedImages}
                        mediaUploaderHint={mediaUploaderHint}
                        isDragging={isDragging}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onRemoveFile={handleRemoveFile}
                        onRemoveExistingMedia={handleRemoveExistingMedia}
                        onAddFiles={handleAddFiles}
                        onOpenMediaModal={() => setIsMediaModalOpen(true)}
                        scheduledDate={scheduledDate}
                        onScheduledDateChange={setScheduledDate}
                        scheduledTime={scheduledTime}
                        onScheduledTimeChange={setScheduledTime}
                        firstComment={firstComment}
                        onFirstCommentChange={setFirstComment}
                        isFirstCommentRequired={isFirstCommentRequired}
                        onFirstCommentRequiredChange={setIsFirstCommentRequired}
                        disableLinkPreview={disableLinkPreview}
                        onDisableLinkPreviewChange={setDisableLinkPreview}
                        isLinkedinCollapsed={isLinkedinCollapsed}
                        onToggleLinkedinCollapse={() => setIsLinkedinCollapsed((prev) => !prev)}
                        facebookContentType={facebookContentType}
                        onFacebookContentTypeChange={setFacebookContentType}
                        facebookTitle={facebookTitle}
                        onFacebookTitleChange={setFacebookTitle}
                        facebookDraft={facebookDraft}
                        onFacebookDraftChange={setFacebookDraft}
                        facebookTextPreset={facebookTextPreset}
                        onFacebookTextPresetChange={setFacebookTextPreset}
                        facebookGeoCountries={facebookGeoCountries}
                        onFacebookGeoCountriesChange={setFacebookGeoCountries}
                        isFacebookCollapsed={isFacebookCollapsed}
                        onToggleFacebookCollapse={() => setIsFacebookCollapsed((prev) => !prev)}
                        instagramContentType={instagramContentType}
                        onInstagramContentTypeChange={setInstagramContentType}
                        instagramShareToFeed={instagramShareToFeed}
                        onInstagramShareToFeedChange={setInstagramShareToFeed}
                        instagramAudioConfig={instagramAudioConfig}
                        onInstagramAudioConfigChange={setInstagramAudioConfig}
                        onOpenAudioModal={() => setIsAudioModalOpen(true)}
                        instagramMuteAudio={instagramMuteAudio}
                        onInstagramMuteAudioChange={setInstagramMuteAudio}
                        instagramTrial={instagramTrial}
                        onInstagramTrialChange={setInstagramTrial}
                        instagramTrialGraduation={instagramTrialGraduation}
                        onInstagramTrialGraduationChange={setInstagramTrialGraduation}
                        instagramThumbnail={instagramThumbnail}
                        onInstagramThumbnailChange={setInstagramThumbnail}
                        instagramThumbOffset={instagramThumbOffset}
                        onInstagramThumbOffsetChange={setInstagramThumbOffset}
                        instagramCollaborators={instagramCollaborators}
                        onInstagramCollaboratorsChange={setInstagramCollaborators}
                        instagramLocationId={instagramLocationId}
                        onInstagramLocationIdChange={setInstagramLocationId}
                        instagramPaidPartnership={instagramPaidPartnership}
                        onInstagramPaidPartnershipChange={setInstagramPaidPartnership}
                        instagramSponsors={instagramSponsors}
                        onInstagramSponsorsChange={setInstagramSponsors}
                        instagramCommentsEnabled={instagramCommentsEnabled}
                        onInstagramCommentsEnabledChange={setInstagramCommentsEnabled}
                        isInstagramViaFacebook={isInstagramViaFacebook}
                        isInstagramCollapsed={isInstagramCollapsed}
                        onToggleInstagramCollapse={() => setIsInstagramCollapsed((prev) => !prev)}
                        youtubeTitle={youtubeTitle}
                        onYoutubeTitleChange={setYoutubeTitle}
                        youtubeVisibility={youtubeVisibility}
                        onYoutubeVisibilityChange={setYoutubeVisibility}
                        youtubeCategoryId={youtubeCategoryId}
                        onYoutubeCategoryIdChange={setYoutubeCategoryId}
                        youtubeMadeForKids={youtubeMadeForKids}
                        onYoutubeMadeForKidsChange={setYoutubeMadeForKids}
                        youtubeContainsSyntheticMedia={youtubeContainsSyntheticMedia}
                        onYoutubeContainsSyntheticMediaChange={setYoutubeContainsSyntheticMedia}
                        youtubePlaylistId={youtubePlaylistId}
                        onYoutubePlaylistIdChange={setYoutubePlaylistId}
                        youtubePlaylists={youtubePlaylists}
                        isLoadingPlaylists={loadingPlaylists}
                        onRefreshPlaylists={fetchYoutubePlaylists}
                        youtubeFirstComment={youtubeFirstComment}
                        onYoutubeFirstCommentChange={setYoutubeFirstComment}
                        youtubeCustomThumbnail={youtubeCustomThumbnail}
                        onYoutubeCustomThumbnailChange={setYoutubeCustomThumbnail}
                        youtubeIsShort={youtubeIsShort}
                        isYoutubeCollapsed={isYoutubeCollapsed}
                        onToggleYoutubeCollapse={() => setIsYoutubeCollapsed((prev) => !prev)}
                        onSubmit={handleSchedule}
                        loading={loading}
                    />

                    {/* Right Column: Unified Live Social Media Post Preview with Navigation (< >) */}
                    {selectedPlatforms.length > 0 && (
                        <SchedulerLivePreview
                            selectedPlatforms={selectedPlatforms}
                            activePreviewIndex={activePreviewIndex}
                            onPrevPreview={handlePrevPreview}
                            onNextPreview={handleNextPreview}
                            onSelectPreviewIndex={setActivePreviewIndex}
                            content={content}
                            previewMediaUrl={previewMediaUrl}
                            allPreviewMediaUrls={allPreviewMediaUrls}
                            activeMediaType={activeMediaType}
                            user={user}
                            firstComment={firstComment}
                            disableLinkPreview={disableLinkPreview}
                            onOpenMediaModal={() => setIsMediaModalOpen(true)}
                            facebookContentType={facebookContentType}
                            facebookTitle={facebookTitle}
                            facebookDraft={facebookDraft}
                            facebookTextPreset={facebookTextPreset}
                            instagramContentType={instagramContentType}
                            instagramCollaborators={instagramCollaborators}
                            instagramLocationId={instagramLocationId}
                            instagramPaidPartnership={instagramPaidPartnership}
                            instagramSponsors={instagramSponsors}
                            instagramAudioConfig={instagramAudioConfig}
                            instagramMuteAudio={instagramMuteAudio}
                            instagramTrial={instagramTrial}
                            instagramCommentsEnabled={instagramCommentsEnabled}
                            youtubeTitle={youtubeTitle}
                            youtubeVisibility={youtubeVisibility}
                            youtubeIsShort={youtubeIsShort}
                            youtubeFirstComment={youtubeFirstComment}
                            youtubeCustomThumbnail={youtubeCustomThumbnail}
                            youtubeMadeForKids={youtubeMadeForKids}
                            youtubeContainsSyntheticMedia={youtubeContainsSyntheticMedia}
                        />
                    )}
                </div>
            )}

            {/* TAB 2: POST HISTORY */}
            {activeTab === "history" && (
                <PostHistoryTab
                    posts={posts}
                    expandedPostIds={expandedPostIds}
                    onToggleExpand={togglePostExpansion}
                    onPreviewMedia={setPreviewModalMedia}
                    onDeleteUpcoming={setDeleteConfirmPost}
                    deletingId={deletingId}
                    onViewAnalytics={handleViewAnalytics}
                    onReEdit={handleReEditFailedPost}
                    onEditYoutubeDescription={(post) => setEditingYoutubePost(post)}
                    formatRelativeSchedule={formatRelativeSchedule}
                    onCreatePostClick={() => setActiveTab("create")}
                />
            )}

            {/* DELETE CONFIRMATION MODAL (FOR UPCOMING / SCHEDULED POSTS ONLY) */}
            <DeleteConfirmModal
                post={deleteConfirmPost}
                deletingId={deletingId}
                onClose={() => setDeleteConfirmPost(null)}
                onConfirm={handleDeletePost}
            />

            {/* MEDIA LIGHTBOX PREVIEW MODAL */}
            <MediaLightboxModal
                media={previewModalMedia}
                onClose={() => setPreviewModalMedia(null)}
            />

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
                    isLinkedInSelected,
                    isYouTubeSelected
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
            <PostAnalyticsModal
                postId={analyticsModalPost}
                analyticsData={analyticsData}
                loading={loadingAnalytics}
                onClose={() => {
                    setAnalyticsModalPost(null);
                    setAnalyticsData(null);
                }}
            />

            {/* YouTube Description Edit Modal */}
            <EditYoutubeDescriptionModal
                isOpen={Boolean(editingYoutubePost)}
                post={editingYoutubePost}
                onClose={() => setEditingYoutubePost(null)}
                onSuccess={(updatedPostId, newContent) => {
                    setPosts((prev) =>
                        prev.map((p) => (p._id === updatedPostId ? { ...p, content: newContent } : p))
                    );
                    setEditingYoutubePost(null);
                }}
            />
        </div>
    );
};

export default Scheduler;
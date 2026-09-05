import React, { useState } from "react";
import {
    HeartIcon,
    MessageCircleIcon,
    SendIcon,
    BookmarkIcon,
    MoreHorizontalIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MusicIcon,
    VolumeXIcon,
    SparklesIcon,
    MapPinIcon,
    EyeOffIcon,
    FilmIcon,
    ClockIcon,
} from "lucide-react";

export interface InstagramUser {
    name?: string;
    email?: string;
    picture?: string;
}

export interface InstagramPreviewProps {
    content?: string;
    mediaUrl?: string | string[] | null;
    mediaUrls?: string[];
    mediaType?: "image" | "video" | null;
    user?: InstagramUser | null;
    // Format and Platform Specific Options
    contentType?: "feed" | "reel" | "story";
    collaborators?: string[];
    locationId?: string;
    isPaidPartnership?: boolean;
    brandedContentSponsors?: string[];
    audioTitle?: string;
    artistName?: string;
    muteAudio?: boolean;
    isTrial?: boolean;
    commentsEnabled?: boolean;
}

export const InstagramPostPreview: React.FC<InstagramPreviewProps> = ({
    content = "",
    mediaUrl,
    mediaUrls,
    mediaType,
    user,
    contentType = "feed",
    collaborators = [],
    locationId,
    isPaidPartnership = false,
    brandedContentSponsors = [],
    audioTitle,
    artistName,
    muteAudio = false,
    isTrial = false,
    commentsEnabled = true,
}) => {
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const displayName = user?.name || "Creator";
    const username = user?.name
        ? user.name.toLowerCase().replace(/[^a-z0-9]/g, "")
        : "social_creator";

    const getMediaList = (): string[] => {
        const list: string[] = [];
        if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
            list.push(...mediaUrls.filter(Boolean));
        } else if (Array.isArray(mediaUrl)) {
            list.push(...mediaUrl.filter(Boolean));
        } else if (typeof mediaUrl === "string" && mediaUrl.trim() !== "") {
            list.push(mediaUrl);
        }
        return list;
    };

    const mediaList = getMediaList();
    const activeMedia = mediaList[currentMediaIndex] || mediaList[0] || undefined;

    const isVideo = (url?: string) => {
        if (!url) return mediaType === "video";
        return (
            mediaType === "video" ||
            /\.(mp4|webm|mov|ogg|mkv)$/i.test(url) ||
            url.includes("/video/upload/") ||
            url.startsWith("blob:")
        );
    };

    const renderFormattedContent = (text: string) => {
        if (!text.trim()) {
            return (
                <span className="text-slate-400 dark:text-zinc-500 italic">
                    Write a caption for your post...
                </span>
            );
        }

        const lines = text.split("\n");
        return lines.map((line, lineIdx) => {
            const tokens = line.split(/(\s+)/);
            return (
                <React.Fragment key={lineIdx}>
                    {tokens.map((token, tokenIdx) => {
                        if (token.match(/^([@#][\w_]+)/gi)) {
                            return (
                                <span
                                    key={tokenIdx}
                                    className="text-sky-600 dark:text-sky-400 font-semibold cursor-pointer hover:underline"
                                >
                                    {token}
                                </span>
                            );
                        }
                        return token;
                    })}
                    {lineIdx < lines.length - 1 && <br />}
                </React.Fragment>
            );
        });
    };

    // ==========================================
    // 1. STORY PREVIEW (9:16 Ephemeral Frame)
    // ==========================================
    if (contentType === "story") {
        return (
            <div className="w-full max-w-70 mx-auto aspect-9/16 bg-black rounded-2xl shadow-xl overflow-hidden relative flex flex-col justify-between border-2 border-slate-800 text-white font-sans select-none">
                {/* Story Top Progress Bar */}
                <div className="absolute top-2.5 inset-x-2 z-20 flex gap-1">
                    <div className="h-1 flex-1 bg-white/90 rounded-full shadow-xs" />
                </div>

                {/* Story Header */}
                <div className="absolute top-5 inset-x-3 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full p-0.5 bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
                            {user?.picture ? (
                                <img
                                    src={user.picture}
                                    alt={displayName}
                                    className="size-full rounded-full object-cover border border-black"
                                />
                            ) : (
                                <div className="size-full rounded-full bg-zinc-800 text-white font-bold text-[10px] flex items-center justify-center border border-black">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xs leading-none drop-shadow-md">
                                {username}
                            </span>
                            <span className="text-[9px] text-white/70 flex items-center gap-1 mt-0.5">
                                <ClockIcon className="size-2.5" /> 24h Story
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                            Story
                        </span>
                        <MoreHorizontalIcon className="size-4 text-white drop-shadow-md" />
                    </div>
                </div>

                {/* Story Media Background */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950">
                    {activeMedia ? (
                        isVideo(activeMedia) ? (
                            <video
                                src={activeMedia}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={activeMedia}
                                alt="Story Media"
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="p-6 text-center text-zinc-400 text-xs italic">
                            Upload 1 image or video to preview your Instagram Story
                        </div>
                    )}
                </div>

                {/* Story Bottom Interactive Overlay */}
                <div className="relative z-20 p-3 pt-6 bg-linear-to-t from-black/80 via-black/30 to-transparent flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 rounded-full border border-white/30 bg-black/30 backdrop-blur-md text-xs text-white/60">
                        Send message...
                    </div>
                    <button className="size-8 rounded-full flex items-center justify-center text-white hover:bg-white/10">
                        <HeartIcon className="size-4.5" />
                    </button>
                    <button className="size-8 rounded-full flex items-center justify-center text-white hover:bg-white/10">
                        <SendIcon className="size-4.5" />
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // 2. REEL PREVIEW (9:16 Vertical Video Frame)
    // ==========================================
    if (contentType === "reel") {
        return (
            <div className="w-full max-w-72.5 mx-auto aspect-9/16 bg-black rounded-2xl shadow-xl overflow-hidden relative flex flex-col justify-between border border-slate-800 text-white font-sans select-none">
                {/* Reel Header Pills */}
                <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 text-[11px] font-bold bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                            <FilmIcon className="size-3 text-pink-500" />
                            Reel
                        </span>
                        {isTrial && (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-purple-500/80 backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs">
                                <SparklesIcon className="size-2.5" /> Trial Reel
                            </span>
                        )}
                    </div>
                    {muteAudio && (
                        <span className="flex items-center gap-1 text-[10px] font-medium bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 text-white/80">
                            <VolumeXIcon className="size-3" /> Muted
                        </span>
                    )}
                </div>

                {/* Paid Partnership Banner if applicable */}
                {isPaidPartnership && (
                    <div className="absolute top-12 inset-x-0 z-20 py-1 bg-black/60 backdrop-blur-md border-y border-white/10 text-center text-[10px] font-semibold text-white/90">
                        Paid partnership
                        {brandedContentSponsors.length > 0 && (
                            <span> with {brandedContentSponsors.map(s => `@${s.replace(/^@/, "")}`).join(", ")}</span>
                        )}
                    </div>
                )}

                {/* Reel Video Media */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950">
                    {activeMedia ? (
                        isVideo(activeMedia) ? (
                            <video
                                src={activeMedia}
                                controls
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={activeMedia}
                                alt="Reel Video Preview"
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="p-6 text-center text-zinc-400 text-xs italic">
                            Upload a video file (MP4/MOV up to 90s) to preview Reel
                        </div>
                    )}
                </div>

                {/* Reel Right Action Sidebar */}
                <div className="absolute right-2 bottom-16 z-20 flex flex-col items-center gap-4 text-white">
                    <div className="flex flex-col items-center gap-1">
                        <button className="size-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors">
                            <HeartIcon className="size-5 fill-white" />
                        </button>
                        <span className="text-[10px] font-semibold drop-shadow-md">24.5K</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <button className="size-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors">
                            <MessageCircleIcon className="size-5 fill-white" />
                        </button>
                        <span className="text-[10px] font-semibold drop-shadow-md">
                            {commentsEnabled ? "382" : "Off"}
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <button className="size-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors">
                            <SendIcon className="size-5 fill-white" />
                        </button>
                        <span className="text-[10px] font-semibold drop-shadow-md">Share</span>
                    </div>
                    <button className="size-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors">
                        <BookmarkIcon className="size-5" />
                    </button>
                </div>

                {/* Reel Bottom Creator Info & Caption */}
                <div className="relative z-20 p-3 pt-8 bg-linear-to-t from-black via-black/60 to-transparent pr-14 text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="size-7 rounded-full p-0.5 bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
                            {user?.picture ? (
                                <img
                                    src={user.picture}
                                    alt={displayName}
                                    className="size-full rounded-full object-cover border border-black"
                                />
                            ) : (
                                <div className="size-full rounded-full bg-zinc-800 text-white font-bold text-[10px] flex items-center justify-center border border-black">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="font-bold text-xs text-white drop-shadow-md">
                            {username}
                        </span>
                        {collaborators.length > 0 && (
                            <span className="text-[10px] text-white/80 truncate">
                                with {collaborators.map(c => `@${c.replace(/^@/, "")}`).join(", ")}
                            </span>
                        )}
                        <button className="text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/50 text-white backdrop-blur-xs">
                            Follow
                        </button>
                    </div>

                    {/* Caption snippet */}
                    <div className="text-[11px] text-white/90 line-clamp-2 leading-tight drop-shadow-xs">
                        {content.trim() || "No caption provided"}
                    </div>

                    {/* Audio track ticker */}
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-white/80 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 w-fit max-w-full truncate">
                        <MusicIcon className="size-3 text-pink-400 shrink-0 animate-pulse" />
                        <span className="truncate">
                            {audioTitle ? `${artistName ? `${artistName} • ` : ""}${audioTitle}` : "Original Audio"}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 3. FEED / CAROUSEL PREVIEW (Standard Post)
    // ==========================================
    return (
        <div className="w-full max-w-[320px] mx-auto bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-md text-slate-900 dark:text-zinc-100 font-sans transition-all overflow-hidden text-left">
            {/* Paid Partnership Header */}
            {isPaidPartnership && (
                <div className="px-3 py-1 bg-slate-50 dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800/80 text-[10px] font-semibold text-slate-600 dark:text-zinc-400 text-center">
                    Paid partnership
                    {brandedContentSponsors.length > 0 && (
                        <span> with {brandedContentSponsors.map(s => `@${s.replace(/^@/, "")}`).join(", ")}</span>
                    )}
                </div>
            )}

            {/* Top Author Header */}
            <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-0.5 rounded-full bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 shrink-0">
                        {user?.picture ? (
                            <img
                                src={user.picture}
                                alt={displayName}
                                className="size-7 rounded-full object-cover border-2 border-white dark:border-zinc-900"
                            />
                        ) : (
                            <div className="size-7 rounded-full bg-slate-900 dark:bg-zinc-800 text-white font-bold text-[11px] flex items-center justify-center border-2 border-white dark:border-zinc-900">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white truncate leading-tight">
                                {username}
                            </span>
                            {collaborators.length > 0 && (
                                <span className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                                    and {collaborators.map(c => `@${c.replace(/^@/, "")}`).join(", ")}
                                </span>
                            )}
                        </div>
                        {locationId ? (
                            <span className="text-[10px] text-slate-500 dark:text-zinc-400 leading-tight flex items-center gap-0.5">
                                <MapPinIcon className="size-2.5 text-rose-500" /> Location #{locationId}
                            </span>
                        ) : (
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 leading-tight">
                                Original Post
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        type="button"
                        className="bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                    >
                        Follow
                    </button>
                    <button type="button" className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full">
                        <MoreHorizontalIcon className="size-4" />
                    </button>
                </div>
            </div>

            {/* Media Area (Supports Carousel Arrows & Dots) */}
            <div className="w-full aspect-square bg-slate-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden relative">
                {mediaList.length > 0 ? (
                    isVideo(activeMedia) ? (
                        <video
                            src={activeMedia}
                            controls
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={activeMedia}
                            alt="Instagram Post Media"
                            className="w-full h-full object-cover"
                        />
                    )
                ) : (
                    <div className="p-4 text-center text-slate-400 dark:text-zinc-500 text-xs italic">
                        No image or video attached. Upload media to preview Instagram post.
                    </div>
                )}

                {/* Carousel Navigation Arrows */}
                {mediaList.length > 1 && (
                    <>
                        {currentMediaIndex > 0 && (
                            <button
                                type="button"
                                onClick={() => setCurrentMediaIndex((prev) => Math.max(0, prev - 1))}
                                className="absolute left-2 top-1/2 -translate-y-1/2 size-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md"
                            >
                                <ChevronLeftIcon className="size-4" />
                            </button>
                        )}
                        {currentMediaIndex < mediaList.length - 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentMediaIndex((prev) => Math.min(mediaList.length - 1, prev + 1))}
                                className="absolute right-2 top-1/2 -translate-y-1/2 size-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-md"
                            >
                                <ChevronRightIcon className="size-4" />
                            </button>
                        )}

                        {/* Pagination Counter Badge */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white">
                            {currentMediaIndex + 1}/{mediaList.length}
                        </div>
                    </>
                )}
            </div>

            {/* Action Bar & Carousel Dots */}
            <div className="px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3.5 text-slate-800 dark:text-zinc-200">
                    <button type="button" className="hover:text-rose-500 transition-colors cursor-pointer">
                        <HeartIcon className="size-4.5" />
                    </button>
                    <button type="button" className="hover:text-sky-500 transition-colors cursor-pointer">
                        <MessageCircleIcon className="size-4.5" />
                    </button>
                    <button type="button" className="hover:text-sky-500 transition-colors cursor-pointer">
                        <SendIcon className="size-4.5" />
                    </button>
                </div>

                {/* Carousel Pagination Dots */}
                {mediaList.length > 1 && (
                    <div className="flex items-center gap-1">
                        {mediaList.map((_, idx) => (
                            <div
                                key={idx}
                                className={`size-1.5 rounded-full transition-all ${
                                    idx === currentMediaIndex
                                        ? "bg-sky-500 scale-125"
                                        : "bg-slate-300 dark:bg-zinc-700"
                                }`}
                            />
                        ))}
                    </div>
                )}

                <button type="button" className="text-slate-800 dark:text-zinc-200 hover:text-amber-500 transition-colors cursor-pointer">
                    <BookmarkIcon className="size-4.5" />
                </button>
            </div>

            {/* Social Proof Line */}
            <div className="px-3 text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <div className="size-3.5 rounded-full bg-slate-300 dark:bg-zinc-700 shrink-0" />
                <span>Liked by <strong>alok_kumar</strong> and <strong>1,842 others</strong></span>
            </div>

            {/* Caption */}
            <div className="px-3 pt-1 text-xs leading-snug text-slate-800 dark:text-zinc-200">
                <span className="font-bold mr-1.5 text-slate-900 dark:text-white">{username}</span>
                {renderFormattedContent(content)}
            </div>

            {/* Comments status */}
            <div className="px-3 pt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                {commentsEnabled ? (
                    <span className="hover:text-slate-600 cursor-pointer">View all 34 comments</span>
                ) : (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <EyeOffIcon className="size-3" /> Comments turned off for this post
                    </span>
                )}
            </div>

            {/* Time Ago Footer */}
            <div className="px-3 pt-1 pb-2.5 text-[9px] uppercase font-semibold text-slate-400 dark:text-zinc-500">
                Just now • Instagram
            </div>
        </div>
    );
};

export const InstagramPreview = InstagramPostPreview;
export default InstagramPostPreview;
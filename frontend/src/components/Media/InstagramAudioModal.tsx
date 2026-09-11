import React, { useState, useEffect, useRef, useCallback } from "react";
import { XIcon, MusicIcon, SearchIcon, PlayIcon, PauseIcon, CheckIcon, Volume2Icon, SparklesIcon, Loader2Icon } from "lucide-react";
import { api, API_PATHS } from "../../api/axios";
import { toast } from "sonner";

export interface SelectedAudioConfig {
    audioId: string;
    audioTitle?: string;
    artistName?: string;
    audioVolume: number;
    videoVolume: number;
}

interface InstagramAudioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAudio: (config: SelectedAudioConfig | null) => void;
    currentAudioConfig?: SelectedAudioConfig | null;
    accountId?: string;
}

export const InstagramAudioModal: React.FC<InstagramAudioModalProps> = ({
    isOpen,
    onClose,
    onSelectAudio,
    currentAudioConfig,
    accountId,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [tracks, setTracks] = useState<any[]>([]);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const [selectedTrack, setSelectedTrack] = useState<any>(null);
    const [audioVolume, setAudioVolume] = useState<number>(currentAudioConfig?.audioVolume ?? 100);
    const [videoVolume, setVideoVolume] = useState<number>(currentAudioConfig?.videoVolume ?? 100);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const fetchAudioTracks = useCallback(async (q: string) => {
        setLoading(true);
        try {
            const { data } = await api.get(API_PATHS.ACCOUNTS.INSTAGRAM_AUDIO_SEARCH(q, accountId));
            const results = data?.data || data?.results || (Array.isArray(data) ? data : []);
            setTracks(results);
        } catch (error: any) {
            // If backend returns account requirement message
            const msg = error.response?.data?.message || "Failed to search Instagram audio catalog";
            toast.error(msg);
            setTracks([]);
        } finally {
            setLoading(false);
        }
    }, [accountId]);

    // Initial search or preselect current track
    useEffect(() => {
        if (isOpen) {
            if (currentAudioConfig?.audioId) {
                setSelectedTrack({
                    id: currentAudioConfig.audioId,
                    title: currentAudioConfig.audioTitle || "Selected Audio",
                    artist_name: currentAudioConfig.artistName || "",
                });
                setAudioVolume(currentAudioConfig.audioVolume ?? 100);
                setVideoVolume(currentAudioConfig.videoVolume ?? 100);
            }
            fetchAudioTracks(searchQuery || "trending");
        } else {
            // Stop playback when modal closes
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setPlayingTrackId(null);
        }
    }, [isOpen, currentAudioConfig, fetchAudioTracks, searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        fetchAudioTracks(searchQuery.trim());
    };

    const togglePlay = (track: any) => {
        if (playingTrackId === track.id) {
            audioRef.current?.pause();
            setPlayingTrackId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            if (track.audio_asset_url || track.preview_url || track.url) {
                const url = track.audio_asset_url || track.preview_url || track.url;
                audioRef.current = new Audio(url);
                audioRef.current.volume = audioVolume / 100;
                audioRef.current.play().catch(() => toast.error("Could not play audio preview"));
                audioRef.current.onended = () => setPlayingTrackId(null);
                setPlayingTrackId(track.id);
            } else {
                toast.info("Audio preview not available for this track");
            }
        }
    };

    const handleConfirm = () => {
        if (!selectedTrack) {
            onSelectAudio(null);
            onClose();
            return;
        }

        onSelectAudio({
            audioId: selectedTrack.id || selectedTrack.audio_id || selectedTrack.audioId,
            audioTitle: selectedTrack.title || selectedTrack.audio_name || "Instagram Audio",
            artistName: selectedTrack.artist_name || selectedTrack.artist || "",
            audioVolume,
            videoVolume,
        });
        onClose();
    };

    const handleRemoveAudio = () => {
        if (audioRef.current) audioRef.current.pause();
        setSelectedTrack(null);
        onSelectAudio(null);
        toast.info("Catalog audio removed from Reel");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
            <div
                className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-xs">
                                <MusicIcon className="size-4" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Instagram Reel Audio Catalog
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                            Search Meta's licensed music library and attach official audio to your Reel.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                        <XIcon className="size-4" />
                    </button>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mt-4 flex gap-2 shrink-0">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search song title, artist, or genre..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                        {loading ? <Loader2Icon className="size-3.5 animate-spin" /> : "Search"}
                    </button>
                </form>

                {/* Track Results List */}
                <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1 min-h-55">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <Loader2Icon className="size-6 animate-spin text-pink-500" />
                            <span className="text-xs mt-2">Searching Instagram audio catalog...</span>
                        </div>
                    ) : tracks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                            <MusicIcon className="size-8 stroke-1 text-slate-300 dark:text-zinc-600" />
                            <span className="text-xs font-medium text-slate-600 dark:text-zinc-400 mt-2">
                                No audio tracks found
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                                Try searching for an artist name, song title, or popular trend.
                            </span>
                        </div>
                    ) : (
                        tracks.map((track) => {
                            const isSelected = selectedTrack?.id === track.id || selectedTrack?.audioId === track.id;
                            const isPlaying = playingTrackId === track.id;

                            return (
                                <div
                                    key={track.id}
                                    onClick={() => setSelectedTrack(track)}
                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                        isSelected
                                            ? "border-pink-500 bg-pink-50/40 dark:bg-pink-950/20 shadow-xs"
                                            : "border-slate-200/80 dark:border-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-900/40"
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {/* Play / Pause button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePlay(track);
                                            }}
                                            className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/60 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                                            title={isPlaying ? "Pause Preview" : "Play Preview"}
                                        >
                                            {isPlaying ? (
                                                <PauseIcon className="size-4 fill-current" />
                                            ) : (
                                                <PlayIcon className="size-4 fill-current ml-0.5" />
                                            )}
                                        </button>

                                        {/* Info */}
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                                {track.title || track.audio_name || "Audio Track"}
                                            </span>
                                            <span className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                                                {track.artist_name || track.artist || "Unknown Artist"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {isSelected && (
                                            <span className="flex items-center gap-1 text-[11px] font-semibold text-pink-600 dark:text-pink-400 bg-pink-100/60 dark:bg-pink-900/40 px-2 py-0.5 rounded-full">
                                                <CheckIcon className="size-3" />
                                                Selected
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Volume Controls (When Track is Selected) */}
                {selectedTrack && (
                    <div className="mt-4 p-3.5 rounded-xl border border-pink-200/80 dark:border-pink-900/40 bg-pink-50/20 dark:bg-pink-950/10 space-y-3 shrink-0">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <SparklesIcon className="size-3.5 text-pink-500" />
                                Selected Track: {selectedTrack.title || "Audio Track"}
                            </span>
                            <button
                                type="button"
                                onClick={handleRemoveAudio}
                                className="text-[11px] text-red-500 hover:text-red-700 font-medium cursor-pointer"
                            >
                                Remove Track
                            </button>
                        </div>

                        {/* Sliders Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-1">
                            <div>
                                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-300 mb-1">
                                    <span className="flex items-center gap-1">
                                        <MusicIcon className="size-3 text-pink-500" />
                                        Music Volume
                                    </span>
                                    <span className="font-bold">{audioVolume}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={audioVolume}
                                    onChange={(e) => setAudioVolume(Number(e.target.value))}
                                    className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-300 mb-1">
                                    <span className="flex items-center gap-1">
                                        <Volume2Icon className="size-3 text-blue-500" />
                                        Video Original Volume
                                    </span>
                                    <span className="font-bold">{videoVolume}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={videoVolume}
                                    onChange={(e) => setVideoVolume(Number(e.target.value))}
                                    className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-end gap-2.5 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="px-5 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-sm shadow-pink-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <CheckIcon className="size-3.5" />
                        <span>{selectedTrack ? "Attach Audio to Reel" : "Close"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstagramAudioModal;

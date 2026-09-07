import React, { useRef } from "react";
import {
    FilmIcon,
    ImageIcon,
    XIcon,
    LayersIcon,
    PlusIcon,
    UploadCloudIcon,
} from "lucide-react";

interface MediaUploaderProps {
    allPreviewMediaUrls: string[];
    hasVideo: boolean;
    activeMediaType: "image" | "video" | null;
    mediaFiles: File[];
    existingMediaUrls: string[];
    maxAllowedImages: number;
    mediaUploaderHint: string;
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onRemoveFile: (index: number) => void;
    onRemoveExistingMedia: (index: number) => void;
    onAddFiles: (files: FileList | File[]) => void;
    onOpenMediaModal: () => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
    allPreviewMediaUrls,
    hasVideo,
    activeMediaType,
    mediaFiles,
    maxAllowedImages,
    mediaUploaderHint,
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onRemoveFile,
    onRemoveExistingMedia,
    onAddFiles,
    onOpenMediaModal,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                        Media Attachment
                    </label>
                    {allPreviewMediaUrls.length > 0 && (
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                            {hasVideo
                                ? "(1 video)"
                                : `(${allPreviewMediaUrls.length}/${maxAllowedImages} images)`}
                        </span>
                    )}
                </div>
                {activeMediaType && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-red-500 dark:text-red-400 uppercase bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900/50">
                        {activeMediaType === "video" ? (
                            <FilmIcon className="size-3" />
                        ) : (
                            <ImageIcon className="size-3" />
                        )}
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
                                    if (mediaFiles.length > 0) onRemoveFile(0);
                                    else onRemoveExistingMedia(0);
                                }}
                                className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer shadow-xs z-10"
                                title="Remove video"
                            >
                                <XIcon className="size-3" />
                            </button>
                        </div>
                    ) : allPreviewMediaUrls.length <= 4 ? (
                        <div
                            className={`gap-2 h-44 p-0.5 ${
                                allPreviewMediaUrls.length === 1
                                    ? "flex items-center justify-center"
                                    : allPreviewMediaUrls.length === 2
                                    ? "grid grid-cols-2"
                                    : allPreviewMediaUrls.length === 3
                                    ? "grid grid-cols-3"
                                    : "grid grid-cols-2"
                            }`}
                        >
                            {allPreviewMediaUrls.map((url, i) => {
                                const isUploadedFile = i < mediaFiles.length;
                                const fileName = isUploadedFile
                                    ? mediaFiles[i].name
                                    : `Image ${i + 1}`;

                                return (
                                    <div
                                        key={`media-slot-${i}`}
                                        className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs aspect-video w-full h-full"
                                    >
                                        <img
                                            src={url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Number Tag */}
                                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9px] font-mono text-white">
                                            #{i + 1}
                                        </span>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (isUploadedFile) onRemoveFile(i);
                                                else onRemoveExistingMedia(i - mediaFiles.length);
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
                                const fileName = isUploadedFile
                                    ? mediaFiles[i].name
                                    : `Image ${i + 1}`;

                                return (
                                    <div
                                        key={`media-top3-${i}`}
                                        className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs aspect-video w-full h-full"
                                    >
                                        <img
                                            src={url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Number Tag */}
                                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[9px] font-mono text-white">
                                            #{i + 1}
                                        </span>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (isUploadedFile) onRemoveFile(i);
                                                else onRemoveExistingMedia(i - mediaFiles.length);
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
                                onClick={onOpenMediaModal}
                                className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs aspect-video w-full h-full cursor-pointer select-none text-left p-0 transition-all hover:ring-2 hover:ring-sky-500/50"
                                title={`Click to view all ${allPreviewMediaUrls.length} images & organize gallery`}
                            >
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
                                    onClick={onOpenMediaModal}
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
                                onChange={(e) => e.target.files && onAddFiles(e.target.files)}
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
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <label
                        className={`flex-1 flex flex-col items-center justify-center gap-2 py-6 px-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all group min-h-44 ${
                            isDragging
                                ? "border-red-500 bg-red-50/50 dark:bg-red-950/30 scale-[1.01]"
                                : "border-slate-200 dark:border-zinc-800 hover:border-red-400 dark:hover:border-red-700/60 hover:bg-red-50/20 dark:hover:bg-red-950/10"
                        }`}
                    >
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
                            onChange={(e) => e.target.files && onAddFiles(e.target.files)}
                        />
                    </label>
                </div>
            )}
        </div>
    );
};

export default MediaUploader;

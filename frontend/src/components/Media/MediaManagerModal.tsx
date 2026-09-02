import React, { useRef, useEffect, useState } from "react";
import {
    XIcon,
    PlusIcon,
    Trash2Icon,
    UploadCloudIcon,
    ImageIcon,
    LayersIcon
} from "lucide-react";

export interface MediaManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    mediaFiles: File[];
    mediaFileUrls: string[];
    existingMediaUrls: string[];
    onRemoveFile: (index: number) => void;
    onRemoveExistingUrl: (index: number) => void;
    onAddFiles: (files: FileList | File[]) => void;
    maxAllowed: number;
    platformName?: string;
    onClearAll?: () => void;
}

export const MediaManagerModal: React.FC<MediaManagerModalProps> = ({
    isOpen,
    onClose,
    mediaFiles,
    mediaFileUrls,
    existingMediaUrls,
    onRemoveFile,
    onRemoveExistingUrl,
    onAddFiles,
    maxAllowed = 20,
    platformName = "LinkedIn",
    onClearAll
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Close on Escape key and prevent background body scroll
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const totalCount = mediaFiles.length + existingMediaUrls.length;
    const remainingSlots = Math.max(0, maxAllowed - totalCount);
    const isMaxReached = totalCount >= maxAllowed;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onAddFiles(e.target.files);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
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
            onAddFiles(e.dataTransfer.files);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="relative w-full max-w-4xl max-h-[94vh] sm:max-h-[88vh] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all text-slate-900 dark:text-zinc-100 animate-in zoom-in-95 duration-200"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* MODAL HEADER */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/90 dark:bg-zinc-900/80 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
                            <LayersIcon className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                                    Manage Attached Media
                                </h3>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                    {totalCount} / {maxAllowed}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                                {platformName} multi-image gallery • Drag & drop or re-order media
                            </p>
                        </div>
                    </div>

                    {/* Header Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        {!isMaxReached && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs shadow-sky-500/20"
                            >
                                <PlusIcon className="size-3.5" />
                                <span>Add Images</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="Close modal (Esc)"
                        >
                            <XIcon className="size-5" />
                        </button>
                    </div>
                </div>

                {/* DRAG-OVERLAY HINT */}
                {isDragging && (
                    <div className="absolute inset-0 z-30 bg-sky-500/15 backdrop-blur-xs border-2 border-dashed border-sky-500 rounded-2xl sm:rounded-3xl flex items-center justify-center p-4">
                        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-sky-300 dark:border-sky-800 flex items-center gap-3">
                            <UploadCloudIcon className="size-6 text-sky-500 animate-bounce" />
                            <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
                                Drop files here to add to gallery
                            </span>
                        </div>
                    </div>
                )}

                {/* MODAL BODY (ORGANIZED RESPONSIVE GRID) */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-4">
                    {totalCount === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="p-4 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 mb-3 text-slate-400">
                                <ImageIcon className="size-8" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                                No media attached yet
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mt-1 mb-4">
                                Add up to {maxAllowed} images for your {platformName} post to create engaging carousels and multi-photo updates.
                            </p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                            >
                                <PlusIcon className="size-4" />
                                <span>Upload Media</span>
                            </button>
                        </div>
                    ) : (
                        /* Image Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                            {/* Newly uploaded files */}
                            {mediaFiles.map((file, i) => {
                                const isVid = file.type.startsWith("video/");
                                const blobUrl = mediaFileUrls[i];
                                const overallIndex = i + 1;

                                return (
                                    <div
                                        key={`modal-file-${i}`}
                                        className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs aspect-square sm:aspect-4/3 flex flex-col"
                                    >
                                        {isVid ? (
                                            <video
                                                src={blobUrl}
                                                controls
                                                playsInline
                                                className="w-full h-full object-contain bg-black"
                                            />
                                        ) : (
                                            <img
                                                src={blobUrl}
                                                alt={file.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        )}

                                        {/* Number Badge */}
                                        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-bold shadow-xs">
                                            #{overallIndex}
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => onRemoveFile(i)}
                                            className="absolute top-2 right-2 z-10 size-7 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md opacity-90 group-hover:opacity-100"
                                            title="Delete image"
                                        >
                                            <Trash2Icon className="size-3.5" />
                                        </button>

                                        {/* Bottom File Name Tag */}
                                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/85 via-black/50 to-transparent p-2 pt-4 pointer-events-none">
                                            <p className="text-[10px] font-mono text-white/90 truncate leading-tight">
                                                {file.name}
                                            </p>
                                            <span className="text-[9px] text-zinc-400">
                                                {(file.size / (1024 * 1024)).toFixed(1)} MB
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Pre-existing media URLs */}
                            {existingMediaUrls.map((url, i) => {
                                const isUrlVid = /\.(mp4|webm|mov|mkv|ogg)$/i.test(url) || url.includes("/video/upload/");
                                const overallIndex = mediaFiles.length + i + 1;

                                return (
                                    <div
                                        key={`modal-url-${i}`}
                                        className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-900 shadow-xs aspect-square sm:aspect-4/3 flex flex-col"
                                    >
                                        {isUrlVid ? (
                                            <video
                                                src={url}
                                                controls
                                                playsInline
                                                className="w-full h-full object-contain bg-black"
                                            />
                                        ) : (
                                            <img
                                                src={url}
                                                alt={`Media ${overallIndex}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        )}

                                        {/* Number Badge */}
                                        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-bold shadow-xs">
                                            #{overallIndex}
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => onRemoveExistingUrl(i)}
                                            className="absolute top-2 right-2 z-10 size-7 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md opacity-90 group-hover:opacity-100"
                                            title="Delete image"
                                        >
                                            <Trash2Icon className="size-3.5" />
                                        </button>

                                        {/* Bottom URL Tag */}
                                        <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/85 via-black/50 to-transparent p-2 pt-4 pointer-events-none">
                                            <p className="text-[10px] font-mono text-white/90 truncate leading-tight">
                                                Online Attachment
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add More Slot Card inside the Grid */}
                            {!isMaxReached && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-zinc-800 hover:border-sky-500 dark:hover:border-sky-500 bg-slate-50/50 dark:bg-zinc-900/40 hover:bg-sky-50/30 dark:hover:bg-sky-950/20 aspect-square sm:aspect-4/3 flex flex-col items-center justify-center gap-1.5 p-3 text-slate-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all cursor-pointer group shadow-2xs"
                                >
                                    <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 group-hover:bg-sky-500 group-hover:text-white transition-colors border border-slate-200 dark:border-zinc-700 shadow-2xs">
                                        <PlusIcon className="size-5" />
                                    </div>
                                    <span className="text-xs font-bold mt-1">Add Image</span>
                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                        {remainingSlots} slots remaining
                                    </span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* MODAL FOOTER */}
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-zinc-800 px-4 sm:px-6 py-3 bg-slate-50/80 dark:bg-zinc-900/60 shrink-0">
                    <div>
                        {totalCount > 0 && onClearAll && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to remove all attached media?")) {
                                        onClearAll();
                                    }
                                }}
                                className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
                            >
                                <Trash2Icon className="size-3.5" />
                                <span>Clear All</span>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5">
                        {!isMaxReached && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="sm:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer"
                            >
                                <PlusIcon className="size-3.5" />
                                <span>Add</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaManagerModal;

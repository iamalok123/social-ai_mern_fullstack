import React, { useState, useRef } from "react";
import { LightbulbIcon, XIcon, UploadCloudIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import type { Idea, Column } from "./types/idea";
import { api, API_PATHS } from "../../api/axios";

interface IdeaDialogModalProps {
    open?: boolean;
    idea?: Idea;
    columns: Column[];
    defaultColumnId: string;
    onClose: () => void;
    onSave: (idea: Idea) => void;
}

export const IdeaDialogModal: React.FC<IdeaDialogModalProps> = ({
    open = true,
    idea,
    columns,
    defaultColumnId,
    onClose,
    onSave,
}) => {
    const [title, setTitle] = useState(idea?.title || "");
    const [description, setDescription] = useState(idea?.description || "");
    const [selectedColumn, setSelectedColumn] = useState(idea?.columnId || defaultColumnId);
    const [images, setImages] = useState<string[]>(idea?.images || []);
    const [tagsInput, setTagsInput] = useState((idea?.tags || []).join(", "));
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!open) return null;

    const processFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);
        const toastId = toast.loading("Uploading image to Cloudinary...");

        try {
            const { data } = await api.post(API_PATHS.IDEAS.UPLOAD_IMAGE, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (data?.url) {
                setImages((prev) => [...prev, data.url]);
                toast.success("Image uploaded successfully!", { id: toastId });
            }
        } catch (error: any) {
            console.error("Failed to upload image", error);
            toast.error(
                error.response?.data?.message || "Failed to upload image to Cloudinary",
                { id: toastId }
            );
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Please enter a title for your idea");
            return;
        }

        const parsedTags = tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        onSave({
            id: idea?.id || `idea-${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            columnId: selectedColumn,
            images,
            tags: parsedTags,
            createdAt: idea?.createdAt || new Date().toISOString(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 px-5 py-3 bg-slate-50/70 dark:bg-zinc-950/70 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 sm:p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0">
                            <LightbulbIcon className="size-4" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                            {idea ? "Edit Content Idea" : "Create Content Idea"}
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <select
                            value={selectedColumn}
                            onChange={(e) => setSelectedColumn(e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs text-slate-800 dark:text-zinc-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
                        >
                            {columns.map((col) => (
                                <option key={col.id} value={col.id}>
                                    Column: {col.title}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <XIcon className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                    {/* Scrollable Content Body with hidden scrollbar */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                Idea Title <span className="text-orange-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Give your content idea a catchy title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/60 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                Description & Content Outline
                            </label>
                            <textarea
                                placeholder="Describe your main hook, key takeaways, script outline, or notes..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/60 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 resize-y leading-relaxed transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                                Tags / Categories <span className="text-slate-400 dark:text-zinc-500 font-normal">(comma separated)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Carousel, Reel, Productivity, Growth"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/60 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all"
                            />
                        </div>

                        {/* Image Uploading & Attachment Area */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                Image Attachments
                            </label>

                            {/* Compact Horizontal Drag and Drop Zone */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className={`relative group border-2 border-dashed rounded-xl px-4 py-2.5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                    isDragging
                                        ? "border-orange-500 bg-orange-500/10 dark:bg-orange-500/10 scale-[0.99]"
                                        : "border-slate-300 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 hover:bg-orange-500/5 hover:border-orange-500/40"
                                }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                {isUploading ? (
                                    <div className="flex items-center gap-2 py-0.5">
                                        <Loader2Icon className="size-4 animate-spin text-orange-500 shrink-0" />
                                        <p className="text-xs font-semibold text-orange-500">
                                            Uploading image to Cloudinary...
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-105 transition-transform shrink-0">
                                                <UploadCloudIcon className="size-4" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                                    Click to browse or drop an image here
                                                </p>
                                                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                    PNG, JPG, WEBP or GIF
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-semibold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20 shrink-0">
                                            Browse
                                        </span>
                                    </>
                                )}
                            </div>



                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                                    {images.map((url, i) => (
                                        <div
                                            key={i}
                                            className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 shadow-xs"
                                        >
                                            <img
                                                src={url}
                                                alt=""
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(i)}
                                                    className="p-1 rounded-full bg-red-600/90 text-white hover:bg-red-600 transition-transform hover:scale-110 cursor-pointer shadow-md"
                                                    title="Remove image"
                                                >
                                                    <XIcon className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="flex items-center justify-end gap-2.5 px-4 sm:px-5 py-2.5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/70 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim() || isUploading}
                            className="px-5 py-1.5 rounded-xl bg-linear-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-semibold transition-all shadow-md hover:shadow-orange-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Idea
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IdeaDialogModal;

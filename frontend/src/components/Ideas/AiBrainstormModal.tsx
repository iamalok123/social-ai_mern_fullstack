import React, { useState, useRef } from "react";
import { 
    SparklesIcon, XIcon, CheckIcon, RefreshCwIcon, ArrowLeft, 
    Wand2Icon, Loader2Icon, CheckCheckIcon,
    ArrowUpRightIcon, ArrowDownRightIcon, ImageIcon 
} from "lucide-react";
import { toast } from "sonner";
import type { Idea } from "./types/idea";
import { api, API_PATHS } from "../../api/axios";

interface AiBrainstormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveIdea: (idea: Idea) => void;
}

export const AiBrainstormModal: React.FC<AiBrainstormModalProps> = ({
    isOpen,
    onClose,
    onSaveIdea,
}) => {
    const [aiStep, setAiStep] = useState<1 | 2 | 3>(1);
    
    // Step 1 states
    const [businessType, setBusinessType] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [topic, setTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Step 2 states
    const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
    const [selectedAiIndex, setSelectedAiIndex] = useState(0);

    // Step 3 states
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const [showAiMenu, setShowAiMenu] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleGenerateAi = async () => {
        if (!businessType.trim() && !targetAudience.trim() && !topic.trim()) {
            toast.error("Please fill in business details or target audience to generate content ideas.");
            return;
        }

        setIsGenerating(true);
        try {
            const { data } = await api.post(API_PATHS.IDEAS.GENERATE_AI, {
                businessType: businessType.trim(),
                targetAudience: targetAudience.trim(),
                topic: topic.trim(),
            });

            if (data?.ideas && Array.isArray(data.ideas)) {
                const formattedIdeas: Idea[] = data.ideas.map((item: any, idx: number) => ({
                    id: `ai-${Date.now()}-${idx}`,
                    title: item.title,
                    description: item.description,
                    columnId: "backlog",
                    tags: item.tags || ["AI Generated"],
                    createdAt: new Date().toISOString(),
                }));
                setGeneratedIdeas(formattedIdeas);
                setSelectedAiIndex(0);
                setAiStep(2);
                toast.success("Generated 4 AI content ideas!");
            }
        } catch (error: any) {
            console.error("Failed to generate AI ideas", error);
            toast.error(error.response?.data?.message || "Failed to generate AI content ideas");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleProceedToEdit = () => {
        const chosen = generatedIdeas[selectedAiIndex];
        if (chosen) {
            setEditedTitle(chosen.title);
            setEditedDescription(chosen.description || "");
            setAiStep(3);
        }
    };

    const handleFinalSave = () => {
        const chosen = generatedIdeas[selectedAiIndex];
        if (!editedTitle.trim()) {
            toast.error("Title cannot be empty");
            return;
        }
        
        onSaveIdea({
            ...chosen,
            title: editedTitle.trim(),
            description: editedDescription.trim(),
            images: images,
        });
        toast.success("Idea added to Backlog!");
        handleClose();
    };

    const handleClose = () => {
        onClose();
        setAiStep(1);
        setEditedTitle("");
        setEditedDescription("");
        setImages([]);
        setShowAiMenu(false);
    };

    // --- Image Upload Logic ---
    const processFile = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);
        const toastId = toast.loading("Uploading image...");

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
                error.response?.data?.message || "Failed to upload image",
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

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // --- AI Assistant Logic ---
    const handleAiAction = async (action: "grammar" | "longer" | "shorter") => {
        if (!editedDescription.trim()) {
            toast.error("Description is empty. Nothing to enhance.");
            return;
        }
        
        setShowAiMenu(false);
        setIsAiProcessing(true);
        const toastId = toast.loading("AI is enhancing your content...");

        try {
            const { data } = await api.post(API_PATHS.IDEAS.AI_ASSISTANT, {
                content: editedDescription,
                action,
            });
            if (data?.modifiedContent) {
                setEditedDescription(data.modifiedContent);
                toast.success("Content updated successfully!", { id: toastId });
            }
        } catch (error: any) {
            console.error("AI Assistant Error", error);
            toast.error(error.response?.data?.message || "Failed to process content", { id: toastId });
        } finally {
            setIsAiProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 px-5 py-4 bg-slate-50/70 dark:bg-zinc-950/70 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0">
                            {aiStep === 3 ? (
                                <Wand2Icon className="size-4" />
                            ) : (
                                <SparklesIcon className="size-4 animate-pulse" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                                {aiStep === 3 ? "Edit Idea" : "Generate Content Ideas"}
                            </h3>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-400">
                                {aiStep === 1
                                    ? "Step 1 of 3: Define your business context"
                                    : aiStep === 2
                                    ? "Step 2 of 3: Pick your favorite idea"
                                    : "Step 3 of 3: Edit & customize your idea"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <XIcon className="size-4" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-6 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                    {aiStep === 1 && (
                        <div className="space-y-4">
                            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                                Tell us about your business & audience to get 4 personalized, high-converting content ideas generated by AI.
                            </p>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                                    Business Type / Niche <span className="text-orange-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Fitness brand, SaaS productivity tool, E-commerce fashion"
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/60 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                                    Target Audience <span className="text-orange-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Busy professionals, Remote developers, Content creators"
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/60 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                                    Content Goal / Topic <span className="text-slate-400 dark:text-zinc-500 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Viral reels, Product launch, How-to guides, Myth busting"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/60 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleGenerateAi}
                                disabled={isGenerating || (!businessType.trim() && !targetAudience.trim())}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-linear-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md hover:shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <SparklesIcon className="size-4 animate-spin" />
                                        <span>Generating 4 tailored ideas with Gemini...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="size-4" />
                                        <span>Generate Ideas</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {aiStep === 2 && (
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                        Generated Ideas
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        Select an idea to add directly to your content board:
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGenerateAi}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold cursor-pointer disabled:opacity-50"
                                >
                                    <RefreshCwIcon className={`size-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                                    <span>Regenerate</span>
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {generatedIdeas.map((idea, idx) => {
                                    const isSelected = selectedAiIndex === idx;
                                    return (
                                        <div
                                            key={idea.id}
                                            onClick={() => setSelectedAiIndex(idx)}
                                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                                                isSelected
                                                    ? "border-orange-500 bg-orange-500/10 dark:bg-orange-500/10 ring-2 ring-orange-500/30 shadow-xs"
                                                    : "border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 hover:border-slate-300 dark:hover:border-zinc-700"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`mt-0.5 size-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                                        isSelected
                                                            ? "border-orange-500 bg-orange-500 text-white"
                                                            : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                                    }`}
                                                >
                                                    {isSelected && <CheckIcon className="size-3 stroke-3" />}
                                                </div>
                                                <div className="space-y-1 min-w-0 flex-1">
                                                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                                                        {idea.title}
                                                    </h5>
                                                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                                                        {idea.description}
                                                    </p>
                                                    {idea.tags && idea.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                                            {idea.tags.map((tag, tIdx) => (
                                                                <span
                                                                    key={tIdx}
                                                                    className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-semibold border border-orange-500/20"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setAiStep(1)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                    <ArrowLeft  className="size-3 stroke-3" /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleProceedToEdit}
                                    className="flex-1 py-2.5 px-3 bg-linear-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer text-center"
                                >
                                    Use Selected Idea
                                </button>
                            </div>
                        </div>
                    )}

                    {aiStep === 3 && (
                        <div className="space-y-4 flex flex-col h-full">
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-400"
                                placeholder="Idea Title"
                            />
                            
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                rows={6}
                                className="w-full text-sm text-slate-700 dark:text-zinc-300 bg-transparent border-none focus:outline-none focus:ring-0 resize-y leading-relaxed placeholder:text-slate-400"
                                placeholder="Description and content outline..."
                            />

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                {/* Image Upload Button */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => !isUploading && fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 hover:border-orange-500 hover:bg-orange-500/5 transition-all text-xs font-semibold text-slate-600 dark:text-zinc-400 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {isUploading ? (
                                        <Loader2Icon className="size-4 animate-spin text-orange-500" />
                                    ) : (
                                        <ImageIcon className="size-4" />
                                    )}
                                    <span>{isUploading ? "Uploading..." : "Select File"}</span>
                                </button>
                                
                                {/* AI Assistant Menu */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowAiMenu(!showAiMenu)}
                                        disabled={isAiProcessing}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        {isAiProcessing ? (
                                            <Loader2Icon className="size-4 animate-spin text-purple-500" />
                                        ) : (
                                            <Wand2Icon className="size-4 text-purple-500" />
                                        )}
                                        <span>AI Assistant</span>
                                    </button>

                                    {showAiMenu && (
                                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden z-10 py-1">
                                            <button
                                                type="button"
                                                onClick={() => handleAiAction("grammar")}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                                            >
                                                <CheckCheckIcon className="size-3.5 text-slate-400" />
                                                Correct Grammar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleAiAction("longer")}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                                            >
                                                <ArrowUpRightIcon className="size-3.5 text-slate-400" />
                                                Make Longer
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleAiAction("shorter")}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                                            >
                                                <ArrowDownRightIcon className="size-3.5 text-slate-400" />
                                                Make Shorter
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="flex gap-2 pt-2">
                                    {images.map((url, i) => (
                                        <div
                                            key={i}
                                            className="relative group size-14 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 shadow-xs shrink-0"
                                        >
                                            <img
                                                src={url}
                                                alt=""
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(i)}
                                                    className="p-1 rounded-full bg-red-600/90 text-white hover:bg-red-600 transition-transform hover:scale-110 cursor-pointer shadow-md"
                                                    title="Remove image"
                                                >
                                                    <XIcon className="size-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-zinc-800 mt-auto">
                                <button
                                    type="button"
                                    onClick={() => setAiStep(2)}
                                    className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleFinalSave}
                                    disabled={isAiProcessing || isUploading || !editedTitle.trim()}
                                    className="px-5 py-1.5 bg-lime-500 hover:bg-lime-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Save Idea
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiBrainstormModal;

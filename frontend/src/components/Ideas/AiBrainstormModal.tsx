import React, { useState } from "react";
import { SparklesIcon, XIcon, CheckIcon, RefreshCwIcon } from "lucide-react";
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
    const [aiStep, setAiStep] = useState<1 | 2>(1);
    const [businessType, setBusinessType] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [topic, setTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
    const [selectedAiIndex, setSelectedAiIndex] = useState(0);

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

    const handleUseAiIdea = () => {
        const chosen = generatedIdeas[selectedAiIndex];
        if (chosen) {
            onSaveIdea(chosen);
            toast.success("Selected AI content idea added to Backlog!");
        }
        handleClose();
    };

    const handleClose = () => {
        onClose();
        setAiStep(1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 px-5 py-4 bg-slate-50/70 dark:bg-zinc-950/70 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0">
                            <SparklesIcon className="size-4 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                                Generate Content Ideas
                            </h3>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-400">
                                {aiStep === 1 ? "Step 1 of 2: Define your business context" : "Step 2 of 2: Pick your favorite idea"}
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
                    {aiStep === 1 ? (
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
                    ) : (
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
                                    className="flex-1 py-2.5 px-3 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-center"
                                >
                                    ✕ Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUseAiIdea}
                                    className="flex-1 py-2.5 px-3 bg-linear-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer text-center"
                                >
                                    Use Selected Idea
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

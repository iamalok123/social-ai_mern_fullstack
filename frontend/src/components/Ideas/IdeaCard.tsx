import React from "react";
import {
    MoreHorizontalIcon,
    EditIcon,
    Wand2Icon,
    CalendarIcon,
    Trash2Icon,
    TagIcon,
    GripVerticalIcon,
    ArrowRightIcon
} from "lucide-react";
import type { Idea, ColumnMeta } from "./types/idea";

interface IdeaCardProps {
    idea: Idea;
    columnId: string;
    meta: ColumnMeta;
    isMenuOpen: boolean;
    isBeingDragged: boolean;
    isDragOverTarget?: boolean;
    onDragStart: (e: React.DragEvent, ideaId: string) => void;
    onDragOverCard?: (e: React.DragEvent, ideaId: string) => void;
    onDropOnCard?: (e: React.DragEvent, columnId: string, ideaId: string) => void;
    onCardClick: () => void;
    onToggleMenu: (e: React.MouseEvent) => void;
    onEditIdea: () => void;
    onSendToAIComposer: (idea: Idea) => void;
    onSendToScheduler: (idea: Idea) => void;
    onDeleteIdea: (columnId: string, ideaId: string) => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
    idea,
    columnId,
    meta,
    isMenuOpen,
    isBeingDragged,
    isDragOverTarget = false,
    onDragStart,
    onDragOverCard,
    onDropOnCard,
    onCardClick,
    onToggleMenu,
    onEditIdea,
    onSendToAIComposer,
    onSendToScheduler,
    onDeleteIdea,
}) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, idea.id)}
            onDragOver={(e) => {
                if (onDragOverCard) {
                    e.preventDefault();
                    e.stopPropagation();
                    onDragOverCard(e, idea.id);
                }
            }}
            onDrop={(e) => {
                if (onDropOnCard) {
                    e.preventDefault();
                    e.stopPropagation();
                    onDropOnCard(e, columnId, idea.id);
                }
            }}
            onClick={onCardClick}
            className={`group relative rounded-xl bg-white dark:bg-zinc-950 border transition-all duration-200 cursor-pointer active:cursor-grabbing hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-zinc-700 p-4 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/40 ${
                isBeingDragged ? "opacity-30 scale-95" : "opacity-100"
            } ${
                isDragOverTarget
                    ? "border-orange-500 ring-2 ring-orange-500/30 scale-[1.02]"
                    : "border-slate-200/90 dark:border-zinc-800/90"
            }`}
        >
            {/* Top Accent Line */}
            <div className={`absolute top-0 left-4 right-4 h-0.5 rounded-full bg-linear-to-r ${meta.accentColor}`} />

            {/* Card Options & Title */}
            <div className="flex items-start justify-between gap-2 mb-2 pt-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {idea.title}
                </h4>

                {/* Dropdown Menu */}
                <div className="relative shrink-0">
                    <button
                        type="button"
                        onClick={onToggleMenu}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                        <MoreHorizontalIcon className="size-4" />
                    </button>

                    {isMenuOpen && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-8 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 duration-100 text-xs"
                        >
                            <button
                                onClick={onEditIdea}
                                className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-left font-medium cursor-pointer"
                            >
                                <EditIcon className="size-3.5 text-slate-500" /> Edit Idea
                            </button>

                            <button
                                onClick={() => onSendToAIComposer(idea)}
                                className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left font-medium cursor-pointer"
                            >
                                <Wand2Icon className="size-3.5" /> AI Composer
                            </button>

                            <button
                                onClick={() => onSendToScheduler(idea)}
                                className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-left font-medium cursor-pointer"
                            >
                                <CalendarIcon className="size-3.5" /> Schedule Post
                            </button>

                            <div className="h-px bg-slate-100 dark:bg-zinc-800 my-1" />

                            <button
                                onClick={() => onDeleteIdea(columnId, idea.id)}
                                className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-left font-medium cursor-pointer"
                            >
                                <Trash2Icon className="size-3.5" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Description Preview */}
            {idea.description && (
                <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-2.5">
                    {idea.description}
                </p>
            )}

            {/* Tags Badges */}
            {idea.tags && idea.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {idea.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-700/60"
                        >
                            <TagIcon className="size-2.5 opacity-60" />
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Image Thumbnails */}
            {idea.images && idea.images.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {idea.images.map((imgUrl, i) => (
                        <img
                            key={i}
                            src={imgUrl}
                            alt=""
                            className="h-14 w-full object-cover rounded-lg border border-slate-200/80 dark:border-zinc-800 shadow-xs group-hover:opacity-95 transition-opacity"
                        />
                    ))}
                </div>
            )}

            {/* Quick Action Footer */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-slate-400 dark:text-zinc-500 font-medium">
                    <GripVerticalIcon className="size-3 text-slate-300 dark:text-zinc-700" /> Drag to move
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSendToAIComposer(idea);
                    }}
                    className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                    <span>Compose</span>
                    <ArrowRightIcon className="size-3" />
                </button>
            </div>
        </div>
    );
};

export default IdeaCard;

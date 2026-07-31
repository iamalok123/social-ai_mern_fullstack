import React from "react";
import { PlusIcon } from "lucide-react";
import type { Column, Idea } from "./types/idea";
import { COLUMN_CONFIG } from "./types/constants";
import { IdeaCard } from "./IdeaCard";

interface KanbanColumnProps {
    column: Column;
    dragOverColumnId: string | null;
    draggedIdeaId: string | null;
    dragOverIdeaId?: string | null;
    activeDropdownCardId: string | null;
    onDragOver: (e: React.DragEvent, columnId: string) => void;
    onDragOverCard?: (e: React.DragEvent, ideaId: string) => void;
    onDragLeave: (columnId: string) => void;
    onDrop: (e: React.DragEvent, columnId: string, targetIdeaId?: string) => void;
    onDragStart: (e: React.DragEvent, ideaId: string) => void;
    onOpenCreateModal: (columnId: string) => void;
    onOpenEditModal: (idea: Idea, columnId: string) => void;
    onToggleDropdown: (cardId: string | null) => void;
    onSendToAIComposer: (idea: Idea) => void;
    onSendToScheduler: (idea: Idea) => void;
    onDeleteIdea: (columnId: string, ideaId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    column,
    dragOverColumnId,
    draggedIdeaId,
    dragOverIdeaId,
    activeDropdownCardId,
    onDragOver,
    onDragOverCard,
    onDragLeave,
    onDrop,
    onDragStart,
    onOpenCreateModal,
    onOpenEditModal,
    onToggleDropdown,
    onSendToAIComposer,
    onSendToScheduler,
    onDeleteIdea,
}) => {
    const meta = COLUMN_CONFIG[column.id] || COLUMN_CONFIG.backlog;
    const ColumnIcon = meta.icon;
    const isDragOver = dragOverColumnId === column.id && !dragOverIdeaId;

    return (
        <div
            onDragOver={(e) => onDragOver(e, column.id)}
            onDragLeave={() => onDragLeave(column.id)}
            onDrop={(e) => onDrop(e, column.id)}
            className={`flex flex-col flex-1 w-80 min-w-65 max-w-95 shrink-0 rounded-2xl p-4 transition-all duration-200 border ${
                isDragOver
                    ? "bg-orange-50/80 dark:bg-orange-950/30 border-orange-400 dark:border-orange-500/80 ring-2 ring-orange-500/20 shadow-lg scale-[1.01]"
                    : "bg-slate-50/80 dark:bg-zinc-900/50 border-slate-200/90 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700/80"
            } backdrop-blur-xs`}
        >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3.5 px-1 border-b border-slate-200/80 dark:border-zinc-800 mb-3.5">
                <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border ${meta.badgeClass}`}>
                        <ColumnIcon className="size-3.5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-zinc-100 tracking-tight">
                        {column.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold border ${meta.badgeClass}`}>
                        {column.ideas.length}
                    </span>
                </div>
                <button
                    onClick={() => onOpenCreateModal(column.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-slate-200/70 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
                    title="Add idea to column"
                >
                    <PlusIcon className="size-4" />
                </button>
            </div>

            {/* Cards Container */}
            <div className="space-y-3 min-h-48 max-h-[calc(100vh-240px)] overflow-y-auto pr-1 custom-scrollbar flex-1 flex flex-col">
                {column.ideas.map((idea) => {
                    const isMenuOpen = activeDropdownCardId === idea.id;

                    return (
                        <IdeaCard
                            key={idea.id}
                            idea={idea}
                            columnId={column.id}
                            meta={meta}
                            isMenuOpen={isMenuOpen}
                            isBeingDragged={draggedIdeaId === idea.id}
                            isDragOverTarget={dragOverIdeaId === idea.id}
                            onDragStart={onDragStart}
                            onDragOverCard={onDragOverCard}
                            onDropOnCard={(e, colId, targetIdeaId) => onDrop(e, colId, targetIdeaId)}
                            onCardClick={() => onOpenEditModal(idea, column.id)}
                            onToggleMenu={(e) => {
                                e.stopPropagation();
                                onToggleDropdown(isMenuOpen ? null : idea.id);
                            }}
                            onEditIdea={() => {
                                onToggleDropdown(null);
                                onOpenEditModal(idea, column.id);
                            }}
                            onSendToAIComposer={onSendToAIComposer}
                            onSendToScheduler={onSendToScheduler}
                            onDeleteIdea={onDeleteIdea}
                        />
                    );
                })}

                {/* Empty / Quick Add Placeholder */}
                {column.ideas.length === 0 ? (
                    <button
                        onClick={() => onOpenCreateModal(column.id)}
                        className="group flex-1 flex flex-col items-center justify-center gap-2.5 p-6 border-2 border-dashed border-slate-300/80 dark:border-zinc-800/80 hover:border-orange-400 dark:hover:border-orange-500/50 hover:bg-orange-50/40 dark:hover:bg-orange-500/5 rounded-xl transition-all duration-200 cursor-pointer min-h-45"
                    >
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-800/80 text-slate-400 dark:text-zinc-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/10 transition-colors">
                            <PlusIcon className="size-5" />
                        </div>
                        <span className="font-bold text-xs text-slate-700 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            Add Idea
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 text-center">
                            Click or drag an idea into this stage
                        </span>
                    </button>
                ) : (
                    <button
                        onClick={() => onOpenCreateModal(column.id)}
                        className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 dark:border-zinc-800/80 hover:border-orange-400 dark:hover:border-orange-500/50 hover:bg-orange-50/40 dark:hover:bg-orange-500/5 rounded-xl text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 cursor-pointer mt-auto"
                    >
                        <PlusIcon className="size-3.5" />
                        <span>Add Idea</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;

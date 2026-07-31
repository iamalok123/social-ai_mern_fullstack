import React from "react";
import type { Column, Idea } from "./types/idea";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
    columns: Column[];
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

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
    columns,
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
    return (
        <div className="flex-1 overflow-x-auto pb-6 custom-scrollbar">
            <div className="flex h-full gap-6 justify-center items-stretch min-w-210 max-w-7xl mx-auto px-2">
                {columns.map((column) => (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        dragOverColumnId={dragOverColumnId}
                        draggedIdeaId={draggedIdeaId}
                        dragOverIdeaId={dragOverIdeaId}
                        activeDropdownCardId={activeDropdownCardId}
                        onDragOver={onDragOver}
                        onDragOverCard={onDragOverCard}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onDragStart={onDragStart}
                        onOpenCreateModal={onOpenCreateModal}
                        onOpenEditModal={onOpenEditModal}
                        onToggleDropdown={onToggleDropdown}
                        onSendToAIComposer={onSendToAIComposer}
                        onSendToScheduler={onSendToScheduler}
                        onDeleteIdea={onDeleteIdea}
                    />
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;

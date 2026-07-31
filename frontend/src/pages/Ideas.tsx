import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    IdeasHeader,
    KanbanBoard,
    AiBrainstormModal,
    IdeaDialogModal,
    INITIAL_COLUMNS,
    LOCAL_STORAGE_KEY,
} from "../components/Ideas";
import type { Idea, Column } from "../components/Ideas";
import { api, API_PATHS } from "../api/axios";

export type { Idea, Column };
export { IdeaDialogModal };

export default function Ideas() {
    const navigate = useNavigate();

    // Load initial state from LocalStorage or default mock data
    const [columns, setColumns] = useState<Column[]>(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Failed to load ideas from local storage", e);
        }
        return INITIAL_COLUMNS;
    });

    // Fetch user ideas from backend on mount
    useEffect(() => {
        const fetchBackendIdeas = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const { data } = await api.get(API_PATHS.IDEAS.GET_ALL);
                if (Array.isArray(data)) {
                    const mappedIdeas: Idea[] = data.map((item: any) => ({
                        id: item._id || item.id,
                        title: item.title,
                        description: item.description || "",
                        columnId: item.columnId || "backlog",
                        images: item.images || [],
                        tags: item.tags || [],
                        createdAt: item.createdAt,
                    }));

                    setColumns((prevCols) =>
                        prevCols.map((col) => ({
                            ...col,
                            ideas: mappedIdeas.filter((i) => i.columnId === col.id),
                        }))
                    );
                }
            } catch (e) {
                console.warn("Backend ideas fetch failed, keeping local state", e);
            }
        };

        fetchBackendIdeas();
    }, []);

    // Save to LocalStorage whenever columns state updates
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(columns));
        } catch (e) {
            console.error("Failed to persist ideas", e);
        }
    }, [columns]);

    // Active Modal state for Create / Edit
    const [activeModal, setActiveModal] = useState<{
        open: boolean;
        idea?: Idea;
        columnId?: string;
    }>({ open: false });

    // AI Generation Popover Modal State
    const [aiPopoverOpen, setAiPopoverOpen] = useState(false);

    // Active Dropdown Menu state per card
    const [activeDropdownCardId, setActiveDropdownCardId] = useState<string | null>(null);

    // Drag and Drop State
    const [draggedIdeaId, setDraggedIdeaId] = useState<string | null>(null);
    const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
    const [dragOverIdeaId, setDragOverIdeaId] = useState<string | null>(null);

    // Close dropdown menu on outer click
    useEffect(() => {
        const handleGlobalClick = () => setActiveDropdownCardId(null);
        window.addEventListener("click", handleGlobalClick);
        return () => window.removeEventListener("click", handleGlobalClick);
    }, []);

    // Handlers
    const handleSaveIdea = async (savedIdea: Idea) => {
        let finalIdea = savedIdea;

        // Try API sync if user is logged in
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const isMongoId = /^[0-9a-fA-F]{24}$/.test(savedIdea.id);
                if (isMongoId) {
                    const { data } = await api.put(API_PATHS.IDEAS.UPDATE(savedIdea.id), {
                        title: savedIdea.title,
                        description: savedIdea.description,
                        columnId: savedIdea.columnId,
                        images: savedIdea.images,
                        tags: savedIdea.tags,
                    });
                    finalIdea = { ...savedIdea, id: data._id || data.id };
                } else {
                    const { data } = await api.post(API_PATHS.IDEAS.CREATE, {
                        title: savedIdea.title,
                        description: savedIdea.description,
                        columnId: savedIdea.columnId,
                        images: savedIdea.images,
                        tags: savedIdea.tags,
                    });
                    finalIdea = { ...savedIdea, id: data._id || data.id };
                }
            } catch (e) {
                console.warn("API save idea error, using local save", e);
            }
        }

        setColumns((prevCols) => {
            const cleanedCols = prevCols.map((col) => ({
                ...col,
                ideas: col.ideas.filter((i) => i.id !== savedIdea.id && i.id !== finalIdea.id),
            }));

            return cleanedCols.map((col) => {
                if (col.id === finalIdea.columnId) {
                    return {
                        ...col,
                        ideas: [finalIdea, ...col.ideas],
                    };
                }
                return col;
            });
        });

        toast.success(savedIdea.id && !savedIdea.id.startsWith("idea-") ? "Idea saved successfully" : "New idea created");
        setActiveModal({ open: false });
    };

    const handleDeleteIdea = async (columnId: string, ideaId: string) => {
        const token = localStorage.getItem("token");
        if (token && /^[0-9a-fA-F]{24}$/.test(ideaId)) {
            try {
                await api.delete(API_PATHS.IDEAS.DELETE(ideaId));
            } catch (e) {
                console.warn("API delete idea error", e);
            }
        }

        setColumns((prevCols) =>
            prevCols.map((col) =>
                col.id === columnId
                    ? { ...col, ideas: col.ideas.filter((i) => i.id !== ideaId) }
                    : col
            )
        );
        toast.info("Idea removed");
        setActiveDropdownCardId(null);
    };

    // Drag & Drop handlers
    const handleDragStart = (e: React.DragEvent, ideaId: string) => {
        e.dataTransfer.setData("text/plain", ideaId);
        setDraggedIdeaId(ideaId);
    };

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        if (dragOverColumnId !== columnId) {
            setDragOverColumnId(columnId);
        }
    };

    const handleDragOverCard = (e: React.DragEvent, ideaId: string) => {
        e.preventDefault();
        if (dragOverIdeaId !== ideaId) {
            setDragOverIdeaId(ideaId);
        }
    };

    const handleDragLeave = (columnId: string) => {
        if (dragOverColumnId === columnId) {
            setDragOverColumnId(null);
        }
        setDragOverIdeaId(null);
    };

    const handleDrop = async (e: React.DragEvent, targetColumnId: string, targetIdeaId?: string) => {
        e.preventDefault();
        const ideaId = e.dataTransfer.getData("text/plain") || draggedIdeaId;
        setDragOverColumnId(null);
        setDraggedIdeaId(null);
        setDragOverIdeaId(null);

        if (!ideaId) return;

        // Try API update if valid mongo ID
        const token = localStorage.getItem("token");
        if (token && /^[0-9a-fA-F]{24}$/.test(ideaId)) {
            try {
                await api.put(API_PATHS.IDEAS.UPDATE(ideaId), { columnId: targetColumnId });
            } catch (e) {
                console.warn("API drag-drop update error", e);
            }
        }

        setColumns((prevCols) => {
            let foundIdea: Idea | undefined;

            for (const col of prevCols) {
                const match = col.ideas.find((i) => i.id === ideaId);
                if (match) {
                    foundIdea = { ...match, columnId: targetColumnId };
                    break;
                }
            }

            if (!foundIdea) return prevCols;

            return prevCols.map((col) => {
                const filteredIdeas = col.ideas.filter((i) => i.id !== ideaId);

                if (col.id === targetColumnId) {
                    if (targetIdeaId && targetIdeaId !== ideaId) {
                        const targetIndex = filteredIdeas.findIndex((i) => i.id === targetIdeaId);
                        if (targetIndex !== -1) {
                            const newIdeas = [...filteredIdeas];
                            newIdeas.splice(targetIndex, 0, foundIdea!);
                            return { ...col, ideas: newIdeas };
                        }
                    }
                    return { ...col, ideas: [foundIdea!, ...filteredIdeas] };
                }

                return { ...col, ideas: filteredIdeas };
            });
        });
    };

    // Navigation actions
    const handleSendToAIComposer = (idea: Idea) => {
        setActiveDropdownCardId(null);
        navigate("/ai-composer", {
            state: {
                prompt: idea.description ? `${idea.title}\n\n${idea.description}` : idea.title,
                title: idea.title,
                images: idea.images || [],
                tags: idea.tags || [],
            },
        });
        toast.success("Loaded idea into AI Composer");
    };

    const handleSendToScheduler = (idea: Idea) => {
        setActiveDropdownCardId(null);
        navigate("/schedule", {
            state: {
                content: idea.description ? `${idea.title}\n\n${idea.description}` : idea.title,
                title: idea.title,
                images: idea.images || [],
                tags: idea.tags || [],
            },
        });
        toast.success("Loaded idea into Post Scheduler");
    };

    const totalIdeasCount = columns.reduce((acc, col) => acc + col.ideas.length, 0);

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* --- Top Action Header Bar --- */}
            <IdeasHeader
                totalIdeasCount={totalIdeasCount}
                onOpenAiBrainstorm={() => setAiPopoverOpen(true)}
                onNewIdea={() =>
                    setActiveModal({
                        open: true,
                        columnId: columns[0]?.id || "backlog",
                    })
                }
            />

            {/* --- Kanban Board Columns Grid --- */}
            <KanbanBoard
                columns={columns}
                dragOverColumnId={dragOverColumnId}
                draggedIdeaId={draggedIdeaId}
                dragOverIdeaId={dragOverIdeaId}
                activeDropdownCardId={activeDropdownCardId}
                onDragOver={handleDragOver}
                onDragOverCard={handleDragOverCard}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onOpenCreateModal={(columnId) => setActiveModal({ open: true, columnId })}
                onOpenEditModal={(idea, columnId) => setActiveModal({ open: true, idea, columnId })}
                onToggleDropdown={setActiveDropdownCardId}
                onSendToAIComposer={handleSendToAIComposer}
                onSendToScheduler={handleSendToScheduler}
                onDeleteIdea={handleDeleteIdea}
            />

            {/* --- AI Generation Popover Modal --- */}
            <AiBrainstormModal
                isOpen={aiPopoverOpen}
                onClose={() => setAiPopoverOpen(false)}
                onSaveIdea={handleSaveIdea}
            />

            {/* --- Idea Edit / Create Modal Dialog --- */}
            {activeModal.open && (
                <IdeaDialogModal
                    open={activeModal.open}
                    idea={activeModal.idea}
                    columns={columns}
                    defaultColumnId={activeModal.columnId || columns[0].id}
                    onClose={() => setActiveModal({ open: false })}
                    onSave={handleSaveIdea}
                />
            )}
        </div>
    );
}

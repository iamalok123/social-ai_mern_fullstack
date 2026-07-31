export interface Idea {
    id: string;
    title: string;
    description: string;
    columnId: string;
    images?: string[];
    createdAt?: string;
    tags?: string[];
}

export interface Column {
    id: string;
    title: string;
    ideas: Idea[];
}

export interface ColumnMeta {
    accentColor: string;
    badgeClass: string;
    icon: React.ComponentType<{ className?: string }>;
}

import { WorkflowNode, WorkflowEdge } from "@/lib/workflow/types";

export type TemplateCategory =
    | "Marketing"
    | "Sales"
    | "Customer Support"
    | "Productivity"
    | "HR"
    | "Development";

export type TemplateDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Template {
    _id?: string;
    id: string;
    name: string;
    description: string;
    category: TemplateCategory;
    tags: string[];
    difficulty: TemplateDifficulty;
    triggerNode: string;
    version: number;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    viewport?: {
        x: number;
        y: number;
        zoom: number;
    };
    isNew?: boolean;
    isPopular?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
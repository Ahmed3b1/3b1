import { Node, Edge } from "reactflow";

export type NodeType =
    | "webhook"
    | "http_request"
    | "send_email"
    | "ai_generate_text";

export interface NodeData {
    label: string;
    config?: Record<string, any>;
    [key: string]: any;
}

export type WorkflowNode = Node<NodeData> & {
    type: NodeType;
};

export type WorkflowEdge = Edge;

export interface Workflow {
    id: string;
    userId?: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}

export interface ExecutionContext {
    flowId: string;
    triggerData: any;
    executionMode: "manual" | "webhook";
    steps: Record<string, any>;
}

export interface NodeDefinition {
    type: NodeType;
    label: string;
    category: "trigger" | "action";
    description: string;
    icon?: any;
    configSchema: ConfigField[];
}

export interface ConfigField {
    name: string;
    label: string;
    type: "text" | "textarea" | "select" | "number" | "json";
    required?: boolean;
    options?: { label: string; value: string }[];
    placeholder?: string;
    defaultValue?: any;
}
import { Workflow, WorkflowNode, ExecutionContext } from "./types";
import { executeHttpNode } from "./nodes/http";
import { executeEmailNode } from "./nodes/email";
import { executeAiNode } from "./nodes/ai";
import { deductCredits } from "../billing/credits";
import { getNodeCost } from "../billing/costs";

export class FlowExecutor {
    private flow: Workflow;
    private context: ExecutionContext;

    constructor(flow: Workflow, triggerData: any = {}, executionMode: "manual" | "webhook" = "webhook") {
        this.flow = flow;
        this.context = {
            flowId: flow.id,
            triggerData,
            executionMode,
            steps: {},
        };
    }

    public async execute(startNodeId?: string): Promise<ExecutionContext> {
        let currentNode: WorkflowNode | undefined;

        if (startNodeId) {
            currentNode = this.flow.nodes.find((n) => n.id === startNodeId);
            if (!currentNode) {
                throw new Error(`Start node ${startNodeId} not found`);
            }
        } else {
            const triggerNode = this.flow.nodes.find((n) => n.type === "webhook");
            if (triggerNode) {
                currentNode = triggerNode;
            } else {
                const targetNodes = new Set(this.flow.edges.map((e) => e.target));
                currentNode = this.flow.nodes.find((n) => !targetNodes.has(n.id));
            }
        }

        if (!currentNode) {
            throw new Error("No starting node found in workflow");
        }

        while (currentNode) {
            const executingNode: WorkflowNode = currentNode;
            console.log(
                `Executing node: ${executingNode.id} (${executingNode.type})`
            );

            try {
                const output = await this.executeNode(executingNode);
                this.context.steps[executingNode.id] = output;

                const edge = this.flow.edges.find(
                    (e) => e.source === executingNode.id
                );

                currentNode = edge
                    ? this.flow.nodes.find((n) => n.id === edge.target)
                    : undefined;
            } catch (error) {
                console.error(
                    `Error executing node ${executingNode.id}:`,
                    error
                );
                throw error;
            }
        }

        return this.context;
    }

    private async executeNode(node: WorkflowNode): Promise<any> {

        const cost = getNodeCost(node.type);
        if (cost > 0 && this.flow.userId) {
            const deduction = await deductCredits({
                userId: this.flow.userId,
                amount: cost,
                reason: `Execute Node: ${node.type}`,
                referenceType: "node",
                referenceId: node.id,
                metadata: { flowId: this.flow.id }
            });

            if (!deduction.success) {
                throw new Error(`Insufficient credits to execute node ${node.type}: ${deduction.error}`);
            }
        }

        const rawConfig = node.data?.config || {};
        const processedConfig = this.replaceVariables(rawConfig);

        switch (node.type) {
            case "webhook":
                return { success: true, body: this.context.triggerData };

            case "http_request":
                return executeHttpNode(processedConfig);

            case "ai_generate_text":
                return executeAiNode(processedConfig);

            case "send_email":
                return executeEmailNode(processedConfig);

            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    private replaceVariables(value: any): any {
        if (typeof value === "string") {
            return value.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
                const resolved = this.resolvePath(path.trim());
                return resolved !== undefined ? String(resolved) : "";
            });
        }

        if (Array.isArray(value)) {
            return value.map((v) => this.replaceVariables(v));
        }

        if (typeof value === "object" && value !== null) {
            const result: any = {};
            for (const key in value) {
                result[key] = this.replaceVariables(value[key]);
            }
            return result;
        }

        return value;
    }

    private resolvePath(path: string): any {
        const parts = path.split(".");
        let current: any;

        if (parts[0] === "trigger") {
            current = this.context.triggerData;
            parts.shift();
        } else if (parts[0] === "steps") {
            current = this.context.steps;
            parts.shift();
        } else {
            return undefined;
        }

        for (const part of parts) {
            if (current == null) return undefined;
            current = current[part];
        }

        return current;
    }
}
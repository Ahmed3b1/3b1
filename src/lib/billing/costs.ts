export const COST_CONFIG = {
    FLOW_CREATE: 50,
    NODE_EXECUTION: {
        send_email: 30,
        ai_generate_text: 20,
        http_request: 10,
        webhook: 0,
    },
} as const;

export type ActionType = keyof typeof COST_CONFIG;
export type NodeType = keyof typeof COST_CONFIG.NODE_EXECUTION;

export function getActionCost(action: ActionType): number {
    if (action === "FLOW_CREATE") return COST_CONFIG.FLOW_CREATE;
    return 0;
}

export function getNodeCost(nodeType: string): number {
    return (COST_CONFIG.NODE_EXECUTION as any)[nodeType] ?? 0;
}
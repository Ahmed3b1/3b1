"use client";

import { useCallback, useState, useMemo } from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Save, Play } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CustomNode from "@/components/workflow/custom-node";
import { NodePicker } from "@/components/workflow/node-picker";
import { NodeConfigPanel } from "@/components/workflow/node-config-panel";
import { NODE_REGISTRY } from "@/lib/workflow/registry";
import { runFlowManually } from "@/app/dashboard/flows/[flowId]/actions";

interface FlowBuilderProps {
    initialNodes?: Node[];
    initialEdges?: Edge[];
    flowId: string;
}


function FlowBuilderContent({ initialNodes = [], initialEdges = [], flowId }: FlowBuilderProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const [isSaving, setIsSaving] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const router = useRouter()

    const onRunFlow = async (startNodeId?: string) => {
        setIsRunning(true)
        const toastId = toast.loading(startNodeId ? "Starting execution from node..." : "Executing flow...")
        try {
            const result = await runFlowManually(flowId, startNodeId)
            if (result.success) {
                toast.success("Flow executed successfully", { id: toastId })
            } else {
                toast.error(`Execution failed:  ${result.error}`, { id: toastId })
            }
        } catch (error: any) {
            toast.error(`Execution failed:  ${error.message}`, { id: toastId })
        } finally {
            setIsRunning(false)
        }
    }

    const onRunFromNode = useCallback((nodeId: string) => {
        onRunFlow(nodeId);
    }, [onRunFlow]);

    const nodeTypes = useMemo(() => ({
        webhook: CustomNode,
        http_request: CustomNode,
        send_email: CustomNode,
        ai_generate_text: CustomNode,
        default: CustomNode,
    }), []);

    const nodesWithRun = useMemo(() => {
        return nodes.map((node) => ({
            ...node,
            data: {
                ...node.data,
                onRun: onRunFromNode,
            },
        }));
    }, [nodes, onRunFromNode]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    const onSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch(`/api/flows/${flowId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nodes,
                    edges,
                }),
            });
            if (!res.ok) throw new Error("Failed to save flow")
            toast.success("Flow saved successfully")
            router.refresh()
        } catch (err) {
            toast.error("Failed to save flow")
        } finally {
            setIsSaving(false)
        }
    };

    const onAddNode = (type: string) => {
        const id = `${type}-${Date.now()}`
        const nodeDef = NODE_REGISTRY[type]

        const newNode: Node = {
            id,
            type: type,
            position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
            data: {
                label: nodeDef?.label || type,
                type: type,
                config: {}
            },
        }
        setNodes((nds) => nds.concat(newNode))
    };

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        setSelectedNode(node)
    };

    const onUpdateNode = (nodeId: string, newData: any) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: newData };
                }
                return node;
            })
        );

        if (selectedNode?.id === nodeId) {
            setSelectedNode((prev) => prev ? { ...prev, data: newData } : null);
        }
    };

    return (
        <div className="h-[calc(100vh-10rem)] w-full border rounded-lg bg-background relative flex">
            <div className="flex-1 relative">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <NodePicker onAddNode={onAddNode} />
                    <Button size="sm" variant="outline" onClick={() => onRunFlow()}
                        disabled={isRunning || isSaving}>
                        <Play className="h-4 w-4 mr-1 fill-current" />
                        {isRunning ? "Running..." : "Run Flow"}

                    </Button>
                    <Button size="sm" onClick={onSave} disabled={isSaving || isRunning}>
                        <Save className="h-4 w-4 mr-1" />
                        {isSaving ? "Saving..." : "Save Flow"}
                    </Button>

                </div>
                <ReactFlow
                    nodes={nodesWithRun}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onNodeClick={onNodeClick}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background gap={12} size={1} />

                </ReactFlow>

            </div>
            <NodeConfigPanel selectedNode={selectedNode} onClose={() => setSelectedNode(null)}
                onUpdate={onUpdateNode} />

        </div>
    )
}


export default function FlowBuilder(props: FlowBuilderProps) {
    return (
        <ReactFlowProvider>
            <FlowBuilderContent {...props} />
        </ReactFlowProvider>
    )
}
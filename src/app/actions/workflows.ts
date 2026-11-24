"use server";

import { auth } from "@/auth";
import { WorkflowNode, WorkflowEdge } from "@/lib/workflow/types";
import { deductCredits } from "@/lib/billing/credits";
import CreditTransaction from "@/models/CreditTransaction";
import Flow from "@/models/Flow";
import Template from "@/models/Template";
import connectToDatabase from "@/lib/db";
import { nanoid } from "nanoid";


export async function cloneTemplateToFlow(templateId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        await connectToDatabase()

        const deduction = await deductCredits({
            userId: session.user.id,
            amount: 50,
            reason: `Clone Template: ${templateId}`,
            referenceType: "flow",
            referenceId: "pending",
        });
        if (!deduction.success) {
            return { success: false, error: deduction.error }
        }

        const template = await Template.findById(templateId) || await Template.findOne({ id: templateId })
        if (!template) {
            throw new Error("Template not found")
        }

        const nodeIdMap = new Map<string, string>();

        const newNodes: WorkflowNode[] = template.nodes.map((node: WorkflowNode) => {
            const newId = `node_${nanoid(10)}`;
            nodeIdMap.set(node.id, newId);

            return {
                ...node,
                id: newId,
                data: JSON.parse(JSON.stringify(node.data))
            }
        });

        const newEdges: WorkflowEdge[] = template.edges.map((edge: WorkflowEdge) => {
            const newSource = nodeIdMap.get(edge.source);
            const newTarget = nodeIdMap.get(edge.target);

            if (!newSource || !newTarget) {
                console.warn(`Skipping edge ${edge.id} due to missing source/target mapping`)
                return null;
            }
            return {
                ...edge,
                id: `edge_${nanoid(10)}`,
                source: newSource,
                target: newTarget,
            };
        }).filter(Boolean) as WorkflowEdge[];

        const flowId = nanoid()
        const newFlow = await Flow.create({
            flowId,
            userId: session.user.id,
            name: `${template.name}`,
            description: template.description,
            nodes: newNodes,
            edges: newEdges,
            published: false,
        });

        await CreditTransaction.updateOne(
            { userId: session.user.id, referenceId: "pending", reason: `Clone Template: ${templateId}` },
            { $set: { referenceId: newFlow._id.toString() } }
        ).sort({ createdAt: -1 });

        return { success: true, flowId: newFlow._id.toString() };
    } catch (error) {
        console.error("Error cloning template:", error)
        return { success: false, error: "Failed to create flow from template" }
    }
}
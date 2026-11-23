"use server";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import Flow from "@/models/Flow";
import { FlowExecutor } from "@/lib/workflow/executor";
import { Types } from "mongoose";
import { Workflow } from "@/lib/workflow/types";

export async function runFlowManually(flowId: string, startNodeId?: string) {
    const session = await auth()
    if (!session?.user || !session.user.id) {
        throw new Error("Unauthorized")
    }

    await connectToDatabase()

    const flowDoc = await Flow.findOne({
        _id: new Types.ObjectId(flowId),
        userId: new Types.ObjectId(session.user.id)
    });

    if (!flowDoc) {
        throw new Error("Flow not found")
    }

    const workflow: Workflow = {
        id: flowDoc._id.toString(),
        userId: flowDoc.userId.toString(),
        nodes: flowDoc.nodes,
        edges: flowDoc.edges,
    };

    const executor = new FlowExecutor(workflow, {}, "manual")

    try {
        const result = await executor.execute(startNodeId);
        return {
            success: true,
            result,
        }
    } catch (error: any) {
        console.error("Manual flow execution failed", error)
        return {
            success: false,
            error: error.message || "Execution failed"
        }
    }
}
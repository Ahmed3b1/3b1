import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import Flow from "@/models/Flow";
import { z } from "zod";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { deductCredits } from "@/lib/billing/credits";
import CreditTransaction from "@/models/CreditTransaction";

const createFlowSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        await connectToDatabase();
        const flows = await Flow.find({
            userId: new mongoose.Types.ObjectId(session.user.id),
        }).sort({ updatedAt: -1 });
        return NextResponse.json(flows)
    } catch (error) {
        console.error("failed to fetch flows", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json();
        const { name, description } = createFlowSchema.parse(body)
        await connectToDatabase()

        const deduction = await deductCredits({
            userId: session.user.id,
            amount: 50,
            reason: "Create New Flow",
            referenceType: "flow",
            referenceId: "pending",
        });
        if (!deduction.success) {
            return NextResponse.json({ error: deduction.error }, { status: 402 })
        }

        const flow = await Flow.create({
            flowId: nanoid(),
            name,
            description,
            userId: new mongoose.Types.ObjectId(session.user.id),
            nodes: [],
            edges: [],
        });
        await CreditTransaction.updateOne(
            { userId: session.user.id, referenceId: "pending", reason: "Create New Flow" },
            { $set: { referenceId: flow._id.toString() } }
        ).sort({ createdAt: -1 })
        return NextResponse.json(flow, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }
        console.error("Failed to create flow:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
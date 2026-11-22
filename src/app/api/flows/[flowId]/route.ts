import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import Flow from "@/models/Flow";
import { z } from "zod";
import { Types } from "mongoose";

const updateFlowSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    nodes: z.array(z.any()).optional(),
    edges: z.array(z.any()).optional(),
    published: z.boolean().optional(),
})

export async function GET(
    request: Request,
    { params }: { params: Promise<{ flowId: string }> }
) {
    try {
        const { flowId } = await params
        const session = await auth();
        if (!session?.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        if (!Types.ObjectId.isValid(flowId)) {
            return NextResponse.json({ error: "Invalid flow id" }, { status: 400 })
        }
        await connectToDatabase();
        const flow = await Flow.findOne({
            _id: new Types.ObjectId(flowId),
            userId: new Types.ObjectId(session.user.id),
        });
        if (!flow) {
            return NextResponse.json({ error: "Flow not found" }, { status: 404 })
        }
        return NextResponse.json(flow)

    } catch (error) {
        console.error("GET flow error:", error)
        return NextResponse.json(
            { error: "Internal Server error:" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ flowId: string }> }
) {
    try {
        const { flowId } = await params;

        const session = await auth();

        if (!session?.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        if (!Types.ObjectId.isValid(flowId)) {
            return NextResponse.json({ error: "Invalid flow id" }, { status: 400 })
        }

        const body = await request.json();
        const updates = updateFlowSchema.parse(body);

        await connectToDatabase();

        const flow = await Flow.findOneAndUpdate(
            {
                _id: new Types.ObjectId(flowId),
                userId: new Types.ObjectId(session.user.id),
            },
            { $set: updates },
            { new: true }
        );
        if (!flow) {
            return NextResponse.json({ error: "Flow not found" }, { status: 404 })
        }
        return NextResponse.json(flow)

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0].message },
                { status: 400 }
            )
        }
        console.error("PUT flow error:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ flowId: string }> }
) {
    try {
        const { flowId } = await params;

        const session = await auth();

        if (!session?.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        if (!Types.ObjectId.isValid(flowId)) {
            return NextResponse.json({ error: "Invalid flow id" }, { status: 400 })
        }

        await connectToDatabase()

        const flow = await Flow.findOneAndDelete({
            _id: new Types.ObjectId(flowId),
            userId: new Types.ObjectId(session.user.id),
        });
        if (!flow) {
            return NextResponse.json({ error: "Flow not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Flow deleted successfully" })

    } catch (error) {
        console.error("DELETE flow error:", error)

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
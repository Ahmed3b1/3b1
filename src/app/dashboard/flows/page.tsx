import { auth } from "@/auth";
import { FlowCard } from "@/components/flow-card";
import connectToDatabase from "@/lib/db";
import Flow from "@/models/Flow";
import { redirect } from "next/navigation";
import CreateFlowButton from "./create-flow-button";
import { Types } from "mongoose";

async function getFlows(userId: string) {
    await connectToDatabase()

    const flows = await Flow.find({
        userId: new Types.ObjectId(userId)
    }).sort({ updatedAt: -1 })

    return JSON.parse(JSON.stringify(flows))
}

export default async function FlowPage() {
    const session = await auth()
    if (!session?.user || !session.user.id) {
        redirect("/login")
    }

    const flows = await getFlows(session.user.id)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Flows</h1>
                    <p className="text-muted-foreground">
                        Manage your automated workflows here.
                    </p>
                </div>
                <CreateFlowButton />

            </div>
            {flows.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-100 border
                rounded-lg bg-muted/10">
                    <p className="text-muted-foreground">
                        No flows found. Create your first one!
                    </p>
                    <CreateFlowButton />

                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {flows.map((flow: any) => (
                        <FlowCard key={flow._id} flow={flow} />
                    ))}
                </div>
            )}
        </div>
    )
}
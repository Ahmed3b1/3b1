"use server";

import { cloneTemplateToFlow } from "@/app/actions/workflows";
import { redirect } from "next/navigation";

export async function createFlowFromTemplate(templateId: string) {
    const result = await cloneTemplateToFlow(templateId);

    if (result.success && result.flowId) {
        redirect(`/dashboard/flows/${result.flowId}`);
    } else {
        throw new Error(result.error || "Failed to create flow from template");
    }
}
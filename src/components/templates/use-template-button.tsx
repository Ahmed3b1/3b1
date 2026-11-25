"use client";

import { Button } from "@/components/ui/button";
import { createFlowFromTemplate } from "@/app/dashboard/templates/actions";
import { Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UseTemplateButtonProps {
    templateId: string;
}

export default function UseTemplateButton({ templateId }: UseTemplateButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleUseTemplate() {
        setIsLoading(true)
        try {
            await createFlowFromTemplate(templateId)
        } catch (err) {
            console.error(err)
            toast.error("Failed to create flow from template")
            setIsLoading(false)
        }
    }

    return (
        <Button onClick={handleUseTemplate} disabled={isLoading} className="w-full" variant="default">
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                </>
            ) : (
                <>
                    <Zap className="mr-2 h-4 w-4" />
                    Use Template
                </>
            )}
        </Button>
    )
}
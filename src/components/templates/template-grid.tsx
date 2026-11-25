import { Template } from "@/lib/templates/types";
import TemplateCard from "./template-card";

interface TemplateGridProps {
    templates: Template[];
}

export default function TemplateGrid({ templates }: TemplateGridProps) {
    if (templates.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                    No Templates found matching your criteria.
                </p>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t) => (
                <TemplateCard key={t._id || t.id} template={t} />
            ))}

        </div>
    )
}
import connectToDatabase from "@/lib/db";
import Template from "@/models/Template";
import TemplateGrid from "@/components/templates/template-grid";
import TemplateFilters from "@/components/templates/template-filters";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Automation Templates",
    description: "Browse and use pre-built automation templates.",
}

export default async function TemplatesPage(props: {
    searchParams: Promise<{ query?: string; category?: string }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query?.toLowerCase() || "";
    const category = searchParams?.category || "All"

    await connectToDatabase()

    const allTemplates = await Template.find({}).sort({ isPopular: -1, createdAt: -1 });

    const plainTemplates = JSON.parse(JSON.stringify(allTemplates))

    const filteredTemplates = plainTemplates.filter((template: any) => {
        const matchesQuery =
            template.name.toLowerCase().includes(query) ||
            template.description.toLowerCase().includes(query) ||
            template.tags.some((tag: string) => tag.toLowerCase().includes(query));

        const matchesCategory = category === "All" || template.category === category;

        return matchesQuery && matchesCategory;
    });

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Automation Templates</h1>
                <p className="text-muted-foreground">
                    Jumpstart your workflow with our collection of pre-built automation templates.
                </p>

            </div>

            <TemplateFilters />
            <TemplateGrid templates={filteredTemplates} />

        </div>
    )
}
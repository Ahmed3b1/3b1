import { Template } from "@/lib/templates/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UseTemplateButton from "./use-template-button";
import { Clock, Activity, Tag, Zap, Mail, Bot, Globe, ArrowRight } from "lucide-react";
import { NodeType } from "@/lib/workflow/types";

interface TemplateCardProps {
    template: Template;
}

const NodeIcon = ({ type }: { type: NodeType }) => {
    switch (type) {
        case "webhook":
            return <Zap className="h-4 w-4 text-orange-500" />;
        case "http_request":
            return <Globe className="h-4 w-4 text-blue-500" />
        case "send_email":
            return <Mail className="h-4 w-4 text-green-500" />
        case "ai_generate_text":
            return <Bot className="h-4 w-4 text-purple-500" />
        default:
            return <Activity className="h-4 w-4 text-gray-500" />
    }
}

export default function TemplateCard({ template }: TemplateCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 group">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        <CardTitle className="text-xl line-clamp-1
                        group-hover:text-primary transition-colors">
                            {template.name}
                        </CardTitle>

                        <div className="flex flex-wrap gap-2 pt-1">
                            <Badge variant="secondary" className="text-xs font-normal">
                                {template.category}
                            </Badge>
                            {template.isPopular && (
                                <Badge variant="default" className="bg-amber-500
                                hover:bg-amber-600 text-xs font-normal">
                                    Popular
                                </Badge>
                            )}
                            {template.isNew && (
                                <Badge variant="default" className="bg-blue-500
                                hover:bg-blue-600 text-xs font-normal">
                                    New
                                </Badge>
                            )}
                        </div>

                    </div>

                </div>

                <CardDescription className="line-clamp-2 mt-2">
                    {template.description}
                </CardDescription>

            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md overflow-hidden">
                    {template.nodes.slice(0, 4).map((node, index) => (
                        <div key={node.id} className="flex items-center gap-2">
                            <div className="p-1.5 bg-background rounded-full border shadow-sm"
                                title={node.data.label}>
                                <NodeIcon type={node.type} />

                            </div>
                            {index < template.nodes.length - 1 && index < 3 && (
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            )}
                        </div>
                    ))}
                    {template.nodes.length > 4 && (
                        <span className="text-xs text-muted-foreground pl-1">{template.nodes.length - 4}</span>
                    )}

                </div>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />

                    </div>
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />

                    </div>
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span className="line-clamp-1">{template.tags.join(", ")}</span>

                    </div>

                </div>

            </CardContent>

            <CardFooter>
                <UseTemplateButton templateId={template.id} />
            </CardFooter>

        </Card>
    )
}
import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NODE_REGISTRY } from "@/lib/workflow/registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const CustomNode = ({ id, data, selected }: NodeProps) => {
    const nodeType = NODE_REGISTRY[data.type] || NODE_REGISTRY.webhook;
    const Icon = nodeType.icon;

    return (
        <Card className={cn("w-62.5 shadow-md border-2 group", selected ? "border-primary" : "border-border")}>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0 relative">
                <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-md", nodeType.category === "trigger"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-orange-100 text-orange-600")}>
                        {Icon && <Icon className="w-4 h-4" />}
                    </div>
                    <CardTitle className="text-sm font-medium">
                        {data.label || nodeType.label}
                    </CardTitle>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onRun?.(id)
                        }} title="Run from here">
                        <Play className="h-3 w-3 fill-current" />
                    </Button>
                    {nodeType.category === "trigger" && <Badge variant="secondary"
                        className="text-xs">Trigger</Badge>}
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {nodeType.description}
                </p>
            </CardContent>

            {nodeType.category !== "trigger" && (
                <Handle
                    type="target"
                    position={Position.Top}
                    className="bg-muted-foreground! w-3! h-3! "
                />
            )}
            <Handle
                type="source"
                position={Position.Bottom}
                className="bg-muted-foreground! w-3! h-3! "
            />
        </Card>
    );
};

export default memo(CustomNode);
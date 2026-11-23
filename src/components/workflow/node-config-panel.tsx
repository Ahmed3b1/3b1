import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { NODE_REGISTRY } from "@/lib/workflow/registry";
import { useEffect, useState } from "react";
import { Node } from "reactflow";

interface NodeConfigPanelProps {
    selectedNode: Node | null;
    onClose: () => void;
    onUpdate: (nodeId: string, data: any) => void;
}

export function NodeConfigPanel({ selectedNode, onClose, onUpdate }: NodeConfigPanelProps) {
    const [config, setConfig] = useState<Record<string, any>>({});

    useEffect(() => {
        if (selectedNode) {
            setConfig(selectedNode.data.config || {});
        }
    }, [selectedNode]);

    if (!selectedNode) return null;
    const nodeDef = NODE_REGISTRY[selectedNode.data.type];
    if (!nodeDef) return null;

    const handleSave = () => {
        onUpdate(selectedNode.id, {
            ...selectedNode.data,
            config,
        });
        onClose();
    };

    const handleChange = (key: string, value: any) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <Sheet open={!!selectedNode} onOpenChange={(open: boolean) => !open && onClose()}>
            <SheetContent className="w-100 sm:w-135 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <nodeDef.icon className="w-5 h-5" />
                        {nodeDef.label} Configuration
                    </SheetTitle>
                    <SheetDescription>
                        {nodeDef.description}
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                        <Label>Node Label</Label>
                        <Input
                            value={selectedNode.data.label}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                onUpdate(selectedNode.id, { ...selectedNode.data, label: e.target.value })
                            }
                        />
                    </div>

                    {nodeDef.configSchema.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <Label>
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>

                            {field.type === "text" && (
                                <Input
                                    value={config[field.name] || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange(field.name, e.target.value)
                                    }
                                    placeholder={field.placeholder}
                                />
                            )}

                            {field.type === "textarea" && (
                                <Textarea
                                    value={config[field.name] || ""}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        handleChange(field.name, e.target.value)
                                    }
                                    placeholder={field.placeholder}
                                    rows={4}
                                />
                            )}

                            {field.type === "number" && (
                                <Input
                                    type="number"
                                    value={config[field.name] || ""}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange(field.name, Number(e.target.value))
                                    }
                                    placeholder={field.placeholder}
                                />
                            )}

                            {field.type === "select" && (
                                <Select
                                    value={config[field.name] || field.defaultValue}
                                    onValueChange={(val: string) => handleChange(field.name, val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}

                            {field.type === "json" && (
                                <Textarea
                                    value={
                                        typeof config[field.name] === "object"
                                            ? JSON.stringify(config[field.name], null, 2)
                                            : config[field.name] || ""
                                    }
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                        try {
                                            handleChange(field.name, e.target.value);
                                        } catch (err) {

                                        }
                                    }}
                                    className="font-mono text-xs"
                                    placeholder={field.placeholder}
                                    rows={5}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Configuration</Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
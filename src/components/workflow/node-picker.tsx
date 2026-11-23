import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { NODE_TYPES_LIST } from "@/lib/workflow/registry";
import { Plus } from "lucide-react";
import { useState } from "react";

interface NodePickerProps {
    onAddNode: (type: string) => void;
}

export function NodePicker({ onAddNode }: NodePickerProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (type: string) => {
        onAddNode(type);
        setOpen(false);
    };

    const triggers = NODE_TYPES_LIST.filter((n) => n.category === "trigger");
    const actions = NODE_TYPES_LIST.filter((n) => n.category === "action");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Node
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-150 p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-semibold">Add a Node</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 p-6 pt-2 max-h-[70vh] overflow-y-auto">
                    <section>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider
                        text-muted-foreground/70">
                            Triggers
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {triggers.map((node) => (
                                <button
                                    key={node.type}
                                    onClick={() => handleSelect(node.type)}
                                    className="group flex flex-row items-start
                                    gap-3 p-4 text-left border rounded-xl bg-card
                                    hover:bg-accent hover:border-accent-foreground/20
                                    transition-all duration-200 focus-visible:outline-none
                                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <div className="shrink-0 p-2 rounded-lg bg-blue-50 text-blue-600
                                    group-hover:bg-blue-100 transition-colors">
                                        <node.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="text-sm font-semibold leading-tight
                                        group-hover:text-accent-foreground transition-colors">
                                            {node.label}
                                        </span>

                                        <span className="text-xs
                                        text-muted-foreground leading-relaxed line-clamp-2">
                                            {node.description}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="mb-3 text-xs font-bold
                        uppercase tracking-wider text-accent-foreground/70">
                            Actions
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {actions.map((node) => (
                                <button
                                    key={node.type}
                                    onClick={() => handleSelect(node.type)}
                                    className="group flex flex-row items-start
                                    gap-3 p-4 text-left border rounded-xl bg-card
                                    hover:bg-accent hover:border-accent-foreground/20
                                    transition-all duration-200 focus-visible:outline-none
                                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <div className="shrink-0 p-2 rounded-lg bg-blue-50 text-blue-600
                                    group-hover:bg-blue-100 transition-colors">
                                        <node.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="text-sm font-semibold leading-tight
                                        group-hover:text-accent-foreground transition-colors">
                                            {node.label}
                                        </span>

                                        <span className="text-xs
                                        text-muted-foreground leading-relaxed line-clamp-2">
                                            {node.description}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
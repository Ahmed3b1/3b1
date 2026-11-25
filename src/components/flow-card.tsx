"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Play, Settings, MoreVertical, Calendar, Edit2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FlowCardProps {
    flow: {
        _id: string;
        name: string;
        description?: string;
        status: "active" | "draft" | "error";
        lastRun?: Date;
        createdAt: Date;
    };
}

export function FlowCard({ flow }: FlowCardProps) {
    const router = useRouter()
    const statusColors = {
        active: "success",
        draft: "secondary",
        error: "destructive",
    } as const
    const handleCardClick = () => {
        router.push(`/dashboard/flows/${flow._id}`)
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Card className="group relative overflow-hidden cursor-pointer
            hover:border-primary/50 transition-colors"
                onClick={handleCardClick}>
                <div className="absolute right-4 top-4 z-10 opacity-0 transition-opacity
                group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full
                            bg-background/50 backdrop-blur-sm hover:bg-background">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                <span className="sr-only">Open menu</span>

                            </Button>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/flows/${flow._id}`)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                <span>Edit</span>

                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive"
                                onClick={() => {

                                }}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>Delete</span>
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1 pr-8">
                        <CardTitle className="text-xl font-bold group-hover:text-primary
                        transition-colors">
                            {flow.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 min-h-10">
                            {flow.description || "No Description provided."}
                        </CardDescription>

                    </div>
                    <Badge variant={statusColors[flow.status]} className="capitalize">
                        {flow.status}
                    </Badge>

                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Created {formatDistanceToNow(new Date(flow.createdAt))} ago</span>

                        </div>
                        {flow.lastRun && (
                            <div className="flex items-center gap-1">
                                <Play className="w-3 h-3" />
                                <span>Last run {formatDistanceToNow(new Date(flow.lastRun))} ago</span>

                            </div>
                        )}

                    </div>

                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4 pb-5">
                    <div className="flex gap-2">
                        <Button variant="default" size="sm" className="h-8 gap-2"
                            onClick={(e) => {
                                e.stopPropagation()
                            }}>
                            <Play className="h-3.5 w-3.5" />
                            Run Now

                        </Button>

                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Zap className="h-3 w-3" />
                        <span>Ready</span>

                    </div>

                </CardFooter>

            </Card>
        </motion.div>
    )
}
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="container mx-auto py-8 px-4 flex flex-col
        items-center justify-center min-h-100 text-center">
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                We encountered an error while loading the templates. Please try again later.
            </p>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    );
}
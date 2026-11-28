"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function BillingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success) {
      toast.success("Credits purchased successfully");
      router.refresh();
      router.replace("/dashboard/billing");
    }

    if (canceled) {
      toast.error("purchase canceled");
      router.replace("/dashboard/billing");
    }
  }, [searchParams, router]);

  async function buyCridits(packageId: string) {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Credits</h1>
        <p className="text-muted-foreground">
          Purchase credits to power your AI automations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Starter Pack</CardTitle>
            <CardDescription>Perfect for testing flows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$10</div>
            <div className="text-muted-foreground">50 Credits</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                Access to all AI models
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                Stansard support
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pb-5">
            <Button
              className="w-full"
              onClick={() => buyCridits("starter")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Pro Pack</CardTitle>
            <CardDescription>For serious automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$20</div>
            <div className="text-muted-foreground">100 Credits</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                Best for individuals
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                Priority support
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pb-5">
            <Button
              className="w-full"
              onClick={() => buyCridits("starter")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Enterprise Pack</CardTitle>
            <CardDescription>Scalable power</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$100</div>
            <div className="text-muted-foreground">1000 Credits</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                Bulk credits
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                24/7 Dedicated support
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pb-5">
            <Button
              className="w-full"
              onClick={() => buyCridits("starter")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
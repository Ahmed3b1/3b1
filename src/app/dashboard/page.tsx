import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, CreditCard, Activity, History as HistoryIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

async function getUserStats(email: string) {
    await connectToDatabase();
    const user = await User.findOne({ email })
    return {
        credits: user?.credits || 0,
        creditsUsed: user?.creditsUsed || 0,
    }
}

export default async function DashboardPage() {
    const session = await auth();
    const stats = session?.user?.email ? await getUserStats(session.user.email) : { credits: 0, creditsUsed: 0 };
    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.credits}
                            <p className="text-xs text-muted-foreground">
                                Ready for automation
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">

                        </div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime consumption
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Flows</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            0
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Running automations
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/billing/usage">
                        <HistoryIcon className="mr-2 h-4 w-4" />
                        View Usage History
                    </Link>
                </Button>
            </div>
        </div>
    )
}
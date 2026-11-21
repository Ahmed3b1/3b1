import { auth } from '@/auth' ;
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import connectToDatabase from "@/lib/db" ; 
import User from "@/models/User" ;

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Zap, FileText, CreditCard, Settings, LogOut, Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle" ;

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/flows", label: "Flows", icon: Zap },
    { href: "/dashboard/templates", label: "Templates", icon: FileText },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    const credits = user?.credits || 0;

    return (
        <div className="flex min-h-screen w-full bg-background">
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-card/50 backdrop-blur-xl sm:flex">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Zap className="w-5 h-5" />
                        </div>
                        <span className="text-lg tracking-tight">AutoFlow ai</span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                        >
                            <item.icon className="h-4 w-4 transition-colors group-hover:text-primary" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="border-t p-4">
                    <form action={async () => {
                        'use server';
                        await signOut()
                    }}>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive" type="submit">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </form>
                </div>
            </aside>

            <div className="flex flex-1 flex-col sm:pl-64">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="sm:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="w-64 p-0">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <div className="flex h-16 items-center border-b px-6">
                                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                                    <Zap className="h-5 w-5 text-primary" />
                                    <span>AutoFlow ai</span>
                                </Link>
                            </div>
                            <nav className="space-y-1 px-3 py-4">
                                {navItems.map((item) => {
                                    <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground">
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                })
                            </nav>
                        </SheetContent>
                    </Sheet> 

                                        <div className="flex flex-1 items-center justify-between ">
                        <h1 className="text-sm font-medium text-muted-foreground sm:text-base">
                            Dashboard
                        </h1>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard/billing/usage"
                                className="hidden items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium hover:bg-accent transition-colors md:flex"
                            >
                                <Zap className="w-3 h-3 text-primary" />
                                <span>{credits} Credits</span>
                            </Link>
                            <ModeToggle />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user.image || ""} />
                                            <AvatarFallback>
                                                {session.user.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>

                                {/* DropdownMenuContent */}
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground ">{session.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings" >Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Support</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <form action={async () => {
                                        "use server";
                                        await signOut();
                                    }}>
                                        <DropdownMenuItem asChild>
                                            <button className="w-full text-left text-destructive">Logout</button>
                                        </DropdownMenuItem>
                                    </form>
                                </DropdownMenuContent>
                            

                
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>

            

                

            </div>
}
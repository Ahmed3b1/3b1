import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import CreditTransaction from "@/models/CreditTransaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react";

async function getUsageHistory(userId: string) {
  await connectToDatabase();
  return await CreditTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);
}

export default async function UsageHistoryPage() {
  const session = await auth();
  if(!session?.user?.id) redirect("/login");
  const history = await getUsageHistory(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usage Jistory</h1>
        <p className="text-muted-foreground">
          Detailed ledger of your credit consumption and purchases.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((tx) => (
                  <TableRow key={tx._id.toString()}>
                    <TableCell>
                      {format(new Date(tx.createdAt), "mmm D, HH:mm")}
                    </TableCell>
                    <TableCell className="font-medium">{tx.reason}</TableCell>
                    <TableCell className="capitalize">
                      {tx.referenceType}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        tx.amount < 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      <span className="flex items-center justify-end gap-1">
                        {tx.amount < 0 ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {Math.abs(tx.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
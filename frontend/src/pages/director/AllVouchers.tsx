import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllVouchers } from "@/services/voucher.service";
import type { Voucher } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "outline",
  pending_approval: "secondary",
  approved: "default",
  rejected: "destructive",
};

const statusLabel: Record<string, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
};

export default function AllVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllVouchers();
        setVouchers(data);
      } catch (err) {
        console.error("Failed to load vouchers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">All Vouchers</h1>
      <Card>
        <CardHeader>
          <CardTitle>{vouchers.length} total</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voucher #</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((v) => (
                <TableRow key={v._id}>
                  <TableCell className="font-medium">
                    {v.voucherNumber}
                  </TableCell>
                  <TableCell>
                    {typeof v.employee === "object" ? v.employee.name : "-"}
                  </TableCell>
                  <TableCell>{v.expenseTitle}</TableCell>
                  <TableCell>₹{v.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[v.status]}>
                      {statusLabel[v.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/director/vouchers/${v._id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

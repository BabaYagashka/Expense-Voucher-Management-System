import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getEmployeeDashboard,
  type EmployeeDashboardData,
} from "@/services/dashboard.service";
import { getMyVouchers } from "@/services/voucher.service";
import type { Voucher } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function EmployeeDashboard() {
  const [stats, setStats] = useState<EmployeeDashboardData | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, vouchersData] = await Promise.all([
          getEmployeeDashboard(),
          getMyVouchers(),
        ]);
        setStats(statsData);
        setVouchers(vouchersData);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">My Dashboard</h1>
        <Link to="/employee/vouchers/new">
          <Button>+ New Voucher</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.totalVouchers ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Draft
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.draftVouchers ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.pendingApproval ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.approvedVouchers ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.rejectedVouchers ?? 0}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Amount Claimed (Approved)</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold text-green-700">
          ₹{stats?.totalAmountClaimed?.toLocaleString("en-IN") ?? 0}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Vouchers</CardTitle>
        </CardHeader>
        <CardContent>
          {vouchers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No vouchers yet. Create your first one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voucher #</TableHead>
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
                    <TableCell>{v.expenseTitle}</TableCell>
                    <TableCell>₹{v.amount.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[v.status]}>
                        {statusLabel[v.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/employee/vouchers/${v._id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

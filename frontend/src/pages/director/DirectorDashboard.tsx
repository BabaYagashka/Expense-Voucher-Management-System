import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDirectorDashboard,
  type DirectorDashboardData,
} from "@/services/dashboard.service";
import { getAllVouchers } from "@/services/voucher.service";
import type { Voucher } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DirectorDashboard() {
  const [stats, setStats] = useState<DirectorDashboardData | null>(null);
  const [pendingVouchers, setPendingVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, vouchers] = await Promise.all([
          getDirectorDashboard(),
          getAllVouchers({ status: "pending_approval" }),
        ]);
        setStats(statsData);
        setPendingVouchers(vouchers);
      } catch (err) {
        console.error("Failed to load director dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading)
    return <p className="text-muted-foreground">Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          Director Dashboard
        </h1>
        <Link
          to="/director/vouchers"
          className="text-sm text-blue-600 hover:underline"
        >
          View all vouchers →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.pendingApprovalCount ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Approved Today
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.approvedToday ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Rejected Today
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.rejectedToday ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Pending (₹)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            ₹{stats?.totalPendingAmount?.toLocaleString("en-IN") ?? 0}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Awaiting Your Approval</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingVouchers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No vouchers pending approval.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voucher #</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingVouchers.map((v) => (
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
                      <Link
                        to={`/director/vouchers/${v._id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Review
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentActivity?.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent activity.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voucher #</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentActivity.map((v) => (
                  <TableRow key={v._id}>
                    <TableCell className="font-medium">
                      {v.voucherNumber}
                    </TableCell>
                    <TableCell>
                      {typeof v.employee === "object" ? v.employee.name : "-"}
                    </TableCell>
                    <TableCell>₹{v.amount.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          v.status === "approved" ? "default" : "destructive"
                        }
                      >
                        {v.status === "approved" ? "Approved" : "Rejected"}
                      </Badge>
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

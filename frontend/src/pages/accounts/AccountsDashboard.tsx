import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAccountsDashboard,
  type AccountsDashboardData,
} from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AccountsDashboard() {
  const [stats, setStats] = useState<AccountsDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAccountsDashboard();
        setStats(data);
      } catch (err) {
        console.error("Failed to load accounts dashboard:", err);
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
          Accounts Dashboard
        </h1>
        <Link
          to="/accounts/vouchers"
          className="text-sm text-blue-600 hover:underline"
        >
          View all vouchers →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Vouchers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {stats?.totalVouchers ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending Approval
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
          <CardTitle>Total Approved Expense Amount</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold text-green-700">
          ₹{stats?.totalApprovedExpenseAmount?.toLocaleString("en-IN") ?? 0}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Approved</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentApprovedVouchers?.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No approved vouchers yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voucher #</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentApprovedVouchers.map((v) => (
                  <TableRow key={v._id}>
                    <TableCell className="font-medium">
                      {v.voucherNumber}
                    </TableCell>
                    <TableCell>
                      {typeof v.employee === "object" ? v.employee.name : "-"}
                    </TableCell>
                    <TableCell>{v.expenseTitle}</TableCell>
                    <TableCell>₹{v.amount.toLocaleString("en-IN")}</TableCell>
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

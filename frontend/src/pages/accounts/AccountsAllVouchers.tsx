import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllVouchers } from "@/services/voucher.service";
import type { Voucher } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function AccountsAllVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  const loadVouchers = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = { sortBy, sortOrder };
      if (search.trim()) params.search = search.trim();
      if (status !== "all") params.status = status;

      const data = await getAllVouchers(params);
      setVouchers(data);
    } catch (err) {
      console.error("Failed to load vouchers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadVouchers();
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">All Vouchers</h1>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-sm font-medium text-slate-900">
                Search
              </label>
              <Input
                placeholder="Voucher # or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-40 space-y-1.5">
              <label className="text-sm font-medium text-slate-900">
                Status
              </label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value ?? "all")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-40 space-y-1.5">
              <label className="text-sm font-medium text-slate-900">
                Sort by
              </label>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value ?? "createdAt")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date created</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="expenseDate">Expense date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-36 space-y-1.5">
              <label className="text-sm font-medium text-slate-900">
                Order
              </label>
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value ?? "desc")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest first</SelectItem>
                  <SelectItem value="asc">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit">Search</Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{vouchers.length} result{vouchers.length !== 1 ? "s" : ""}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : vouchers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No vouchers match your filters.
            </p>
          ) : (
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
                    <TableCell className="font-medium">{v.voucherNumber}</TableCell>
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
                        to={`/accounts/vouchers/${v._id}`}
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
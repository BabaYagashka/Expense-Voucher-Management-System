import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVoucherById } from "@/services/voucher.service";
import type { Voucher } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function AccountsVoucherDetail() {
  const { id } = useParams<{ id: string }>();

  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await getVoucherById(id);
        setVoucher(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load voucher");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (!voucher) return <p className="text-red-600">{error || "Voucher not found"}</p>;

  const employeeName = typeof voucher.employee === "object" ? voucher.employee.name : "-";
  const employeeEmail = typeof voucher.employee === "object" ? voucher.employee.email : "";
  const directorName = typeof voucher.director === "object" ? voucher.director.name : null;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link to="/accounts/vouchers" className="text-sm text-blue-600 hover:underline">
        ← Back to all vouchers
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{voucher.voucherNumber}</CardTitle>
          <Badge variant={statusVariant[voucher.status]}>
            {statusLabel[voucher.status]}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Submitted by</p>
            <p className="font-medium">
              {employeeName} ({employeeEmail})
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Expense Title</dt>
              <dd className="font-medium">{voucher.expenseTitle}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="font-medium">₹{voucher.amount.toLocaleString("en-IN")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Department</dt>
              <dd className="font-medium">{voucher.department}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium">{voucher.expenseCategory}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Expense Date</dt>
              <dd className="font-medium">
                {new Date(voucher.expenseDate).toLocaleDateString("en-IN")}
              </dd>
            </div>
            {directorName && (
              <div>
                <dt className="text-muted-foreground">Reviewed by</dt>
                <dd className="font-medium">{directorName}</dd>
              </div>
            )}
          </dl>

          {voucher.expenseDescription && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{voucher.expenseDescription}</p>
            </div>
          )}

          {voucher.status === "rejected" && voucher.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm font-medium text-red-800">Rejection Reason</p>
              <p className="text-sm text-red-700">{voucher.rejectionReason}</p>
            </div>
          )}

          {voucher.employeeSignature && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Employee Signature</p>
              <img
                src={voucher.employeeSignature}
                alt="Employee signature"
                className="h-20 border rounded"
              />
            </div>
          )}

          {voucher.directorSignature && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Director Signature</p>
              <img
                src={voucher.directorSignature}
                alt="Director signature"
                className="h-20 border rounded"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
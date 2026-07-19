import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getVoucherById,
  submitVoucher,
  deleteVoucher,
} from "@/services/voucher.service";
import type { Voucher } from "@/types";
import { Button } from "@/components/ui/button";
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

export default function VoucherDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadVoucher = async () => {
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

  useEffect(() => {
    loadVoucher();
  }, [id]);

  const handleSubmit = async () => {
    if (!id || !signatureFile) {
      setError("Please select a signature image before submitting");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const updated = await submitVoucher(id, signatureFile);
      setVoucher(updated);
      setSignatureFile(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit voucher");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Delete this draft voucher? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteVoucher(id);
      navigate("/employee/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete voucher");
      setIsDeleting(false);
    }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (!voucher)
    return <p className="text-red-600">{error || "Voucher not found"}</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link
        to="/employee/dashboard"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to dashboard
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{voucher.voucherNumber}</CardTitle>
          <Badge variant={statusVariant[voucher.status]}>
            {statusLabel[voucher.status]}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Expense Title</dt>
              <dd className="font-medium">{voucher.expenseTitle}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Amount</dt>
              <dd className="font-medium">
                ₹{voucher.amount.toLocaleString("en-IN")}
              </dd>
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
          </dl>

          {voucher.expenseDescription && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm">{voucher.expenseDescription}</p>
            </div>
          )}

          {voucher.status === "rejected" && voucher.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm font-medium text-red-800">
                Rejection Reason
              </p>
              <p className="text-sm text-red-700">{voucher.rejectionReason}</p>
            </div>
          )}

          {voucher.employeeSignature && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Employee Signature
              </p>
              <img
                src={voucher.employeeSignature}
                alt="Employee signature"
                className="h-20 border rounded"
              />
            </div>
          )}

          {voucher.directorSignature && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Director Signature
              </p>
              <img
                src={voucher.directorSignature}
                alt="Director signature"
                className="h-20 border rounded"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {voucher.status === "draft" && (
            <div className="border-t pt-4 space-y-3">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Upload signature to submit for approval
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSignatureFile(e.target.files?.[0] || null)
                  }
                  className="text-sm"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit for Approval"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Draft"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

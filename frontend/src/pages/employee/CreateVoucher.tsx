import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createVoucher } from "@/services/voucher.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateVoucher() {
  const [expenseDate, setExpenseDate] = useState("");
  const [department, setDepartment] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !expenseDate ||
      !department ||
      !expenseTitle ||
      !expenseCategory ||
      !amount
    ) {
      setError("Please fill in all required fields");
      return;
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    setIsSubmitting(true);
    try {
      const voucher = await createVoucher({
        expenseDate,
        department,
        expenseTitle,
        expenseCategory,
        expenseDescription,
        amount: amountNum,
      });
      navigate(`/employee/vouchers/${voucher._id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create voucher");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link
        to="/employee/dashboard"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Expense Voucher</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expenseDate">Expense Date *</Label>
                <Input
                  id="expenseDate"
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Engineering"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenseTitle">Expense Title *</Label>
              <Input
                id="expenseTitle"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                placeholder="Client dinner reimbursement"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expenseCategory">Category *</Label>
                <Input
                  id="expenseCategory"
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  placeholder="Travel & Food"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenseDescription">Description</Label>
              <Textarea
                id="expenseDescription"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                placeholder="Additional details about this expense..."
                rows={3}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </Button>
              <Link to="/employee/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

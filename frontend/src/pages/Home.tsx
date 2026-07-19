import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Submit in seconds",
    description:
      "Employees log expenses, attach a signature, and submit for approval — all from one clean form.",
  },
  {
    title: "Clear approval workflow",
    description:
      "Directors see every pending voucher in one queue, approve or reject with a reason, no email chains.",
  },
  {
    title: "Full audit trail",
    description:
      "Every voucher tracks who submitted it, who approved it, and when — visible to the Accounts team at a glance.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
          Expense vouchers,
          <br />
          <span className="text-primary">without the paper trail</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
          A simple digital workflow for submitting, approving, and tracking
          expense vouchers — replacing manual paper forms end to end.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/register">
            <Button size="lg">Get started</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {f.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t py-6">
        <p className="text-center text-sm text-muted-foreground">
          Built for Prachay Securities Pvt. Ltd. — Full Stack Developer
          Internship Assignment
        </p>
      </footer>
    </div>
  );
}

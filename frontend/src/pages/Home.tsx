import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 pt-10 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Expense <span className="text-green-700">Vouchers</span>
            <br />
            <span className="text-primary">without the paper trail.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            A simple digital workflow for submitting, approving, and tracking
            expense vouchers — replacing manual paper forms end to end.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="px-6">
                Get started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="bg-white px-6">
                Sign in
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto px-4 pb-24">
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card
                key={f.title}
                className="border-slate-200/80 text-center bg-white shadow-sm hover:border-slate-300 transition-colors duration-200"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-800">
                    {f.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 leading-relaxed">
                  {f.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Footer/>
    </div>
  );
}

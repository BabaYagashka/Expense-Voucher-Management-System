import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const dashboardByRole: Record<string, string> = {
  employee: "/employee/dashboard",
  director: "/director/dashboard",
  accounts: "/accounts/dashboard",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(dashboardByRole[user.role] || "/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Center Container */}
        <div className="flex items-center justify-center pt-16 pb-24 px-4">
          <div className="w-full max-w-sm space-y-5">
            <Link
              to="/"
              className="block text-center font-bold text-lg text-slate-900 tracking-tight"
            >
              Expense<span className="text-green-700">Voucher</span>
            </Link>

            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-xl font-bold  text-slate-900">
                  Sign in
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Welcome back, please enter your details to your access your account!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-slate-900 font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="border-slate-200 focus-visible:ring-emerald-600/20 focus-visible:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-slate-900 font-medium"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="border-slate-200 focus-visible:ring-emerald-600/20 focus-visible:border-emerald-600"
                    />
                  </div>

                  {error && (
                    <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size={"lg"}
                    className="w-full font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                <p className="mt-5 text-sm text-center text-slate-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-green-700 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

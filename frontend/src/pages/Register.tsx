import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/services/auth.service";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !role) {
      setError("Name, email, password, and role are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (name.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser({ name, email, password, role, department });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again.",
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
        <div className="flex items-center text-center justify-center pt-12 pb-20 px-4">
          <div className="w-full max-w-sm space-y-5">
            <Link
              to="/"
              className="block text-center font-bold text-lg text-slate-900 tracking-tight"
            >
              Expense<span className="text-green-700">Voucher</span>
            </Link>

            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-bold text-slate-900">
                  Create an account
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Get started in a few seconds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-slate-900 font-medium"
                    >
                      Full name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Viraj Employee"
                      className="border-slate-200 focus-visible:ring-emerald-600/20 focus-visible:border-emerald-600"
                    />
                  </div>

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

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="department"
                      className="text-slate-900 font-medium"
                    >
                      Department
                    </Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Engineering"
                      className="border-slate-200 focus-visible:ring-emerald-600/20 focus-visible:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="role"
                      className="text-slate-900 font-medium"
                    >
                      Role
                    </Label>
                    <Select
                      value={role}
                      onValueChange={(val) => setRole(val as UserRole)}
                    >
                      <SelectTrigger
                        id="role"
                        className="w-full border-slate-200 focus:ring-emerald-600/20 focus:border-emerald-600"
                      >
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="director">Director</SelectItem>
                        <SelectItem value="accounts">Accounts Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
                      {error}
                    </p>
                  )}

                  {success && (
                    <p className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-3 py-2 rounded-md">
                      Account created! Redirecting to login...
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Button>
                </form>

                <p className="mt-5 text-sm text-center text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-green-700 hover:underline"
                  >
                    Sign in
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

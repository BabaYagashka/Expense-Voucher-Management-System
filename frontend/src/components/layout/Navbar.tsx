import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const dashboardByRole: Record<string, string> = {
  employee: "/employee/dashboard",
  director: "/director/dashboard",
  accounts: "/accounts/dashboard",
};

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to={dashboardByRole[user.role]}
          className="font-semibold text-slate-900"
        >
          Expense Voucher System
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-sm text-right hidden sm:block">
            <p className="font-medium text-slate-900 leading-tight">
              {user.name}
            </p>
            <p className="text-muted-foreground capitalize leading-tight">
              {user.role}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

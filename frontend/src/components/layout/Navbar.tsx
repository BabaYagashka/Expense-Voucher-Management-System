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

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to={user ? dashboardByRole[user.role] : "/"}
          className="font-semibold text-lg text-slate-900 tracking-tight"
        >
          Expense<span className="text-green-800">Voucher</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-slate-900 leading-tight">
                {user.name}
              </p>
              <p className="text-muted-foreground capitalize leading-tight">
                {user.role}
              </p>
            </div>
            <Button variant="outline" size="lg" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="lg">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

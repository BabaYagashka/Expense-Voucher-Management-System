import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

const dashboardByRole: Record<string, string> = {
  employee: "/employee/dashboard",
  director: "/director/dashboard",
  accounts: "/accounts/dashboard",
};

export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Navigate to={dashboardByRole[user.role] || "/"} replace />;
  }

  return <>{children}</>;
}

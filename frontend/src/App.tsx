import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import CreateVoucher from "@/pages/employee/CreateVoucher";
import VoucherDetail from "@/pages/employee/VoucherDetail";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <Layout>
                <EmployeeDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/director/dashboard"
          element={
            <ProtectedRoute allowedRoles={["director"]}>
              <Layout>
                <div>Director Dashboard (placeholder)</div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/accounts/dashboard"
          element={
            <ProtectedRoute allowedRoles={["accounts"]}>
              <Layout>
                <div>Accounts Dashboard (placeholder)</div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={<div>You don't have permission to view this page.</div>}
        />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/employee/vouchers/new"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <Layout>
                <CreateVoucher />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/vouchers/:id"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <Layout>
                <VoucherDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

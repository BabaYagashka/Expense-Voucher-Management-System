import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { Layout } from "@/components/layout/Layout";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import CreateVoucher from "@/pages/employee/CreateVoucher";
import VoucherDetail from "@/pages/employee/VoucherDetail";

import DirectorDashboard from "@/pages/director/DirectorDashboard";
import AllVouchers from "@/pages/director/AllVouchers";
import DirectorVoucherDetail from "@/pages/director/DirectorVoucherDetail";

import AccountsDashboard from "@/pages/accounts/AccountsDashboard";
import AccountsAllVouchers from "@/pages/accounts/AccountsAllVouchers";

import AccountsVoucherDetail from "@/pages/accounts/AccountsVoucherDetail";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Employee routes */}
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

        {/* Director routes */}
        <Route
          path="/director/dashboard"
          element={
            <ProtectedRoute allowedRoles={["director"]}>
              <Layout>
                <DirectorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/director/vouchers"
          element={
            <ProtectedRoute allowedRoles={["director"]}>
              <Layout>
                <AllVouchers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/director/vouchers/:id"
          element={
            <ProtectedRoute allowedRoles={["director"]}>
              <Layout>
                <DirectorVoucherDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Accounts routes */}
        <Route
          path="/accounts/dashboard"
          element={
            <ProtectedRoute allowedRoles={["accounts"]}>
              <Layout>
                <AccountsDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/vouchers"
          element={
            <ProtectedRoute allowedRoles={["accounts"]}>
              <Layout>
                <AccountsAllVouchers />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/accounts/vouchers/:id"
          element={
            <ProtectedRoute allowedRoles={["accounts"]}>
              <Layout>
                <AccountsVoucherDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/unauthorized"
          element={<div>You don't have permission to view this page.</div>}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

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
              <div>Employee Dashboard (placeholder)</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/director/dashboard"
          element={
            <ProtectedRoute allowedRoles={["director"]}>
              <div>Director Dashboard (placeholder)</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/accounts/dashboard"
          element={
            <ProtectedRoute allowedRoles={["accounts"]}>
              <div>Accounts Dashboard (placeholder)</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={<div>You don't have permission to view this page.</div>}
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

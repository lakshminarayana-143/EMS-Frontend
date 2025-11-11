import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeManagement from "./pages/EmployeeMangement";
import AdminSignup from "./components/AdminSignup";
import AdminAccessCheck from "./components/AdminAccessCheck";
import ProtectedSignupRoute from "./components/ProtectedSignupRoute";
import AdminEntry from "./components/AdminEntry";

function App() {
  return (
    <Routes>
      {/* 🚀 Entry point now decides login vs signup */}
      <Route path="/" element={<AdminEntry />} />

      {/* Login and Access check */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/access-check" element={<AdminAccessCheck />} />

      {/* Signup */}
      <Route
        path="/admin/register"
        element={
          <ProtectedSignupRoute>
            <AdminSignup />
          </ProtectedSignupRoute>
        }
      />

      {/* Protected employee dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/employees" element={<EmployeeManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

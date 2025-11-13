import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import EmployeeManagement from "./pages/EmployeeMangement";
import AdminSignup from "./components/AdminSignup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* Public routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminSignup />} />

      {/* Protected route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/employees" element={<EmployeeManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UpdatePassword from "./pages/UpdatePassword";
import UserStores from "./pages/UserStores";
import AdminDashboard from "./pages/AdminDashboard";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import AdminUserDetail from "./pages/AdminUserDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />

      <Route path="/stores" element={<ProtectedRoute roles={["USER"]}><UserStores /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />

      <Route path="/owner/dashboard" element={<ProtectedRoute roles={["STORE_OWNER"]}><StoreOwnerDashboard /></ProtectedRoute>} />

      <Route path="/admin/users" element={<ProtectedRoute roles={["ADMIN"]}><AdminUsers /></ProtectedRoute>} />

      <Route path="/admin/stores" element={<ProtectedRoute roles={["ADMIN"]}><AdminStores /></ProtectedRoute>} />

      <Route path="/admin/users/:id" element={<ProtectedRoute roles={["ADMIN"]}><AdminUserDetail /></ProtectedRoute>} />

      {/* Default: redirect root and any unknown path to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
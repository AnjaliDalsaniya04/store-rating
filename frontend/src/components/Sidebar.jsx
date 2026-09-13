import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    showToast("Logged out", "success");
    navigate("/login");
  }

  if (!user) return null;

  return (
    <div className="sidebar">
      <div className="brand">Store<span>Rate</span></div>
      <nav>
        {user.role === "ADMIN" && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "active" : "")}>
              Users
            </NavLink>
            <NavLink to="/admin/stores" className={({ isActive }) => (isActive ? "active" : "")}>
              Stores
            </NavLink>
          </>
        )}
        {user.role === "USER" && (
          <NavLink to="/stores" className={({ isActive }) => (isActive ? "active" : "")} end>
            Browse stores
          </NavLink>
        )}
        {user.role === "STORE_OWNER" && (
          <NavLink to="/owner/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            My store
          </NavLink>
        )}
        <NavLink to="/update-password" className={({ isActive }) => (isActive ? "active" : "")}>
          Change password
        </NavLink>
        <button onClick={handleLogout}>Log out</button>
      </nav>
      <div className="user-chip">
        Signed in as<br />
        <strong style={{ color: "white" }}>{user.name}</strong>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      showToast(`Welcome back, ${res.data.user.name.split(" ")[0]}`, "success");
      const role = res.data.user.role;
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "STORE_OWNER") navigate("/owner/dashboard");
      else navigate("/stores");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      {/* Left brand panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-logo">Rate<span>It</span></div>
        <h1>Real reviews, from real customers.</h1>
        <p>Rate stores you've visited, discover the best in your area, and help others shop with confidence.</p>
        <div className="auth-brand-features">
          <div className="feat">
            <div className="feat-icon">⭐</div>
            Rate stores honestly
          </div>
          <div className="feat">
            <div className="feat-icon">🔍</div>
            Discover top-rated places
          </div>
          <div className="feat">
            <div className="feat-icon">🛡️</div>
            Trusted community reviews
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p className="sub">Enter your credentials to access your account.</p>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="field-error">{error}</div>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="auth-footer">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

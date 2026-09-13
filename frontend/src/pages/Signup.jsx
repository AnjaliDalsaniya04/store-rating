import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { validateName, validateAddress, validatePassword, validateEmail } from "../utils/validation";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const errs = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
    };
    setErrors(errs);
    return Object.values(errs).every((v) => !v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      login(res.data.token, res.data.user);
      showToast("Account created — welcome!", "success");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
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
        <h1>Join a community that rates what matters.</h1>
        <p>Create an account to start rating stores and sharing your experience with others.</p>
        <div className="auth-brand-features">
          <div className="feat">
            <div className="feat-icon">✍️</div>
            Share honest reviews
          </div>
          <div className="feat">
            <div className="feat-icon">📍</div>
            Find the best local stores
          </div>
          <div className="feat">
            <div className="feat-icon">🤝</div>
            Help others shop smarter
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create your account</h2>
            <p className="sub">Takes less than a minute.</p>
          </div>

          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="name">
                Full name
                <span className="field-hint">(20–60 characters)</span>
              </label>
              <input
                id="name"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="field-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                placeholder="123 Main St, City"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
              {errors.address && <div className="field-error">{errors.address}</div>}
            </div>

            <div className="field-group">
              <label htmlFor="password">
                Password
                <span className="field-hint">(8–16 chars, 1 uppercase, 1 special char)</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

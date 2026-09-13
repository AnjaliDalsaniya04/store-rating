import { useState } from "react";
import api from "../api/client";
import { useToast } from "../context/ToastContext";
import { validatePassword } from "../utils/validation";

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const pwError = validatePassword(newPassword);
    if (pwError) return setError(pwError);

    try {
      await api.put("/auth/update-password", { oldPassword, newPassword });
      showToast("Password updated successfully", "success");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      const msg = err.response?.data?.message || "Could not update password";
      setError(msg);
      showToast(msg, "error");
    }
  }

  return (
    <div>
      <h2>Change password</h2>
      <div className="card" style={{ maxWidth: 420, marginTop: 20 }}>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label>Current password</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
          </div>
          <div>
            <label>New password (8-16 chars, 1 uppercase, 1 special char)</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          {error && <div className="field-error">{error}</div>}
          <button className="btn-primary" type="submit">Update password</button>
        </form>
      </div>
    </div>
  );
}
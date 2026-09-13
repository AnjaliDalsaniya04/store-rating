import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import StarRating from "../components/StarRating";

const badgeClass = { ADMIN: "badge-admin", USER: "badge-user", STORE_OWNER: "badge-owner" };
const roleLabel = { ADMIN: "Admin", USER: "Normal user", STORE_OWNER: "Store owner" };

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load user"));
  }, [id]);

  if (error) return (
    <div>
      <button className="btn-secondary" onClick={() => navigate("/admin/users")} style={{ marginBottom: 20 }}>
        ← Back to users
      </button>
      <div className="field-error">{error}</div>
    </div>
  );

  if (!user) return <p>Loading…</p>;

  return (
    <div>
      <button
        className="btn-secondary"
        onClick={() => navigate("/admin/users")}
        style={{ marginBottom: 24 }}
      >
        ← Back to users
      </button>

      <h2>User details</h2>

      <div className="card" style={{ maxWidth: 520, marginTop: 20 }}>
        <div className="user-detail-grid">
          <div className="user-detail-row">
            <span className="user-detail-label">Name</span>
            <span className="user-detail-value">{user.name}</span>
          </div>
          <div className="user-detail-row">
            <span className="user-detail-label">Email</span>
            <span className="user-detail-value">{user.email}</span>
          </div>
          <div className="user-detail-row">
            <span className="user-detail-label">Address</span>
            <span className="user-detail-value">{user.address}</span>
          </div>
          <div className="user-detail-row">
            <span className="user-detail-label">Role</span>
            <span className="user-detail-value">
              <span className={`badge ${badgeClass[user.role]}`}>{roleLabel[user.role]}</span>
            </span>
          </div>

          {user.role === "STORE_OWNER" && (
            <>
              <div className="user-detail-row">
                <span className="user-detail-label">Store rating</span>
                <span className="user-detail-value" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <StarRating value={Math.round(user.rating ?? 0)} readOnly />
                  <span style={{ color: "var(--ink-soft)", fontSize: 13 }}>
                    {user.rating !== null ? user.rating : "No ratings yet"}
                  </span>
                </span>
              </div>

              {user.store ? (
                <>
                  <div className="user-detail-row" style={{ marginTop: 8, paddingTop: 16, borderTop: "2px solid var(--line)" }}>
                    <span className="user-detail-label" style={{ fontWeight: 700, color: "var(--ink)" }}>Store details</span>
                  </div>
                  <div className="user-detail-row">
                    <span className="user-detail-label">Store name</span>
                    <span className="user-detail-value">{user.store.name}</span>
                  </div>
                  <div className="user-detail-row">
                    <span className="user-detail-label">Store email</span>
                    <span className="user-detail-value">{user.store.email}</span>
                  </div>
                  <div className="user-detail-row">
                    <span className="user-detail-label">Store address</span>
                    <span className="user-detail-value">{user.store.address}</span>
                  </div>
                </>
              ) : (
                <div className="user-detail-row">
                  <span className="user-detail-label">Store</span>
                  <span className="user-detail-value" style={{ color: "var(--ink-soft)" }}>
                    No store assigned yet
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load dashboard"));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <div className="field-error">{error}</div>}
      {stats && (
        <div className="stat-row" style={{ marginTop: 20 }}>
          <div className="stat">
            <div className="num">{stats.totalUsers}</div>
            <div className="label">Total users</div>
          </div>
          <div className="stat">
            <div className="num">{stats.totalStores}</div>
            <div className="label">Total stores</div>
          </div>
          <div className="stat">
            <div className="num">{stats.totalRatings}</div>
            <div className="label">Ratings submitted</div>
          </div>
        </div>
      )}
    </div>
  );
}
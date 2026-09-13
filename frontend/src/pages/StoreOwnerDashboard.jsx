import { useEffect, useState } from "react";
import api from "../api/client";
import StarRating from "../components/StarRating";

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/store-owner/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load dashboard"));
  }, []);

  if (error) return <div className="field-error">{error}</div>;
  if (!data) return <p>Loading…</p>;

  return (
    <div>
      <h2>{data.storeName}</h2>
      <div className="stat-row" style={{ marginTop: 20 }}>
        <div className="stat">
          <div className="num">{data.averageRating}</div>
          <div className="label">Average rating</div>
        </div>
        <div className="stat">
          <div className="num">{data.raters.length}</div>
          <div className="label">Ratings submitted</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 14 }}>Who rated your store</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.raters.map((r) => (
              <tr key={r.userId}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td><StarRating value={r.rating} readOnly /></td>
              </tr>
            ))}
            {data.raters.length === 0 && (
              <tr>
                <td colSpan={3}>No ratings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
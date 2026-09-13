import { useEffect, useState } from "react";
import api from "../api/client";
import { useToast } from "../context/ToastContext";
import StarRating from "../components/StarRating";

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const { showToast } = useToast();

  async function fetchStores() {
    try {
      const res = await api.get("/stores", { params: { name, address } });
      setStores(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || "Could not load stores", "error");
    }
  }

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    fetchStores();
  }

  async function rate(storeId, value) {
    try {
      await api.post(`/stores/${storeId}/rating`, { rating: value });
      setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, yourRating: value } : s)));
      showToast("Rating saved", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not submit rating", "error");
    }
  }

  return (
    <div>
      <h2>Browse stores</h2>
      <form className="filters" onSubmit={handleSearch} style={{ marginTop: 20 }}>
        <input placeholder="Search by name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Search by address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button className="btn-secondary" type="submit">Search</button>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Store</th>
              <th>Address</th>
              <th>Overall rating</th>
              <th>Your rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td>
                  <StarRating value={Math.round(s.overallRating)} readOnly />
                  <span style={{ marginLeft: 6, color: "var(--ink-soft)", fontSize: 13 }}>
                    {s.overallRating || "—"}
                  </span>
                </td>
                <td>
                  <StarRating value={s.yourRating || 0} onChange={(v) => rate(s.id, v)} />
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan={4}>No stores found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
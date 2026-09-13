import { useEffect, useState } from "react";
import api from "../api/client";
import Modal from "../components/Modal";
import StarRating from "../components/StarRating";
import { useToast } from "../context/ToastContext";

const emptyForm = { name: "", email: "", address: "", ownerId: "" };

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  async function fetchStores() {
    const params = { ...filters, sortBy, order };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    const res = await api.get("/admin/stores", { params });
    setStores(res.data);
  }

  // Fetch all Store Owner accounts, so the dropdown always shows current data
  async function fetchOwners() {
    const res = await api.get("/admin/users", { params: { role: "STORE_OWNER" } });
    setOwners(res.data);
  }

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  function toggleSort(field) {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setOrder("asc");
    }
  }

  function openModal() {
    fetchOwners();
    setShowModal(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const payload = { ...form, ownerId: form.ownerId ? Number(form.ownerId) : null };
      await api.post("/admin/stores", payload);
      showToast("Store created successfully", "success");
      setForm(emptyForm);
      setShowModal(false);
      fetchStores();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not create store", "error");
    }
  }

  const sortIndicator = (field) => (sortBy === field ? (order === "asc" ? " ▲" : " ▼") : "");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Stores</h2>
        <button className="btn-primary" onClick={openModal}>+ Add store</button>
      </div>

      <form
        className="filters"
        onSubmit={(e) => { e.preventDefault(); fetchStores(); }}
        style={{ marginTop: 20 }}
      >
        <input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <button className="btn-secondary" type="submit">Apply</button>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")}>Name{sortIndicator("name")}</th>
              <th onClick={() => toggleSort("email")}>Email{sortIndicator("email")}</th>
              <th onClick={() => toggleSort("address")}>Address{sortIndicator("address")}</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td><StarRating value={Math.round(s.rating)} readOnly /></td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr><td colSpan={4}>No stores found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Add store" onClose={() => setShowModal(false)}>
          <form className="form-grid" onSubmit={handleCreate}>
            <div>
              <label>Store name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label>Store email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label>Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
            <div>
              <label>Store owner (optional)</label>
              <select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })}>
                <option value="">No owner yet</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} — {o.email}
                  </option>
                ))}
              </select>
              {owners.length === 0 && (
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 6 }}>
                  No Store Owner accounts exist yet. Create one from the Users page first, then come back here.
                </p>
              )}
            </div>
            <button className="btn-primary" type="submit">Create store</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
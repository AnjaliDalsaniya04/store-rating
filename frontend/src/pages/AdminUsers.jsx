import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";
import { validateName, validateAddress, validatePassword, validateEmail } from "../utils/validation";

const emptyForm = { name: "", email: "", address: "", password: "", role: "USER" };
const emptyStoreForm = { name: "", email: "", address: "" };

const badgeClass = { ADMIN: "badge-admin", USER: "badge-user", STORE_OWNER: "badge-owner" };
const roleLabel = { ADMIN: "Admin", USER: "Normal user", STORE_OWNER: "Store owner" };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

  // Step 1: create user
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Step 2: assign store (only shown after creating a STORE_OWNER)
  const [newOwner, setNewOwner] = useState(null); // { id, name } of the just-created owner
  const [storeForm, setStoreForm] = useState(emptyStoreForm);
  const [storeFormErrors, setStoreFormErrors] = useState({});
  const [showStoreStep, setShowStoreStep] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  async function fetchUsers() {
    const params = { ...filters, sortBy, order };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    const res = await api.get("/admin/users", { params });
    setUsers(res.data);
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, order]);

  function toggleSort(field) {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else { setSortBy(field); setOrder("asc"); }
  }

  function validateUser() {
    const errs = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
    };
    setFormErrors(errs);
    return Object.values(errs).every((v) => !v);
  }

  function validateStore() {
    const errs = {};
    if (!storeForm.name.trim()) errs.name = "Store name is required";
    if (!storeForm.email.trim()) errs.email = "Store email is required";
    if (!storeForm.address.trim()) errs.address = "Store address is required";
    setStoreFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    if (!validateUser()) return;
    try {
      const res = await api.post("/admin/users", form);
      showToast("User created successfully", "success");
      fetchUsers();

      if (form.role === "STORE_OWNER") {
        // Move to step 2 — keep modal open, switch to store assignment
        setNewOwner({ id: res.data.id, name: res.data.name });
        setStoreForm(emptyStoreForm);
        setStoreFormErrors({});
        setShowStoreStep(true);
      } else {
        closeModal();
      }

      setForm(emptyForm);
      setFormErrors({});
    } catch (err) {
      showToast(err.response?.data?.message || "Could not create user", "error");
    }
  }

  async function handleCreateStore(e) {
    e.preventDefault();
    if (!validateStore()) return;
    try {
      await api.post("/admin/stores", { ...storeForm, ownerId: newOwner.id });
      showToast(`Store created and assigned to ${newOwner.name}`, "success");
      closeModal();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not create store", "error");
    }
  }

  function closeModal() {
    setShowModal(false);
    setShowStoreStep(false);
    setNewOwner(null);
    setForm(emptyForm);
    setFormErrors({});
    setStoreForm(emptyStoreForm);
    setStoreFormErrors({});
  }

  const sortIndicator = (field) => (sortBy === field ? (order === "asc" ? " ▲" : " ▼") : "");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Users</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add user</button>
      </div>

      <form
        className="filters"
        onSubmit={(e) => { e.preventDefault(); fetchUsers(); }}
        style={{ marginTop: 20 }}
      >
        <input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All roles</option>
          <option value="USER">Normal user</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store owner</option>
        </select>
        <button className="btn-secondary" type="submit">Apply</button>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")}>Name{sortIndicator("name")}</th>
              <th onClick={() => toggleSort("email")}>Email{sortIndicator("email")}</th>
              <th onClick={() => toggleSort("address")}>Address{sortIndicator("address")}</th>
              <th onClick={() => toggleSort("role")}>Role{sortIndicator("role")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="clickable" onClick={() => navigate(`/admin/users/${u.id}`)}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td><span className={`badge ${badgeClass[u.role]}`}>{roleLabel[u.role]}</span></td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Step 1: Create user ── */}
      {showModal && !showStoreStep && (
        <Modal title="Add user" onClose={closeModal}>
          <form className="form-grid" onSubmit={handleCreateUser}>
            <div>
              <label>Name (20-60 chars)</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {formErrors.name && <div className="field-error">{formErrors.name}</div>}
            </div>
            <div>
              <label>Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {formErrors.email && <div className="field-error">{formErrors.email}</div>}
            </div>
            <div>
              <label>Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              {formErrors.address && <div className="field-error">{formErrors.address}</div>}
            </div>
            <div>
              <label>Password (8-16 chars, 1 uppercase, 1 special char)</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              {formErrors.password && <div className="field-error">{formErrors.password}</div>}
            </div>
            <div>
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="USER">Normal user</option>
                <option value="ADMIN">Admin</option>
                <option value="STORE_OWNER">Store owner</option>
              </select>
              {form.role === "STORE_OWNER" && (
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 6 }}>
                  You'll be able to assign a store to this owner in the next step.
                </p>
              )}
            </div>
            <button className="btn-primary" type="submit">
              {form.role === "STORE_OWNER" ? "Create user & continue →" : "Create user"}
            </button>
          </form>
        </Modal>
      )}

      {/* ── Step 2: Assign store to new owner ── */}
      {showModal && showStoreStep && (
        <Modal title={`Assign a store to ${newOwner?.name}`} onClose={closeModal}>
          <div className="store-step-banner">
            <span className="store-step-icon">🏪</span>
            <div>
              <strong>{newOwner?.name}</strong> was created as a Store Owner.
              <br />
              Create and assign their store now, or skip to do it later from the Stores page.
            </div>
          </div>

          <form className="form-grid" onSubmit={handleCreateStore} style={{ marginTop: 20 }}>
            <div>
              <label>Store name</label>
              <input
                value={storeForm.name}
                onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              />
              {storeFormErrors.name && <div className="field-error">{storeFormErrors.name}</div>}
            </div>
            <div>
              <label>Store email</label>
              <input
                type="email"
                value={storeForm.email}
                onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
              />
              {storeFormErrors.email && <div className="field-error">{storeFormErrors.email}</div>}
            </div>
            <div>
              <label>Store address</label>
              <input
                value={storeForm.address}
                onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
              />
              {storeFormErrors.address && <div className="field-error">{storeFormErrors.address}</div>}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" type="submit" style={{ flex: 1 }}>
                Create store
              </button>
              <button className="btn-secondary" type="button" onClick={closeModal} style={{ flex: 1 }}>
                Skip for now
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

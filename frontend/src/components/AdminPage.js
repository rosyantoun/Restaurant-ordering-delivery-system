import { useState, useEffect } from "react";
import "./AdminPage.css";

const CATEGORIES = ["Burger", "Pizza", "Pasta", "Appetizers"];
const API = "http://localhost:5000";
const emptyForm = { name: "", price: "", category: "Burger", imageURL: "" };

const AdminPage = () => {
  const [tab, setTab] = useState("orders");
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === "menu") fetchItems();
    if (tab === "orders") fetchOrders();
  }, [tab]);

  const fetchItems = async () => {
    const res = await fetch(`${API}/api/items`);
    setItems(await res.json());
  };

  const fetchOrders = async () => {
    const res = await fetch(`${API}/api/admin/orders`);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/api/admin/items/${editingId}` : `${API}/api/admin/items`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });
      const data = await res.json();
      alert(data.message);
      setForm(emptyForm);
      setEditingId(null);
      fetchItems();
    } catch {
      alert("Error saving item.");
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, price: item.price, category: item.category || "Burger", imageURL: item.imageURL || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    const res = await fetch(`${API}/api/admin/items/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.message);
    fetchItems();
  };

  return (
    <div className="admin-page">
      <div className="admin-tabs">
        <button className={tab === "orders" ? "admin-tab active" : "admin-tab"} onClick={() => setTab("orders")}>
          📋 Orders
        </button>
        <button className={tab === "menu" ? "admin-tab active" : "admin-tab"} onClick={() => setTab("menu")}>
          🍔 Menu Items
        </button>
      </div>

      {/* ORDERS TAB */}
      {tab === "orders" && (
        <div className="admin-section">
          <div className="section-header">
            <h2>All Orders</h2>
            <button className="refresh-btn" onClick={fetchOrders}>↻ Refresh</button>
          </div>
          {orders.length === 0 ? (
            <p className="empty-msg">No orders yet.</p>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Date</th><th>Customer</th><th>Email</th>
                    <th>Phone</th><th>Address</th><th>Items</th><th>Total</th><th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}</td>
                      <td>{o.name || "—"}</td>
                      <td>{o.email}</td>
                      <td>{o.phoneNumber || "—"}</td>
                      <td>{o.address || "—"}</td>
                      <td className="items-cell">{o.items}</td>
                      <td>${parseFloat(o.totalPrice).toFixed(2)}</td>
                      <td>{o.paymentInfo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MENU TAB */}
      {tab === "menu" && (
        <div className="admin-section">
          {/* Form */}
          <div className="admin-form-card">
            <h2>{editingId ? "✏️ Edit Item" : "➕ Add New Item"}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <label>Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Classic Burger" />
              </div>
              <div className="form-row">
                <label>Price ($)</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="e.g. 9.99" />
              </div>
              <div className="form-row">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Image URL</label>
                <input type="text" value={form.imageURL} onChange={(e) => setForm({ ...form, imageURL: e.target.value })} placeholder="http://localhost:3000/food-delivery-app/images/burger.png" />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? "Saving..." : editingId ? "Update Item" : "Add Item"}
                </button>
                {editingId && <button type="button" className="btn-cancel" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
              </div>
            </form>
          </div>

          {/* Items Table */}
          <div className="admin-form-card">
            <h2>All Menu Items ({items.length})</h2>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td><img src={item.imageURL} alt={item.name} className="admin-item-img" onError={(e) => (e.target.style.display = "none")} /></td>
                      <td>{item.name}</td>
                      <td><span className="category-badge">{item.category}</span></td>
                      <td>${parseFloat(item.price).toFixed(2)}</td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

import { useEffect, useState } from "react";
import "./AdminOrders.css";
import { adminOrdersApi } from "../api/adminOrders";

const STATUSES = ["Pending", "Preparing", "OutForDelivery", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  const load = () => adminOrdersApi.getAllOrders().then(setOrders).catch(console.error);

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminOrdersApi.updateOrderStatus(orderId, newStatus);
      await load();
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    revenue: orders
      .filter((o) => o.status === "Delivered")
      .reduce((acc, o) => acc + Number(o.totalPrice), 0),
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">
        <h1 className="admin-orders-title">Order Management</h1>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>Today's Orders</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Delivered</span>
            <strong>{stats.delivered}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Revenue</span>
            <strong>${stats.revenue.toFixed(2)}</strong>
          </div>
        </div>

        <div className="admin-filter-row">
          <label>Filter by status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-orders-list">
          {filtered.length === 0 ? (
            <p className="admin-orders-empty">No orders found.</p>
          ) : (
            filtered.map((order) => (
              <div key={order.id} className="admin-order-card">
                <div className="admin-order-header">
                  <div className="admin-order-header-left">
                    <span className="admin-order-id">Order #{order.id}</span>
                    <span className="admin-order-customer">{order.userEmail}</span>
                  </div>
                  <span className="admin-order-date">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                {order.addressText && (
                  <p className="admin-order-address">📍 {order.addressText}</p>
                )}

                <ul className="admin-order-items">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      <span>{item.itemName} × {item.quantity}</span>
                      <span>${Number(item.subtotal).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <div className="admin-order-footer">
                  <span className="admin-order-total">
                    Total: ${Number(order.totalPrice).toFixed(2)}
                  </span>
                  <select
                    className={`admin-status-select status-${order.status.toLowerCase()}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
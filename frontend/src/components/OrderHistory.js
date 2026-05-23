import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OrderHistory.css";
import { orderApi } from "../api/orders";
import { useAuth } from "../context/AuthContext";

const statusColors = {
  Pending: {
    background: "#fff7e8",
    color: "#8a6500",
    border: "#f0dfb7",
  },
  Preparing: {
    background: "#f3f6fa",
    color: "#587089",
    border: "#d8e1eb",
  },
  OutForDelivery: {
    background: "#f5f3fa",
    color: "#6a617f",
    border: "#ddd8e8",
  },
  Delivered: {
    background: "#f2f8f3",
    color: "#52745a",
    border: "#d6e6d9",
  },
  Cancelled: {
    background: "#fbf3f2",
    color: "#8a5c58",
    border: "#ead8d5",
  },
};

const defaultStatusStyle = {
  background: "#f5f3f0",
  color: "#6f665f",
  border: "#dfdad4",
};

const OrderHistory = () => {
  const { refreshCartCount } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi
      .getMine()
      .then((data) => setOrders(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleReorder = async (orderId) => {
    try {
      await orderApi.reorder(orderId);
      await refreshCartCount();
      alert("✅ Items added to your cart.");
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <p className="orders-loading">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-panel">
          <div className="orders-heading">
            <h1 className="orders-title">Past Orders</h1>
          </div>

          {orders.length === 0 ? (
            <div className="orders-empty">
              <p>You haven't placed any orders yet.</p>
              <Link to="/menu" className="orders-cta">
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => {
                const statusStyle =
                  statusColors[order.status] || defaultStatusStyle;

                return (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-heading-group">
                        <span className="order-icon" aria-hidden="true">
                          🍽️
                        </span>

                        <div className="order-meta">
                          <span className="order-id">Order #{order.id}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <span
                        className="order-status"
                        style={{
                          background: statusStyle.background,
                          color: statusStyle.color,
                          borderColor: statusStyle.border,
                        }}
                      >
                        {order.status}
                      </span>
                    </div>

                    <ul className="order-items">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          <span className="order-item-name">
                            {item.itemName} × {item.quantity}
                          </span>
                          <span className="order-item-price">
                            ${Number(item.subtotal).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="order-footer">
                      <div className="order-total-group">
                        <span className="order-total-label">Total</span>
                        <span className="order-total">
                          ${Number(order.totalPrice).toFixed(2)}
                        </span>
                      </div>

                      <button
                        className="order-reorder"
                        onClick={() => handleReorder(order.id)}
                      >
                        <span className="order-reorder-icon" aria-hidden="true">
                          ↻
                        </span>
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
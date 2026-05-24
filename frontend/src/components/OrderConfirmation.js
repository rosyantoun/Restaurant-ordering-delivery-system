import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./OrderConfirmation.css";
import { orderApi } from "../api/orders";
import { FaCalendarAlt, FaMapMarkerAlt, FaUtensils } from "react-icons/fa";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    orderApi
      .getById(id)
      .then(setOrder)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-container">
          <p className="confirmation-error">{error}</p>
          <Link to="/" className="confirmation-link">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  const subtotal = Number(order.totalPrice || 0);
  const deliveryFee = 3;
  const finalTotal = subtotal + deliveryFee;

  return (
    <main className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-check">✓</div>

        <h1 className="confirmation-title">
          Thank you! Your order has been placed.
        </h1>

        <p className="confirmation-subtitle">
          Your order <strong>#{order.id}</strong> has been received and is now being processed.
        </p>

        <section className="confirmation-card">
          <div className="confirmation-status-row">
            <span className="confirmation-status">{order.status}</span>
          </div>

          <div className="confirmation-meta-grid">
            <div className="confirmation-meta">
              <FaCalendarAlt />
              <div>
                <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                <span>Placed on</span>
              </div>
            </div>

            {order.addressText && (
              <div className="confirmation-meta">
                <FaMapMarkerAlt />
                <div>
                  <strong>{order.addressText}</strong>
                  <span>Delivering to</span>
                </div>
              </div>
            )}
          </div>

          <h2 className="confirmation-items-title">Order Summary</h2>

          <ul className="confirmation-items">
            {order.items.map((item) => (
              <li key={item.id} className="confirmation-item">
                <div className="confirmation-item-info">
                  <span className="confirmation-item-name">{item.itemName}</span>
                  <span className="confirmation-item-qty">Qty: {item.quantity}</span>
                </div>

                <span className="confirmation-item-price">
                  ${Number(item.subtotal).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="confirmation-summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="confirmation-summary-row">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>

          <div className="confirmation-total">
            <span>Total</span>
            <strong>${finalTotal.toFixed(2)}</strong>
          </div>
        </section>

        <div className="confirmation-actions">
          <Link to="/orders" className="confirmation-btn primary">
            View My Orders
          </Link>

          <Link to="/menu" className="confirmation-btn secondary">
            Continue Shopping
          </Link>
        </div>
      </div>

      <footer className="confirmation-footer">
        <div className="confirmation-support">
          <FaUtensils />
          <span>
            Need help?{" "}
          <a href="mailto:support@tastybites.com">Contact support</a>
          </span>
        </div>

        <div className="confirmation-footer-message">
          <span className="footer-smiley">☺</span>

          <div className="footer-message-copy">
            <span>Enjoy delicious meals from your favorite restaurant.</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default OrderConfirmation;
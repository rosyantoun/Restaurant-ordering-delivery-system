import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { cartApi } from "../api/cart";
import { addressApi } from "../api/addresses";
import { orderApi } from "../api/orders";
import { useAuth } from "../context/AuthContext";
import { FaMapMarkerAlt, FaCreditCard, FaClipboardCheck } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5242";

const displayUrl = (url) => {
  if (!url) return "/default-image.jpg";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads/")) return `${API_URL}${url}`;
  return url;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { refreshCartCount } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    cartApi.getCart().then(setCartItems).catch(console.error);

    addressApi
      .getMine()
      .then((data) => {
        setAddresses(data || []);
        const def = (data || []).find((a) => a.isDefault);

        if (def) setSelectedAddressId(def.id);
        else if (data && data.length > 0) setSelectedAddressId(data[0].id);
      })
      .catch(console.error);
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, i) => acc + Number(i.subtotal || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddressError("");
    setPaymentError("");

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!selectedAddressId) {
      setAddressError(
        "⚠️ A delivery address is required to place your order. Please add one before continuing."
      );
      return;
    }

    if (!paymentInfo) {
      setPaymentError("⚠️ A payment method is required to place your order. Please select one before continuing.");
      return;
    }

    setSubmitting(true);

    try {
      const order = await orderApi.checkout({
        addressId: Number(selectedAddressId),
        paymentInfo: paymentInfo,
      });

      await refreshCartCount();
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      alert(`❌ ${error.message}`);
      setSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>

        {cartItems.length === 0 ? (
          <p className="checkout-empty">Your cart is empty.</p>
        ) : (
          <form className="checkout-layout" onSubmit={handleSubmit}>
            <div className="checkout-steps">
              <section className="checkout-step">
                <div className="step-rail">
                  <div className="step-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <span className="step-line" />
                </div>

                <div className="step-content">
                  <div className="step-heading">
                    <h2>Delivery Address</h2>
                    <span>* Required</span>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="checkout-no-address">
                      <p className="checkout-no-address-msg">
                        📍 You have no saved addresses. Please{" "}
                        <a href="/add-address">add a delivery address</a> before placing your order.
                      </p>
                    </div>
                  ) : (
                    <select
                      className="checkout-select"
                      value={selectedAddressId}
                      onChange={(e) => {
                        setSelectedAddressId(e.target.value);
                        setAddressError("");
                      }}
                    >
                      <option value="">— Select a delivery address —</option>

                      {addresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label ? `${a.label} — ` : ""}
                          {a.fullAddress}
                        </option>
                      ))}
                    </select>
                  )}

                  {addressError && (
                    <div className="checkout-error-msg">{addressError}</div>
                  )}
                </div>
              </section>

              <section className="checkout-step">
                <div className="step-rail">
                  <div className="step-icon">
                    <FaCreditCard />
                  </div>
                  <span className="step-line" />
                </div>

                <div className="step-content">
                  <div className="step-heading">
                    <h2>Payment</h2>
                    <span>* Required</span>
                  </div>
                  <select
                    className="checkout-select"
                    value={paymentInfo}
                    onChange={(e) => {
                      setPaymentInfo(e.target.value);
                      setPaymentError("");
                    }}
                  >
                    <option value="">— Select Payment Method —</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                  </select>

                  {paymentError && (
                    <div className="checkout-error-msg">{paymentError}</div>
                  )}
                </div>
              </section>

              <section className="checkout-step review-step">
                <div className="step-rail">
                  <div className="step-icon muted">
                    <FaClipboardCheck />
                  </div>
                </div>

                <div className="step-content">
                  <div className="step-heading review-heading">
                    <h2>Review &amp; Place Order</h2>
                  </div>

                  <p className="review-copy">
                    Complete the details above to review your order and place it.
                  </p>
                </div>
              </section>
            </div>

            <aside className="checkout-summary">
              <h2>Order Summary</h2>

              <ul className="checkout-items">
                {cartItems.map((item) => (
                  <li key={item.id} className="checkout-item">
                    <img
                      src={displayUrl(item.imageUrl)}
                      alt={item.name}
                    />

                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      <span className="checkout-item-meta">
                        Quantity: {item.quantity}
                      </span>
                      <span className="checkout-item-meta">
                        ${Number(item.unitPrice).toFixed(2)} each
                      </span>
                    </div>

                    <span className="checkout-item-subtotal">
                      ${Number(item.subtotal).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="checkout-total-row">
                <span>Subtotal</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>

              <div className="checkout-total-row checkout-grand-total">
                <span>Total</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>

              <button
                type="submit"
                className="checkout-submit"
                disabled={submitting || addresses.length === 0}
              >
                {submitting
                  ? "Placing order..."
                  : `Place Order — $${totalPrice.toFixed(2)}`}
              </button>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
};

export default Checkout;

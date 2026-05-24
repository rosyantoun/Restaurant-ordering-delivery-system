<<<<<<< HEAD
import { useState, useEffect } from "react";
import "./CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", rating: "", comment: "", imagePath: "" });
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:5000/api/orderitems?user_id=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const data = await response.json();
        if (!Array.isArray(data)) return;
        setCartItems(data.map((item) => ({ ...item, price: Number(item.price) || 0 })));
      } catch (error) {
        console.error("❌ Error fetching cart items:", error);
      }
    };
    fetchCart();
  }, [userId]);

  const handleQuantityChange = async (index, delta) => {
    if (!userId) return;
    const updatedCart = [...cartItems];
    const item = updatedCart[index];
    if (!item || !item.itemId) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return handleRemoveItem(index);
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    try {
      await fetch(`http://localhost:5000/api/orderitems/${item.itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, quantity: newQuantity }),
      });
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (index) => {
    if (!userId) return;
    const itemToRemove = cartItems[index];
    setCartItems(cartItems.filter((_, i) => i !== index));
    try {
      await fetch(`http://localhost:5000/api/orderitems/${itemToRemove.itemId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
=======
import { useState, useEffect, useCallback } from "react";
import "./CartPage.css";
import { cartApi } from "../api/cart";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5242";

// Builds the right URL for both seed images ("/images/...") and admin uploads ("/uploads/menu/...")
const displayUrl = (url) => {
  if (!url) return "/default-image.jpg";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads/")) return `${API_URL}${url}`;
  return url;
};

const CartPage = () => {
  const { isAuthenticated, refreshCartCount } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    try {
      const data = await cartApi.getCart();
      setCartItems(data || []);
    } catch (error) {
      console.error("❌ Error fetching cart items:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (cartItemId, currentQty, delta) => {
    const newQuantity = currentQty + delta;

    if (newQuantity < 1) {
      return handleRemoveItem(cartItemId);
    }

    try {
      await cartApi.update(cartItemId, newQuantity);
      await fetchCart();
      await refreshCartCount();
    } catch (error) {
      console.error("❌ Error updating item quantity:", error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartApi.remove(cartItemId);
      await fetchCart();
      await refreshCartCount();
>>>>>>> origin/main
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };

<<<<<<< HEAD
  const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);

  const handlePaymentSubmit = async () => {
    if (!userId) return;

    // Validate card fields if visa selected
    if (paymentMethod === "visa") {
      if (!cardNumber || !cardExpiry || !cardCVV) {
        alert("❌ Please fill in all card details.");
        return;
      }
    }

    const paymentInfo = paymentMethod === "cash"
      ? "Cash on Delivery"
      : `Visa ending in ${cardNumber.slice(-4)}`;

    const orderData = {
      userId,
      totalPrice: totalPrice.toFixed(2),
      paymentInfo,
      items: JSON.stringify(cartItems),
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Failed to submit order");

      setCartItems([]);
      setShowPaymentModal(false);
      setShowFeedbackModal(true);
      setCardNumber(""); setCardExpiry(""); setCardCVV("");

      await fetch(`http://localhost:5000/api/orderitems/clear`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      alert("✅ Payment successful! Your order has been placed.");
    } catch (error) {
      console.error("❌ Error submitting order:", error);
    }
  };

  const handleFeedbackChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData({ name: "", rating: "", comment: "", imagePath: "" });
      alert("✅ Feedback submitted successfully!");
      setShowFeedbackModal(false);
    } catch (error) {
      console.error("❌ Error submitting feedback:", error.message);
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="empty-cart">🛒 Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item, index) => (
              <li key={item.itemId} className="cart-item">
                <img src={item.imageUrl || item.imageURL || "/food-delivery-app/images/burger.png"} alt={item.name} />
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">${(Number(item.price) || 0).toFixed(2)}</p>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => handleQuantityChange(index, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                </div>
                <p className="cart-item-remove" onClick={() => handleRemoveItem(index)}>✕</p>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <p>Total: ${totalPrice.toFixed(2)}</p>
            <button className="cart-checkout" onClick={() => setShowPaymentModal(true)}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <button className="close-payment" onClick={() => setShowPaymentModal(false)}>✕</button>
            <h2>💳 Checkout</h2>
            <p className="payment-total">Total: <strong>${totalPrice.toFixed(2)}</strong></p>

            <div className="payment-methods">
              <div
                className={`payment-method-card ${paymentMethod === "cash" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("cash")}
              >
                <span className="method-icon">💵</span>
                <span>Cash on Delivery</span>
              </div>
              <div
                className={`payment-method-card ${paymentMethod === "visa" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("visa")}
              >
                <span className="method-icon">💳</span>
                <span>Visa Card</span>
              </div>
            </div>

            {paymentMethod === "visa" && (
              <div className="card-fields">
                <input
                  type="text"
                  placeholder="Card Number (16 digits)"
                  maxLength={16}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                />
                <div className="card-row">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={3}
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "cash" && (
              <p className="cash-note">💡 You will pay when your order arrives.</p>
            )}

            <div className="payment-buttons">
              <button className="cancel-button" onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className="pay-button" onClick={handlePaymentSubmit}>Place Order</button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="feedback-overlay">
          <div className="feedback-modal">
            <button className="close-feedback" onClick={() => setShowFeedbackModal(false)}>✕</button>
            <h2>⭐ Leave Your Feedback</h2>
            <input type="text" id="name" value={formData.name} onChange={handleFeedbackChange} placeholder="Your name" required />
            <select id="rating" value={formData.rating} onChange={handleFeedbackChange} required>
              <option value="">Select a rating</option>
              <option value="5⭐">5⭐</option>
              <option value="4⭐">4⭐</option>
              <option value="3⭐">3⭐</option>
              <option value="2⭐">2⭐</option>
              <option value="1⭐">1⭐</option>
            </select>
            <textarea id="comment" value={formData.comment} onChange={handleFeedbackChange} placeholder="Write your comment here" required></textarea>
            <input type="text" id="imagePath" value={formData.imagePath} onChange={handleFeedbackChange} placeholder="Image URL (optional)" />
            <button type="submit" onClick={handleFeedbackSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
=======
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0
  );

  const totalItems = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0
  );

  return (
    <main className="cart-page">
      <div className="cart-container">
        <header className="cart-header">
          <h1 className="cart-title">
            Your Cart
            {isAuthenticated && cartItems.length > 0
              ? ` (${totalItems} ${totalItems === 1 ? "item" : "items"})`
              : ""}
          </h1>

          {isAuthenticated && cartItems.length > 0 && (
            <p className="cart-subtitle">Review your items and proceed to checkout</p>
          )}
        </header>

        {!isAuthenticated ? (
          <p className="empty-cart">🔒 Please log in to view your cart.</p>
        ) : cartItems.length === 0 ? (
          <p className="empty-cart">🛒 Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-table-header">
              <span>Item</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span />
            </div>

            <ul className="cart-items">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-product">
                    <img
                      src={displayUrl(item.imageUrl)}
                      alt={item.name}
                    />

                    <div className="cart-item-details">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-meta">Freshly prepared for your order</p>
                    </div>
                  </div>

                  <div className="cart-item-price">
                    <span className="mobile-label">Price</span>
                    <span>${Number(item.unitPrice).toFixed(2)}</span>
                  </div>

                  <div className="cart-item-quantity">
                    <span className="mobile-label">Quantity</span>

                    <div className="quantity-box">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity, -1)
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity, 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    <span className="mobile-label">Total</span>
                    <strong>${Number(item.subtotal || 0).toFixed(2)}</strong>
                  </div>

                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Delivery Fee:</span>
                <span>Applied at order confirmation</span>
              </div>

              <div className="summary-total">
                <span>Grand total:</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>

              <button
                className="cart-checkout"
                onClick={() => navigate("/checkout")}
              >
                Check out
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default CartPage;
>>>>>>> origin/main

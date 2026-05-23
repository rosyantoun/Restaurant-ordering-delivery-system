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
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };

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

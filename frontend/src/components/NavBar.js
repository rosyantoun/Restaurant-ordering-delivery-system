import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { FaShoppingCart, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";

const ADMIN_EMAIL = "admin@tastybites.com";

const NavBar = ({ onLogout }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("user_id");
  const userEmail = localStorage.getItem("user_email");
  const isAdmin = userEmail === ADMIN_EMAIL;

  useEffect(() => {
    if (userId && !isAdmin) {
      fetch(`http://localhost:5000/api/cart-count?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setCartCount(data.count))
        .catch((err) => console.error("Error fetching cart count:", err));
    }
  }, [userId, isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    if (onLogout) onLogout();
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Tasty Bites</h1>

      <div className={isMobile ? "nav-links-mobile show" : "nav-links"}>
        {isAdmin ? (
          // Admin navbar - only relevant links
          <>
            <Link to="/admin">Dashboard</Link>
          </>
        ) : (
          // Customer navbar
          <>
            <Link to="/">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/about">About</Link>
            <Link to="/add-address">Address</Link>
            <Link to="/testimonial">Feedback</Link>
            <Link to="/cart">
              <div className="cart-icon-container">
                <FaShoppingCart className="cart-icon" />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </div>
            </Link>
          </>
        )}

        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="mobile-menu-icon" onClick={() => setIsMobile(!isMobile)}>
        {isMobile ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default NavBar;

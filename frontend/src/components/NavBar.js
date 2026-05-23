import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import {
  FaUser,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const TastyBitesMark = () => (
  <svg
    className="brand-mark"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.2" />
    <path
      d="M17 18V29"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M14.5 18V23C14.5 24.3807 15.6193 25.5 17 25.5C18.3807 25.5 19.5 24.3807 19.5 23V18"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M30.5 17.5C33.5376 17.5 35.5 20.1863 35.5 23.5C35.5 26.8137 33.5376 29.5 30.5 29.5V17.5Z"
      stroke="#A85F31"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path
      d="M30.5 29.5V32"
      stroke="#A85F31"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const FormBox = ({ title, subtitle, buttonText, onSubmit, error }) => (
  <div className="login-box">
    <div className="login-avatar">
      <FaUser />
    </div>

    <div className="login-heading-row">
      <span />
      <h2 className="login-title">{title}</h2>
      <span />
    </div>

    <p className="login-subtitle">{subtitle}</p>

    {error && <div className="auth-error-msg">{error}</div>}

    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" placeholder="Enter your email" />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input type="password" name="password" placeholder="Enter your password" />
      </div>

      <button className="login-button" type="submit">
        {buttonText}
      </button>
    </form>
  </div>
);

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, cartCount, login, register, logout } = useAuth();

  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authError, setAuthError] = useState("");

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setAuthError("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSignUp(false);
    setAuthError("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();

    if (!q) return;

    navigate(`/menu?search=${encodeURIComponent(q)}`);
    setSearchQuery("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email) {
      setAuthError("⚠️ Please enter your email.");
      return;
    }

    if (!password) {
      setAuthError("⚠️ Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setAuthError("⚠️ Password must be at least 6 characters.");
      return;
    }

    try {
      const data = await login(email, password);
      handleCloseModal();
      // ✅ If the logged-in user is an admin, send them straight to /admin
      if (data?.role === "Admin") {
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      setAuthError(`❌ Invalid email or password. Please try again.`);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email) {
      setAuthError("⚠️ Please enter your email.");
      return;
    }

    if (!password) {
      setAuthError("⚠️ Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setAuthError("⚠️ Password must be at least 6 characters.");
      return;
    }

    try {
      const data = await register({ email, password });
      handleCloseModal();
      // ✅ Same admin redirect on sign-up (in case an admin account is created)
      if (data?.role === "Admin") {
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      setAuthError(`❌ Unable to create account. Please check your details or try another email.`);
    }
  };

  // ✅ Always go to home after logout (clears any admin URL the user was on)
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // ---------- ADMIN VIEW ----------
  if (isAdmin) {
    return (
      <nav className="navbar">
        {/* ✅ Brand link goes to /admin instead of / for admins */}
        <Link to="/admin" className="navbar-brand">
          <TastyBitesMark />
          <span className="navbar-logo">Tasty Bites</span>
        </Link>

        <div className={isMobile ? "nav-links-mobile show" : "nav-links"}>
          <Link to="/admin/menu">Manage Menu</Link>
          <Link to="/admin">Manage Orders</Link>
          <button className="nav-icon logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <button
          type="button"
          className="mobile-menu-icon"
          aria-expanded={isMobile}
          onClick={() => setIsMobile(!isMobile)}
        >
          {isMobile ? <FaTimes /> : <FaBars />}
        </button>
      </nav>
    );
  }

  // ---------- REGULAR USER VIEW ----------
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <TastyBitesMark />
        <span className="navbar-logo">Tasty Bites</span>
      </Link>

      <div className={isMobile ? "nav-shell nav-shell-mobile" : "nav-shell"}>
        <div className="nav-links">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>

          <NavLink to="/menu" className="nav-link">
            Menu
          </NavLink>

          <NavLink to="/about" className="nav-link">
            About
          </NavLink>

          <NavLink to="/add-address" className="nav-link">
            Address
          </NavLink>

          <NavLink to="/feedback" className="nav-link">
            Feedback
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/orders" className="nav-link">
              My Orders
            </NavLink>
          )}
        </div>

        <div className="nav-actions">
          <div className="search-container">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <FaSearch className="search-leading-icon" />

              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />

              {searchQuery && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </form>
          </div>

          <Link to="/cart" className="utility-link cart-link" aria-label="Cart">
            <div className="cart-icon-container">
              <FaShoppingCart className="utility-icon cart-icon" />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
          </Link>

          {isAuthenticated ? (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="utility-button"
              onClick={handleOpenModal}
              aria-label="Account"
            >
              <FaUser className="utility-icon user-icon" />
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        className="mobile-menu-icon"
        aria-expanded={isMobile}
        onClick={() => setIsMobile(!isMobile)}
      >
        {isMobile ? <FaTimes /> : <FaBars />}
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              ✕
            </button>

            {isSignUp ? (
              <FormBox
                title="Create Account"
                subtitle="Join Tasty Bites and start ordering your favorites."
                buttonText="Sign Up"
                onSubmit={handleSignUpSubmit}
                error={authError}
              />
            ) : (
              <FormBox
                title="Sign In"
                subtitle="Welcome back. Sign in to continue."
                buttonText="Login"
                onSubmit={handleLoginSubmit}
                error={authError}
              />
            )}

            <div className="login-links">
              {isSignUp ? (
                <Link
                  to="#"
                  className="signup-link"
                  onClick={() => {
                    setIsSignUp(false);
                    setAuthError("");
                  }}
                >
                  Already have an account? Log in
                </Link>
              ) : (
                <Link
                  to="#"
                  className="signup-link"
                  onClick={() => {
                    setIsSignUp(true);
                    setAuthError("");
                  }}
                >
                  Don't have an account? Create one
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const ADMIN_EMAIL = "admin@tastybites.com"; // change to your admin email

const LandingPage = ({ onLogin }) => {
  const [role, setRole] = useState(null); // null | "customer" | "admin"
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setMode("login");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (role === "admin" && email !== ADMIN_EMAIL) {
      alert("❌ Not an admin account.");
      setLoading(false);
      return;
    }

    const endpoint = mode === "login" ? "/api/login" : "/api/signup";

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`❌ ${data.error || "Something went wrong."}`);
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        alert("✅ Signup successful! Please log in.");
        setMode("login");
        setLoading(false);
        return;
      }

      // login success
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("user_email", email);
      onLogin(data.user.id, email);

      if (role === "admin") navigate("/admin");
      else navigate("/");
    } catch {
      alert("❌ Network error. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="landing-page">
      <div className="landing-bg-overlay" />

      <div className="landing-content">
        <div className="landing-brand">
          <h1>🍔 Tasty Bites</h1>
          <p>Delicious food delivered to your door</p>
        </div>

        {/* Step 1: Role Selection */}
        {!role && (
          <div className="role-selection">
            <h2>Welcome! How would you like to continue?</h2>
            <div className="role-cards">
              <div className="role-card" onClick={() => handleRoleSelect("customer")}>
                <div className="role-icon">🛵</div>
                <h3>Customer</h3>
                <p>Browse menu, order food & track your cart</p>
                <button className="role-btn customer-btn">Continue as Customer</button>
              </div>
              <div className="role-card" onClick={() => handleRoleSelect("admin")}>
                <div className="role-icon">⚙️</div>
                <h3>Admin</h3>
                <p>Manage menu items and view all orders</p>
                <button className="role-btn admin-btn">Continue as Admin</button>
              </div>
            </div>
            <button className="guest-btn" onClick={() => { onLogin(null, null); navigate("/"); }}>
              👀 Continue as Guest
            </button>
          </div>
        )}

        {/* Step 2: Login / Signup Form */}
        {role && (
          <div className="auth-card">
            <button className="back-btn" onClick={() => setRole(null)}>← Back</button>
            <div className="auth-role-badge">
              {role === "admin" ? "⚙️ Admin Login" : "🛵 Customer " + (mode === "login" ? "Login" : "Sign Up")}
            </div>

            <div className="auth-tabs">
              {role === "customer" && (
                <>
                  <button className={mode === "login" ? "auth-tab active" : "auth-tab"} onClick={() => setMode("login")}>Login</button>
                  <button className={mode === "signup" ? "auth-tab active" : "auth-tab"} onClick={() => setMode("signup")}>Sign Up</button>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;

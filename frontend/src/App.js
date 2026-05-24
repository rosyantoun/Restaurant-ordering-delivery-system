<<<<<<< HEAD
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Header from './components/Header';
import Promotions from './components/Promotions';
import Menu from './components/Menu';
import Burger2 from './components/Burger2';
import BookTable from './components/BookTable';
import TestimonialSlider from './components/TestimonialSlider';
import Footer from './components/Footer';
import CartPage from "./components/CartPage";
import AdminPage from "./components/AdminPage";
import LandingPage from "./components/LandingPage";
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("user_id") !== null
  );

  const handleLogin = (userId, email) => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <Router>
        <LandingPage onLogin={handleLogin} />
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <NavBar onLogout={handleLogout} />
        <Routes>
=======
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Burger2 from "./components/Burger2";
import BookTable from "./components/BookTable";
import TestimonialSlider from "./components/TestimonialSlider";
import Footer from "./components/Footer";
import CartPage from "./components/CartPage";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";
import OrderHistory from "./components/OrderHistory";
import AdminMenu from "./components/AdminMenu";
import AdminOrders from "./components/AdminOrders";
import FeedbackPage from "./components/FeedbackPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import "./App.css";

// Block admins from being on any non-admin URL
const AdminGuard = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  if (isAdmin && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin" replace />;
  }
  return null;
};

// Block admins from customer-only routes
const CustomerRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/admin" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <AdminGuard />
        <Routes>
          {/* Home — always accessible, renders full homepage */}
>>>>>>> origin/main
          <Route
            path="/"
            element={
              <div>
                <Header />
<<<<<<< HEAD
                <Promotions />
=======
>>>>>>> origin/main
                <Menu />
                <Burger2 />
                <BookTable />
                <TestimonialSlider />
                <Footer />
              </div>
            }
          />
<<<<<<< HEAD
          <Route path="/cart" element={<CartPage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<Burger2 />} />
          <Route path="/add-address" element={<BookTable />} />
          <Route path="/testimonial" element={<TestimonialSlider />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" />} />
=======

          {/* Public routes */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<Burger2 />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/testimonial" element={<Navigate to="/feedback" replace />} />

          {/* Customer-only routes */}
          <Route path="/add-address" element={<CustomerRoute><BookTable /></CustomerRoute>} />
          <Route path="/cart" element={<CustomerRoute><CartPage /></CustomerRoute>} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CustomerRoute>
                  <Checkout />
                </CustomerRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:id"
            element={
              <ProtectedRoute>
                <CustomerRoute>
                  <OrderConfirmation />
                </CustomerRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <CustomerRoute>
                  <OrderHistory />
                </CustomerRoute>
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={<ProtectedRoute requireAdmin><AdminOrders /></ProtectedRoute>}
          />
          <Route
            path="/admin/menu"
            element={<ProtectedRoute requireAdmin><AdminMenu /></ProtectedRoute>}
          />
>>>>>>> origin/main
        </Routes>
      </div>
    </Router>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> origin/main

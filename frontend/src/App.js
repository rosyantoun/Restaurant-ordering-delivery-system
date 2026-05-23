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
          <Route
            path="/"
            element={
              <div>
                <Header />
                <Menu />
                <Burger2 />
                <BookTable />
                <TestimonialSlider />
                <Footer />
              </div>
            }
          />

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
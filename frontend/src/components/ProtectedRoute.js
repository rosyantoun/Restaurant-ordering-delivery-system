import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  // Non-admin trying to access an admin route → home
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  // Admin trying to access a customer-only protected route → admin dashboard
  if (!requireAdmin && isAdmin) return <Navigate to="/admin" replace />;

  return children;
};

export default ProtectedRoute;
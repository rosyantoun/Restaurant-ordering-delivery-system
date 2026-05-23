import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/auth";
import { cartApi } from "../api/cart";

const TOKEN_KEY = "tastybites_token";
const USER_KEY = "tastybites_user";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [cartCount, setCartCount] = useState(0);

  const persistSession = (authResponse) => {
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    const userData = {
      id: authResponse.userId,
      email: authResponse.email,
      fullName: authResponse.fullName,
      role: authResponse.role,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    persistSession(data);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    persistSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setCartCount(0);
  };

  const refreshCartCount = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const data = await cartApi.getCount();
      setCartCount(data?.count ?? 0);
    } catch {
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "Admin",
    cartCount,
    login,
    register,
    logout,
    refreshCartCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
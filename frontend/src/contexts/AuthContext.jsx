import { createContext, useState, useEffect } from "react";
import api from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!token);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser && savedUser !== "undefined"
        ? JSON.parse(savedUser)
        : null;
    } catch (err) {
      console.error("Invalid user JSON:", err.message);
      return null;
    }
  });

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/api/users/profile"); // ✅ fixed route
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to refresh user:", err.message);
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (!token) {
      logout();
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (!user) {
      refreshUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, isLoggedIn, user, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.displayName = "AuthProvider"; // ✅ Fix Vite Fast Refresh issue

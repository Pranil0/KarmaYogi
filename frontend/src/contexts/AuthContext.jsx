// src/contexts/AuthContext.js
import { createContext, useState, useEffect } from "react";
import api from "../utils/axiosInstance"; // ✅ import your shared axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
 const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  try {
    if (!savedUser || savedUser === "undefined") return null;
    return JSON.parse(savedUser);
  } catch (err) {
    console.error("Invalid user JSON:", err.message);
    return null;
  }
});

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      logout();
      return;
    }

    // Attach token to Axios instance
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // If user is missing, fetch it from backend
    if (!user) {
      api
        .get("/auth/profile") // adjust this endpoint to match your backend
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error("Token invalid or fetch failed:", err.message);
          logout();
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

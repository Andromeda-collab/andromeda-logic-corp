import { createContext, useContext, useState, useCallback } from "react";
import adminApi from "../services/adminApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem("alc_admin_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const res = await adminApi.post("/auth/login", { email, password });
    localStorage.setItem("alc_admin_token", res.data.access_token);
    localStorage.setItem("alc_admin_user", JSON.stringify(res.data.admin));
    setAdmin(res.data.admin);
    return res.data.admin;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("alc_admin_token");
    localStorage.removeItem("alc_admin_user");
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

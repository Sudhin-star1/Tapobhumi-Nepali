import { createContext, useContext, useMemo, useState } from "react";
import { apiJson } from "./api";

type AuthState = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_token"));

  const value = useMemo<AuthState>(
    () => ({
      token,
      login: async (email, password) => {
        const res = await apiJson<{ token: string }>("/api/auth/login", { email, password });
        localStorage.setItem("admin_token", res.token);
        setToken(res.token);
      },
      logout: () => {
        localStorage.removeItem("admin_token");
        setToken(null);
      },
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}


import React, { createContext, useContext, useState, ReactNode } from "react";

type Admin = {
  id: number;
  username: string;
  email: string;
};

type AuthContextType = {
  admin: Admin | null;
  token: string | null;
  login: (admin: Admin, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (admin: Admin, token: string) => {
    setAdmin(admin);
    setToken(token);
    localStorage.setItem("auth", JSON.stringify({ admin, token }));
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  // load from localStorage on first render
  React.useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const { admin, token } = JSON.parse(stored);
      setAdmin(admin);
      setToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

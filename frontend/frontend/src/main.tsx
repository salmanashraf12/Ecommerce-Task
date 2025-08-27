import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App.tsx";
import CategoriesPage from "./pages/CategoriesPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ProtectedRoute from "./components/PrivateRoute.tsx";
import AuthRedirectRoute from "./components/AuthRedirectRoute.tsx";

const queryClient = new QueryClient();

// 🔹 Navbar Component
function Navbar() {
  const { admin, logout } = useAuth();

  return (
    <div className="p-4 flex gap-4 border-b mb-4">
      {admin ? (
        <>
          <Link to="/" className="text-blue-500">Home</Link>
          <Link to="/products" className="text-blue-500">Products</Link>
          <Link to="/categories" className="text-blue-500">Categories</Link>
          <button
            onClick={logout}
            className="text-red-500 ml-auto"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-blue-500">Login</Link>
          <Link to="/register" className="text-blue-500">Register</Link>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar /> {/* 🔹 conditionally shows links */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./pages/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import BuyerLayout from "./layouts/BuyerLayout";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import RegisterChoice from "./pages/RegisterChoice";
import RegisterBuyer from "./pages/RegisterBuyer";
import RegisterSeller from "./pages/RegisterSeller";
import BecomeSeller from "./pages/BecomeSeller";
import Dashboard from "./pages/Dashboard";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Products from "./pages/Products";
import BuyerDashboard from "./pages/BuyerDashboard";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Context
import { AdminAuthProvider } from "./context/AdminAuthContext";

const App = () => (
  <AdminAuthProvider>
    <ErrorBoundary>
      <Routes>
        {/* PUBLIC ROUTES - Using MainLayout (with Navbar) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterChoice />} />
          <Route path="/register/buyer" element={<RegisterBuyer />} />
          <Route path="/register/seller" element={<RegisterSeller />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* BUYER DASHBOARD - Using BuyerLayout (with Sidebar) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BuyerDashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="settings" element={<Settings />} />
          <Route path="wishlist" element={<div>Wishlist Page</div>} />
        </Route>

        {/* SELLER DASHBOARD - Using DashboardLayout (with Sidebar and DashboardNavbar) */}
        <Route
          path="/seller/*"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="store" element={<Store />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="cart" element={<Cart />} />
          <Route path="shop" element={<Shop />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="text-center py-5"><h2>404 - Page Not Found</h2></div>} />
      </Routes>
    </ErrorBoundary>
  </AdminAuthProvider>
);

export default App;
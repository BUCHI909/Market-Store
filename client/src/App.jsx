// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import MobileLayout from "./layouts/MobileLayout";
import DashboardLayout from "./pages/DashboardLayout";
import BuyerLayout from "./layouts/BuyerLayout";
import AdminLayout from "./layouts/AdminLayout";

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
import AddProduct from "./pages/AddProduct";  
import BuyerDashboard from "./pages/BuyerDashboard";
import Favorites from "./pages/Favorites"; // ✅ Now exists

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRedirect from "./components/DashboardRedirect";
import ErrorBoundary from "./components/ErrorBoundary";

// Context
import { AdminAuthProvider } from "./context/AdminAuthContext";

const App = () => (
  <AdminAuthProvider>
    <ErrorBoundary>
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
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

        {/* ========== PROTECTED ROUTES (Mobile with BottomNav) ========== */}
        <Route element={<MobileLayout />}>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/store" 
            element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/add-product" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <AddProduct />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/products" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <Products />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* ========== SELLER DASHBOARD (Desktop) ========== */}
        <Route
          path="/seller/*"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="store" element={<Store />} />
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="cart" element={<Cart />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>

        {/* ========== BUYER DASHBOARD (Desktop) ========== */}
        <Route
          path="/buyer/*"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/buyer/dashboard" replace />} />
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="shop" element={<Shop />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="settings" element={<Settings />} />
          <Route path="wishlist" element={<Favorites />} />
          <Route path="product/:id" element={<ProductDetails />} />
        </Route>

        {/* ========== ADMIN ROUTES ========== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<div className="p-4"><h2>Users Management</h2></div>} />
          <Route path="sellers" element={<div className="p-4"><h2>Sellers Management</h2></div>} />
          <Route path="orders" element={<div className="p-4"><h2>Orders Management</h2></div>} />
          <Route path="products" element={<div className="p-4"><h2>Products Management</h2></div>} />
          <Route path="reviews" element={<div className="p-4"><h2>Reviews Management</h2></div>} />
        </Route>

        {/* ========== 404 PAGE ========== */}
        <Route path="*" element={
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
            <div className="text-center">
              <h1 className="display-1 fw-bold text-primary">404</h1>
              <h4 className="mb-3">Page Not Found</h4>
              <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
              <button 
                className="btn btn-primary px-4 py-2"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </button>
            </div>
          </div>
        } />
      </Routes>
    </ErrorBoundary>
  </AdminAuthProvider>
);

export default App;
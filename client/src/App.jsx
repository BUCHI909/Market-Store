// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./pages/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import BuyerLayout from "./layouts/BuyerLayout";
import MobileLayout from "./layouts/MobileLayout"; // New layout for mobile with BottomNav

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
import Favorites from "./pages/Favorites"; // Add Favorites page

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import BottomNav from "./components/BottomNav"; // Import BottomNav

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

        {/* MOBILE BOTTOM NAVIGATION ROUTES - For all authenticated users on mobile */}
        <Route element={<MobileLayout />}>
          {/* Dashboard/Home */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <BuyerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Store/Shop */}
          <Route path="/store" element={<Shop />} />
          
          {/* Orders */}
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          
          {/* Profile */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Favorites/Wishlist */}
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } 
          />
          
          {/* Add Product (Sellers only) */}
          <Route 
            path="/add-product" 
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <AddProduct />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* BUYER DASHBOARD - Using BuyerLayout (with Sidebar) for desktop */}
        <Route
          path="/buyer/*"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BuyerDashboard />} />
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="settings" element={<Settings />} />
          <Route path="wishlist" element={<Favorites />} />
          <Route path="shop" element={<Shop />} />
        </Route>

        {/* SELLER DASHBOARD - Using DashboardLayout (with Sidebar and DashboardNavbar) for desktop */}
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
          <Route path="add-product" element={<AddProduct />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="cart" element={<Cart />} />
          <Route path="shop" element={<Shop />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<div>Users Management</div>} />
          <Route path="orders" element={<div>Orders Management</div>} />
          <Route path="products" element={<div>Products Management</div>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="text-center py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
              <h2 className="display-1 fw-bold text-primary">404</h2>
              <h4 className="mb-3">Page Not Found</h4>
              <p className="text-muted">The page you're looking for doesn't exist.</p>
              <button 
                className="btn btn-primary mt-3"
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
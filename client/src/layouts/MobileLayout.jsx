// src/layouts/MobileLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

const MobileLayout = () => {
  const location = useLocation();
  const { user, loading } = useAuth(); // Get user and loading state
  
  // Don't show BottomNav on these paths regardless of auth
  const hideBottomNavPaths = [
    '/login', 
    '/register', 
    '/register/buyer', 
    '/register/seller', 
    '/admin/login',
    '/become-seller'
  ];
  
  const isAuthPage = hideBottomNavPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path)
  );
  
  // Show BottomNav ONLY if:
  // 1. User is logged in (has user object)
  // 2. Not on auth pages
  // 3. Not loading
  const showBottomNav = !loading && user && !isAuthPage;

  return (
    <>
      <div style={{ 
        minHeight: "100vh", 
        background: "#f8f9fa",
        paddingBottom: showBottomNav ? "70px" : "0"
      }}>
        <Outlet />
      </div>
      {showBottomNav && <BottomNav />}
    </>
  );
};

export default MobileLayout;
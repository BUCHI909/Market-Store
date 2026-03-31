// src/layouts/MobileLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const MobileLayout = () => {
  const location = useLocation();
  
  // Don't show BottomNav on these paths
  const hideBottomNav = [
    '/login', 
    '/register', 
    '/register/buyer', 
    '/register/seller', 
    '/admin/login',
    '/product/',
    '/checkout'
  ];
  
  const shouldHideBottomNav = hideBottomNav.some(path => 
    location.pathname === path || location.pathname.startsWith(path)
  );

  return (
    <>
      <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
        <Outlet />
      </div>
      {!shouldHideBottomNav && <BottomNav />}
    </>
  );
};

export default MobileLayout;
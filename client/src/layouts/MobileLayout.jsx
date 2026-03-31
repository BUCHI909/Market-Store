// src/layouts/MobileLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const MobileLayout = () => {
  const location = useLocation();
  
  // Don't show BottomNav on these paths
  const hideBottomNav = ['/login', '/register', '/register/buyer', '/register/seller', '/admin/login'];
  
  const showBottomNav = !hideBottomNav.includes(location.pathname);

  return (
    <div style={{ paddingBottom: showBottomNav ? "70px" : "0", minHeight: "100vh", background: "#f8f9fa" }}>
      <Outlet />
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default MobileLayout;
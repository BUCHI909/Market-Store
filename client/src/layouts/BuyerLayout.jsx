// src/layouts/BuyerLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import BuyerSidebar from "../components/BuyerSidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import BottomNav from "../components/BottomNav";

const BuyerLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarWidth = sidebarCollapsed ? 80 : 280;

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      minHeight: "100vh", 
      background: "#f8f9fa"
    }}>
      <DashboardNavbar />
      
      <div style={{ 
        display: "flex", 
        flex: 1,
        marginTop: "70px",
        position: "relative"
      }}>
        {/* Sidebar */}
        <div style={{
          width: isMobile ? (sidebarCollapsed ? "0" : "280px") : `${sidebarWidth}px`,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          flexShrink: 0,
          overflow: "hidden",
          position: isMobile ? "fixed" : "relative",
          left: 0,
          top: isMobile ? "70px" : 0,
          bottom: 0,
          zIndex: isMobile ? 1000 : 1,
          height: isMobile ? "calc(100vh - 70px)" : "auto",
          transform: isMobile && sidebarCollapsed ? "translateX(-100%)" : "translateX(0)",
          boxShadow: isMobile ? "2px 0 10px rgba(0,0,0,0.1)" : "none"
        }}>
          <BuyerSidebar 
            collapsed={sidebarCollapsed} 
            setCollapsed={setSidebarCollapsed}
            isMobile={isMobile}
          />
        </div>
        
        {/* Overlay for mobile */}
        {isMobile && !sidebarCollapsed && (
          <div
            onClick={() => setSidebarCollapsed(true)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 999,
              transition: "all 0.3s ease"
            }}
          />
        )}
        
        {/* Main Content */}
        <div style={{ 
          flex: 1,
          overflow: "auto",
          padding: isMobile ? "20px 16px 80px 16px" : "20px 24px",
          background: "#f8f9fa",
          width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
          transition: "margin-left 0.3s ease"
        }}>
          <Outlet />
        </div>
      </div>
      
      {isMobile && <BottomNav />}
    </div>
  );
};

export default BuyerLayout;
// src/pages/DashboardLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleSidebarToggle = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        setSidebarCollapsed(sidebar.classList.contains('collapsed'));
      }
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, [user, navigate]);

  const sidebarWidth = sidebarCollapsed ? 80 : 280;

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      minHeight: "100vh", 
      background: "#f8f9fa"
    }}>
      {/* Navbar on top */}
      <DashboardNavbar sidebarCollapsed={sidebarCollapsed} />
      
      {/* Sidebar and Main Content below navbar */}
      <div style={{ 
        display: "flex", 
        flex: 1,
        marginTop: "0", // No margin, navbar is fixed
        position: "relative"
      }}>
        {/* Sidebar - Hidden on mobile by default, shown when toggled */}
        <div style={{
          width: isMobile ? (sidebarCollapsed ? "0" : "280px") : `${sidebarWidth}px`,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          flexShrink: 0,
          overflow: "hidden",
          background: "white",
          borderRight: isMobile ? "none" : "1px solid #e9ecef",
          position: isMobile ? "fixed" : "relative",
          left: 0,
          top: isMobile ? "70px" : 0,
          bottom: 0,
          zIndex: isMobile ? 1000 : 1,
          height: isMobile ? "calc(100vh - 70px)" : "auto",
          transform: isMobile && sidebarCollapsed ? "translateX(-100%)" : "translateX(0)",
          boxShadow: isMobile ? "2px 0 10px rgba(0,0,0,0.1)" : "none"
        }}>
          <Sidebar isMobile={isMobile} />
        </div>
        
        {/* Overlay for mobile when sidebar is open */}
        {isMobile && !sidebarCollapsed && (
          <div
            onClick={() => {
              const sidebar = document.querySelector('.sidebar');
              if (sidebar) {
                sidebar.classList.add('collapsed');
                window.dispatchEvent(new Event('sidebarToggle'));
              }
            }}
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
          marginLeft: isMobile ? 0 : 0,
          width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
          transition: "margin-left 0.3s ease"
        }}>
          <Outlet />
        </div>
      </div>
      
      {/* Bottom Navigation for Mobile */}
      {isMobile && <BottomNav />}
    </div>
  );
};

export default DashboardLayout;
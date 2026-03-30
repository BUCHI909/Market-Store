// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaStore,
  FaHistory,
  FaSignOutAlt,
  FaBars,
  FaShoppingBag,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaStar,
  FaBoxOpen,
  FaChartLine,
  FaUsers,
  FaWallet,
  FaHeadset,
  FaMoon,
  FaSun,
  FaBell,
  FaSearch,
  FaEnvelope,
  FaFileAlt,
  FaTag,
  FaPercent,
  FaGift,
  FaShippingFast,
  FaCreditCard
} from "react-icons/fa";
import axios from "axios";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route matches
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Main navigation links
  const mainLinks = [
    { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard", badge: null, exact: true },
    { to: "/dashboard/profile", icon: <FaUser />, label: "Profile", badge: null },
    { to: "/dashboard/store", icon: <FaStore />, label: "Store", badge: 5 },
    { to: "/dashboard/products", icon: <FaBoxOpen />, label: "Products", badge: 12 },
    { to: "/dashboard/orders", icon: <FaShoppingBag />, label: "Orders", badge: 3 },
    { to: "/dashboard/customers", icon: <FaUsers />, label: "Customers", badge: null },
    { to: "/dashboard/analytics", icon: <FaChartLine />, label: "Analytics", badge: null },
  ];

  // Secondary navigation links
  const secondaryLinks = [
    { to: "/dashboard/messages", icon: <FaEnvelope />, label: "Messages", badge: 2 },
    { to: "/dashboard/reviews", icon: <FaStar />, label: "Reviews", badge: null },
    { to: "/dashboard/discounts", icon: <FaTag />, label: "Discounts", badge: null },
    { to: "/dashboard/promotions", icon: <FaGift />, label: "Promotions", badge: 1 },
  ];

  // Settings and support links
  const bottomLinks = [
    { to: "/dashboard/settings", icon: <FaCog />, label: "Settings", badge: null },
    { to: "/dashboard/support", icon: <FaHeadset />, label: "Support", badge: null },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);

    const startTime = Date.now();

    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      localStorage.clear();

      const elapsed = Date.now() - startTime;
      const delay = Math.max(3000 - elapsed, 0);

      setTimeout(() => navigate("/login"), delay);
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Try again!");
      setLoggingOut(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("sidebar-dark-mode");
  };

  // Handle window resize for responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={`sidebar ${collapsed ? "collapsed" : ""} ${isDarkMode ? "dark-mode" : ""}`}
        style={{
          width: collapsed ? "80px" : "280px",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #ffffff 0%, #f8faff 100%)",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          borderRight: "1px solid rgba(102, 126, 234, 0.1)"
        }}
      >
        {/* Decorative gradient line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
          backgroundSize: "200% 100%",
          animation: "gradientMove 3s ease infinite"
        }} />

        {/* Header with Brand */}
        <div
          className="d-flex align-items-center justify-content-between p-4"
          style={{
            borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)"
          }}
        >
          {!collapsed && (
            <div className="d-flex align-items-center gap-2 brand-container">
              <div className="brand-icon-wrapper">
                <FaShoppingBag className="brand-icon" />
              </div>
              <div>
                <h4 className="mb-0 fw-bold brand-text">
                  MarketSphere
                </h4>
                <small className="text-muted" style={{ fontSize: "0.7rem" }}>Admin Dashboard</small>
              </div>
            </div>
          )}

          <button
            className="btn btn-sm toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}
          >
            {collapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
          </button>
        </div>

        {/* User Profile Summary */}
        {!collapsed && (
          <div className="p-4 text-center user-profile">
            <div className="position-relative d-inline-block">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                alt="Profile"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "20px",
                  objectFit: "cover",
                  border: "3px solid white",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
                }}
              />
              <span style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                width: "15px",
                height: "15px",
                background: "#10b981",
                border: "2px solid white",
                borderRadius: "50%"
              }} />
            </div>
            <h6 className="mt-3 mb-1 fw-bold">Genesis Hodgles</h6>
            <small className="text-muted">Store Administrator</small>
          </div>
        )}

        {/* Search Bar (when expanded) */}
        {!collapsed && (
          <div className="px-3 mb-3">
            <div className="position-relative">
              <FaSearch className="position-absolute top-50 translate-middle-y ms-3" style={{ color: "#667eea", fontSize: "14px" }} />
              <input
                type="text"
                className="form-control rounded-pill border-0 bg-light"
                placeholder="Quick search..."
                style={{ paddingLeft: "40px", fontSize: "0.9rem" }}
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="sidebar-section">
          {!collapsed && <div className="px-4 mb-2"><small className="text-uppercase fw-bold text-muted">Main Menu</small></div>}
          <nav className="flex-grow-1 px-2">
            {mainLinks.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: collapsed ? "0" : "12px",
                  padding: collapsed ? "12px 0" : "12px 16px",
                  margin: "4px 0",
                  textDecoration: "none",
                  color: isActive ? "#fff" : "#4a5568",
                  background: isActive 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                    : "transparent",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  fontWeight: isActive ? "600" : "500",
                  justifyContent: collapsed ? "center" : "flex-start",
                  position: "relative",
                  overflow: "hidden"
                })}
                onMouseEnter={() => setHoveredItem(link.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span style={{ fontSize: "1.2rem", minWidth: "24px" }}>{link.icon}</span>
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{link.label}</span>
                    {link.badge && (
                      <span className="badge rounded-pill" style={{
                        background: "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
                        color: "white",
                        fontSize: "0.7rem",
                        padding: "3px 8px"
                      }}>
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && hoveredItem === link.label && (
                  <div className="tooltip">{link.label}</div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div className="sidebar-section mt-3">
          {!collapsed && <div className="px-4 mb-2"><small className="text-uppercase fw-bold text-muted">Marketing</small></div>}
          <nav className="flex-grow-1 px-2">
            {secondaryLinks.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.to}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: collapsed ? "0" : "12px",
                  padding: collapsed ? "12px 0" : "12px 16px",
                  margin: "4px 0",
                  textDecoration: "none",
                  color: isActive ? "#fff" : "#4a5568",
                  background: isActive 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                    : "transparent",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                  fontWeight: isActive ? "600" : "500",
                  justifyContent: collapsed ? "center" : "flex-start",
                  position: "relative"
                })}
                onMouseEnter={() => setHoveredItem(link.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span style={{ fontSize: "1.2rem", minWidth: "24px" }}>{link.icon}</span>
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{link.label}</span>
                    {link.badge && (
                      <span className="badge rounded-pill" style={{
                        background: "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
                        color: "white",
                        fontSize: "0.7rem",
                        padding: "3px 8px"
                      }}>
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && hoveredItem === link.label && (
                  <div className="tooltip">{link.label}</div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="sidebar-footer" style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: collapsed ? "10px" : "16px",
          borderTop: "1px solid rgba(102, 126, 234, 0.1)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)"
        }}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="sidebar-link w-100 mb-2"
            style={{
              display: "flex",
              alignItems: "center",
              gap: collapsed ? "0" : "12px",
              padding: collapsed ? "12px 0" : "12px 16px",
              border: "none",
              background: "transparent",
              color: "#4a5568",
              borderRadius: "12px",
              justifyContent: collapsed ? "center" : "flex-start",
              cursor: "pointer"
            }}
          >
            {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            {!collapsed && (isDarkMode ? "Light Mode" : "Dark Mode")}
          </button>

          {/* Settings & Support */}
          {bottomLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              className="sidebar-link w-100 mb-2"
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: collapsed ? "0" : "12px",
                padding: collapsed ? "12px 0" : "12px 16px",
                textDecoration: "none",
                color: isActive ? "#fff" : "#4a5568",
                background: isActive ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                borderRadius: "12px",
                justifyContent: collapsed ? "center" : "flex-start",
              })}
            >
              <span style={{ fontSize: "1.2rem", minWidth: "24px" }}>{link.icon}</span>
              {!collapsed && link.label}
            </NavLink>
          ))}

          {/* Logout Button */}
          <div className="position-relative mt-2">
            <button
              onClick={handleLogout}
              className="sidebar-link w-100"
              style={{
                display: "flex",
                alignItems: "center",
                gap: collapsed ? "0" : "12px",
                padding: collapsed ? "12px 0" : "12px 16px",
                border: "none",
                background: "transparent",
                color: "#ef4444",
                borderRadius: "12px",
                justifyContent: collapsed ? "center" : "flex-start",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              disabled={loggingOut}
            >
              <FaSignOutAlt size={18} />
              {!collapsed && "Logout"}
            </button>

            {/* Animated Logout Card */}
            {loggingOut && (
              <div
                className="logout-card d-flex align-items-center justify-content-center"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "12px",
                  display: "flex",
                  gap: "10px",
                  animation: "fadeSlide 0.5s ease forwards",
                  zIndex: 10,
                }}
              >
                <span className="spinner-border spinner-border-sm"></span>
                Logging out...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsed Tooltip */}
      <style jsx="true">{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
        }

        .sidebar-link {
          position: relative;
          transition: all 0.3s ease;
        }

        .sidebar-link:hover:not(.active) {
          background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%) !important;
          color: #667eea !important;
          transform: translateX(4px);
        }

        .sidebar-link.active {
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .sidebar-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 0 3px 3px 0;
        }

        .tooltip {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          white-space: nowrap;
          margin-left: 10px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .tooltip::before {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: transparent #667eea transparent transparent;
        }

        .brand-container {
          animation: slideInRight 0.5s ease;
        }

        .brand-icon-wrapper {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-icon {
          font-size: 24px;
          color: #667eea;
          animation: rotate 20s linear infinite;
        }

        .brand-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-section {
          margin-bottom: 20px;
        }

        .sidebar.dark-mode {
          background: linear-gradient(180deg, #1a202c 0%, #2d3748 100%);
        }

        .sidebar.dark-mode .sidebar-link {
          color: #a0aec0 !important;
        }

        .sidebar.dark-mode .sidebar-link:hover {
          background: linear-gradient(135deg, #667eea30 0%, #764ba230 100%) !important;
          color: white !important;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-10px, -50%);
          }
          to {
            opacity: 1;
            transform: translate(0, -50%);
          }
        }

        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(${collapsed ? '-280px' : '0'});
          }
          
          .sidebar.collapsed {
            transform: translateX(-80px);
          }
        }

        .toggle-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .user-profile {
          animation: slideInRight 0.5s ease;
        }

        .badge {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
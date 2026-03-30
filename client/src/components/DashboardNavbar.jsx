// src/components/DashboardNavbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  FaShoppingCart, 
  FaUserCircle, 
  FaSearch, 
  FaStore, 
  FaPlus,
  FaHeart,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaUserTie,
  FaClipboardList
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const DashboardNavbar = ({ sidebarCollapsed = false }) => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New order received", time: "5 min ago", read: false },
    { id: 2, text: "Product out of stock", time: "1 hour ago", read: false },
    { id: 3, text: "Payment successful", time: "2 hours ago", read: true }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/seller/shop?search=${searchQuery}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: "/seller/dashboard", icon: <FaTachometerAlt />, label: "Dashboard", exact: true },
    { path: "/seller/shop", icon: <FaStore />, label: "Shop" },
    { path: "/seller/orders", icon: <FaClipboardList />, label: "Orders", badge: null },
    { path: "/seller/products", icon: <FaPlus />, label: "Add Product" },
    { path: "/seller/wishlist", icon: <FaHeart />, label: "Wishlist" }
  ];

  return (
    <>
      <nav 
        className={`navbar navbar-expand-lg transition-all ${isScrolled ? "navbar-scrolled shadow-lg" : ""}`}
        style={{
          background: isScrolled 
            ? "rgba(255, 255, 255, 0.98)" 
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backdropFilter: "blur(10px)",
          padding: isScrolled ? "10px 24px" : "15px 24px",
          transition: "all 0.3s ease",
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 999,
          boxShadow: isScrolled ? "0 2px 10px rgba(0,0,0,0.05)" : "none"
        }}
      >
        <div className="container-fluid" style={{ padding: 0 }}>
          {/* Mobile Menu Button - Only visible on mobile */}
          <button
            className="navbar-toggler border-0 d-lg-none"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: isScrolled ? "#667eea" : "rgba(255,255,255,0.2)",
              borderRadius: "10px",
              padding: "10px",
              border: "none",
              outline: "none"
            }}
          >
            {isMobileMenuOpen ? (
              <FaTimes color="white" size={20} />
            ) : (
              <FaBars color="white" size={20} />
            )}
          </button>

          {/* Brand */}
          <Link 
            className="navbar-brand fw-bold d-flex align-items-center" 
            to="/seller/dashboard"
            style={{
              color: isScrolled ? "#2d3748" : "white",
              fontSize: "1.5rem",
              transition: "all 0.3s"
            }}
          >
            <div className="brand-icon me-2">
              <FaStore style={{ color: isScrolled ? "#667eea" : "white" }} />
            </div>
            <span className="brand-text">MarketSphere</span>
          </Link>

          {/* Navbar Content */}
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}>
            {/* Search Bar */}
            <form 
              className="d-flex mx-auto position-relative" 
              onSubmit={handleSearch}
              style={{ maxWidth: "400px", width: "100%" }}
            >
              <input
                type="text"
                className="form-control rounded-pill border-0"
                placeholder="Search products, orders, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "10px 20px",
                  paddingRight: "45px",
                  background: isScrolled ? "#f7fafc" : "rgba(255,255,255,0.2)",
                  color: isScrolled ? "#2d3748" : "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}
              />
              <button
                type="submit"
                className="btn position-absolute end-0 top-50 translate-middle-y"
                style={{
                  background: "transparent",
                  border: "none",
                  color: isScrolled ? "#667eea" : "white",
                  right: "15px"
                }}
              >
                <FaSearch />
              </button>
            </form>

            {/* Navigation Items */}
            <ul className="navbar-nav ms-auto align-items-center">
              {navItems.map((item) => (
                <li className="nav-item mx-1 d-none d-lg-flex" key={item.path}>
                  <NavLink
                    className={({ isActive }) => 
                      `nav-link d-flex align-items-center px-3 py-2 rounded-3 transition-all ${
                        isActive ? "active-nav-item" : ""
                      }`
                    }
                    to={item.path}
                    end={item.exact}
                    style={({ isActive }) => ({
                      color: isActive ? "#667eea" : isScrolled ? "#4a5568" : "white",
                      background: isActive ? "rgba(102, 126, 234, 0.1)" : "transparent",
                      fontWeight: isActive ? "600" : "500"
                    })}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="me-2">{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}

              {/* Cart */}
              <li className="nav-item mx-1">
                <NavLink
                  className="nav-link d-flex align-items-center px-3 py-2 rounded-3 position-relative"
                  to="/seller/cart"
                  style={({ isActive }) => ({
                    color: isActive ? "#667eea" : isScrolled ? "#4a5568" : "white",
                    background: isActive ? "rgba(102, 126, 234, 0.1)" : "transparent"
                  })}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaShoppingCart className="me-2" />
                  <span className="d-none d-lg-inline">Cart</span>
                  {cart.length > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                      style={{
                        background: "#f56565",
                        color: "white",
                        fontSize: "0.7rem",
                        padding: "3px 6px",
                        border: "2px solid white"
                      }}
                    >
                      {cart.length}
                    </span>
                  )}
                </NavLink>
              </li>

              {/* Notifications */}
              <li className="nav-item dropdown mx-1">
                <a
                  className="nav-link d-flex align-items-center px-3 py-2 rounded-3 position-relative"
                  href="#!"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{
                    color: isScrolled ? "#4a5568" : "white",
                    cursor: "pointer"
                  }}
                >
                  <FaBell className="me-2" />
                  <span className="d-none d-lg-inline">Notifications</span>
                  {unreadNotifications > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                      style={{
                        background: "#f56565",
                        color: "white",
                        fontSize: "0.6rem",
                        padding: "3px 5px",
                        border: "2px solid white"
                      }}
                    >
                      {unreadNotifications}
                    </span>
                  )}
                </a>
                <div className="dropdown-menu dropdown-menu-end p-2" style={{ minWidth: "300px" }}>
                  <div className="d-flex justify-content-between align-items-center px-3 py-2">
                    <h6 className="mb-0 fw-bold">Notifications</h6>
                    {unreadNotifications > 0 && (
                      <small className="text-primary">Mark all as read</small>
                    )}
                  </div>
                  <div className="dropdown-divider"></div>
                  {notifications.map(notification => (
                    <a 
                      key={notification.id} 
                      className="dropdown-item px-3 py-2 rounded-3"
                      href="#!"
                      style={{
                        background: notification.read ? "transparent" : "#ebf8ff"
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <span className="fw-medium">{notification.text}</span>
                        <small className="text-muted">{notification.time}</small>
                      </div>
                    </a>
                  ))}
                </div>
              </li>

              {/* Dark Mode Toggle */}
              <li className="nav-item mx-1">
                <button
                  className="btn nav-link d-flex align-items-center px-3 py-2 rounded-3"
                  onClick={toggleDarkMode}
                  style={{
                    color: isScrolled ? "#4a5568" : "white",
                    border: "none",
                    background: "transparent"
                  }}
                >
                  {isDarkMode ? <FaSun className="me-2" /> : <FaMoon className="me-2" />}
                  <span className="d-none d-lg-inline">{isDarkMode ? "Light" : "Dark"}</span>
                </button>
              </li>

              {/* Profile Dropdown */}
              <li className="nav-item dropdown mx-1">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center px-3 py-2 rounded-3"
                  href="#!"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{
                    color: isScrolled ? "#4a5568" : "white",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)"
                  }}
                >
                  <FaUserTie className="me-2" size={18} />
                  <span className="d-none d-lg-inline">{user?.name?.split(' ')[0] || "Seller"}</span>
                  <FaChevronDown className="ms-2" size={12} />
                </a>
                <div className="dropdown-menu dropdown-menu-end p-2" style={{ minWidth: "220px" }}>
                  <div className="px-3 py-2 text-center mb-2">
                    <div style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "white"
                    }}>
                      {user?.name?.charAt(0) || "S"}
                    </div>
                    <h6 className="mb-0 fw-bold mt-2">{user?.name || "Store Admin"}</h6>
                    <small className="text-muted">{user?.email || "seller@example.com"}</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <NavLink 
                    className="dropdown-item d-flex align-items-center px-3 py-2 rounded-3" 
                    to="/seller/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUserCircle className="me-2" /> My Profile
                  </NavLink>
                  
                  <NavLink 
                    className="dropdown-item d-flex align-items-center px-3 py-2 rounded-3" 
                    to="/seller/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaCog className="me-2" /> Settings
                  </NavLink>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item d-flex align-items-center px-3 py-2 rounded-3 text-danger"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div style={{ height: "70px" }} />

      <style jsx="true">{`
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .nav-link {
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          transform: translateY(-2px);
        }
        
        .nav-link.active-nav-item {
          background: rgba(102, 126, 234, 0.15) !important;
          font-weight: 600;
        }
        
        .dropdown-menu {
          animation: slideIn 0.3s ease;
          border: none;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          border-radius: 15px;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 991px) {
          .navbar-brand {
            // margin-left: auto;//
            margin-right: auto;
          }
          
          .navbar-collapse {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            padding: 20px;
            border-radius: 0 0 20px 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-height: calc(100vh - 70px);
            overflow-y: auto;
            z-index: 1000;
          }
          
          .nav-link {
            color: #2d3748 !important;
            padding: 12px !important;
            justify-content: flex-start !important;
          }
          
          form {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default DashboardNavbar;
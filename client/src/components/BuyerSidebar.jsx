// src/components/BuyerSidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaHeart,
  FaClock,
  FaUser,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaTag,
  FaGift,
  FaStar,
  FaQuestionCircle,
  FaStore,
  FaBoxOpen,
  FaChartLine,
  FaWallet,
  FaHeadset,
  FaMoon,
  FaSun,
  FaSearch
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const BuyerSidebar = ({ collapsed, setCollapsed, isMobile = false }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if current route matches
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Save collapsed state
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('buyerSidebarCollapsed', collapsed);
    }
  }, [collapsed, isMobile]);

  // Load saved state
  useEffect(() => {
    if (!isMobile) {
      const savedState = localStorage.getItem('buyerSidebarCollapsed');
      if (savedState !== null) {
        setCollapsed(savedState === 'true');
      }
    }
  }, [isMobile, setCollapsed]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("buyer-dark-mode");
  };

  const menuItems = [
    {
      section: 'Main',
      items: [
        { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard', end: true, badge: null },
        { path: '/dashboard/orders', icon: <FaShoppingCart />, label: 'My Orders', badge: null },
        { path: '/dashboard/wishlist', icon: <FaHeart />, label: 'Wishlist', badge: null },
        { path: '/dashboard/track-order', icon: <FaClock />, label: 'Track Order', badge: null },
      ]
    },
    {
      section: 'Account',
      items: [
        { path: '/dashboard/profile', icon: <FaUser />, label: 'Profile', badge: null },
        { path: '/dashboard/settings', icon: <FaCog />, label: 'Settings', badge: null },
        { path: '/dashboard/wallet', icon: <FaWallet />, label: 'Wallet', badge: null },
      ]
    },
    {
      section: 'Shop',
      items: [
        { path: '/shop', icon: <FaStore />, label: 'Continue Shopping', badge: null },
        { path: '/dashboard/offers', icon: <FaTag />, label: 'Offers & Deals', badge: '5' },
        { path: '/dashboard/rewards', icon: <FaGift />, label: 'Rewards', badge: null },
      ]
    },
    {
      section: 'Support',
      items: [
        { path: '/dashboard/help', icon: <FaQuestionCircle />, label: 'Help Center', badge: null },
        { path: '/dashboard/feedback', icon: <FaStar />, label: 'Feedback', badge: null },
      ]
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cartCount = cart?.length || 0;

  return (
    <div
      className={`buyer-sidebar ${collapsed ? "collapsed" : ""} ${isDarkMode ? "dark-mode" : ""}`}
      style={{
        width: collapsed ? '80px' : '280px',
        height: '100vh',
        background: "linear-gradient(180deg, #ffffff 0%, #f8faff 100%)",
        color: '#1a1a2e',
        position: isMobile ? 'fixed' : 'relative',
        left: 0,
        top: 0,
        boxShadow: '2px 0 20px rgba(0,0,0,0.05)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e9ecef',
        overflow: 'hidden'
      }}
    >
      {/* Decorative gradient line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
        backgroundSize: '200% 100%',
        animation: 'gradientMove 3s ease infinite'
      }} />

      {/* Brand Header */}
      <div
        style={{
          padding: collapsed ? '20px 0' : '24px 20px',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          position: 'relative',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {!collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaStore style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <div>
                <h5 style={{ 
                  margin: 0, 
                  fontWeight: '700', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>MarketSphere</h5>
                <small style={{ color: '#6c757d', fontSize: '0.7rem' }}>Buyer Dashboard</small>
              </div>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FaChevronLeft size={14} />
            </button>
          </>
        ) : (
          <>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <FaStore style={{ color: 'white', fontSize: '20px' }} />
            </div>
            <button
              onClick={() => setCollapsed(false)}
              style={{
                background: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '10px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#667eea',
                position: 'absolute',
                right: '-16px',
                top: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FaChevronRight size={14} />
            </button>
          </>
        )}
      </div>

      {/* User Profile Summary */}
      {!collapsed && user && (
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e9ecef',
          background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h6 style={{ margin: 0, fontWeight: '600', color: '#1a1a2e' }}>{user.name}</h6>
              <small style={{ color: '#667eea', fontSize: '0.7rem' }}>Premium Buyer</small>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {!collapsed && (
        <div className="px-3 mt-3 mb-2">
          <div className="position-relative">
            <FaSearch className="position-absolute top-50 translate-middle-y ms-3" style={{ color: "#667eea", fontSize: "14px" }} />
            <input
              type="text"
              className="form-control rounded-pill border-0 bg-light"
              placeholder="Search products..."
              style={{ paddingLeft: "40px", fontSize: "0.9rem" }}
            />
          </div>
        </div>
      )}

      {/* Cart Summary */}
      {!collapsed && cartCount > 0 && (
        <div style={{
          margin: '12px 16px',
          padding: '12px',
          background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <FaShoppingCart style={{ color: '#667eea' }} />
              <small className="fw-bold">Cart Items</small>
            </div>
            <span className="badge" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '20px'
            }}>
              {cartCount}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: collapsed ? '16px 0' : '20px 16px'
      }}>
        {menuItems.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '24px' }}>
            {!collapsed && (
              <div style={{
                padding: '0 12px',
                marginBottom: '8px',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#adb5bd'
              }}>
                {section.section}
              </div>
            )}
            
            {section.items.map((item, itemIdx) => (
              <NavLink
                key={itemIdx}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `buyer-sidebar-link ${isActive ? "active" : ""}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: collapsed ? '0' : '12px',
                  padding: collapsed ? '12px 0' : '10px 12px',
                  margin: '2px 0',
                  textDecoration: 'none',
                  color: isActive ? '#fff' : '#4a5568',
                  background: isActive 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'transparent',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  fontWeight: isActive ? '600' : '500'
                })}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span style={{ fontSize: '1.1rem', minWidth: '24px', color: isActive ? 'white' : '#667eea' }}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        background: '#f56565',
                        color: 'white',
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        minWidth: '18px',
                        textAlign: 'center'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && hoveredItem === item.label && (
                  <div style={{
                    position: 'fixed',
                    left: '100px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    marginLeft: '8px',
                    zIndex: 1100,
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    {item.label}
                    {item.badge && ` (${item.badge})`}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div style={{
        padding: collapsed ? '12px' : '16px',
        borderTop: '1px solid #e9ecef',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? '0' : '12px',
            padding: collapsed ? '12px 0' : '10px 12px',
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: '#4a5568',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          {!collapsed && (isDarkMode ? 'Light Mode' : 'Dark Mode')}
        </button>

        {/* Help Center */}
        <NavLink
          to="/dashboard/help"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? '0' : '12px',
            padding: collapsed ? '12px 0' : '10px 12px',
            textDecoration: 'none',
            color: isActive ? '#fff' : '#4a5568',
            background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            marginBottom: '8px'
          })}
        >
          <FaQuestionCircle size={18} />
          {!collapsed && 'Help Center'}
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? '0' : '12px',
            padding: collapsed ? '12px 0' : '10px 12px',
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: '#dc3545',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#fff5f5'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <FaSignOutAlt size={18} />
          {!collapsed && 'Logout'}
        </button>
      </div>

      <style jsx="true">{`
        .buyer-sidebar-link {
          transition: all 0.3s ease;
        }

        .buyer-sidebar-link:hover:not(.active) {
          background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%) !important;
          color: #667eea !important;
          transform: translateX(4px);
        }

        .buyer-sidebar-link.active {
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
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

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .buyer-sidebar.dark-mode {
          background: linear-gradient(180deg, #1a202c 0%, #2d3748 100%);
        }

        .buyer-sidebar.dark-mode .buyer-sidebar-link {
          color: #a0aec0 !important;
        }

        .buyer-sidebar.dark-mode .buyer-sidebar-link:hover {
          background: linear-gradient(135deg, #667eea30 0%, #764ba230 100%) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default BuyerSidebar;
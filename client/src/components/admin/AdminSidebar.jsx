// src/components/admin/AdminSidebar.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaShieldAlt,
  FaBell,
  FaFlag,
  FaFileInvoice,
  FaStar,
  FaUserTie
} from 'react-icons/fa';

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      section: 'Main',
      items: [
        { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard', end: true },
        { path: '/admin/users', icon: <FaUsers />, label: 'Users', badge: '12' },
        { path: '/admin/stores', icon: <FaStore />, label: 'Stores', badge: '8' },
        { path: '/admin/products', icon: <FaBoxOpen />, label: 'Products', badge: '45' },
        { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Orders', badge: '23' },
      ]
    },
    {
      section: 'Financial',
      items: [
        { path: '/admin/transactions', icon: <FaMoneyBillWave />, label: 'Transactions' },
        { path: '/admin/disputes', icon: <FaExclamationTriangle />, label: 'Disputes', badge: '3' },
        { path: '/admin/reports', icon: <FaChartLine />, label: 'Reports' },
      ]
    },
    {
      section: 'Settings',
      items: [
        { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
      ]
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div style={{
      width: collapsed ? '80px' : '280px',
      height: '100vh',
      background: 'linear-gradient(180deg, #1a1f2e 0%, #151a28 100%)',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
      transition: 'width 0.3s ease',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: collapsed ? '24px 0' : '24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between'
      }}>
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
                <FaShieldAlt style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <div>
                <h5 style={{ margin: 0, fontWeight: '700', color: 'white' }}>MarketSphere</h5>
                <small style={{ color: '#a0aec0', fontSize: '0.7rem' }}>Admin Panel</small>
              </div>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white'
              }}
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
              <FaShieldAlt style={{ color: 'white', fontSize: '20px' }} />
            </div>
            <button
              onClick={() => setCollapsed(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                position: 'absolute',
                right: '-16px',
                top: '24px'
              }}
            >
              <FaChevronRight size={14} />
            </button>
          </>
        )}
      </div>

      {/* Admin Profile */}
      {!collapsed && admin && (
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              {admin.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h6 style={{ margin: 0, color: 'white', fontWeight: '600' }}>{admin.name || 'Admin'}</h6>
              <small style={{ color: '#a0aec0' }}>Super Admin</small>
            </div>
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
                padding: '0 16px',
                marginBottom: '8px',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#718096'
              }}>
                {section.section}
              </div>
            )}
            
            {section.items.map((item, itemIdx) => (
              <NavLink
                key={itemIdx}
                to={item.path}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: collapsed ? '0' : '12px',
                  padding: collapsed ? '14px 0' : '12px 16px',
                  margin: '4px 0',
                  textDecoration: 'none',
                  color: isActive ? 'white' : '#a0aec0',
                  background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                })}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        minWidth: '20px',
                        textAlign: 'center'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && hoveredItem === item.label && (
                  <div style={{
                    position: 'absolute',
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#1a1f2e',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    marginLeft: '8px',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
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

      {/* Logout Button */}
      <div style={{
        padding: collapsed ? '16px 0' : '20px 16px',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? '0' : '12px',
            padding: collapsed ? '14px 0' : '12px 16px',
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: '#ef4444',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <FaSignOutAlt size={18} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
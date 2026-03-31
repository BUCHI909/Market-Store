// src/components/BottomNav.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaHeart, FaUser, FaPlusCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Don't show bottom nav on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // In BottomNav.jsx
  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Home' },
    { path: '/products', icon: FaShoppingBag, label: 'Shop' },
    { path: '/add-product', icon: FaPlusCircle, label: 'Sell' }, // ← This
    { path: '/favorites', icon: FaHeart, label: 'Favorites' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
  ];

  // Filter items based on user role if needed
  const filteredItems = navItems.filter(item => {
    if (item.path === '/add-product' && user?.role !== 'seller') {
      return false;
    }
    return true;
  });

  const handleNavigation = (path) => {
    console.log('Navigating to:', path); // Debug log
    navigate(path);
  };

  return (
    <div className="bottom-nav d-md-none">
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <Icon size={24} />
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        );
      })}

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 16px;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
          border-top: 1px solid #e0e0e0;
        }
        
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          transition: all 0.2s;
          color: #666;
        }
        
        .bottom-nav-item.active {
          color: #0d6efd;
        }
        
        .bottom-nav-label {
          font-size: 12px;
          margin-top: 4px;
        }
        
        .bottom-nav-item:hover {
          transform: translateY(-2px);
        }
        
        @media (min-width: 768px) {
          .bottom-nav {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default BottomNav;
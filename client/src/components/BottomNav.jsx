// src/components/BottomNav.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaStore, 
  FaPlusCircle, 
  FaShoppingBag, 
  FaUser,
  FaHeart
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Don't show bottom nav on auth pages
  const hideNavPaths = ['/login', '/register', '/register/buyer', '/register/seller'];
  if (hideNavPaths.includes(location.pathname)) {
    return null;
  }

  // Navigation items with correct paths that match your routes
  const navItems = [
    {
      path: '/dashboard',
      icon: FaHome,
      label: 'Home',
      show: true,
      activePaths: ['/dashboard', '/']
    },
    {
      path: '/shop',
      icon: FaStore,
      label: 'Store',
      show: true,
      activePaths: ['/shop', '/store']
    },
    {
      path: '/add-product',
      icon: FaPlusCircle,
      label: 'Sell',
      show: user?.role === 'seller',
      activePaths: ['/add-product']
    },
    {
      path: '/orders',
      icon: FaShoppingBag,
      label: 'Orders',
      show: true,
      activePaths: ['/orders']
    },
    {
      path: '/profile',
      icon: FaUser,
      label: 'Profile',
      show: true,
      activePaths: ['/profile', '/settings']
    }
  ];

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  const isActive = (item) => {
    return item.activePaths.includes(location.pathname);
  };

  const visibleItems = navItems.filter(item => item.show);

  return (
    <>
      <style>
        {`
          .bottom-nav-container {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 8px 20px;
            padding-bottom: max(8px, env(safe-area-inset-bottom));
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
            z-index: 1000;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
          }
          
          .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px 12px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            color: #6c757d;
            border-radius: 40px;
            position: relative;
            min-width: 64px;
          }
          
          .bottom-nav-item.active {
            color: #667eea;
          }
          
          .bottom-nav-item.active .nav-icon {
            transform: translateY(-2px);
          }
          
          .nav-icon {
            font-size: 24px;
            transition: all 0.2s ease;
          }
          
          .bottom-nav-label {
            font-size: 11px;
            margin-top: 4px;
            font-weight: 500;
            letter-spacing: 0.3px;
          }
          
          .bottom-nav-item:hover {
            transform: translateY(-2px);
            background: rgba(102, 126, 234, 0.1);
          }
          
          .bottom-nav-item:active {
            transform: translateY(0px);
          }
          
          /* Sell button special styling */
          .nav-item-sell {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 8px 20px;
            border-radius: 40px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }
          
          .nav-item-sell .nav-icon,
          .nav-item-sell .bottom-nav-label {
            color: white !important;
          }
          
          .nav-item-sell:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }
          
          @media (min-width: 768px) {
            .bottom-nav-container {
              display: none;
            }
          }
        `}
      </style>
      
      <div className="bottom-nav-container">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isSellButton = item.path === '/add-product';
          const active = isActive(item);
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`bottom-nav-item ${active ? 'active' : ''} ${isSellButton ? 'nav-item-sell' : ''}`}
              aria-label={item.label}
            >
              <Icon className="nav-icon" />
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default BottomNav;
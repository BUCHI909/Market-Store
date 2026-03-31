// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      console.log('Auth check response:', response.data); // Debug log
      
      // ✅ The response structure is { user: {...} }
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
      setError(null);
    } catch (err) {
      console.log('Auth check failed:', err.response?.status);
      setUser(null);
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Authentication check failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    console.log('Setting user in context:', userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    setUser: login,
    loading,
    error,
    logout,
    checkAuthStatus,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
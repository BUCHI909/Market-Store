// src/components/admin/AdminHeader.jsx
import React from 'react';
import { FaBell, FaSearch, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Dropdown } from 'react-bootstrap';

const AdminHeader = () => {
  const { admin } = useAdminAuth();

  return (
    <div style={{
      background: 'white',
      padding: '16px 24px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', width: '400px' }}>
        <FaSearch style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#a0aec0'
        }} />
        <input
          type="text"
          placeholder="Search users, stores, orders..."
          style={{
            width: '100%',
            padding: '10px 10px 10px 40px',
            borderRadius: '30px',
            border: '1px solid #e2e8f0',
            outline: 'none',
            fontSize: '0.95rem'
          }}
        />
      </div>

      {/* Right Side Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <FaBell size={20} style={{ color: '#4a5568', cursor: 'pointer' }} />
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            3
          </span>
        </div>

        {/* Admin Profile Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle 
            variant="link" 
            style={{ 
              textDecoration: 'none',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: 0
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{admin?.name || 'Admin'}</div>
              <small style={{ color: '#718096' }}>Super Admin</small>
            </div>
            <FaChevronDown size={12} style={{ color: '#718096' }} />
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ minWidth: '200px', marginTop: '10px' }}>
            <Dropdown.Item href="/admin/profile">My Profile</Dropdown.Item>
            <Dropdown.Item href="/admin/settings">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/admin/logout" style={{ color: '#ef4444' }}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default AdminHeader;
// src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaShieldAlt, FaLock, FaEnvelope } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/admin');
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card style={{
        width: '100%',
        maxWidth: '400px',
        borderRadius: '20px',
        border: 'none',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <Card.Body className="p-5">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <FaShieldAlt size={40} color="white" />
            </div>
            <h3 style={{ fontWeight: '700', margin: 0 }}>Admin Login</h3>
            <p style={{ color: '#718096', marginTop: '8px' }}>
              MarketSphere Admin Panel
            </p>
          </div>

          {error && (
            <Alert variant="danger" style={{ borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0aec0'
                }} />
                <Form.Control
                  type="email"
                  placeholder="admin@marketsphere.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    paddingLeft: '40px',
                    height: '48px',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0aec0'
                }} />
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    paddingLeft: '40px',
                    height: '48px',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600'
              }}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <small style={{ color: '#a0aec0' }}>
              Secure access for administrators only
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminLogin;
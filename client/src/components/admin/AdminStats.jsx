// src/components/admin/AdminStats.jsx
import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const AdminStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <Row>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Col lg={4} xl={2} md={6} key={i} className="mb-3">
            <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <Card.Body className="text-center">
                <Spinner animation="border" size="sm" />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row>
      {stats.map((stat, index) => (
        <Col lg={4} xl={2} md={6} key={index} className="mb-3">
          <Card style={{ 
            borderRadius: '16px', 
            border: 'none', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Card.Body>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: stat.color
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: stat.trend === 'up' ? '#10b981' : '#ef4444',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  {stat.trend === 'up' ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                  {stat.change}
                </div>
              </div>
              
              <h3 style={{ fontSize: '1.8rem', fontWeight: '700', margin: '8px 0 4px' }}>
                {stat.value}
              </h3>
              <p style={{ color: '#718096', margin: 0, fontSize: '0.9rem' }}>
                {stat.title}
              </p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AdminStats;
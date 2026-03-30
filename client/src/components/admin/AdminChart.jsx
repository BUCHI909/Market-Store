// src/components/admin/AdminChart.jsx
import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AdminChart = () => {
  const [chartData, setChartData] = useState([
    { day: 'Mon', value: 450000 },
    { day: 'Tue', value: 520000 },
    { day: 'Wed', value: 480000 },
    { day: 'Thu', value: 610000 },
    { day: 'Fri', value: 750000 },
    { day: 'Sat', value: 820000 },
    { day: 'Sun', value: 680000 }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/admin/analytics/weekly', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChartData(response.data);
    } catch (error) {
      console.log('Using mock chart data');
      // Keep using mock data
    } finally {
      setLoading(false);
    }
  };

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <Card style={{ borderRadius: '16px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <Card.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h6 style={{ fontWeight: '600', margin: 0 }}>Weekly Sales</h6>
          <select style={{
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            background: 'white'
          }}>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingTop: '20px' }}>
            {chartData.map((item, index) => {
              const height = (item.value / maxValue) * 180;
              
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    height: `${height}px`,
                    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '8px 8px 0 0',
                    transition: 'height 0.3s ease',
                    position: 'relative',
                    cursor: 'pointer'
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.7rem',
                      background: '#333',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      whiteSpace: 'nowrap'
                    }}>
                      ₦{item.value.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#718096' }}>
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AdminChart;
// src/components/PageErrorBoundary.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageErrorBoundary = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <ErrorBoundary
      fallback={
        <div style={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3>This section encountered an error</h3>
            <button 
              onClick={() => navigate(0)}
              className="btn btn-primary mt-3"
            >
              Try Again
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
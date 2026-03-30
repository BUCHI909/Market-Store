// client/src/pages/PaymentSuccess.jsx
// Shown after successful payment

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import {
  FaCheckCircle,
  FaPrint,
  FaDownload,
  FaShare,
  FaHome,
  FaShoppingBag,
  FaReceipt
} from 'react-icons/fa';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Get payment details from navigation state
    if (location.state?.paymentResult) {
      setPaymentDetails(location.state.paymentResult);
    } else {
      // If no details, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // Create receipt content
    const receiptContent = `
      MARKETSPHERE RECEIPT
      ====================
      Date: ${new Date().toLocaleString()}
      Reference: ${paymentDetails?.reference}
      Amount: ₦${paymentDetails?.amount?.toLocaleString()}
      
      Thank you for your purchase!
    `;
    
    // Create download link
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentDetails?.reference}.txt`;
    a.click();
  };

  if (!paymentDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="border-0 shadow-lg text-center" style={{ borderRadius: '20px' }}>
            <Card.Body className="p-5">
              {/* Success Icon */}
              <div className="mb-4">
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b98120, #05966920)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <FaCheckCircle size={50} style={{ color: '#10b981' }} />
                </div>
              </div>

              <h2 className="fw-bold mb-3">Payment Successful!</h2>
              <p className="text-muted mb-4">
                Thank you for your purchase. Your transaction has been completed successfully.
              </p>

              {/* Payment Details */}
              <div className="bg-light p-4 rounded-3 text-start mb-4">
                <h6 className="fw-bold mb-3">
                  <FaReceipt className="me-2" />
                  Transaction Details
                </h6>
                
                <div className="mb-2">
                  <small className="text-muted d-block">Reference Number</small>
                  <strong>{paymentDetails.reference}</strong>
                </div>
                
                <div className="mb-2">
                  <small className="text-muted d-block">Amount Paid</small>
                  <strong className="text-primary h4">₦{paymentDetails.amount?.toLocaleString()}</strong>
                </div>
                
                <div className="mb-2">
                  <small className="text-muted d-block">Date & Time</small>
                  <strong>{new Date().toLocaleString()}</strong>
                </div>
                
                <div>
                  <small className="text-muted d-block">Payment Method</small>
                  <strong>{paymentDetails.method || 'Paystack'}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 justify-content-center">
                <Button
                  variant="outline-primary"
                  onClick={handlePrint}
                  style={{ borderRadius: '30px', padding: '10px 25px' }}
                >
                  <FaPrint className="me-2" />
                  Print
                </Button>
                
                <Button
                  variant="outline-success"
                  onClick={handleDownloadReceipt}
                  style={{ borderRadius: '30px', padding: '10px 25px' }}
                >
                  <FaDownload className="me-2" />
                  Download Receipt
                </Button>
                
                <Button
                  variant="outline-info"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Payment Receipt',
                        text: `Payment of ₦${paymentDetails.amount?.toLocaleString()} was successful. Reference: ${paymentDetails.reference}`,
                      });
                    }
                  }}
                  style={{ borderRadius: '30px', padding: '10px 25px' }}
                >
                  <FaShare className="me-2" />
                  Share
                </Button>
              </div>

              <hr className="my-4" />

              <div className="d-flex gap-3 justify-content-center">
                <Button
                  variant="light"
                  onClick={() => navigate('/')}
                  style={{ borderRadius: '30px', padding: '10px 25px' }}
                >
                  <FaHome className="me-2" />
                  Go Home
                </Button>
                
                <Button
                  variant="primary"
                  onClick={() => navigate('/shop')}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "30px",
                    padding: "10px 25px"
                  }}
                >
                  <FaShoppingBag className="me-2" />
                  Continue Shopping
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentSuccess;
// client/src/components/PaymentModal.jsx
// This is the popup that appears when user clicks "Pay"

import React, { useState } from 'react';
import { Modal, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import {
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaQrcode,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaGooglePay,
  FaApplePay
} from 'react-icons/fa';
import paymentService from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const PaymentModal = ({ show, onHide, orderDetails, onPaymentComplete }) => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle payment button click
  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      if (paymentMethod === 'paystack') {
        // Initialize Paystack payment
        await paymentService.initializePaystackPayment({
          email: user?.email,
          amount: orderDetails.total,
          metadata: {
            orderId: orderDetails.orderId,
            customerName: user?.name,
            customerId: user?.id,
            items: orderDetails.items,
            shippingAddress: orderDetails.shippingAddress
          },
          onSuccess: (response) => {
            setSuccess(true);
            onPaymentComplete({
              success: true,
              reference: response.reference,
              transactionId: response.transaction,
              amount: orderDetails.total
            });
            
            // Auto close after 2 seconds
            setTimeout(() => {
              onHide();
            }, 2000);
          },
          onClose: () => {
            setLoading(false);
            setError('Payment window was closed. Please try again.');
          }
        });
      } else {
        // For other payment methods (simulated)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSuccess(true);
        onPaymentComplete({
          success: true,
          reference: paymentService.generateReference(),
          method: paymentMethod,
          amount: orderDetails.total
        });
        
        setTimeout(() => {
          onHide();
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      backdrop="static" // Prevents closing by clicking outside
    >
      {/* Modal Header */}
      <Modal.Header closeButton style={{ 
        border: 'none', 
        padding: '25px 25px 0' 
      }}>
        <Modal.Title className="fw-bold" style={{ fontSize: '1.5rem' }}>
          Complete Payment
        </Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body className="p-4">
        {/* Security Badge - Shows SSL security */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-2 bg-light rounded-pill">
            <FaLock className="text-success" size={14} />
            <small className="text-muted">256-bit SSL Secure Payment</small>
            <FaShieldAlt className="text-primary" size={14} />
          </div>
        </div>

        {/* Order Summary - Shows what user is paying for */}
        <div className="bg-light p-3 rounded-3 mb-4">
          <h6 className="fw-bold mb-3">Order Summary</h6>
          {orderDetails?.items?.map((item, index) => (
            <div key={index} className="d-flex justify-content-between mb-2">
              <span>
                {item.name} <small className="text-muted">x{item.quantity}</small>
              </span>
              <span className="fw-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <hr />
          <div className="d-flex justify-content-between">
            <span className="h6 fw-bold">Total:</span>
            <span className="h5 fw-bold text-primary">
              ₦{orderDetails?.total?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <h6 className="fw-bold mb-3">Select Payment Method</h6>
        <Row className="g-3 mb-4">
          {/* Paystack - Recommended for Nigeria */}
          <Col xs={6} md={4}>
            <div
              className={`payment-method-card p-3 text-center`}
              onClick={() => setPaymentMethod('paystack')}
              style={{
                borderRadius: '12px',
                border: `2px solid ${paymentMethod === 'paystack' ? '#667eea' : '#e9ecef'}`,
                background: paymentMethod === 'paystack' ? '#667eea10' : 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <img 
                src="https://paystack.com/assets/img/logo.svg" 
                alt="Paystack" 
                style={{ height: '30px', marginBottom: '10px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <div className="mt-2 fw-bold" style={{ fontSize: '0.9rem' }}>Paystack</div>
              <small className="text-muted">Cards, Transfer, USSD</small>
            </div>
          </Col>

          {/* Card Payment */}
          <Col xs={6} md={4}>
            <div
              className={`payment-method-card p-3 text-center`}
              onClick={() => setPaymentMethod('card')}
              style={{
                borderRadius: '12px',
                border: `2px solid ${paymentMethod === 'card' ? '#667eea' : '#e9ecef'}`,
                background: paymentMethod === 'card' ? '#667eea10' : 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <FaCreditCard size={30} color={paymentMethod === 'card' ? '#667eea' : '#6c757d'} />
              <div className="mt-2 fw-bold" style={{ fontSize: '0.9rem' }}>Card Payment</div>
              <small className="text-muted">Visa, Mastercard, Verve</small>
            </div>
          </Col>

          {/* Bank Transfer */}
          <Col xs={6} md={4}>
            <div
              className={`payment-method-card p-3 text-center`}
              onClick={() => setPaymentMethod('bank')}
              style={{
                borderRadius: '12px',
                border: `2px solid ${paymentMethod === 'bank' ? '#667eea' : '#e9ecef'}`,
                background: paymentMethod === 'bank' ? '#667eea10' : 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <FaUniversity size={30} color={paymentMethod === 'bank' ? '#667eea' : '#6c757d'} />
              <div className="mt-2 fw-bold" style={{ fontSize: '0.9rem' }}>Bank Transfer</div>
              <small className="text-muted">Instant transfer</small>
            </div>
          </Col>

          {/* USSD */}
          <Col xs={6} md={4}>
            <div
              className={`payment-method-card p-3 text-center`}
              onClick={() => setPaymentMethod('ussd')}
              style={{
                borderRadius: '12px',
                border: `2px solid ${paymentMethod === 'ussd' ? '#667eea' : '#e9ecef'}`,
                background: paymentMethod === 'ussd' ? '#667eea10' : 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <FaMobileAlt size={30} color={paymentMethod === 'ussd' ? '#667eea' : '#6c757d'} />
              <div className="mt-2 fw-bold" style={{ fontSize: '0.9rem' }}>USSD</div>
              <small className="text-muted">*123#</small>
            </div>
          </Col>

          {/* QR Code */}
          <Col xs={6} md={4}>
            <div
              className={`payment-method-card p-3 text-center`}
              onClick={() => setPaymentMethod('qr')}
              style={{
                borderRadius: '12px',
                border: `2px solid ${paymentMethod === 'qr' ? '#667eea' : '#e9ecef'}`,
                background: paymentMethod === 'qr' ? '#667eea10' : 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <FaQrcode size={30} color={paymentMethod === 'qr' ? '#667eea' : '#6c757d'} />
              <div className="mt-2 fw-bold" style={{ fontSize: '0.9rem' }}>QR Code</div>
              <small className="text-muted">Scan to pay</small>
            </div>
          </Col>

          {/* Digital Wallet */}
          <Col xs={6} md={4}>
            <div
              className={`payment-method-card p-3 text-center`}
              onClick={() => setPaymentMethod('wallet')}
              style={{
                borderRadius: '12px',
                border: `2px solid ${paymentMethod === 'wallet' ? '#667eea' : '#e9ecef'}`,
                background: paymentMethod === 'wallet' ? '#667eea10' : 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="d-flex justify-content-center gap-2">
                <FaGooglePay size={24} color={paymentMethod === 'wallet' ? '#667eea' : '#6c757d'} />
                <FaApplePay size={24} color={paymentMethod === 'wallet' ? '#667eea' : '#6c757d'} />
              </div>
              <div className="mt-2 fw-bold" style={{ fontSize: '0.9rem' }}>Digital Wallets</div>
              <small className="text-muted">Google Pay, Apple Pay</small>
            </div>
          </Col>
        </Row>

        {/* Error Message */}
        {error && (
          <Alert variant="danger" className="mt-3">
            <FaExclamationCircle className="me-2" />
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert variant="success" className="mt-3">
            <FaCheckCircle className="me-2" />
            Payment successful! Redirecting...
          </Alert>
        )}

        {/* Payment Info for selected method */}
        {paymentMethod === 'paystack' && (
          <div className="mt-3 p-3 bg-primary bg-opacity-10 rounded-3">
            <small className="text-muted">
              <FaLock className="me-1" size={12} />
              You'll be redirected to Paystack's secure payment page to complete your transaction.
              We accept all major cards, bank transfers, and USSD.
            </small>
          </div>
        )}
      </Modal.Body>

      {/* Modal Footer */}
      <Modal.Footer style={{ border: 'none', padding: '0 25px 25px' }}>
        <Button 
          variant="light" 
          onClick={onHide}
          disabled={loading}
          style={{ borderRadius: '12px', padding: '12px 30px' }}
        >
          Cancel
        </Button>
        <Button 
          variant="primary"
          onClick={handlePayment}
          disabled={loading || success}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "12px",
            padding: "12px 40px",
            position: "relative"
          }}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Processing...
            </>
          ) : success ? (
            <>
              <FaCheckCircle className="me-2" />
              Completed
            </>
          ) : (
            `Pay ₦${orderDetails?.total?.toLocaleString()}`
          )}
        </Button>
      </Modal.Footer>

      {/* Add custom CSS for hover effects */}
      <style jsx="true">{`
        .payment-method-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
      `}</style>
    </Modal>
  );
};

export default PaymentModal;
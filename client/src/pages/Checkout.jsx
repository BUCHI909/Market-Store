// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Card, Row, Col, Form, Alert, Spinner, Modal } from "react-bootstrap";
import { createOrder } from "../utils/api";
import PaymentModal from "../components/PaymentModal"; // ← ADD THIS IMPORT
import {
  FaShoppingCart,
  FaTruck,
  FaCreditCard,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCity,
  FaFlag,
  FaBuilding,
  FaHome,
  FaArrowLeft,
  FaArrowRight,
  FaLock,
  FaShieldAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaGooglePay,
  FaApplePay,
  FaExclamationCircle,
  FaSpinner,
  FaGift,
  FaPercent,
  FaBoxOpen,
  FaCalendarAlt,
  FaClock,
  FaWhatsapp,
  FaHeadset
} from "react-icons/fa";

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // ← ADD THIS STATE
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Nigeria"
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: "card",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });

  const [errors, setErrors] = useState({});

  // Free shipping threshold
  const FREE_SHIPPING_THRESHOLD = 50000;
  const shippingCost = total >= FREE_SHIPPING_THRESHOLD ? 0 : 2500;
  const tax = total * 0.075; // 7.5% VAT
  const finalTotal = total + shippingCost + tax;

  useEffect(() => {
    // If cart is empty, redirect to shop
    if (!cart || cart.length === 0) {
      navigate("/shop");
    }
  }, [cart, navigate]);

  const validateShipping = () => {
    const newErrors = {};
    
    if (!shippingInfo.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = "Email is invalid";
    if (!shippingInfo.phone.trim()) newErrors.phone = "Phone number is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.state.trim()) newErrors.state = "State is required";
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    
    if (paymentInfo.method === "card") {
      if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
      else if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = "Invalid card number";
      
      if (!paymentInfo.cardName.trim()) newErrors.cardName = "Cardholder name is required";
      
      if (!paymentInfo.expiry.trim()) newErrors.expiry = "Expiry date is required";
      else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiry)) newErrors.expiry = "Use MM/YY format";
      
      if (!paymentInfo.cvv.trim()) newErrors.cvv = "CVV is required";
      else if (paymentInfo.cvv.length < 3) newErrors.cvv = "Invalid CVV";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateShipping()) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2 && validatePayment()) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
    window.scrollTo(0, 0);
  };

  // ← REPLACE your handlePlaceOrder with this new version
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Create orders for each item
      for (const item of cart) {
        await createOrder({
          productId: item.id,
          quantity: item.qty || 1,
          shippingInfo,
          paymentMethod: paymentInfo.method,
          totalAmount: item.price * (item.qty || 1)
        });
      }
      
      setSuccess(true);
      clearCart();
      
      // Show success message and redirect
      setTimeout(() => {
        navigate("/order-confirmation", {
          state: {
            orderDetails: {
              items: cart,
              total: finalTotal,
              shippingInfo,
              orderDate: new Date().toISOString()
            }
          }
        });
      }, 3000);
      
    } catch (err) {
      console.error("Order error:", err);
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  // ← NEW FUNCTION: Handle payment from modal
  const handlePaymentComplete = (result) => {
    if (result.success) {
      // Create the orders after successful payment
      handlePlaceOrder();
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!cart || cart.length === 0) {
    return null;
  }

  return (
    <div className="checkout-container" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      padding: "40px 0"
    }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "700",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "15px"
          }}>
            Checkout
          </h1>
          <p className="text-muted" style={{ fontSize: "1.1rem" }}>
            Complete your purchase in a few simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-5">
          <Row className="g-0">
            {[
              { number: 1, label: "Shipping", icon: <FaTruck /> },
              { number: 2, label: "Payment", icon: <FaCreditCard /> },
              { number: 3, label: "Review", icon: <FaCheckCircle /> }
            ].map((s) => (
              <Col key={s.number} className="text-center position-relative">
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: step >= s.number 
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#e9ecef",
                    color: step >= s.number ? "white" : "#adb5bd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 15px",
                    fontSize: "1.5rem",
                    boxShadow: step >= s.number ? "0 10px 20px rgba(102, 126, 234, 0.3)" : "none",
                    transition: "all 0.3s ease"
                  }}>
                    {s.icon}
                  </div>
                  <h6 style={{
                    fontWeight: step >= s.number ? "600" : "400",
                    color: step >= s.number ? "#667eea" : "#6c757d"
                  }}>
                    {s.label}
                  </h6>
                </div>
                {s.number < 3 && (
                  <div style={{
                    position: "absolute",
                    top: "30px",
                    left: "50%",
                    width: "100%",
                    height: "2px",
                    background: step > s.number ? "linear-gradient(90deg, #667eea, #764ba2)" : "#e9ecef",
                    zIndex: 1
                  }} />
                )}
              </Col>
            ))}
          </Row>
        </div>

        <Row>
          {/* Main Content */}
          <Col lg={8}>
            {/* Error Alert */}
            {error && (
              <Alert 
                variant="danger" 
                className="mb-4"
                style={{ borderRadius: "12px", border: "none" }}
                dismissible
                onClose={() => setError("")}
              >
                <FaExclamationCircle className="me-2" />
                {error}
              </Alert>
            )}

            {/* Success Message */}
            {success && (
              <Alert 
                variant="success" 
                className="mb-4 text-center"
                style={{ borderRadius: "12px", border: "none" }}
              >
                <FaCheckCircle size={30} className="mb-3" />
                <h4>Order Placed Successfully!</h4>
                <p>Redirecting to confirmation page...</p>
                <Spinner animation="border" variant="success" size="sm" />
              </Alert>
            )}

            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <Card className="border-0 shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <Card.Header style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "20px",
                  border: "none"
                }}>
                  <h4 className="mb-0">
                    <FaTruck className="me-2" />
                    Shipping Information
                  </h4>
                </Card.Header>
                <Card.Body className="p-4">
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            <FaUser className="me-2 text-primary" />
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={shippingInfo.fullName}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                            isInvalid={!!errors.fullName}
                            style={{ padding: "12px", borderRadius: "12px" }}
                            placeholder="John Doe"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.fullName}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            <FaEnvelope className="me-2 text-primary" />
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                            isInvalid={!!errors.email}
                            style={{ padding: "12px", borderRadius: "12px" }}
                            placeholder="john@example.com"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaPhone className="me-2 text-primary" />
                        Phone Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        isInvalid={!!errors.phone}
                        style={{ padding: "12px", borderRadius: "12px" }}
                        placeholder="+234 800 000 0000"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <FaHome className="me-2 text-primary" />
                        Street Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        isInvalid={!!errors.address}
                        style={{ padding: "12px", borderRadius: "12px" }}
                        placeholder="123 Main Street"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            <FaCity className="me-2 text-primary" />
                            City
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                            isInvalid={!!errors.city}
                            style={{ padding: "12px", borderRadius: "12px" }}
                            placeholder="Lagos"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            <FaFlag className="me-2 text-primary" />
                            State
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={shippingInfo.state}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                            isInvalid={!!errors.state}
                            style={{ padding: "12px", borderRadius: "12px" }}
                            placeholder="Lagos"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.state}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            <FaBuilding className="me-2 text-primary" />
                            ZIP Code
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={shippingInfo.zipCode}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                            isInvalid={!!errors.zipCode}
                            style={{ padding: "12px", borderRadius: "12px" }}
                            placeholder="100001"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.zipCode}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <Card className="border-0 shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <Card.Header style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "20px",
                  border: "none"
                }}>
                  <h4 className="mb-0">
                    <FaCreditCard className="me-2" />
                    Payment Information
                  </h4>
                </Card.Header>
                <Card.Body className="p-4">
                  {/* Payment Methods */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Payment Method</Form.Label>
                    <div className="d-flex gap-3 flex-wrap">
                      {[
                        { id: "card", label: "Card", icon: <FaCreditCard /> },
                        { id: "paypal", label: "PayPal", icon: <FaCcPaypal /> },
                        { id: "googlepay", label: "Google Pay", icon: <FaGooglePay /> },
                        { id: "applepay", label: "Apple Pay", icon: <FaApplePay /> }
                      ].map((method) => (
                        <div
                          key={method.id}
                          onClick={() => setPaymentInfo({ ...paymentInfo, method: method.id })}
                          style={{
                            flex: 1,
                            minWidth: "120px",
                            padding: "15px",
                            borderRadius: "12px",
                            background: paymentInfo.method === method.id 
                              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              : "#f8f9fa",
                            color: paymentInfo.method === method.id ? "white" : "#495057",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.3s ease",
                            border: paymentInfo.method === method.id ? "none" : "1px solid #dee2e6"
                          }}
                        >
                          <div style={{ fontSize: "1.5rem", marginBottom: "5px" }}>
                            {method.icon}
                          </div>
                          <small className="fw-bold">{method.label}</small>
                        </div>
                      ))}
                    </div>
                  </Form.Group>

                  {paymentInfo.method === "card" && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Card Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ 
                            ...paymentInfo, 
                            cardNumber: formatCardNumber(e.target.value)
                          })}
                          isInvalid={!!errors.cardNumber}
                          style={{ padding: "12px", borderRadius: "12px" }}
                          placeholder="4242 4242 4242 4242"
                          maxLength="19"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.cardNumber}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Cardholder Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                          isInvalid={!!errors.cardName}
                          style={{ padding: "12px", borderRadius: "12px" }}
                          placeholder="John Doe"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.cardName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Expiry Date</Form.Label>
                            <Form.Control
                              type="text"
                              value={paymentInfo.expiry}
                              onChange={(e) => setPaymentInfo({ 
                                ...paymentInfo, 
                                expiry: formatExpiry(e.target.value)
                              })}
                              isInvalid={!!errors.expiry}
                              style={{ padding: "12px", borderRadius: "12px" }}
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.expiry}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">CVV</Form.Label>
                            <Form.Control
                              type="password"
                              value={paymentInfo.cvv}
                              onChange={(e) => setPaymentInfo({ 
                                ...paymentInfo, 
                                cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                              })}
                              isInvalid={!!errors.cvv}
                              style={{ padding: "12px", borderRadius: "12px" }}
                              placeholder="123"
                              maxLength="4"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.cvv}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}

                  {/* Security Badge */}
                  <div className="mt-3 p-3 bg-light rounded-3 text-center">
                    <FaLock className="text-success me-2" />
                    <small className="text-muted">
                      Your payment information is encrypted and secure
                    </small>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <Card className="border-0 shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <Card.Header style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  padding: "20px",
                  border: "none"
                }}>
                  <h4 className="mb-0">
                    <FaCheckCircle className="me-2" />
                    Review Your Order
                  </h4>
                </Card.Header>
                <Card.Body className="p-4">
                  {/* Shipping Details */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">
                      <FaTruck className="me-2 text-primary" />
                      Shipping Details
                    </h6>
                    <div className="bg-light p-3 rounded-3">
                      <p className="mb-1"><strong>{shippingInfo.fullName}</strong></p>
                      <p className="mb-1">{shippingInfo.email}</p>
                      <p className="mb-1">{shippingInfo.phone}</p>
                      <p className="mb-0">
                        {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                      </p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">
                      <FaCreditCard className="me-2 text-primary" />
                      Payment Method
                    </h6>
                    <div className="bg-light p-3 rounded-3">
                      {paymentInfo.method === "card" ? (
                        <>
                          <p className="mb-1">
                            <strong>Card:</strong> **** **** **** {paymentInfo.cardNumber?.slice(-4)}
                          </p>
                          <p className="mb-0">
                            <strong>Expires:</strong> {paymentInfo.expiry}
                          </p>
                        </>
                      ) : (
                        <p className="mb-0">
                          <strong>Method:</strong> {paymentInfo.method.charAt(0).toUpperCase() + paymentInfo.method.slice(1)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">
                      <FaShoppingCart className="me-2 text-primary" />
                      Order Items
                    </h6>
                    {cart.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded-3">
                        <div>
                          <span className="fw-bold">{item.name}</span>
                          <small className="text-muted d-block">Qty: {item.qty || 1}</small>
                        </div>
                        <span className="fw-bold">₦{(item.price * (item.qty || 1)).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Order Summary Sidebar */}
          <Col lg={4}>
            <Card className="border-0 shadow-lg sticky-top" style={{ 
              borderRadius: "20px",
              position: "sticky",
              top: "20px"
            }}>
              <Card.Header style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "20px",
                border: "none"
              }}>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Items List */}
                <div className="mb-3">
                  {cart.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <span>
                        {item.name} <small className="text-muted">x{item.qty || 1}</small>
                      </span>
                      <span className="fw-bold">₦{(item.price * (item.qty || 1)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Price Breakdown */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : `₦${shippingCost.toLocaleString()}`}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Tax (7.5%)</span>
                    <span>₦{tax.toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <span className="h5 fw-bold">Total</span>
                    <span className="h5 fw-bold text-primary">₦{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="bg-light p-3 rounded-3 mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaClock className="text-primary me-2" />
                    <small className="fw-bold">Estimated Delivery</small>
                  </div>
                  <small className="text-muted">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </small>
                </div>

                {/* Navigation Buttons */}
                <div className="d-flex gap-2">
                  {step > 1 && (
                    <Button
                      variant="light"
                      onClick={handleBack}
                      className="flex-grow-1"
                      style={{ borderRadius: "12px", padding: "12px" }}
                    >
                      <FaArrowLeft className="me-2" />
                      Back
                    </Button>
                  )}
                  
                  {step < 3 ? (
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      className="flex-grow-1"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        borderRadius: "12px",
                        padding: "12px"
                      }}
                    >
                      Continue
                      <FaArrowRight className="ms-2" />
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => setShowPaymentModal(true)} // ← CHANGED: Now opens payment modal
                      className="flex-grow-1"
                      style={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        border: "none",
                        borderRadius: "12px",
                        padding: "12px"
                      }}
                    >
                      Proceed to Payment
                      <FaArrowRight className="ms-2" />
                    </Button>
                  )}
                </div>

                {/* Security Badge */}
                <div className="text-center mt-3">
                  <FaLock className="text-muted me-1" size={12} />
                  <small className="text-muted">Secure Checkout</small>
                </div>

                {/* Support */}
                <div className="text-center mt-2">
                  <Button
                    variant="link"
                    className="text-muted"
                    style={{ fontSize: "0.9rem" }}
                    onClick={() => window.open("https://wa.me/2349098746971", "_blank")}
                  >
                    <FaHeadset className="me-1" />
                    Need help? Chat with us
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Confirmation Modal - You can keep this for now, but it might not be needed */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton style={{ border: "none", padding: "25px 25px 0" }}>
          <Modal.Title className="fw-bold">Confirm Order</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea20, #764ba220)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            <FaShoppingCart size={40} style={{ color: "#667eea" }} />
          </div>
          
          <h5 className="fw-bold mb-3">Ready to place your order?</h5>
          <p className="text-muted mb-4">
            By placing this order, you agree to our Terms of Service and Privacy Policy.
          </p>
          
          <div className="bg-light p-3 rounded-3 mb-3">
            <div className="d-flex justify-content-between mb-2">
              <span>Total Amount:</span>
              <span className="fw-bold text-primary">₦{finalTotal.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Items:</span>
              <span>{cart.length}</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none", padding: "0 25px 25px" }}>
          <Button 
            variant="light" 
            onClick={() => setShowConfirmModal(false)}
            style={{ borderRadius: "12px", padding: "12px", flex: 1 }}
          >
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handlePlaceOrder}
            disabled={loading}
            style={{ 
              borderRadius: "12px", 
              padding: "12px", 
              flex: 1,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none"
            }}
          >
            {loading ? (
              <Spinner size="sm" />
            ) : (
              "Confirm Order"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* NEW: Payment Modal */}
      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        orderDetails={{
          orderId: "ORD_" + Date.now(),
          items: cart,
          total: finalTotal,
          shippingAddress: shippingInfo
        }}
        onPaymentComplete={handlePaymentComplete}
      />

      <style jsx="true">{`
        .sticky-top {
          position: sticky;
          top: 20px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .card {
          animation: fadeIn 0.5s ease;
        }
        
        @media (max-width: 768px) {
          .sticky-top {
            position: relative;
            top: 0;
            margin-top: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
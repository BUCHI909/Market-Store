// src/pages/Cart.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Table, Button, Card, Row, Col, Badge, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaTag,
  FaGift,
  FaTruck,
  FaShieldAlt,
  FaCreditCard,
  FaArrowLeft,
  FaArrowRight,
  FaHeart,
  FaRegHeart,
  FaPercent,
  FaCheckCircle,
  FaExclamationCircle,
  FaShoppingBag,
  FaStore,
  FaWallet,
  FaLock,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaGooglePay,
  FaApplePay,
  FaSpinner,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [savedForLater, setSavedForLater] = useState([]);
  const [loading, setLoading] = useState(false);

  // Free shipping threshold
  const FREE_SHIPPING_THRESHOLD = 50000;
  const shippingCost = total >= FREE_SHIPPING_THRESHOLD ? 0 : 2500;
  const finalTotal = total - discount + shippingCost;

  useEffect(() => {
    // Load saved items from localStorage
    const saved = localStorage.getItem("savedForLater");
    if (saved) {
      setSavedForLater(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save saved items to localStorage
    localStorage.setItem("savedForLater", JSON.stringify(savedForLater));
  }, [savedForLater]);

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty >= 1 && newQty <= 10) {
      updateQuantity(itemId, newQty);
    }
  };

  const handleRemoveClick = (item) => {
    setSelectedItem(item);
    setShowRemoveModal(true);
  };

  const confirmRemove = () => {
    if (selectedItem) {
      removeFromCart(selectedItem.id);
      setShowRemoveModal(false);
      setSelectedItem(null);
    }
  };

  const handleSaveForLater = (item) => {
    removeFromCart(item.id);
    setSavedForLater([...savedForLater, { ...item, savedAt: new Date() }]);
  };

  const handleMoveToCart = (item) => {
    const newSaved = savedForLater.filter(i => i.id !== item.id);
    setSavedForLater(newSaved);
    // Add back to cart
    updateQuantity(item.id, item.qty);
  };

  const applyCoupon = () => {
    setLoading(true);
    setTimeout(() => {
      if (couponCode.toUpperCase() === "SAVE20") {
        setDiscount(total * 0.2);
        setCouponApplied(true);
      } else if (couponCode.toUpperCase() === "WELCOME10") {
        setDiscount(total * 0.1);
        setCouponApplied(true);
      } else {
        alert("Invalid coupon code");
      }
      setLoading(false);
    }, 1000);
  };

  const getShippingProgress = () => {
    return Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  };

  const getSuggestedProducts = () => {
    // This would typically come from an API
    return [
      {
        id: 101,
        name: "Wireless Earbuds",
        price: 15000,
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb"
      },
      {
        id: 102,
        name: "Phone Case",
        price: 5000,
        image: "https://images.unsplash.com/photo-1541877944-b82f9c1b1b1d"
      },
      {
        id: 103,
        name: "Screen Protector",
        price: 3000,
        image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee9"
      }
    ];
  };

  // ← NEW: Handle checkout - redirect to your Checkout page
  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="container py-5">
        <Card className="border-0 shadow-lg text-center p-5" style={{ borderRadius: "20px" }}>
          <div className="mb-4">
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "60px",
              background: "linear-gradient(135deg, #667eea20, #764ba220)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto"
            }}>
              <FaShoppingCart size={60} style={{ color: "#667eea" }} />
            </div>
          </div>
          <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
          <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <div>
            <Button
              onClick={() => navigate("/shop")}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                padding: "12px 40px",
                fontSize: "1.1rem",
                borderRadius: "30px"
              }}
            >
              <FaShoppingBag className="me-2" />
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold" style={{ color: "#333" }}>
            <FaShoppingCart className="me-3" style={{ color: "#667eea" }} />
            Shopping Cart
          </h1>
          <p className="text-muted">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Button
          variant="outline-primary"
          onClick={() => navigate("/shop")}
          style={{ borderRadius: "30px", padding: "10px 25px" }}
        >
          <FaArrowLeft className="me-2" />
          Continue Shopping
        </Button>
      </div>

      <Row>
        {/* Cart Items */}
        <Col lg={8}>
          {/* Free Shipping Progress */}
          <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "16px" }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <FaTruck size={20} style={{ color: "#667eea" }} />
                  <span className="ms-2 fw-bold">Free Shipping</span>
                </div>
                <span style={{ color: total >= FREE_SHIPPING_THRESHOLD ? "#10b981" : "#f59e0b" }}>
                  {total >= FREE_SHIPPING_THRESHOLD ? (
                    <>
                      <FaCheckCircle className="me-1" />
                      You've got free shipping!
                    </>
                  ) : (
                    <>
                      <FaClock className="me-1" />
                      ₦{(FREE_SHIPPING_THRESHOLD - total).toLocaleString()} away from free shipping
                    </>
                  )}
                </span>
              </div>
              <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${getShippingProgress()}%`,
                    background: "linear-gradient(90deg, #667eea, #764ba2)",
                    transition: "width 0.5s ease"
                  }}
                />
              </div>
            </Card.Body>
          </Card>

          {/* Cart Items List */}
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-sm mb-3 cart-item" style={{ 
                  borderRadius: "16px",
                  transition: "all 0.3s ease"
                }}>
                  <Card.Body className="p-3">
                    <Row className="align-items-center">
                      <Col xs={3} md={2}>
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1607083206968-13611e3d76db"}
                          alt={item.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "12px",
                            objectFit: "cover"
                          }}
                        />
                      </Col>
                      <Col xs={9} md={6}>
                        <h6 className="fw-bold mb-2">{item.name}</h6>
                        <div className="d-flex gap-2 mb-2">
                          <Badge bg="light" text="dark" style={{ fontSize: "0.8rem" }}>
                            {item.category || "General"}
                          </Badge>
                          {item.discount > 0 && (
                            <Badge bg="danger" style={{ fontSize: "0.8rem" }}>
                              -{item.discount}%
                            </Badge>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="fw-bold text-primary">
                            ₦{item.price.toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <small className="text-muted text-decoration-line-through">
                              ₦{item.originalPrice.toLocaleString()}
                            </small>
                          )}
                        </div>
                      </Col>
                      <Col md={4} className="mt-3 mt-md-0">
                        <div className="d-flex align-items-center justify-content-between">
                          {/* Quantity Controls */}
                          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                            <Button
                              variant="light"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                              style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "10px"
                              }}
                            >
                              <FaMinus size={12} />
                            </Button>
                            <span className="fw-bold mx-2" style={{ minWidth: "30px", textAlign: "center" }}>
                              {item.qty}
                            </span>
                            <Button
                              variant="light"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                              disabled={item.qty >= 10}
                              style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "10px"
                              }}
                            >
                              <FaPlus size={12} />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <div className="text-end">
                            <span className="fw-bold" style={{ fontSize: "1.1rem", color: "#333" }}>
                              ₦{(item.price * item.qty).toLocaleString()}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="d-flex gap-2">
                            <Button
                              variant="link"
                              className="text-danger"
                              onClick={() => handleRemoveClick(item)}
                              style={{ padding: "5px" }}
                            >
                              <FaTrash size={16} />
                            </Button>
                            <Button
                              variant="link"
                              className="text-primary"
                              onClick={() => handleSaveForLater(item)}
                              style={{ padding: "5px" }}
                            >
                              <FaHeart size={16} />
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Saved for Later */}
          {savedForLater.length > 0 && (
            <div className="mt-5">
              <h5 className="fw-bold mb-3">
                <FaHeart className="me-2" style={{ color: "#ef4444" }} />
                Saved for Later ({savedForLater.length})
              </h5>
              {savedForLater.map((item) => (
                <Card key={item.id} className="border-0 shadow-sm mb-2" style={{ borderRadius: "12px", opacity: 0.8 }}>
                  <Card.Body className="p-3">
                    <Row className="align-items-center">
                      <Col xs={2}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }}
                        />
                      </Col>
                      <Col xs={5}>
                        <h6 className="fw-bold mb-1">{item.name}</h6>
                        <small className="text-muted">₦{item.price.toLocaleString()}</small>
                      </Col>
                      <Col xs={5} className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleMoveToCart(item)}
                          style={{ borderRadius: "20px" }}
                        >
                          Move to Cart
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ borderRadius: "16px", top: "20px" }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Order Summary</h5>

              {/* Coupon Code */}
              <div className="mb-4">
                <Form.Group>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      style={{ borderRadius: "12px" }}
                    />
                    <Button
                      variant="primary"
                      onClick={applyCoupon}
                      disabled={!couponCode || couponApplied || loading}
                      style={{ borderRadius: "12px", minWidth: "80px" }}
                    >
                      {loading ? <FaSpinner className="spinner" /> : "Apply"}
                    </Button>
                  </div>
                </Form.Group>
                {couponApplied && (
                  <div className="mt-2 text-success">
                    <FaCheckCircle className="me-1" />
                    Coupon applied successfully!
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-bold">₦{total.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount</span>
                    <span>-₦{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-bold">
                    {shippingCost === 0 ? "Free" : `₦${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span className="h5 fw-bold">Total</span>
                  <span className="h5 fw-bold text-primary">₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button - UPDATED to use handleCheckout */}
              <Button
                className="w-100 mb-3"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  padding: "15px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  borderRadius: "12px"
                }}
                onClick={handleCheckout} // ← Changed from setShowCheckoutModal to handleCheckout
              >
                Proceed to Checkout
                <FaArrowRight className="ms-2" />
              </Button>

              {/* Payment Methods */}
              <div className="text-center">
                <small className="text-muted d-block mb-2">We accept</small>
                <div className="d-flex justify-content-center gap-3">
                  <FaCcVisa size={30} color="#1a1f71" />
                  <FaCcMastercard size={30} color="#eb001b" />
                  <FaCcPaypal size={30} color="#003087" />
                  <FaGooglePay size={30} color="#4285f4" />
                  <FaApplePay size={30} color="#000" />
                </div>
              </div>

              {/* Secure Checkout */}
              <div className="mt-3 text-center">
                <FaLock className="me-1 text-muted" size={12} />
                <small className="text-muted">Secure Checkout</small>
              </div>
            </Card.Body>
          </Card>

          {/* Suggested Products */}
          <Card className="border-0 shadow-sm mt-4" style={{ borderRadius: "16px" }}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3">You might also like</h6>
              {getSuggestedProducts().map((product) => (
                <div key={product.id} className="d-flex align-items-center gap-3 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <small className="fw-bold d-block">{product.name}</small>
                    <small className="text-primary">₦{product.price.toLocaleString()}</small>
                  </div>
                  <Button variant="outline-primary" size="sm" style={{ borderRadius: "20px" }}>
                    Add
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Remove Confirmation Modal */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} centered>
        <Modal.Header closeButton style={{ border: "none" }}>
          <Modal.Title className="fw-bold">
            <FaExclamationCircle className="text-warning me-2" />
            Remove Item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <p>Are you sure you want to remove this item from your cart?</p>
          {selectedItem && (
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                style={{ width: "50px", height: "50px", borderRadius: "8px" }}
              />
              <div>
                <small className="fw-bold d-block">{selectedItem.name}</small>
                <small>₦{selectedItem.price.toLocaleString()}</small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <Button variant="secondary" onClick={() => setShowRemoveModal(false)} style={{ borderRadius: "10px" }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemove} style={{ borderRadius: "10px" }}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style jsx="true">{`
        .cart-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .sticky-top {
          position: sticky;
          top: 20px;
        }

        @media (max-width: 768px) {
          .sticky-top {
            position: relative;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
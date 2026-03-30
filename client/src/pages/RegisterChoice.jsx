// src/pages/RegisterChoice.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaStore, FaArrowRight } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RegisterChoice = () => {
  return (
    <>
      <Navbar />
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #f0f7ff 0%, #e1f0ff 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container>
          <div className="text-center mb-5">
            <h1 className="fw-bold mb-3" style={{ color: "#0d3b66" }}>Join MarketSphere</h1>
            <p className="text-muted fs-5">Choose how you want to be part of our marketplace</p>
          </div>

          <Row className="justify-content-center g-4">
            {/* Buyer Card */}
            <Col md={5}>
              <Card className="border-0 shadow-lg h-100" style={{ borderRadius: "24px", overflow: "hidden" }}>
                <Card.Body className="p-5 text-center">
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
                    <FaShoppingBag size={40} className="text-primary" />
                  </div>
                  <h3 className="fw-bold mb-3">I want to BUY</h3>
                  <p className="text-muted mb-4">
                    Discover amazing products, shop from trusted sellers,
                    and enjoy a seamless shopping experience.
                  </p>
                  <ul className="text-start mb-4">
                    <li className="mb-2">✓ Browse thousands of products</li>
                    <li className="mb-2">✓ Secure checkout with Paystack</li>
                    <li className="mb-2">✓ Track your orders</li>
                    <li className="mb-2">✓ Save items to wishlist</li>
                  </ul>
                  <Link to="/register/buyer">
                    <Button 
                      className="w-100 py-3"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "600"
                      }}
                    >
                      Register as Buyer <FaArrowRight className="ms-2" />
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            {/* Seller Card */}
            <Col md={5}>
              <Card className="border-0 shadow-lg h-100" style={{ borderRadius: "24px", overflow: "hidden" }}>
                <Card.Body className="p-5 text-center">
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
                    <FaStore size={40} className="text-primary" />
                  </div>
                  <h3 className="fw-bold mb-3">I want to SELL</h3>
                  <p className="text-muted mb-4">
                    Start your online business, reach thousands of customers,
                    and grow your brand with MarketSphere.
                  </p>
                  <ul className="text-start mb-4">
                    <li className="mb-2">✓ Create your online store</li>
                    <li className="mb-2">✓ List unlimited products</li>
                    <li className="mb-2">✓ Manage orders easily</li>
                    <li className="mb-2">✓ Access sales analytics</li>
                  </ul>
                  <Link to="/register/seller">
                    <Button 
                      className="w-100 py-3"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "600"
                      }}
                    >
                      Register as Seller <FaArrowRight className="ms-2" />
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <p className="text-muted">
              Already have an account? <Link to="/login" className="text-primary fw-bold">Login here</Link>
            </p>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default RegisterChoice;
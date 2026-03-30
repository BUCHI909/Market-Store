// src/pages/BecomeSeller.jsx
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Spinner } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { BsCart4, BsPersonFill, BsEnvelopeFill, BsTelephoneFill, BsShop } from "react-icons/bs";

const BecomeSeller = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    shopName: "",
    shopDescription: "",
    document: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "document") {
      setFormData({ ...formData, document: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const res = await axios.post(
        "http://localhost:5000/api/auth/become-seller",
        data,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message || "Application submitted successfully!");
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit application");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #f0f7ff 0%, #e1f0ff 100%)",
          minHeight: "100vh",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6} data-aos="fade-up">
              <div
                className="p-5 shadow-lg rounded-4"
                style={{
                  background: "#ffffff",
                  border: "1px solid #d0e4ff",
                }}
              >
                {/* Header */}
                <div className="text-center mb-4">
                  <BsCart4 className="display-3 text-primary mb-2" />
                  <h3 className="fw-bold" style={{ color: "#0d3b66" }}>
                    Become a Seller
                  </h3>
                  <p className="text-muted">
                    Fill out the form below to start selling on MarketSphere
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  {[
                    { label: "Full Name", name: "name", type: "text", icon: <BsPersonFill /> },
                    { label: "Email", name: "email", type: "email", icon: <BsEnvelopeFill /> },
                    { label: "Phone Number", name: "phone", type: "text", icon: <BsTelephoneFill /> },
                    { label: "Shop Name", name: "shopName", type: "text", icon: <BsShop /> },
                  ].map((field, idx) => (
                    <Form.Group className="mb-3" key={idx}>
                      <Form.Label>{field.label}</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-primary text-white">{field.icon}</InputGroup.Text>
                        <Form.Control
                          type={field.type}
                          name={field.name}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  ))}

                  {/* Shop Description */}
                  <Form.Group className="mb-3">
                    <Form.Label>Shop Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="shopDescription"
                      placeholder="Briefly describe your shop"
                      value={formData.shopDescription}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Upload Document */}
                  <Form.Group className="mb-4">
                    <Form.Label>Business Document / ID</Form.Label>
                    <Form.Control
                      type="file"
                      name="document"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-100 py-2 text-white"
                    style={{ background: "linear-gradient(90deg, #0d6efd, #6610f2)" }}
                    disabled={loading}
                  >
                    {loading && <Spinner animation="border" size="sm" className="me-2" />}
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>

                  <div className="text-center mt-3">
                    <a href="/login" className="text-decoration-none" style={{ color: "#0d6efd" }}>
                      Already have an account? Login
                    </a>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />

      {/* Additional Hover Effects */}
      <style>
        {`
          input:focus, textarea:focus {
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
            border-color: #0d6efd;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
        `}
      </style>
    </>
  );
};

export default BecomeSeller;
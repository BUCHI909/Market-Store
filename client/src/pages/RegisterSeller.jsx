// src/pages/RegisterSeller.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaStore, FaPhone, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "https://market-store-2eop.onrender.com"; // ✅ FIXED: Using Render URL

const RegisterSeller = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    shopName: "",
    shopDescription: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getAlertIcon = () => {
    if (alert.type === "success") return <FaCheckCircle className="me-2" />;
    if (alert.type === "danger") return <FaExclamationCircle className="me-2" />;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: "danger", message: "Passwords do not match!" });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/api/auth/register-seller`,  // ✅ FIXED: Using Render URL
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          shopName: formData.shopName,
          shopDescription: formData.shopDescription
        },
        { withCredentials: true }
      );

      setAlert({ type: "success", message: "Seller account created! Redirecting to login..." });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setAlert({ type: "danger", message: err.response?.data?.message || "Registration failed" });
    } finally {
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
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="p-5 shadow-lg rounded-4" style={{ background: "#fff", border: "1px solid #d0e4ff" }}>
                <div className="text-center mb-4">
                  <FaStore className="display-3 text-primary mb-2" />
                  <h2 className="fw-bold" style={{ color: "#0d3b66" }}>Create Seller Account</h2>
                  <p className="text-muted">Start your online business today</p>
                </div>

                {alert.message && (
                  <div className={`d-flex align-items-center mb-3 p-3 rounded-3 text-white`}
                    style={{ background: alert.type === "success" ? "#28a745" : "#dc3545" }}>
                    {getAlertIcon()}
                    <span>{alert.message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <h6 className="fw-bold mb-3">Personal Information</h6>

                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white"><FaUser /></span>
                    <input type="text" name="name" className="form-control" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white"><FaEnvelope /></span>
                    <input type="email" name="email" className="form-control" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                  </div>

                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white"><FaPhone /></span>
                    <input type="tel" name="phone" className="form-control" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                  </div>

                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white"><FaLock /></span>
                    <input type="password" name="password" className="form-control" placeholder="Password" value={formData.password} onChange={handleChange} required />
                  </div>

                  <div className="mb-4 input-group">
                    <span className="input-group-text bg-primary text-white"><FaLock /></span>
                    <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                  </div>

                  <h6 className="fw-bold mb-3 mt-4">Store Information</h6>

                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white"><FaStore /></span>
                    <input type="text" name="shopName" className="form-control" placeholder="Store Name" value={formData.shopName} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <textarea name="shopDescription" rows={3} className="form-control" placeholder="Store Description (what will you sell?)" value={formData.shopDescription} onChange={handleChange} required />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 py-2 text-white"
                    style={{ background: "linear-gradient(90deg, #0d6efd, #6610f2)", fontWeight: "600" }}
                    disabled={loading}
                  >
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Register as Seller"}
                  </button>

                  <div className="text-center mt-3">
                    <Link to="/register" className="text-decoration-none"><FaArrowLeft className="me-1" /> Back to registration options</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default RegisterSeller;
// src/pages/RegisterBuyer.jsx
import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "https://market-store-2eop.onrender.com"; // ✅ FIXED: Using Render URL

const RegisterBuyer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      await axios.post(
        `${API_URL}/api/auth/register-buyer`,  // ✅ FIXED: Using Render URL
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        },
        { withCredentials: true }
      );
      setAlert({ type: "success", message: "Registration successful! Redirecting to login..." });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setAlert({ type: "danger", message: err.response?.data?.message || "Registration failed 😢" });
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
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div
                className="p-5 shadow-lg rounded-4"
                style={{
                  background: "#fff",
                  border: "1px solid #d0e4ff",
                }}
              >
                <div className="text-center mb-4">
                  <FaUserPlus className="display-3 text-primary mb-2" />
                  <h2 className="fw-bold" style={{ color: "#0d3b66" }}>
                    Create Buyer Account
                  </h2>
                  <p className="text-muted">
                    Join MarketSphere as a buyer and start shopping today!
                  </p>
                </div>

                {alert.message && (
                  <div
                    className={`d-flex align-items-center mb-3 p-3 rounded-3 shadow-sm text-white`}
                    style={{
                      background: alert.type === "success"
                        ? "linear-gradient(90deg, #28a745, #218838)"
                        : "linear-gradient(90deg, #dc3545, #b02a37)",
                    }}
                  >
                    {getAlertIcon()}
                    <span>{alert.message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white"><FaUser /></span>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white"><FaEnvelope /></span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white"><FaLock /></span>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4 input-group">
                    <span className="input-group-text bg-primary text-white"><FaLock /></span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 py-2 text-white d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background: "linear-gradient(90deg, #0d6efd, #6610f2)",
                      fontWeight: "600",
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <><FaUserPlus /> Register as Buyer</>
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <Link to="/register" className="text-decoration-none">
                      <FaArrowLeft className="me-1" /> Back to registration options
                    </Link>
                  </div>

                  <p className="text-center text-muted small mt-3">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-bold">
                      Login Here
                    </Link>
                  </p>
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

export default RegisterBuyer;
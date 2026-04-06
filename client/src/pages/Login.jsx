// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../utils/api.js"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser, checkAuthStatus } = useAuth(); // Added checkAuthStatus
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

 

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

 // In Login.jsx, replace the handleSubmit function with this:

const handleSubmit = async (e) => {
  e.preventDefault();
  setAlert({ type: "", message: "" });
  
  try {
    setLoading(true);
    const res = await loginUser(formData);
    
    console.log('Login response:', res.data);
    
    // ✅ FIXED: Check if setUser exists before calling it
    if (setUser && typeof setUser === 'function') {
      setUser(res.data.user);
    } else {
      console.error('setUser is not a function! Check AuthContext');
    }
    
    setAlert({ 
      type: "success", 
      message: "Login successful! Redirecting to dashboard..." 
    });
    
  } catch (err) {
    console.error('Login error:', err);
    setAlert({ 
      type: "danger", 
      message: err.response?.data?.message || "Login failed 😢" 
    });
  } finally {
    setLoading(false);
  }
};

// Also fix the useEffect dependency (remove alert from dependencies):
useEffect(() => {
  if (user && user.role) {  // ✅ FIXED: Check for user.role instead of alert.type
    const userRole = user.role;
    console.log("User role after login:", userRole);
    
    const pendingProduct = localStorage.getItem('pendingProduct');
    if (pendingProduct) {
      localStorage.removeItem('pendingProduct');
      const product = JSON.parse(pendingProduct);
      setTimeout(() => navigate("/cart"), 1500);
      return;
    }
    
    if (userRole === 'seller') {
      setTimeout(() => navigate("/seller"), 1500);
    } else if (userRole === 'admin') {
      setTimeout(() => navigate("/admin"), 1500);
    } else {
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  }
}, [user, navigate]);  // ✅ FIXED: Removed 'alert' from dependencies

  const getAlertIcon = () => {
    if (alert.type === "success") return <FaCheckCircle className="me-2" />;
    if (alert.type === "danger") return <FaExclamationCircle className="me-2" />;
    return null;
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
            <div className="col-md-6 col-lg-5" data-aos="fade-up">
              <div
                className="p-5 shadow-lg rounded-4 glass-card"
                style={{
                  background: "#fff",
                  border: "1px solid #d0e4ff",
                }}
              >
                <div className="text-center mb-4">
                  <FaLock className="display-3 text-primary mb-2" />
                  <h2 className="fw-bold" style={{ color: "#0d3b66" }}>
                    Login to MarketSphere
                  </h2>
                  <p className="text-muted">
                    Welcome back! Enter your credentials to access your account and start trading instantly.
                  </p>
                </div>

                {alert.message && (
                  <div
                    className={`d-flex align-items-center mb-3 p-3 rounded-3 shadow-sm text-white`}
                    style={{
                      background: alert.type === "success"
                        ? "linear-gradient(90deg, #28a745, #218838)"
                        : "linear-gradient(90deg, #dc3545, #b02a37)",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  >
                    {getAlertIcon()}
                    <span>{alert.message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 input-group">
                    <span
                      className="input-group-text bg-primary text-white"
                      style={{ borderRight: "0" }}
                    >
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ borderLeft: "0" }}
                    />
                  </div>

                  <div className="mb-4 input-group">
                    <span
                      className="input-group-text bg-primary text-white"
                      style={{ borderRight: "0" }}
                    >
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ borderLeft: "0" }}
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
                      <><FaSignInAlt /> Login</>
                    )}
                  </button>

                  <p className="text-center text-muted small mt-3">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary fw-bold">
                      Register Here
                    </Link>
                  </p>

                  <p className="text-center text-muted small">
                    <Link to="/forgot-password" className="text-primary fw-bold">
                      Forgot Password?
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
            input:focus {
              box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
              border-color: #0d6efd;
            }
            .btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
          `}
        </style>
      </section>

      <Footer />
    </>
  );
};

export default Login;
// src/pages/Register.jsx
import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" }); // New alert state

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const getAlertIcon = () => {
    if (alert.type === "success") return <FaCheckCircle className="me-2" />;
    if (alert.type === "danger") return <FaExclamationCircle className="me-2" />;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" }); // reset on new submit
    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: "danger", message: "Passwords do not match!" });
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { withCredentials: true }
      );
      setAlert({ type: "success", message: "Registration successful! Redirecting to login..." });
      setTimeout(() => navigate("/login"), 1500); // redirect after short delay
    } catch (err) {
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
            <div className="col-md-6 col-lg-5" data-aos="fade-up">
              <div
                className="p-5 shadow-lg rounded-4 glass-card"
                style={{
                  background: "#fff",
                  border: "1px solid #d0e4ff",
                }}
              >
                {/* Header */}
                <div className="text-center mb-4">
                  <FaUserPlus className="display-3 text-primary mb-2" />
                  <h2 className="fw-bold" style={{ color: "#0d3b66" }}>
                    Create Your MarketSphere Account
                  </h2>
                  <p className="text-muted">
                    Join our marketplace to buy and sell nationwide. Your journey to seamless transactions starts here!
                  </p>
                </div>

                {/* Dynamic Alert Card */}
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
                  {/* FULL NAME */}
                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white" style={{ borderRight: "0" }}>
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{ borderLeft: "0" }}
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white" style={{ borderRight: "0" }}>
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

                  {/* PASSWORD */}
                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-primary text-white" style={{ borderRight: "0" }}>
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

                  {/* CONFIRM PASSWORD */}
                  <div className="mb-4 input-group">
                    <span className="input-group-text bg-primary text-white" style={{ borderRight: "0" }}>
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ borderLeft: "0" }}
                    />
                  </div>

                  {/* Register Button with Icon */}
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
                      <><FaUserPlus /> Register</>
                    )}
                  </button>

                  <p className="text-center text-muted small mt-3">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-bold">
                      Login Here
                    </Link>
                  </p>
                </form>

                <hr />

                <div className="text-center mt-3">
                  <p className="text-muted small">
                    By registering, you agree to our{" "}
                    <Link to="/" className="text-primary">Terms of Service</Link> and{" "}
                    <Link to="/" className="text-primary">Privacy Policy</Link>.
                  </p>
                </div>
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

export default Register;
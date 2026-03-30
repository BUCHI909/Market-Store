import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaShoppingCart, FaStore, FaLifeRing } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="pt-5 pb-3"
      style={{
        background: "linear-gradient(180deg, #0d6efd, #e6f2ff)",
        color: "#fff",
        fontFamily: "Poppins, sans-serif",
        position: "relative",
      }}
    >
      <div className="container">

        <div className="row">

          {/* Brand Section */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold" style={{ fontSize: "1.5rem" }}>
              Market<span style={{ color: "#ffffff" }}>Sphere</span>
            </h5>
            <p style={{ color: "#f0f8ff" }}>
              Nigeria’s trusted online marketplace connecting buyers and sellers nationwide.
            </p>

            <div className="d-flex gap-3 mt-2">
              <FaFacebookF style={{ cursor: "pointer", fontSize: "1.2rem" }} />
              <FaTwitter style={{ cursor: "pointer", fontSize: "1.2rem" }} />
              <FaInstagram style={{ cursor: "pointer", fontSize: "1.2rem" }} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <FaShoppingCart className="me-2" /> 
                <a href="#" style={{ color: "#f0f8ff", textDecoration: "none" }}>Shop</a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaStore className="me-2" /> 
                <a href="#" style={{ color: "#f0f8ff", textDecoration: "none" }}>Become Seller</a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaLifeRing className="me-2" /> 
                <a href="#" style={{ color: "#f0f8ff", textDecoration: "none" }}>Support</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-3">Newsletter</h6>
            <p style={{ color: "#f0f8ff" }}>
              Subscribe to receive updates and special offers.
            </p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Your email"
                style={{ borderRadius: "0.25rem 0 0 0.25rem", border: "none" }}
              />
              <button
                className="btn"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0d6efd",
                  fontWeight: "600",
                  borderRadius: "0 0.25rem 0.25rem 0",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e6f2ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                }}
              >
                Subscribe
              </button>
            </div>
          </div>

        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

        <div className="text-center" style={{ fontSize: "0.9rem", color: "#f0f8ff" }}>
          © {new Date().getFullYear()} MarketSphere. All rights reserved.
        </div>

      </div>
    </footer>
  );
};


export default Footer;



import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaStore } from "react-icons/fa";

const CallToAction = () => (
  <section
    className="py-5"
    style={{
      background: "linear-gradient(135deg, #e6f2ff, #0d6efd)",
      color: "#fff",
      fontFamily: "Poppins, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div className="container text-center" data-aos="zoom-in">
      <h2
        className="fw-bold mb-4"
        style={{
          fontSize: "2.5rem",
          lineHeight: "1.3",
          color: "#ffffff",
          textShadow: "1px 1px 6px rgba(0,0,0,0.2)",
        }}
      >
        Ready to Start Shopping or Selling?
      </h2>
      <p
        className="mb-4 mx-auto"
        style={{
          maxWidth: "750px",
          fontSize: "1.05rem",
          lineHeight: "1.7",
          color: "#f0f8ff",
        }}
      >
        Join MarketSphere today and experience the future of online commerce in Nigeria. 
        Discover thousands of products, sell your own items to a nationwide audience, 
        and enjoy a seamless shopping experience with secure payments, fast delivery, and dedicated support.
      </p>

      <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
        <Link
          to="/shop"
          className="btn btn-light btn-lg d-flex align-items-center gap-2 px-5"
          style={{
            fontWeight: "600",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <FaShoppingCart />
          Shop Now
        </Link>

        <Link
          to="/become-seller"
          className="btn btn-outline-light btn-lg d-flex align-items-center gap-2 px-5"
          style={{
            fontWeight: "600",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <FaStore />
          Become a Seller
        </Link>
      </div>

      {/* Decorative Floating Icons */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          fontSize: "6rem",
          color: "rgba(255,255,255,0.1)",
          zIndex: 0,
        }}
      >
        🛒
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "-20px",
          left: "-20px",
          fontSize: "6rem",
          color: "rgba(255,255,255,0.1)",
          zIndex: 0,
        }}
      >
        🏬
      </div>
    </div>
  </section>
);

export default CallToAction;
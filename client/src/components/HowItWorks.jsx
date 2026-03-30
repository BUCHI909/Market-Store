import React from "react";
import { Row, Col } from "react-bootstrap";

const steps = [
  { step: 1, title: "Browse Products", desc: "Discover thousands of products across multiple categories. Filter, search, and compare to find exactly what you need." },
  { step: 2, title: "Add to Cart", desc: "Easily add your favorite items to your cart and review your selections before checkout. Save items for later or create wishlists." },
  { step: 3, title: "Secure Checkout", desc: "Pay safely with our secure payment gateway. We accept cards, bank transfers, and mobile wallets. Track your order in real-time." },
  { step: 4, title: "Receive Your Order", desc: "Sit back and relax as your order is delivered straight to your door quickly and reliably. Enjoy hassle-free returns if needed." },
];

const HowItWorks = () => (
  <section
    className="py-5"
    style={{
      background: "linear-gradient(180deg, #ffffff 0%, #e6f2ff 100%)",
    }}
  >
    <div className="container" data-aos="fade-up">
      {/* Section Title */}
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: "#0d3b66", fontSize: "2.5rem" }}>
          How It Works
        </h2>
        <p
          className="text-muted mx-auto"
          style={{ maxWidth: "800px", fontSize: "1.05rem" }}
        >
          Shopping on MarketSphere is simple, fast, and safe. Follow these easy steps to find, buy, and enjoy your products with confidence.
        </p>
      </div>

      <Row className="g-4 justify-content-center">
        {steps.map((item, idx) => (
          <Col key={idx} md={3} data-aos="fade-up" data-aos-delay={idx * 150}>
            <div
              className="glass-card p-4 text-center h-100"
              style={{
                borderRadius: "15px",
                background: "#ffffffd0",
                boxShadow: "0 6px 15px rgba(13, 54, 102, 0.15)",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-7px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 25px rgba(13, 54, 102, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 15px rgba(13, 54, 102, 0.15)";
              }}
            >
              {/* Step Circle */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "0 auto 20px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0d6efd, #6610f2)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                }}
              >
                {item.step}
              </div>

              <h5 className="fw-bold mb-2" style={{ color: "#0d3b66" }}>
                {item.title}
              </h5>
              <p className="text-muted" style={{ fontSize: "0.95rem" }}>
                {item.desc}
              </p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  </section>
);

export default HowItWorks;
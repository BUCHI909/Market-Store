import React from "react";
import { Row, Col } from "react-bootstrap";
import { 
  FaCheckCircle, 
  FaShippingFast, 
  FaLock, 
  FaHeadset, 
  FaUndoAlt, 
  FaGift 
} from "react-icons/fa";

const points = [
  { icon: <FaCheckCircle />, title: "Trusted Vendors", desc: "All sellers are verified to ensure you only buy from reputable vendors, reducing risk and fraud." },
  { icon: <FaShippingFast />, title: "Fast Delivery", desc: "Our logistics partners deliver your products quickly and reliably across Nigeria." },
  { icon: <FaLock />, title: "Secure Payments", desc: "All transactions are encrypted, and your payment information is never shared." },
  { icon: <FaHeadset />, title: "24/7 Support", desc: "Our support team is always available to answer questions, resolve issues, and provide guidance." },
  { icon: <FaUndoAlt />, title: "Return & Refund", desc: "Easy returns and refunds make shopping risk-free. Satisfaction is guaranteed." },
  { icon: <FaGift />, title: "Exclusive Deals", desc: "Enjoy discounts, special promotions, and limited-time offers regularly." },
];

const WhyChooseUs = () => (
  <section
    className="py-5"
    style={{
      background: "linear-gradient(180deg, #ffffff 0%, #e6f2ff 100%)"
    }}
  >
    <div className="container" data-aos="fade-up">
      {/* Section Title */}
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: "#0d3b66", fontSize: "2.5rem" }}>
          Why Choose MarketSphere
        </h2>
        <p
          className="text-muted mx-auto"
          style={{ maxWidth: "800px", fontSize: "1.05rem" }}
        >
          Thousands of customers trust MarketSphere for secure, fast, and reliable online shopping. Here’s why you should too.
        </p>
      </div>

      {/* Feature Cards */}
      <Row className="g-4 justify-content-center">
        {points.map((point, idx) => (
          <Col key={idx} md={4} data-aos="fade-up" data-aos-delay={idx * 150}>
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
              {/* Icon Circle */}
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
                }}
              >
                {point.icon}
              </div>

              <h5 className="fw-bold mb-3" style={{ color: "#0d3b66" }}>
                {point.title}
              </h5>
              <p className="text-muted" style={{ fontSize: "0.95rem" }}>
                {point.desc}
              </p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  </section>
);

export default WhyChooseUs;
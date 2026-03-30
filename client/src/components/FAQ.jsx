import React from "react";
import { Accordion } from "react-bootstrap";

const faqs = [
  { q: "How do I create an account?", a: "Click on the Register button, fill in your details, verify your email, and start shopping immediately. You can also save your favorites and track your orders easily." },
  { q: "How do I become a seller?", a: "Click Become a Seller, fill the application form, provide required documents, and wait for approval. Once approved, you can list products and reach thousands of customers." },
  { q: "What payment methods are available?", a: "We support debit/credit cards, bank transfers, and mobile wallets. All transactions are encrypted and secure." },
  { q: "Is my data secure?", a: "Absolutely. We use top-level encryption and secure servers to protect your personal and financial information." },
  { q: "Can I return products?", a: "Yes. MarketSphere has an easy returns and refund process. Simply submit a request, and we’ll guide you step by step." },
  { q: "How do I track my order?", a: "After checkout, you can view your order in the dashboard and receive real-time updates on shipping and delivery." },
];

const FAQ = () => (
  <section
    className="py-5"
    style={{
      background: "linear-gradient(180deg, #ffffff 0%, #e6f2ff 100%)",
      fontFamily: "Poppins, sans-serif",
    }}
  >
    <div className="container" data-aos="fade-up">
      {/* Section Title */}
      <div className="text-center mb-5">
        <h2 className="fw-bold" style={{ color: "#0d3b66", fontSize: "2.5rem" }}>
          Frequently Asked Questions
        </h2>
        <p className="text-muted mx-auto" style={{ maxWidth: "800px", fontSize: "1.05rem" }}>
          Answers to the most common questions about using MarketSphere.
        </p>
      </div>

      {/* Accordion */}
      <Accordion defaultActiveKey="0" flush>
        {faqs.map((item, idx) => (
          <Accordion.Item
            eventKey={idx.toString()}
            key={idx}
            style={{
              marginBottom: "15px",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#ffffff",
              boxShadow: "0 6px 15px rgba(13, 54, 102, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 25px rgba(13, 54, 102, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 15px rgba(13, 54, 102, 0.1)";
            }}
          >
            <Accordion.Header style={{ color: "#0d3b66", fontWeight: "600" }}>
              {item.q}
            </Accordion.Header>
            <Accordion.Body style={{ color: "#555", fontSize: "1rem", lineHeight: "1.6" }}>
              {item.a}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
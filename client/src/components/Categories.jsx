import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { FaLaptop, FaTshirt, FaHome, FaMobileAlt, FaFutbol, FaSpa, FaChild, FaCar } from "react-icons/fa";

const categories = [
  { name: "Electronics", icon: <FaLaptop />, image: "https://images.unsplash.com/photo-1518443895914-6d8b6f28f8c4", desc: "Latest gadgets, devices, and electronics at unbeatable prices." },
  { name: "Fashion", icon: <FaTshirt />, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", desc: "Trendy clothes, shoes, and accessories for all styles." },
  { name: "Home & Living", icon: <FaHome />, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7", desc: "Everything you need to make your house a home." },
  { name: "Gadgets", icon: <FaMobileAlt />, image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db", desc: "Smart devices and accessories for tech lovers." },
  { name: "Sports", icon: <FaFutbol />, image: "https://images.unsplash.com/photo-1599058917212-7c56f30d76f2", desc: "Equipment and apparel for all your fitness and sporting needs." },
  { name: "Beauty", icon: <FaSpa />, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3", desc: "Cosmetics, skincare, and grooming products to look your best." },
  { name: "Toys & Kids", icon: <FaChild />, image: "https://images.unsplash.com/photo-1580910051077-f0ab403f7a40", desc: "Fun, safe, and educational toys for children of all ages." },
  { name: "Automotive", icon: <FaCar />, image: "https://images.unsplash.com/photo-1614697867529-ec0a26f849d2", desc: "Car accessories, tools, and gadgets to keep you moving." },
];

const Categories = () => {
  return (
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
            Shop by Category
          </h2>
          <p
            className="text-muted mx-auto"
            style={{ maxWidth: "800px", fontSize: "1.05rem" }}
          >
            Explore our wide selection of product categories. From electronics and fashion to home essentials, sports equipment, and beauty products — everything you need is just a click away. Discover the perfect products for yourself or your loved ones.
          </p>
        </div>

        {/* Category Cards */}
        <Row className="g-4">
          {categories.map((cat, idx) => (
            <Col key={idx} xs={6} sm={4} md={3}>
              <Card
                className="h-100 text-center p-3 glass-card shadow-lg"
                data-aos="zoom-in"
                data-aos-delay={idx * 100}
                style={{
                  borderRadius: "15px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                  background: "#ffffffd0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 12px 25px rgba(13, 54, 102, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 15px rgba(13, 54, 102, 0.15)";
                }}
              >
                <div
                  className="mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#0d6efd10",
                    color: "#0d6efd",
                    fontSize: "1.8rem",
                    margin: "0 auto",
                  }}
                >
                  {cat.icon}
                </div>
                <Card.Img
                  src={cat.image}
                  alt={cat.name}
                  className="mb-3 rounded"
                  style={{ height: "140px", objectFit: "cover" }}
                />
                <Card.Body>
                  <h6 className="fw-bold text-dark">{cat.name}</h6>
                  <p className="text-muted small">{cat.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Categories;
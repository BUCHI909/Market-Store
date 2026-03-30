import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  { 
    name: "Aisha Bello", 
    text: "MarketSphere made selling my handmade goods easy and fast! The verification process was smooth, and I started getting orders within days.",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  { 
    name: "Chinedu Okeke", 
    text: "I found everything I needed in one place. The product selection, secure payment, and quick delivery make MarketSphere my favorite shopping platform.",
    image: "https://randomuser.me/api/portraits/men/75.jpg"
  },
  { 
    name: "Fatima Musa", 
    text: "Secure payments and fast delivery – MarketSphere never disappoints. Their customer support helped me track a delayed shipment efficiently.",
    image: "https://randomuser.me/api/portraits/women/45.jpg"
  },
  { 
    name: "Tunde Adedayo", 
    text: "As a seller, MarketSphere helped me grow my business and reach thousands of customers. The dashboard is easy to use and very intuitive.",
    image: "https://randomuser.me/api/portraits/men/34.jpg"
  },
];

const Testimonials = () => (
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
          What Our Customers Say
        </h2>
        <p
          className="text-muted mx-auto"
          style={{ maxWidth: "800px", fontSize: "1.05rem" }}
        >
          Hear from our satisfied users across Nigeria who love shopping and selling on MarketSphere.
        </p>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        loop={true}
      >
        {testimonials.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="glass-card p-4 text-center mx-auto"
              style={{
                maxWidth: "650px",
                borderRadius: "15px",
                background: "#ffffffd0",
                boxShadow: "0 6px 20px rgba(13, 54, 102, 0.15)",
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
                  "0 6px 20px rgba(13, 54, 102, 0.15)";
              }}
            >
              {/* Customer Image */}
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  marginBottom: "20px",
                  border: "3px solid #0d6efd",
                }}
              />

              <p className="fst-italic" style={{ fontSize: "1rem", color: "#333" }}>
                "{item.text}"
              </p>
              <h6 className="fw-bold mt-3" style={{ color: "#0d3b66" }}>
                {item.name}
              </h6>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default Testimonials;
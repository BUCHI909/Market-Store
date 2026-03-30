import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaShoppingCart, FaTag, FaUserCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Trending = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Replace these URLs with actual product images from your database or assets
  const products = [
    {
      name: "Sony Wireless Headphones",
      price: 45000,
      image: "https://images.unsplash.com/photo-1518443895914-6d8b6f28f8c4"
    },
    {
      name: "Apple Smart Watch",
      price: 120000,
      image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b"
    },
    {
      name: "Nike Premium Sneakers",
      price: 65000,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
      name: "PlayStation 5 Console",
      price: 550000,
      image: "https://images.unsplash.com/photo-1606813909354-3c7f05b60c4f"
    },
    {
      name: "Modern Office Chair",
      price: 80000,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7"
    },
    {
      name: "Luxury Leather Handbag",
      price: 50000,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3"
    },
    {
      name: "4K LED TV",
      price: 350000,
      image: "https://images.unsplash.com/photo-1614697867529-ec0a26f849d2"
    },
    {
      name: "Laptop Backpack",
      price: 15000,
      image: "https://images.unsplash.com/photo-1580910051077-f0ab403f7a40"
    }
  ];

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

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
            Trending Products
          </h2>
          <p
            className="text-muted mx-auto"
            style={{ maxWidth: "700px", fontSize: "1.05rem" }}
          >
            Explore high-quality items with competitive pricing, trusted vendors, 
            and the latest trends in electronics, fashion, and lifestyle essentials.
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          breakpoints={{
            576: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <div
                className="card shadow-lg h-100"
                style={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  border: "1px solid #0d6efd20",
                  transition: "transform 0.3s",
                  cursor: "pointer",
                  background: "#ffffff",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {/* Product Image */}
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "240px", objectFit: "cover" }}
                />

                {/* Card Body */}
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold text-dark">{product.name}</h6>
                  <p className="text-primary fw-semibold mb-2">
                    <FaTag className="me-1" /> ₦{product.price.toLocaleString()}
                  </p>
                  <p className="text-muted mb-3">
                    <FaUserCheck className="me-1 text-primary" />
                    Verified Vendor
                  </p>

                  <button
                    className="btn btn-primary mt-auto d-flex align-items-center justify-content-center"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart className="me-2" /> Add to Cart
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Trending;
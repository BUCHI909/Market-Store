// src/pages/Shop.jsx
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaTag,
  FaLaptop,
  FaTshirt,
  FaMobileAlt,
  FaBoxes,
  FaHeart,
  FaStar,
  FaEye,
  FaFilter,
  FaSort,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaGift,
  FaTruck,
  FaShieldAlt,
  FaArrowRight,
  FaWhatsapp
} from "react-icons/fa";
import axios from "axios";

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const isDashboard = location.pathname.includes('/dashboard');

  const allProducts = [
    // ELECTRONICS
    {
      id: 1,
      name: "Sony Wireless Headphones",
      price: 45000,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1518443895914-6d8b6f28f8c4",
      rating: 4.5,
      reviews: 128,
      discount: 15,
      featured: true,
      new: true
    },
    {
      id: 2,
      name: "Samsung 55\" Smart TV",
      price: 380000,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1593784991095-a205069470b6",
      rating: 4.8,
      reviews: 89,
      discount: 10,
      featured: true
    },
    {
      id: 3,
      name: "Canon DSLR Camera",
      price: 420000,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      rating: 4.6,
      reviews: 56,
      featured: false
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      price: 35000,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab",
      rating: 4.3,
      reviews: 234,
      discount: 20,
      new: true
    },

    // TECHNOLOGY
    {
      id: 5,
      name: "Apple Smart Watch",
      price: 120000,
      category: "Technology",
      image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
      rating: 4.7,
      reviews: 312,
      featured: true,
      new: true
    },
    {
      id: 6,
      name: "MacBook Pro Laptop",
      price: 950000,
      category: "Technology",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      rating: 4.9,
      reviews: 167,
      discount: 5
    },
    {
      id: 7,
      name: "iPhone 15 Pro",
      price: 1100000,
      category: "Technology",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484bce71",
      rating: 4.8,
      reviews: 423,
      featured: true
    },
    {
      id: 8,
      name: "PlayStation 5 Console",
      price: 550000,
      category: "Technology",
      image: "https://images.unsplash.com/photo-1606813909354-3c7f05b60c4f",
      rating: 4.9,
      reviews: 278,
      discount: 8,
      new: true
    },

    // FASHION
    {
      id: 9,
      name: "Nike Premium Sneakers",
      price: 65000,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      rating: 4.5,
      reviews: 189,
      featured: true
    },
    {
      id: 10,
      name: "Luxury Leather Handbag",
      price: 50000,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      rating: 4.4,
      reviews: 67,
      discount: 25
    },
    {
      id: 11,
      name: "Men's Designer Jacket",
      price: 75000,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1520975922327-7f6c06c1d4c2",
      rating: 4.3,
      reviews: 45,
      featured: false
    },
    {
      id: 12,
      name: "Women's Stylish Dress",
      price: 55000,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
      rating: 4.6,
      reviews: 98,
      new: true
    },

    // OTHERS
    {
      id: 13,
      name: "Modern Office Chair",
      price: 80000,
      category: "Others",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      rating: 4.2,
      reviews: 34,
      discount: 12
    },
    {
      id: 14,
      name: "Gaming Desk Setup",
      price: 180000,
      category: "Others",
      image: "https://images.unsplash.com/photo-1593642634367-d91a135587b5",
      rating: 4.7,
      reviews: 56,
      featured: true
    },
    {
      id: 15,
      name: "Smart Home LED Lights",
      price: 25000,
      category: "Others",
      image: "https://images.unsplash.com/photo-1507477338202-487281e6c27e",
      rating: 4.1,
      reviews: 167,
      discount: 30,
      new: true
    },
    {
      id: 16,
      name: "Travel Backpack",
      price: 30000,
      category: "Others",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      rating: 4.4,
      reviews: 89,
      featured: false
    }
  ];

  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState(allProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [wishlist, setWishlist] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const productsPerPage = 8;

  // Different backgrounds based on location
  const pageBackground = isDashboard
    ? "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  const cardBackground = isDashboard
    ? "#ffffff"
    : "rgba(255, 255, 255, 0.95)";

  // Check authentication first
  useEffect(() => {
    setFadeIn(true);

    // If not on dashboard and not logged in, redirect to login
    if (!isDashboard && !user) {
      navigate('/login', { state: { from: '/shop' } });
      return;
    }

    setAuthChecked(true);
  }, [user, navigate, isDashboard]);

  // Fetch products only after auth check passes
  useEffect(() => {
    if (!authChecked) return;
    if (!isDashboard && !user) return; // Don't fetch if not authenticated

    fetchProducts();
  }, [authChecked, user, isDashboard]);

  // src/pages/Shop.jsx
// Update the fetchProducts function to NOT require authentication

const fetchProducts = async () => {
  setLoading(true);
  try {
    console.log('Fetching products from API...');
    
    // ✅ REMOVE TOKEN REQUIREMENT - Make it public
    const res = await axios.get('http://localhost:5000/api/auth/products', {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    console.log('Products API response status:', res.status);
    
    // Process products normally
    let productsData = [];
    if (Array.isArray(res.data)) {
      productsData = res.data;
    } else if (res.data?.data && Array.isArray(res.data.data)) {
      productsData = res.data.data;
    } else {
      productsData = [];
    }
    
    const formatted = productsData.map((p) => ({
      id: p.id,
      name: p.name || "Unnamed Product",
      price: p.price || 0,
      category: p.category || "Others",
      image: p.image || "https://images.unsplash.com/photo-1607083206968-13611e3d76db",
      rating: p.rating || 4.0,
      reviews: p.reviews || 0,
      discount: p.discount || 0,
      featured: p.featured || false,
      new: p.new || false
    }));

    setProducts([...allProducts, ...formatted]);
    setFeaturedProducts([...allProducts, ...formatted].filter(p => p.featured));

  } catch (err) {
    console.error("Fetch products error:", err.message);
    // Still show static products on error
    setProducts(allProducts);
    setFeaturedProducts(allProducts.filter(p => p.featured));
  } finally {
    setLoading(false);
  }
};

  // Filter and sort products
  const filteredProducts = products
    .filter(p => category === "All" ? true : p.category === category)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        case "newest": return b.new ? 1 : -1;
        default: return 0;
      }
    });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const categories = [
    { name: "All", icon: <FaBoxes />, color: "#667eea" },
    { name: "Electronics", icon: <FaLaptop />, color: "#48bb78" },
    { name: "Technology", icon: <FaMobileAlt />, color: "#4299e1" },
    { name: "Fashion", icon: <FaTshirt />, color: "#ed64a6" },
    { name: "Others", icon: <FaGift />, color: "#a0aec0" }
  ];

  // src/pages/Shop.jsx
  const handleAddToCart = (product) => {
    // ✅ Only check login when adding to cart, not when viewing products
    if (!user) {
      // Save the product they wanted to add
      localStorage.setItem('pendingProduct', JSON.stringify(product));
      navigate("/login", { state: { from: '/shop', product: product } });
      return;
    }
    addToCart(product);
    // Show success message
    alert(`${product.name} added to cart!`);
  };

  const toggleWishlist = (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        size={14}
        style={{
          color: i < Math.floor(rating) ? "#fbbf24" : "#e2e8f0",
          marginRight: 2
        }}
      />
    ));
  };

  return (
    <>
      {/* Hero Section - Different for Dashboard vs Landing */}
      <section style={{
        background: pageBackground,
        padding: isDashboard ? "30px 0" : "60px 0",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.3s ease"
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: "absolute",
          top: -100,
          right: -50,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          animation: "float 6s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: -100,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          animation: "float 8s ease-in-out infinite reverse"
        }} />

        <Container style={{ position: "relative", zIndex: 1 }}>
          <Row className="align-items-center">
            <Col lg={6} className={isDashboard ? "" : "text-white"}>
              <div className={`fade-in ${fadeIn ? 'visible' : ''}`}>
                <h1 style={{
                  fontSize: isDashboard ? "2rem" : "3rem",
                  fontWeight: "700",
                  color: isDashboard ? "#333" : "white",
                  marginBottom: "15px"
                }}>
                  {isDashboard ? "Store Products" : "MarketSphere Shop"}
                </h1>
                <p style={{
                  fontSize: "1.1rem",
                  color: isDashboard ? "#666" : "rgba(255,255,255,0.9)",
                  marginBottom: "30px",
                  maxWidth: "500px"
                }}>
                  {isDashboard
                    ? "Manage your products and inventory"
                    : "Discover amazing products at the best prices"}
                </p>

                {/* Search Bar */}
                <div style={{ position: "relative", maxWidth: "500px" }}>
                  <FaSearch style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                    zIndex: 10
                  }} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "15px 15px 15px 45px",
                      borderRadius: "50px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      fontSize: "1rem",
                      transition: "box-shadow 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.boxShadow = "0 8px 30px rgba(102, 126, 234, 0.3)"}
                    onBlur={(e) => e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"}
                  />
                </div>
              </div>
            </Col>

            {/* Stats for Dashboard */}
            {isDashboard && (
              <Col lg={6}>
                <Row className="g-3">
                  <Col md={4}>
                    <div className="stat-card" style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      textAlign: "center",
                      transition: "all 0.3s ease"
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <h3 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#667eea", margin: 0 }}>
                        {products.length}
                      </h3>
                      <p style={{ color: "#666", margin: "5px 0 0 0" }}>Total Products</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="stat-card" style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      textAlign: "center",
                      transition: "all 0.3s ease"
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <h3 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#48bb78", margin: 0 }}>
                        {products.filter(p => p.discount > 0).length}
                      </h3>
                      <p style={{ color: "#666", margin: "5px 0 0 0" }}>On Sale</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="stat-card" style={{
                      background: "white",
                      padding: "20px",
                      borderRadius: "12px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      textAlign: "center",
                      transition: "all 0.3s ease"
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <h3 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#ed64a6", margin: 0 }}>
                        {products.filter(p => p.new).length}
                      </h3>
                      <p style={{ color: "#666", margin: "5px 0 0 0" }}>New Arrivals</p>
                    </div>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* Rest of your component remains the same... */}
      {/* Main Shop Section */}
      <section style={{
        background: isDashboard ? "#f8f9fa" : "#ffffff",
        padding: "40px 0"
      }}>
        <Container>
          {/* Category and Filter Bar */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 2px 15px rgba(0,0,0,0.05)",
            marginBottom: "30px"
          }}>
            <Row className="align-items-center">
              <Col lg={8}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setCategory(cat.name)}
                      className="category-btn"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        borderRadius: "30px",
                        border: "none",
                        background: category === cat.name ? cat.color : "#f0f0f0",
                        color: category === cat.name ? "white" : "#666",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        fontWeight: category === cat.name ? "600" : "400",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (category !== cat.name) {
                          e.currentTarget.style.background = "#e0e0e0";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (category !== cat.name) {
                          e.currentTarget.style.background = "#f0f0f0";
                        }
                      }}
                    >
                      {cat.icon}
                      {cat.name}
                    </button>
                  ))}
                </div>
              </Col>

              <Col lg={4}>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "30px",
                      border: "1px solid #e0e0e0",
                      background: "white",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#667eea"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  >
                    <option value="default">Sort by: Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest First</option>
                  </select>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="filter-btn"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "30px",
                      border: "1px solid #e0e0e0",
                      background: showFilters ? "#667eea" : "white",
                      color: showFilters ? "white" : "#666",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <FaFilter />
                    Filters
                  </button>
                </div>
              </Col>
            </Row>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="slide-down" style={{ marginTop: "20px" }}>
                <div style={{
                  padding: "20px",
                  background: "#f8f9fa",
                  borderRadius: "12px"
                }}>
                  <Row>
                    <Col md={6}>
                      <h6 style={{ fontWeight: "600", marginBottom: "15px" }}>Price Range</h6>
                      <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                        <input
                          type="range"
                          min="0"
                          max="2000000"
                          step="10000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          style={{ flex: 1, minWidth: "200px" }}
                        />
                        <div style={{ display: "flex", gap: "10px" }}>
                          <span style={{ background: "white", padding: "5px 15px", borderRadius: "20px", fontSize: "0.9rem" }}>
                            ₦{priceRange[0].toLocaleString()}
                          </span>
                          <span>-</span>
                          <span style={{ background: "white", padding: "5px 15px", borderRadius: "20px", fontSize: "0.9rem" }}>
                            ₦{priceRange[1].toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <h6 style={{ fontWeight: "600", marginBottom: "15px" }}>Quick Filters</h6>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <Badge
                          bg="light"
                          text="dark"
                          style={{ padding: "8px 15px", borderRadius: "20px", cursor: "pointer", transition: "all 0.3s ease" }}
                          onClick={() => setSortBy("discount")}
                        >
                          On Sale
                        </Badge>
                        <Badge
                          bg="light"
                          text="dark"
                          style={{ padding: "8px 15px", borderRadius: "20px", cursor: "pointer", transition: "all 0.3s ease" }}
                          onClick={() => setSortBy("newest")}
                        >
                          New Arrivals
                        </Badge>
                        <Badge
                          bg="light"
                          text="dark"
                          style={{ padding: "8px 15px", borderRadius: "20px", cursor: "pointer", transition: "all 0.3s ease" }}
                          onClick={() => setSortBy("rating")}
                        >
                          Top Rated
                        </Badge>
                        <Badge
                          bg="light"
                          text="dark"
                          style={{ padding: "8px 15px", borderRadius: "20px", cursor: "pointer", transition: "all 0.3s ease" }}
                        >
                          In Stock
                        </Badge>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <Row>
                {currentProducts.map((product) => (
                  <Col key={product.id} xs={12} sm={6} lg={3} className="mb-4">
                    <div
                      className="product-card"
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      style={{
                        background: cardBackground,
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: hoveredProduct === product.id
                          ? "0 20px 30px rgba(0,0,0,0.1)"
                          : "0 5px 15px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                        position: "relative",
                        height: "100%"
                      }}
                    >
                      {/* Product Badges */}
                      <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 2 }}>
                        {product.discount > 0 && (
                          <Badge bg="danger" style={{ marginRight: "5px", padding: "5px 10px", borderRadius: "20px" }}>
                            -{product.discount}%
                          </Badge>
                        )}
                        {product.new && (
                          <Badge bg="success" style={{ padding: "5px 10px", borderRadius: "20px" }}>
                            New
                          </Badge>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="wishlist-btn"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          zIndex: 2,
                          background: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "35px",
                          height: "35px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                          color: wishlist.includes(product.id) ? "#ef4444" : "#999",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <FaHeart size={16} />
                      </button>

                      {/* Product Image */}
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-image"
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            transition: "transform 0.5s ease"
                          }}
                        />

                        {/* Quick View Overlay */}
                        {hoveredProduct === product.id && (
                          <div
                            className="quick-view-overlay"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: "rgba(0,0,0,0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "10px",
                              animation: "fadeIn 0.3s ease"
                            }}
                          >
                            <button
                              className="quick-view-btn"
                              style={{
                                background: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "45px",
                                height: "45px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.1)";
                                e.currentTarget.style.background = "#667eea";
                                e.currentTarget.style.color = "white";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.background = "white";
                                e.currentTarget.style.color = "#667eea";
                              }}
                            >
                              <FaEye size={20} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div style={{ padding: "15px" }}>
                        <h6 style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: "#333"
                        }}>
                          {product.name}
                        </h6>

                        {/* Rating */}
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
                          {renderStars(product.rating)}
                          <small style={{ color: "#999" }}>({product.reviews})</small>
                        </div>

                        {/* Price */}
                        <div style={{ marginBottom: "12px" }}>
                          {product.discount > 0 ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span style={{
                                fontSize: "1.2rem",
                                fontWeight: "700",
                                color: "#ef4444"
                              }}>
                                ₦{(product.price * (1 - product.discount / 100)).toLocaleString()}
                              </span>
                              <span style={{
                                fontSize: "0.9rem",
                                color: "#999",
                                textDecoration: "line-through"
                              }}>
                                ₦{product.price.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span style={{
                              fontSize: "1.2rem",
                              fontWeight: "700",
                              color: "#333"
                            }}>
                              ₦{product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Category Badge */}
                        <Badge
                          bg="light"
                          text="dark"
                          style={{
                            fontSize: "0.8rem",
                            padding: "5px 10px",
                            borderRadius: "20px",
                            marginBottom: "12px"
                          }}
                        >
                          {product.category}
                        </Badge>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="add-to-cart-btn"
                          style={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            borderRadius: "30px",
                            padding: "8px 16px",
                            width: "100%",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.3s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <FaShoppingCart />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "40px" }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "30px",
                      border: "1px solid #e0e0e0",
                      background: "white",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      opacity: currentPage === 1 ? 0.5 : 1,
                      transition: "all 0.3s ease"
                    }}
                  >
                    <FaChevronLeft />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className="pagination-btn"
                      style={{
                        padding: "10px 20px",
                        borderRadius: "30px",
                        border: "none",
                        background: currentPage === i + 1 ? "#667eea" : "white",
                        color: currentPage === i + 1 ? "white" : "#666",
                        cursor: "pointer",
                        fontWeight: currentPage === i + 1 ? "600" : "400",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "30px",
                      border: "1px solid #e0e0e0",
                      background: "white",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      transition: "all 0.3s ease"
                    }}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Featured Products Section (Only on Landing Page) */}
          {!isDashboard && featuredProducts.length > 0 && (
            <section style={{ marginTop: "60px" }}>
              <h2 style={{
                fontSize: "2rem",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "40px",
                color: "#333"
              }}>
                Featured Products
              </h2>

              <Row>
                {featuredProducts.slice(0, 4).map((product) => (
                  <Col key={product.id} md={3} className="mb-4">
                    <div className="featured-card" style={{
                      background: "white",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      position: "relative",
                      transition: "all 0.3s ease"
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover"
                        }}
                      />
                      <div style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "#fbbf24",
                        color: "white",
                        padding: "5px 15px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "600"
                      }}>
                        Featured
                      </div>
                      <div style={{ padding: "15px" }}>
                        <h6 style={{ fontWeight: "600", marginBottom: "5px" }}>{product.name}</h6>
                        <p style={{ color: "#667eea", fontWeight: "700", marginBottom: "10px" }}>
                          ₦{product.price.toLocaleString()}
                        </p>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          style={{ width: "100%", borderRadius: "20px", transition: "all 0.3s ease" }}
                          onClick={() => handleAddToCart(product)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#667eea";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#667eea";
                          }}
                        >
                          Shop Now
                        </Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}

          {/* Trust Badges (Only on Landing Page) */}
          {!isDashboard && (
            <section style={{ marginTop: "60px", padding: "40px 0" }}>
              <Row className="g-4">
                {[
                  { icon: <FaTruck />, title: "Free Delivery", desc: "On orders over ₦50,000" },
                  { icon: <FaShieldAlt />, title: "Secure Payment", desc: "100% secure transactions" },
                  { icon: <FaGift />, title: "Best Offers", desc: "Daily deals & discounts" },
                  { icon: <FaWhatsapp />, title: "24/7 Support", desc: "Chat with us anytime" }
                ].map((item, index) => (
                  <Col md={3} key={index}>
                    <div className="trust-badge" style={{
                      textAlign: "center",
                      padding: "20px",
                      transition: "all 0.3s ease"
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <div style={{
                        width: "70px",
                        height: "70px",
                        background: "#667eea20",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 15px",
                        transition: "all 0.3s ease"
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#667eea";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#667eea20";
                          e.currentTarget.style.color = "#667eea";
                        }}
                      >
                        {React.cloneElement(item.icon, { size: 30, color: "inherit" })}
                      </div>
                      <h6 style={{ fontWeight: "600" }}>{item.title}</h6>
                      <p style={{ fontSize: "0.9rem", color: "#666" }}>{item.desc}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}
        </Container>
      </section>

      {/* <Footer /> */}

      {/* CSS Animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .fade-in {
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .fade-in.visible {
          opacity: 1;
        }

        .slide-down {
          animation: slideDown 0.3s ease forwards;
        }

        .category-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .filter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .product-card:hover .product-image {
          transform: scale(1.1);
        }

        .quick-view-btn:hover {
          transform: scale(1.1);
          background: #667eea;
          color: white;
        }

        .wishlist-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .add-to-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .pagination-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .featured-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .trust-badge:hover div:first-child {
          background: #667eea;
          color: white;
          transform: scale(1.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          h1 {
            font-size: 2rem !important;
          }
          
          .category-btn {
            padding: 8px 15px !important;
            font-size: 0.85rem !important;
          }
          
          .product-card {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default Shop;
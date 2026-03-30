// src/pages/BuyerDashboard.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axios from "axios";
import {
  FaShoppingCart,
  FaHeart,
  FaClock,
  FaTag,
  FaStar,
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaGift,
  FaWhatsapp,
  FaFire,
  FaNewspaper,
  FaEye,
  FaCalendarAlt,
  FaLaptop,
  FaTshirt,
  FaHome,
  FaGem,
  FaBook,
  FaFutbol,
  FaAward,
  FaBolt,
  FaCrown,
  FaWallet,
  FaUndo,
  FaHeadset,
  FaThumbsUp
} from "react-icons/fa";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  // User Stats
  const cartCount = cart?.length || 0;
  const wishlistCount = 0;
  const totalSpent = 125000;
  const loyaltyPoints = 1250;

  // Featured Sellers
  const topSellers = [
    { id: 1, name: "TechHub", rating: 4.9, sales: 1250, category: "Electronics" },
    { id: 2, name: "Fashion World", rating: 4.8, sales: 890, category: "Fashion" },
    { id: 3, name: "Home Comfort", rating: 4.7, sales: 567, category: "Home" },
    { id: 4, name: "Book Haven", rating: 4.9, sales: 234, category: "Books" }
  ];

  // Categories
  const categories = [
    { name: "Electronics", count: 156, icon: <FaLaptop />, color: "#4299e1", bg: "#e6f0ff" },
    { name: "Fashion", count: 89, icon: <FaTshirt />, color: "#ed64a6", bg: "#fce7f3" },
    { name: "Home & Living", count: 67, icon: <FaHome />, color: "#48bb78", bg: "#e6f7ec" },
    { name: "Jewelry", count: 45, icon: <FaGem />, color: "#fbbf24", bg: "#fef3c7" },
    { name: "Books", count: 234, icon: <FaBook />, color: "#9f7aea", bg: "#f0e7fe" },
    { name: "Sports", count: 78, icon: <FaFutbol />, color: "#f59e0b", bg: "#fff0e0" }
  ];

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Fetch ALL products from ALL sellers using public endpoint
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Use the public products endpoint that returns all products from all sellers
      const res = await axios.get('http://localhost:5000/api/auth/public/products', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      let productsData = [];
      if (Array.isArray(res.data)) {
        productsData = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        productsData = res.data.data;
      } else {
        productsData = [];
      }

      console.log('Fetched products:', productsData.length);
      setProducts(productsData);
      setFeaturedProducts(productsData.filter(p => p.featured || p.discount > 15).slice(0, 4));
      setTrendingProducts([...productsData].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4));
      setNewArrivals([...productsData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4));
      setRecommendedProducts(productsData.slice(4, 8));
      
    } catch (err) {
      console.error("Fetch products error:", err);
      // Set fallback data for demo
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/auth/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = 9999;
    toast.innerHTML = `
      <div class="toast show" role="alert">
        <div class="toast-header bg-success text-white">
          <strong class="me-auto">Success!</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          ${product.name} added to cart!
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleShopNow = (category = null) => {
    if (category) {
      navigate(`/shop?category=${category}`);
    } else {
      navigate("/shop");
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} size={14} style={{ color: i < Math.floor(rating || 4) ? "#fbbf24" : "#e2e8f0", marginRight: 2 }} />
    ));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Get pending orders count
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'Pending').length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 0",
        color: "white",
        borderRadius: "20px",
        marginBottom: "30px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: -50, left: -50, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <h1 className="display-4 fw-bold mb-3">
                Welcome back, {user?.name?.split(' ')[0] || "Shopper"}! 👋
              </h1>
              <p className="lead mb-4">
                {getGreeting()}. Discover amazing products from trusted sellers across Nigeria.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button variant="light" size="lg" onClick={() => handleShopNow()} style={{ borderRadius: "30px", padding: "12px 30px" }}>
                  Shop Now <FaArrowRight className="ms-2" />
                </Button>
                <Button variant="outline-light" size="lg" onClick={() => navigate("/orders")} style={{ borderRadius: "30px", padding: "12px 30px" }}>
                  My Orders
                </Button>
                <Button variant="outline-light" size="lg" onClick={() => navigate("/wishlist")} style={{ borderRadius: "30px", padding: "12px 30px" }}>
                  <FaHeart className="me-2" /> Wishlist
                </Button>
              </div>
            </Col>
            <Col lg={5} className="mt-4 mt-lg-0">
              <div className="d-flex gap-3">
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "16px", padding: "20px", backdropFilter: "blur(10px)", flex: 1 }}>
                  <h2 className="fw-bold mb-0">{products.length}</h2>
                  <small>Products Available</small>
                </div>
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "16px", padding: "20px", backdropFilter: "blur(10px)", flex: 1 }}>
                  <h2 className="fw-bold mb-0">50+</h2>
                  <small>Trusted Sellers</small>
                </div>
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "16px", padding: "20px", backdropFilter: "blur(10px)", flex: 1 }}>
                  <h2 className="fw-bold mb-0">4.8⭐</h2>
                  <small>Avg Rating</small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Quick Stats Cards */}
      <Container>
        <Row className="g-4 mb-5">
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm text-center p-3" style={{ borderRadius: "16px", cursor: "pointer" }} onClick={() => navigate("/cart")}>
              <FaShoppingCart size={30} className="mx-auto text-primary mb-2" />
              <h3 className="fw-bold mb-0">{cartCount}</h3>
              <p className="text-muted">Items in Cart</p>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm text-center p-3" style={{ borderRadius: "16px", cursor: "pointer" }} onClick={() => navigate("/wishlist")}>
              <FaHeart size={30} className="mx-auto text-danger mb-2" />
              <h3 className="fw-bold mb-0">{wishlistCount}</h3>
              <p className="text-muted">Wishlist</p>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm text-center p-3" style={{ borderRadius: "16px", cursor: "pointer" }} onClick={() => navigate("/orders")}>
              <FaClock size={30} className="mx-auto text-warning mb-2" />
              <h3 className="fw-bold mb-0">{pendingOrdersCount}</h3>
              <p className="text-muted">Pending Orders</p>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm text-center p-3" style={{ borderRadius: "16px" }}>
              <FaWallet size={30} className="mx-auto text-success mb-2" />
              <h3 className="fw-bold mb-0">₦{totalSpent.toLocaleString()}</h3>
              <p className="text-muted">Total Spent</p>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Flash Sale Banner */}
      <Container className="mb-5">
        <div style={{
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          borderRadius: "20px",
          padding: "30px",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h2 className="fw-bold mb-2"><FaBolt className="me-2" /> Flash Sale!</h2>
              <p className="mb-0">Hurry! Limited time offers ending soon</p>
            </div>
            <Button variant="light" onClick={() => handleShopNow()} style={{ borderRadius: "30px" }}>Shop Now <FaArrowRight /></Button>
          </div>
        </div>
      </Container>

      {/* Trending Products */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0"><FaFire className="me-2 text-danger" /> Trending Now</h2>
            <p className="text-muted">Most popular items this week</p>
          </div>
          <Button variant="link" onClick={() => handleShopNow()} className="text-decoration-none">View All <FaArrowRight /></Button>
        </div>
        <Row>
          {trendingProducts.map((product) => (
            <Col key={product.id} md={3} className="mb-4">
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: "16px", overflow: "hidden", cursor: "pointer" }} onClick={() => navigate(`/product/${product.id}`)}>
                <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                  <img src={product.image || "https://via.placeholder.com/200"} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <Badge bg="danger" style={{ position: "absolute", top: "10px", left: "10px" }}>Hot 🔥</Badge>
                </div>
                <Card.Body>
                  <h6 className="fw-bold">{product.name}</h6>
                  <div className="d-flex align-items-center gap-2 mb-2">{renderStars(product.rating)}<small>({product.reviews || 0})</small></div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">₦{product.price?.toLocaleString()}</span>
                    <Button size="sm" variant="outline-primary" onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}><FaShoppingCart /> Add</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Featured Products */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0"><FaStar className="me-2 text-warning" /> Featured Products</h2>
            <p className="text-muted">Hand-picked just for you</p>
          </div>
          <Button variant="link" onClick={() => handleShopNow()} className="text-decoration-none">View All <FaArrowRight /></Button>
        </div>
        <Row>
          {featuredProducts.map((product) => (
            <Col key={product.id} md={3} className="mb-4">
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: "16px", overflow: "hidden", cursor: "pointer" }} onClick={() => navigate(`/product/${product.id}`)}>
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <img src={product.image || "https://via.placeholder.com/200"} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <Card.Body>
                  {product.discount > 0 && <Badge bg="danger" className="mb-2">-{product.discount}% OFF</Badge>}
                  <h6 className="fw-bold">{product.name}</h6>
                  <div className="d-flex align-items-center gap-2 mb-2">{renderStars(product.rating)}<small>({product.reviews || 0})</small></div>
                  <div className="d-flex justify-content-between align-items-center">
                    {product.discount > 0 ? (
                      <div>
                        <span className="fw-bold text-danger">₦{(product.price * (1 - product.discount/100)).toLocaleString()}</span>
                        <small className="text-muted text-decoration-line-through ms-2">₦{product.price?.toLocaleString()}</small>
                      </div>
                    ) : (
                      <span className="fw-bold text-primary">₦{product.price?.toLocaleString()}</span>
                    )}
                    <Button size="sm" variant="outline-primary" onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}><FaShoppingCart /> Add</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* New Arrivals */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0"><FaGift className="me-2 text-success" /> New Arrivals</h2>
            <p className="text-muted">Fresh products just added</p>
          </div>
          <Button variant="link" onClick={() => handleShopNow()} className="text-decoration-none">View All <FaArrowRight /></Button>
        </div>
        <Row>
          {newArrivals.map((product) => (
            <Col key={product.id} md={3} className="mb-4">
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: "16px", overflow: "hidden", cursor: "pointer" }} onClick={() => navigate(`/product/${product.id}`)}>
                <div style={{ height: "180px", overflow: "hidden" }}>
                  <img src={product.image || "https://via.placeholder.com/180"} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <Card.Body>
                  <Badge bg="success" className="mb-2">New</Badge>
                  <h6 className="fw-bold">{product.name}</h6>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="fw-bold text-primary">₦{product.price?.toLocaleString()}</span>
                    <Button size="sm" variant="outline-primary" onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}><FaShoppingCart /></Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Categories Section */}
      <Container className="mb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Shop by Category</h2>
          <p className="text-muted">Browse products by category</p>
        </div>
        <Row className="g-4">
          {categories.map((cat, idx) => (
            <Col key={idx} md={3} sm={4} xs={6}>
              <Card className="border-0 shadow-sm text-center py-4" style={{ borderRadius: "16px", cursor: "pointer", background: cat.bg, transition: "transform 0.3s" }} onClick={() => handleShopNow(cat.name)} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ fontSize: "2.5rem", color: cat.color }}>{cat.icon}</div>
                <h6 className="fw-bold mt-2 mb-0">{cat.name}</h6>
                <small className="text-muted">{cat.count} items</small>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Top Sellers Section */}
      <Container className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0"><FaCrown className="me-2 text-warning" /> Top Rated Sellers</h2>
            <p className="text-muted">Shop from the best sellers on MarketSphere</p>
          </div>
          <Button variant="link" className="text-decoration-none">View All <FaArrowRight /></Button>
        </div>
        <Row>
          {topSellers.map((seller) => (
            <Col key={seller.id} md={3} sm={6} className="mb-4">
              <Card className="border-0 shadow-sm text-center p-4" style={{ borderRadius: "16px", cursor: "pointer" }} onClick={() => handleShopNow(seller.category)}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold", color: "white" }}>
                  {seller.name.charAt(0)}
                </div>
                <h6 className="fw-bold mt-3 mb-1">{seller.name}</h6>
                <div className="d-flex justify-content-center gap-1 mb-2">{renderStars(seller.rating)}</div>
                <small className="text-muted">{seller.sales} sales</small>
                <Button size="sm" variant="outline-primary" className="mt-3" onClick={() => handleShopNow(seller.category)}>Visit Store</Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Loyalty Rewards */}
      <Container className="mb-5">
        <div style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: "20px", padding: "30px", color: "white" }}>
          <Row className="align-items-center">
            <Col md={8}>
              <h3 className="fw-bold mb-2"><FaGift className="me-2" /> Your Rewards</h3>
              <p className="mb-0">You have <strong>{loyaltyPoints}</strong> loyalty points! Redeem them for amazing discounts.</p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button variant="light" style={{ borderRadius: "30px" }}>Redeem Now</Button>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Trust Badges */}
      <Container className="mb-5">
        <Row className="g-4 text-center">
          <Col md={3} sm={6}><div className="p-3"><FaTruck size={30} className="text-primary mb-2" /><h6>Free Delivery</h6><small className="text-muted">On orders over ₦50,000</small></div></Col>
          <Col md={3} sm={6}><div className="p-3"><FaShieldAlt size={30} className="text-primary mb-2" /><h6>Secure Payment</h6><small className="text-muted">Paystack secure checkout</small></div></Col>
          <Col md={3} sm={6}><div className="p-3"><FaUndo size={30} className="text-primary mb-2" /><h6>Easy Returns</h6><small className="text-muted">30-day return policy</small></div></Col>
          <Col md={3} sm={6}><div className="p-3"><FaHeadset size={30} className="text-primary mb-2" /><h6>24/7 Support</h6><small className="text-muted">Chat with us anytime</small></div></Col>
        </Row>
      </Container>
    </>
  );
};

export default BuyerDashboard;
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Spinner, Modal, Form, Badge, Container } from "react-bootstrap";
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaPlus, 
  FaEdit, 
  FaTrash,
  FaShoppingBag,
  FaTag,
  FaBoxOpen,
  FaFilter,
  FaSearch,
  FaHeart,
  FaShare,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaStore
} from "react-icons/fa";
import { createProduct, getProducts, deleteProduct, updateProduct } from "../utils/api.js";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    id: null,
    category: "general",
    stock: 10
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Products", icon: <FaBoxOpen /> },
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "fashion", name: "Fashion", icon: "👕" },
    { id: "home", name: "Home & Living", icon: "🏠" },
    { id: "beauty", name: "Beauty", icon: "💄" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "books", name: "Books", icon: "📚" },
    { id: "general", name: "General", icon: "📦" }
  ];

  /* ================= CURRENCY FORMAT ================= */
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= FILTER AND SORT PRODUCTS ================= */
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(product => 
        product.category === selectedCategory
      );
    }

    // Apply sorting
    switch(sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortBy, products]);

  /* ================= RATING STARS ================= */
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" size={16} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" size={16} />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" size={16} />);
      }
    }

    return stars;
  };

  /* ================= ADD / UPDATE PRODUCT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) return;

    setAdding(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("stock", formData.stock);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (formData.id) {
        const res = await updateProduct(formData.id, data);
        setProducts(products.map((p) => p.id === formData.id ? res.data : p));
      } else {
        const res = await createProduct(data);
        setProducts([res.data, ...products]);
      }

      // Reset form
      setFormData({
        name: "",
        price: "",
        description: "",
        image: null,
        id: null,
        category: "general",
        stock: 10
      });

      setPreviewImage(null);
      setShowModal(false);

    } catch (err) {
      console.error("Create/Edit product error:", err);
      alert("Failed to add or update product");
    } finally {
      setAdding(false);
    }
  };

  /* ================= DELETE PRODUCT ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete product error:", err);
      alert("Failed to delete product");
    }
  };

  /* ================= EDIT PRODUCT ================= */
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: null,
      id: product.id,
      category: product.category || "general",
      stock: product.stock || 10
    });

    setPreviewImage(
      product.image
        ? `http://localhost:5000${product.image}`
        : null
    );

    setShowModal(true);
  };

  /* ================= STATS ================= */
  const totalProducts = products.length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 1)), 0);
  const averageRating = products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length || 0;
  const outOfStock = products.filter(p => p.stock === 0).length;

  /* ================= UI ================= */
  return (
    <div style={{ 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "30px 20px"
    }}>
      <Container fluid>
        {/* Store Header */}
        <div className="text-center text-white mb-5">
          <div className="d-inline-block bg-white bg-opacity-20 p-4 rounded-circle mb-3">
            <FaStore size={50} color="white" />
          </div>
          <h1 className="display-4 fw-bold mb-2">Marketsphere Store</h1>
          <p className="lead opacity-90">Discover amazing products at the best prices</p>
        </div>

        {/* Stats Cards */}
        <Row className="g-4 mb-5">
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-lg h-100" style={{ borderRadius: "20px", background: "rgba(255,255,255,0.95)" }}>
              <Card.Body className="text-center p-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                  <FaBoxOpen size={30} className="text-primary" />
                </div>
                <h3 className="fw-bold mb-1">{totalProducts}</h3>
                <p className="text-muted mb-0">Total Products</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-lg h-100" style={{ borderRadius: "20px", background: "rgba(255,255,255,0.95)" }}>
              <Card.Body className="text-center p-4">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                  <FaTag size={30} className="text-success" />
                </div>
                <h3 className="fw-bold mb-1">{formatPrice(totalValue)}</h3>
                <p className="text-muted mb-0">Inventory Value</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-lg h-100" style={{ borderRadius: "20px", background: "rgba(255,255,255,0.95)" }}>
              <Card.Body className="text-center p-4">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                  <FaStar size={30} className="text-warning" />
                </div>
                <h3 className="fw-bold mb-1">{averageRating.toFixed(1)}</h3>
                <p className="text-muted mb-0">Avg. Rating</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-lg h-100" style={{ borderRadius: "20px", background: "rgba(255,255,255,0.95)" }}>
              <Card.Body className="text-center p-4">
                <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                  <FaShoppingBag size={30} className="text-danger" />
                </div>
                <h3 className="fw-bold mb-1">{outOfStock}</h3>
                <p className="text-muted mb-0">Out of Stock</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search and Filter Bar */}
        <Card className="border-0 shadow-lg mb-4" style={{ borderRadius: "20px" }}>
          <Card.Body className="p-4">
            <Row className="g-3 align-items-center">
              <Col lg={4}>
                <div className="position-relative">
                  <FaSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                  <Form.Control
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: "40px", borderRadius: "12px", height: "50px" }}
                  />
                </div>
              </Col>
              
              <Col lg={3}>
                <Form.Select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ borderRadius: "12px", height: "50px" }}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              
              <Col lg={3}>
                <Form.Select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ borderRadius: "12px", height: "50px" }}
                >
                  <option value="newest">🆕 Newest First</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💰 Price: High to Low</option>
                  <option value="rating">⭐ Top Rated</option>
                </Form.Select>
              </Col>
              
              <Col lg={2}>
                <Button 
                  variant="primary" 
                  onClick={() => setShowModal(true)}
                  className="w-100"
                  style={{ 
                    borderRadius: "12px", 
                    height: "50px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none"
                  }}
                >
                  <FaPlus className="me-2" /> Add Product
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" style={{ width: "4rem", height: "4rem" }} />
            <p className="text-white mt-3">Loading amazing products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="border-0 shadow-lg text-center p-5" style={{ borderRadius: "20px" }}>
            <FaBoxOpen size={80} className="text-muted mx-auto mb-3" />
            <h3 className="fw-bold mb-2">No Products Found</h3>
            <p className="text-muted mb-4">Start adding products to your store</p>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)}
              className="mx-auto"
              style={{ 
                borderRadius: "12px", 
                padding: "12px 30px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                width: "fit-content"
              }}
            >
              <FaPlus className="me-2" /> Add Your First Product
            </Button>
          </Card>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center text-white mb-3">
              <p className="mb-0">
                Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
              </p>
              <div className="d-flex gap-2">
                <Button 
                  variant={viewMode === "grid" ? "light" : "outline-light"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button 
                  variant={viewMode === "list" ? "light" : "outline-light"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>

            <Row className={`g-4 ${viewMode === "list" ? "flex-column" : ""}`}>
              {filteredProducts.map((product) => (
                <Col 
                  key={product.id} 
                  xs={12} 
                  sm={viewMode === "list" ? 12 : 6} 
                  md={viewMode === "list" ? 12 : 4} 
                  lg={viewMode === "list" ? 12 : 3}
                >
                  <Card 
                    className={`border-0 shadow-lg h-100 ${viewMode === "list" ? "flex-row" : ""}`}
                    style={{ 
                      borderRadius: "20px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      transform: hoveredProduct === product.id ? "translateY(-10px)" : "none",
                      boxShadow: hoveredProduct === product.id ? "0 20px 40px rgba(0,0,0,0.2)" : "0 10px 30px rgba(0,0,0,0.1)"
                    }}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Product Image */}
                    <div style={{ 
                      width: viewMode === "list" ? "200px" : "100%",
                      height: viewMode === "list" ? "200px" : "250px",
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      <Card.Img
                        src={
                          product.image
                            ? `http://localhost:5000${product.image}`
                            : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
                        }
                        style={{ 
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          transition: "transform 0.3s ease"
                        }}
                        className="hover-zoom"
                      />
                      
                      {/* Quick Actions Overlay */}
                      <div style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        display: "flex",
                        gap: "5px"
                      }}>
                        <Button
                          size="sm"
                          variant="light"
                          className="rounded-circle"
                          style={{ width: "35px", height: "35px" }}
                        >
                          <FaHeart />
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          className="rounded-circle"
                          style={{ width: "35px", height: "35px" }}
                        >
                          <FaShare />
                        </Button>
                      </div>

                      {/* Stock Badge */}
                      {product.stock === 0 ? (
                        <Badge 
                          bg="danger"
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "10px",
                            padding: "5px 10px",
                            borderRadius: "20px"
                          }}
                        >
                          Out of Stock
                        </Badge>
                      ) : product.stock < 5 ? (
                        <Badge 
                          bg="warning"
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "10px",
                            padding: "5px 10px",
                            borderRadius: "20px"
                          }}
                        >
                          Only {product.stock} left
                        </Badge>
                      ) : (
                        <Badge 
                          bg="success"
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "10px",
                            padding: "5px 10px",
                            borderRadius: "20px"
                          }}
                        >
                          <FaCheckCircle className="me-1" /> In Stock
                        </Badge>
                      )}
                    </div>

                    {/* Product Details */}
                    <Card.Body className={viewMode === "list" ? "flex-grow-1" : ""}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                          {product.name}
                        </Card.Title>
                        <Badge bg="primary" style={{ borderRadius: "12px" }}>
                          {product.category || "General"}
                        </Badge>
                      </div>

                      <Card.Text className="text-muted small mb-2">
                        {product.description?.length > 100 
                          ? `${product.description.substring(0, 100)}...` 
                          : product.description || "No description available"}
                      </Card.Text>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          {renderStars(product.rating)}
                          <small className="text-muted ms-2">({product.reviewCount || 0})</small>
                        </div>
                        {product.rating > 0 && (
                          <small className="text-success">Top Rated</small>
                        )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="fw-bold text-primary mb-0">
                            {formatPrice(product.price)}
                          </h4>
                          {product.oldPrice && (
                            <small className="text-muted text-decoration-line-through">
                              {formatPrice(product.oldPrice)}
                            </small>
                          )}
                        </div>

                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleEdit(product)}
                            style={{ borderRadius: "10px" }}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(product.id)}
                            style={{ borderRadius: "10px" }}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>

                      {viewMode === "list" && (
                        <div className="mt-3 pt-3 border-top">
                          <Button 
                            variant="primary" 
                            className="w-100"
                            style={{ borderRadius: "12px" }}
                          >
                            View Details
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Add/Edit Product Modal */}
        <Modal 
          show={showModal} 
          onHide={() => {
            setShowModal(false);
            setFormData({ name: "", price: "", description: "", image: null, id: null, category: "general", stock: 10 });
            setPreviewImage(null);
          }} 
          centered 
          size="lg"
        >
          <Modal.Header closeButton style={{ borderBottom: "2px solid #f0f0f0" }}>
            <Modal.Title style={{ fontSize: "1.3rem", fontWeight: "600" }}>
              {formData.id ? "Edit Product" : "Add New Product"}
            </Modal.Title>
          </Modal.Header>

          <Form onSubmit={handleSubmit}>
            <Modal.Body style={{ padding: "30px" }}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "500" }}>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Premium Wireless Headphones"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{ padding: "12px", borderRadius: "12px" }}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "500" }}>Price (₦)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="e.g., 25000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      style={{ padding: "12px", borderRadius: "12px" }}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "500" }}>Category</Form.Label>
                    <Form.Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ padding: "12px", borderRadius: "12px" }}
                    >
                      {categories.filter(c => c.id !== "all").map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "500" }}>Stock Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      style={{ padding: "12px", borderRadius: "12px" }}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "500" }}>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Describe your product features, benefits, and specifications..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ padding: "12px", borderRadius: "12px" }}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{ fontWeight: "500" }}>Product Image</Form.Label>
                    <div 
                      className="border rounded-3 p-4 text-center"
                      style={{ 
                        border: "2px dashed #dee2e6",
                        background: "#f8f9fa",
                        cursor: "pointer"
                      }}
                      onClick={() => document.getElementById('product-image').click()}
                    >
                      <input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          setFormData({ ...formData, image: file });
                          setPreviewImage(URL.createObjectURL(file));
                        }}
                        style={{ display: "none" }}
                      />
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="img-fluid rounded-3"
                          style={{ maxHeight: "200px", margin: "0 auto" }}
                        />
                      ) : (
                        <>
                          <FaPlus size={40} className="text-muted mb-2" />
                          <p className="text-muted mb-0">Click to upload product image</p>
                          <small className="text-muted">PNG, JPG up to 5MB</small>
                        </>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer style={{ borderTop: "2px solid #f0f0f0", padding: "20px" }}>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowModal(false);
                  setFormData({ name: "", price: "", description: "", image: null, id: null, category: "general", stock: 10 });
                  setPreviewImage(null);
                }}
                style={{ borderRadius: "12px", padding: "10px 25px" }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={adding}
                style={{ 
                  borderRadius: "12px", 
                  padding: "10px 30px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none"
                }}
              >
                {adding ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {formData.id ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  formData.id ? "Update Product" : "Add Product"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Custom CSS */}
        <style jsx>{`
          .hover-zoom:hover {
            transform: scale(1.05);
          }
          .bg-opacity-20 {
            --bs-bg-opacity: 0.2;
          }
        `}</style>
      </Container>
    </div>
  );
};

export default Store;
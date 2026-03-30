import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { getProductById, getProducts } from "../utils/api";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    fetchRelated();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error("Fetch product error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async () => {
    try {
      const { data } = await getProducts();
      setRelatedProducts(data.slice(0, 4));
    } catch (err) {
      console.error("Fetch related error:", err);
    }
  };

  const renderStars = (rating) => [...Array(5)].map((_, i) => (
    <FaStar key={i} className={i < rating ? "text-warning" : "text-secondary"} />
  ));

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (!product) return <div className="text-center py-5"><h4>Product not found</h4></div>;

  return (
    <Container className="py-5">
      <p className="text-muted">
        <Link to="/">Home</Link> / <Link to="/marketplace">Marketplace</Link> / {product.name}
      </p>

      <Row className="mb-5">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              style={{ objectFit: "cover", height: "450px" }}
            />
          </Card>
        </Col>

        <Col md={6}>
          <h2 className="fw-bold">{product.name}</h2>
          <div className="mb-2">
            {renderStars(product.rating || 4)}
            <span className="ms-2 text-muted">(32 reviews)</span>
          </div>
          <h3 className="text-primary fw-bold mb-3">₦{product.price.toLocaleString()}</h3>
          <p className="text-muted">{product.description}</p>
          <Badge bg="success" className="mb-3">In Stock</Badge>
          <div className="d-grid gap-2 mt-4">
            <Button variant="primary" size="lg" onClick={() => addToCart(product)}>
              <FaShoppingCart className="me-2" /> Add To Cart
            </Button>
            <Button variant="outline-dark">Buy Now</Button>
          </div>
        </Col>
      </Row>

      <Card className="p-4 mb-5 shadow-sm border-0">
        <h5 className="fw-bold mb-3">Product Description</h5>
        <p className="text-muted">{product.description}</p>
      </Card>

      <h4 className="fw-bold mb-4">Related Products</h4>
      <Row>
        {relatedProducts.map((item) => (
          <Col md={3} key={item.id} className="mb-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Img
                variant="top"
                src={`http://localhost:5000${item.image}`}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{item.name}</Card.Title>
                <div className="mb-2">{renderStars(item.rating || 4)}</div>
                <h6 className="fw-bold">₦{item.price.toLocaleString()}</h6>
                <Link to={`/product/${item.id}`} className="btn btn-outline-primary mt-auto">
                  View Product
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductDetails;
// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../utils/api.js";
import { FaEdit, FaTrash, FaPlus, FaImage, FaBox, FaTag, FaDollarSign } from "react-icons/fa";
import { Modal, Button, Form, Badge } from "react-bootstrap";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ Get the base URL from environment or use the Render URL
  const BASE_URL = import.meta.env.VITE_API_URL || "https://market-store-2eop.onrender.com";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      console.log('Fetched products:', res.data);
      
      // ✅ Handle different response formats
      let productsData = [];
      if (Array.isArray(res.data)) {
        productsData = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        productsData = res.data.data;
      } else if (res.data && res.data.products && Array.isArray(res.data.products)) {
        productsData = res.data.products;
      } else {
        console.error('Products data is not an array:', res.data);
        productsData = [];
      }
      
      setProducts(productsData);
    } catch (err) {
      console.error("Fetch products error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description || "");
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const res = await createProduct(formDataToSend);
      console.log('Product created:', res.data);
      
      // ✅ Add new product to state without refetching
      setProducts([res.data, ...products]);
      
      // ✅ Reset form and close modal
      resetForm();
      setShowModal(false);
      
      // ✅ Show success message
      alert("Product created successfully!");
    } catch (err) {
      console.error("Create error:", err);
      alert(err.response?.data?.message || "Failed to create product");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description || "");
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const res = await updateProduct(editingProduct.id, formDataToSend);
      console.log('Product updated:', res.data);
      
      // ✅ Update product in state
      setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
      
      // ✅ Reset form and close modal
      resetForm();
      setShowModal(false);
      setEditingProduct(null);
      
      // ✅ Show success message
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      // ✅ Remove product from state
      setProducts(products.filter(p => p.id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", description: "", image: null });
    if (previewImage) {
      URL.revokeObjectURL(previewImage); // Clean up URL
    }
    setPreviewImage(null);
  };

  const openCreateModal = () => {
    resetForm();
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: null
    });
    // ✅ Fix image URL - use full backend URL
    if (product.image) {
      const imageUrl = product.image.startsWith('http') 
        ? product.image 
        : `${BASE_URL}${product.image}`;
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
    setShowModal(true);
  };

  // ✅ Function to get correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/60?text=No+Image";
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%', minHeight: '400px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "24px", background: "#f8f9fa", minHeight: "100%" }}>
      {/* Header with Gradient */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "30px 40px",
        color: "white",
        borderRadius: "16px",
        marginBottom: "24px"
      }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: "700", margin: 0 }}>
              <FaBox className="me-3" />
              Product Management
            </h1>
            <p style={{ fontSize: "1.1rem", opacity: 0.9, marginTop: "8px" }}>
              Manage your product catalog, add new items, and update existing ones
            </p>
          </div>
          <button 
            className="btn btn-light d-flex align-items-center gap-2"
            onClick={openCreateModal}
            style={{ 
              borderRadius: "12px", 
              padding: "12px 24px",
              fontWeight: "600",
              border: "none",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}
          >
            <FaPlus /> Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="d-flex gap-3 mt-4 flex-wrap">
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "15px 25px",
            backdropFilter: "blur(10px)"
          }}>
            <small style={{ opacity: 0.9 }}>Total Products</small>
            <h3 style={{ margin: "5px 0 0 0", fontWeight: "700" }}>{products.length}</h3>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "15px 25px",
            backdropFilter: "blur(10px)"
          }}>
            <small style={{ opacity: 0.9 }}>Total Value</small>
            <h3 style={{ margin: "5px 0 0 0", fontWeight: "700" }}>
              ₦{products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border-0 shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ background: "#f8f9fa" }}>
                <tr>
                  <th style={{ padding: "20px", width: "80px" }}>Image</th>
                  <th style={{ padding: "20px" }}>Product Name</th>
                  <th style={{ padding: "20px" }}>Price</th>
                  <th style={{ padding: "20px" }}>Description</th>
                  <th style={{ padding: "20px", width: "180px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ transition: "all 0.3s ease" }}>
                    <td style={{ padding: "15px 20px" }}>
                      <div style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                      }}>
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/60?text=No+Image";
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: "15px 20px" }}>
                      <h6 className="fw-bold mb-1">{product.name}</h6>
                      <small className="text-muted">ID: {product.id}</small>
                    </td>
                    <td style={{ padding: "15px 20px" }}>
                      <Badge bg="success" style={{ fontSize: "1rem", padding: "8px 15px", borderRadius: "30px" }}>
                        ₦{parseFloat(product.price).toLocaleString()}
                      </Badge>
                    </td>
                    <td style={{ padding: "15px 20px" }}>
                      <p style={{ margin: 0, color: "#666" }}>
                        {product.description?.substring(0, 60)}
                        {product.description?.length > 60 ? "..." : ""}
                      </p>
                    </td>
                    <td style={{ padding: "15px 20px" }}>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEditModal(product)}
                          style={{ 
                            borderRadius: "10px", 
                            padding: "8px 12px",
                            border: "2px solid #667eea20"
                          }}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(product.id)}
                          style={{ 
                            borderRadius: "10px", 
                            padding: "8px 12px",
                            border: "2px solid #dc354520"
                          }}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: "60px 20px", textAlign: "center" }}>
                      <FaBox size={50} style={{ color: "#ccc", marginBottom: "15px" }} />
                      <h5 style={{ color: "#666", fontWeight: "600" }}>No Products Yet</h5>
                      <p className="text-muted">Click the "Add New Product" button to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        resetForm();
        setEditingProduct(null);
      }} centered size="lg">
        <Modal.Header closeButton style={{ 
          border: "none", 
          padding: "25px 25px 0",
          background: "linear-gradient(135deg, #667eea10, #764ba210)",
          borderRadius: "16px 16px 0 0"
        }}>
          <Modal.Title className="fw-bold" style={{ fontSize: "1.5rem" }}>
            {editingProduct ? (
              <><FaEdit className="me-2" style={{ color: "#667eea" }} />Edit Product</>
            ) : (
              <><FaPlus className="me-2" style={{ color: "#667eea" }} />Add New Product</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={editingProduct ? handleUpdate : handleCreate}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <FaTag className="me-2 text-primary" />
                Product Name
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Wireless Headphones"
                style={{ padding: "12px", borderRadius: "12px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <FaDollarSign className="me-2 text-primary" />
                Price (₦)
              </Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="e.g., 45000"
                step="0.01"
                style={{ padding: "12px", borderRadius: "12px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description..."
                style={{ padding: "12px", borderRadius: "12px" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                <FaImage className="me-2 text-primary" />
                Product Image
              </Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
                style={{ padding: "12px", borderRadius: "12px" }}
              />
              {previewImage && (
                <div className="mt-3">
                  <p className="mb-2">Preview:</p>
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    style={{ 
                      width: "150px", 
                      height: "150px", 
                      objectFit: "cover", 
                      borderRadius: "12px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                    }} 
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                variant="light" 
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                  setEditingProduct(null);
                }}
                style={{ borderRadius: "12px", padding: "12px 25px" }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                style={{ 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 30px",
                  fontWeight: "600"
                }}
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Products;
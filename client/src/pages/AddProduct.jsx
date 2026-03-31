// src/pages/AddProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../utils/api";
import { FaArrowLeft, FaImage, FaTag, FaDollarSign, FaBox } from "react-icons/fa";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description || "");
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      await createProduct(formDataToSend);
      
      // Success - navigate back to products page
      alert("Product added successfully!");
      navigate("/products");
    } catch (err) {
      console.error("Create error:", err);
      alert(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px 24px",
        color: "white",
        borderRadius: "16px",
        marginBottom: "24px"
      }}>
        <div className="d-flex align-items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "12px",
              padding: "10px",
              color: "white",
              cursor: "pointer"
            }}
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "700", margin: 0 }}>
              <FaBox className="me-2" />
              Add New Product
            </h1>
            <p style={{ fontSize: "0.9rem", opacity: 0.9, marginTop: "5px" }}>
              Fill in the details to list your product
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="card border-0 shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="mb-4">
              <label className="fw-bold mb-2 d-flex align-items-center gap-2">
                <FaTag className="text-primary" />
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Wireless Headphones"
                style={{ padding: "12px", borderRadius: "12px", border: "2px solid #e0e0e0" }}
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="fw-bold mb-2 d-flex align-items-center gap-2">
                <FaDollarSign className="text-primary" />
                Price (₦) *
              </label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="e.g., 45000"
                step="0.01"
                style={{ padding: "12px", borderRadius: "12px", border: "2px solid #e0e0e0" }}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="fw-bold mb-2">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="5"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product in detail..."
                style={{ padding: "12px", borderRadius: "12px", border: "2px solid #e0e0e0" }}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="fw-bold mb-2 d-flex align-items-center gap-2">
                <FaImage className="text-primary" />
                Product Image
              </label>
              <input
                type="file"
                name="image"
                className="form-control"
                onChange={handleInputChange}
                accept="image/*"
                style={{ padding: "12px", borderRadius: "12px", border: "2px solid #e0e0e0" }}
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
            </div>

            {/* Submit Buttons */}
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => navigate("/products")}
                style={{ borderRadius: "12px", padding: "12px 30px", fontWeight: "600" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-grow-1"
                disabled={loading}
                style={{ 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px 30px",
                  fontWeight: "600"
                }}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
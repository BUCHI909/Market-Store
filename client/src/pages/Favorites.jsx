// src/pages/Favorites.jsx
import React, { useEffect, useState } from "react";
import { FaHeart, FaTrash, FaShoppingCart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    setLoading(false);
  }, []);

  const removeFromFavorites = (productId) => {
    const updatedFavorites = favorites.filter(p => p.id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", padding: "24px", paddingBottom: "80px" }}>
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "30px 24px",
        color: "white",
        borderRadius: "20px",
        marginBottom: "24px"
      }}>
        <h1 className="fw-bold mb-2">My Favorites</h1>
        <p className="mb-0 opacity-75">Products you've saved for later</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-5">
          <FaHeart size={60} className="text-muted mb-3" />
          <h5 className="fw-bold">No favorites yet</h5>
          <p className="text-muted">Start exploring and save products you love</p>
          <button 
            className="btn btn-primary mt-3 px-4 py-2 rounded-pill"
            onClick={() => navigate("/shop")}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {favorites.map((product) => (
            <div key={product.id} className="col-12">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="row g-0">
                  <div className="col-4">
                    <img
                      src={product.image || "https://via.placeholder.com/120"}
                      className="img-fluid"
                      alt={product.name}
                      style={{ height: "120px", width: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-8">
                    <div className="card-body p-3">
                      <h6 className="fw-bold mb-1">{product.name}</h6>
                      <div className="d-flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={12} className={i < (product.rating || 4) ? "text-warning" : "text-muted"} />
                        ))}
                      </div>
                      <p className="text-primary fw-bold mb-2">₦{product.price?.toLocaleString()}</p>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          onClick={() => addToCart(product)}
                        >
                          <FaShoppingCart className="me-1" size={12} /> Add to Cart
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => removeFromFavorites(product.id)}
                        >
                          <FaTrash className="me-1" size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
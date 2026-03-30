import React, { useState, useEffect } from "react";
import axios from "../utils/api.js";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price) return alert("Please fill name and price");
    await axios.post("/products", newProduct);
    setNewProduct({ name: "", price: "", description: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await axios.delete(`/products/${id}`);
    fetchProducts();
  };

  const handleEdit = async (id) => {
    const name = prompt("Enter new product name:");
    if (!name) return;
    await axios.put(`/products/${id}`, { name });
    fetchProducts();
  };

  if (loading) return <div className="text-center py-5">Loading products...</div>;

  return (
    <div className="my-4">
      <h3 className="mb-3">Manage Your Products</h3>
      <div className="mb-3 d-flex gap-2">
        <input
          className="form-control"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Price"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <button className="btn btn-primary" onClick={handleAdd}><FaPlus /> Add</button>
      </div>

      <div className="list-group">
        {products.map(p => (
          <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{p.name}</strong> - ${p.price}
              <p className="text-muted mb-0">{p.description}</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-warning" onClick={() => handleEdit(p.id)}><FaEdit /></button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
// src/context/ProductContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProducts, createProduct as apiCreateProduct } from '../utils/api';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const response = await apiCreateProduct(productData);
      const newProduct = response.data;
      setProducts(prev => [newProduct, ...prev]);
      return { success: true, product: newProduct };
    } catch (err) {
      console.error('Failed to add product:', err);
      return { success: false, error: err.response?.data?.message };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await updateProduct(id, productData);
      const updatedProduct = response.data;
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return { success: true, product: updatedProduct };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      loadProducts,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};
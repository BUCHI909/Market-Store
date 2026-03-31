// src/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://market-store-2eop.onrender.com",
  withCredentials: true,
});

// ========== AUTH ==========
export const loginUser = (data) => API.post("/auth/login", data);
export const logoutUser = () => API.post("/auth/logout");
export const getCurrentUser = () =>
  API.get("/auth/me", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

// ========== PRODUCTS ==========
export const getProducts = () => API.get("/auth/products");
export const getProductById = (id) => API.get(`/auth/products/${id}`);
export const createProduct = (formData) => API.post("/auth/products", formData, { 
  headers: { "Content-Type": "multipart/form-data" } 
});
export const updateProduct = (id, formData) => API.put(`/auth/products/${id}`, formData, { 
  headers: { "Content-Type": "multipart/form-data" } 
});
export const deleteProduct = (id) => API.delete(`/auth/products/${id}`);

// ========== ORDERS ==========
export const getOrders = async () => {
  const res = await API.get("/auth/orders");
  return res.data;
};

// ✅ FIXED: Added createOrder export (this was missing!)
export const createOrder = (orderData) => API.post("/auth/orders", orderData);

export const updateOrderStatus = ({ orderId, status }) => 
  API.put("/auth/orders/status", { orderId, status });

// ========== REVIEWS ==========
export const getReviews = async () => {
  const res = await API.get("/auth/reviews");
  return res.data;
};

// ========== PROFILE ==========
export const getProfile = () => {
  return API.get("/auth/me");
};

export const updateProfile = (data) => {
  return API.put("/auth/update-profile", data);
};

// ✅ FIXED: Fixed updateProfilePicture function (was missing formData parameter)
export const updateProfilePicture = (formData) =>
  API.post("/auth/update-profile-picture", formData, { 
    headers: { "Content-Type": "multipart/form-data" } 
  });

// ========== SETTINGS API ==========
export const getFullProfile = () => API.get('/settings/profile');
export const updateProfileSettings = (data) => API.put('/settings/profile', data);
export const uploadAvatar = (formData) => API.post('/settings/avatar', formData);
export const updatePassword = (data) => API.put('/settings/password', data);
export const getStoreSettings = () => API.get('/settings/store');
export const updateStoreSettings = (data) => API.put('/settings/store', data);
export const getNotificationSettings = () => API.get('/settings/notifications');
export const updateNotificationSettings = (data) => API.put('/settings/notifications', data);
export const getAppearanceSettings = () => API.get('/settings/appearance');
export const updateAppearanceSettings = (data) => API.put('/settings/appearance', data);
export const deleteAccount = (password) => API.delete('/settings/account', { data: { password } });

// ========== PAYMENT API ==========
export const createPaymentIntent = (orderData) => 
  API.post('/payments/create-intent', orderData);

export const verifyPayment = (reference) => 
  API.get(`/payments/verify/${reference}`);

export const getTransactions = () => 
  API.get('/payments/transactions');

export const processRefund = (data) => 
  API.post('/payments/refund', data);

// ========== REQUEST INTERCEPTOR ==========
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
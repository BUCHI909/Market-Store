import axios from "axios";

// ✅ FIXED: Remove the trailing slash if present
const API = axios.create({
  baseURL: "https://market-store-2eop.onrender.com",  // ← NO trailing slash
  withCredentials: true,  // ✅ This sends cookies with every request
});

// ========== AUTH ==========
export const loginUser = (data) => API.post("/api/auth/login", data);  // ← Added /api prefix
export const logoutUser = () => API.post("/api/auth/logout");  // ← Added /api prefix
export const getCurrentUser = () => API.get("/api/auth/me");  // ← Added /api prefix

// ========== PRODUCTS ==========
export const getProducts = () => API.get("/api/auth/products");  // ← Added /api prefix
export const getProductById = (id) => API.get(`/api/auth/products/${id}`);
export const createProduct = (formData) => API.post("/api/auth/products", formData, { 
  headers: { "Content-Type": "multipart/form-data" } 
});
export const updateProduct = (id, formData) => API.put(`/api/auth/products/${id}`, formData, { 
  headers: { "Content-Type": "multipart/form-data" } 
});
export const deleteProduct = (id) => API.delete(`/api/auth/products/${id}`);

// ========== ORDERS ==========
export const getOrders = async () => {
  const res = await API.get("/api/auth/orders");  // ← Added /api prefix
  return res.data;
};

export const createOrder = (orderData) => API.post("/api/auth/orders", orderData);

export const updateOrderStatus = ({ orderId, status }) => 
  API.put("/api/auth/orders/status", { orderId, status });

// ========== REVIEWS ==========
export const getReviews = async () => {
  const res = await API.get("/api/auth/reviews");  // ← Added /api prefix
  return res.data;
};

// ========== PROFILE ==========
export const getProfile = () => {
  return API.get("/api/auth/me");
};

export const updateProfile = (data) => {
  return API.put("/api/auth/update-profile", data);
};

export const updateProfilePicture = (formData) =>
  API.post("/api/auth/update-profile-picture", formData, { 
    headers: { "Content-Type": "multipart/form-data" } 
  });

// ========== SETTINGS API ==========
export const getFullProfile = () => API.get('/api/settings/profile');  // ← Added /api prefix
export const updateProfileSettings = (data) => API.put('/api/settings/profile', data);
export const uploadAvatar = (formData) => API.post('/api/settings/avatar', formData);
export const updatePassword = (data) => API.put('/api/settings/password', data);
export const getStoreSettings = () => API.get('/api/settings/store');
export const updateStoreSettings = (data) => API.put('/api/settings/store', data);
export const getNotificationSettings = () => API.get('/api/settings/notifications');
export const updateNotificationSettings = (data) => API.put('/api/settings/notifications', data);
export const getAppearanceSettings = () => API.get('/api/settings/appearance');
export const updateAppearanceSettings = (data) => API.put('/api/settings/appearance', data);
export const deleteAccount = (password) => API.delete('/api/settings/account', { data: { password } });

// ========== PAYMENT API ==========
export const createPaymentIntent = (orderData) => 
  API.post('/api/payments/create-intent', orderData);

export const verifyPayment = (reference) => 
  API.get(`/api/payments/verify/${reference}`);

export const getTransactions = () => 
  API.get('/api/payments/transactions');

export const processRefund = (data) => 
  API.post('/api/payments/refund', data);

// ========== REQUEST INTERCEPTOR - REMOVED! ==========
// ❌ REMOVE THIS ENTIRE INTERCEPTOR
// We're using cookies now, not localStorage tokens
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

export default API;
// backend/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getOrders,
  updateOrderStatus,
  updateProfile,
  updateProfilePicture,
  getAllReviews,
  registerBuyer,
  registerSeller,
  getPublicProducts, // ✅ Add this import
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import pool from "../config/db.js";

const router = express.Router();

// ========== PUBLIC ROUTES (No authentication required) ==========

// Auth - Public
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Password Reset - Public
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Registration Routes - Public
router.post("/register-buyer", registerBuyer);
router.post("/register-seller", upload.single("businessDocument"), registerSeller);

// ✅ PUBLIC PRODUCTS ENDPOINT - Anyone can view products (no login required)
router.get("/public/products", getPublicProducts);

// ========== PROTECTED ROUTES (Authentication required) ==========

// Get current user - Protected
router.get("/me", protect, async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.userId]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (client) client.release();
  }
});

// Profile - Protected
router.get("/profile", protect, getProfile);
router.put("/update-profile", protect, updateProfile);
router.post("/update-profile-picture", protect, upload.single("profilePicture"), updateProfilePicture);

// Products - Protected (for sellers to manage their own products)
router.get("/products", protect, getProducts);
router.post("/products", protect, upload.single("image"), createProduct);
router.delete("/products/:id", protect, deleteProduct);
router.put("/products/:id", protect, upload.single("image"), updateProduct);
// Add this if not already present
router.get("/public/products", async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    
    const result = await client.query(
      `SELECT p.*, u.name as seller_name, u.id as seller_id
       FROM products p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.active = true
       ORDER BY p.created_at DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch public products error:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  } finally {
    if (client) client.release();
  }
});

// Orders - Protected
router.get("/orders", protect, getOrders);
router.put("/orders/status", protect, updateOrderStatus);

// Reviews - Protected
router.get("/reviews", protect, getAllReviews);

export default router;
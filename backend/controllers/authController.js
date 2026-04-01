// backend/controllers/authController.js
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../config/mailer.js";
import {
  welcomeEmail,
  forgotEmail,
  resetSuccessEmail,
} from "../config/emailTemplates.js";
import path from "path";
import fs from "fs";

/* ================= TOKEN ================= */
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

/* ================= REGISTER (Original) ================= */
export const register = async (req, res) => {
  let client;
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    client = await pool.connect();
    
    const existing = await client.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (existing.rows.length) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await client.query(
      `INSERT INTO users(name, email, password, role, created_at)
       VALUES($1, $2, $3, $4, NOW()) RETURNING id, name, email, role`,
      [name, email, hashed, 'buyer']
    );

    const token = createToken(user.rows[0].id);
    
    // ✅ UPDATED COOKIE CONFIGURATION FOR MOBILE
    res.cookie("token", token, { 
      httpOnly: true,
      secure: true,           // Required for HTTPS (Vercel/Render use HTTPS)
      sameSite: 'none',       // Allows cross-site cookies (frontend on Vercel, backend on Render)
      partitioned: true,      // For Chrome browsers
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'              // Cookie available across all routes
    });

    await sendEmail(email, "Welcome to MarketSphere", welcomeEmail(name));

    res.json({
      message: "Registered successfully",
      user: user.rows[0],
      token
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  } finally {
    if (client) client.release();
  }
};

/* ================= BUYER REGISTRATION ================= */
export const registerBuyer = async (req, res) => {
  let client;
  try {
    const { name, email, password } = req.body;

    console.log('📝 Registering buyer:', email);

    client = await pool.connect();

    const existing = await client.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await client.query(
      `INSERT INTO users(name, email, password, role, created_at)
       VALUES($1, $2, $3, $4, NOW()) 
       RETURNING id, name, email, role`,
      [name, email, hashed, 'buyer']
    );

    console.log('✅ Buyer registered successfully:', email);
    

    res.cookie("token", token ,{
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned : true,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      path : '/'
    
    }); 


    await sendEmail(email ,"Welcome to MarketSphere" , welcomeEmail(name));

    res.json({
      success: true,
      message: "Buyer account created successfully",
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
      }
    });
  } catch (err) {
    console.error("❌ Buyer Registration Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  } finally {
    if (client) client.release();
  }
};

/* ================= SELLER REGISTRATION ================= */
export const registerSeller = async (req, res) => {
  let client;
  try {
    const { name, email, password, phone, shopName, shopDescription } = req.body;

    console.log('📝 Registering seller:', email);

    client = await pool.connect();

    const existing = await client.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await client.query('BEGIN');

    try {
      const user = await client.query(
        `INSERT INTO users(name, email, password, phone, role, created_at)
         VALUES($1, $2, $3, $4, $5, NOW()) 
         RETURNING id, name, email, role`,
        [name, email, hashed, phone || '', 'seller']
      );

      await client.query(
        `INSERT INTO stores(user_id, store_name, store_description, status, created_at)
         VALUES($1, $2, $3, $4, NOW())`,
        [user.rows[0].id, shopName, shopDescription || '', 'active']
      );

      await client.query('COMMIT');

      console.log('✅ Seller registered successfully:', email);

      res.cookies ( 'token', token ,{
        httpOnly: true ,
        secure: true,
        sameSite:'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
         

      });

      await sendEmail(email , "Welcome to MarketSphere" , welcomeEmail(name));

      res.json({
        success: true,
        message: "Seller account created successfully",
        user: {
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
          role: user.rows[0].role
        }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error("❌ Seller Registration Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  } finally {
    if (client) client.release();
  }
};

/* ================= LOGIN ================= */
// backend/controllers/authController.js - Update login function
export const login = async (req, res) => {
  let client;
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log('🔐 Login attempt:', email);
    console.log('Request body:', req.body);

    client = await pool.connect();

    const user = await client.query(
      "SELECT id, name, email, password, role FROM users WHERE email=$1",
      [email.toLowerCase()] // ✅ Normalize email to lowercase
    );

    if (!user.rows.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user.rows[0].id);
    
    // ✅ Cookie options
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie("token", token, { 
      httpOnly: true,
      secure: isProduction, // Only secure in production
      sameSite: isProduction ? 'none' : 'lax',
      partitioned: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    console.log('✅ Login successful for:', email);

    res.json({
      message: "Logged in successfully",
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
      }
    });
  } catch (err) {
    console.error("❌ Login Error Details:", err);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ 
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    if (client) client.release();
  }
};
/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  // ✅ Updated to clear cookie with matching options
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
  });
  res.json({ message: "Logged out successfully" });
};
/* ================= PROFILE ================= */
export const getProfile = async (req, res) => {
  let client;
  try {
    const userId = req.userId;

    client = await pool.connect();

    const result = await client.query(
      `SELECT id, name, email, phone, bio, location, website, 
              avatar, profile_picture, role, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (client) client.release();
  }
};

// backend/controllers/authController.js - Verify updateProfile function
export const updateProfile = async (req, res) => {
  let client;
  try {
    const userId = req.userId;
    const { name, email, phone, bio, location, website } = req.body;

    console.log('Updating profile for user:', userId);
    console.log('Update data:', { name, email, phone, bio, location, website });

    client = await pool.connect();

    // Don't allow email change to avoid conflicts
    const updateQuery = `
      UPDATE users 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           bio = COALESCE($3, bio),
           location = COALESCE($4, location),
           website = COALESCE($5, website)
       WHERE id = $6
       RETURNING id, name, email, phone, bio, location, website, avatar, role
    `;
    
    const result = await client.query(updateQuery, [
      name, phone, bio, location, website, userId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log('Profile updated successfully');
    res.json({
      message: "Profile updated successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    if (client) client.release();
  }
};
export const updateProfilePicture = async (req, res) => {
  let client;
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    client = await pool.connect();

    const profilePicture = `/uploads/${req.file.filename}`;

    await client.query(
      "UPDATE users SET avatar = $1 WHERE id = $2",
      [profilePicture, userId]
    );

    res.json({
      message: "Profile picture updated",
      profilePicture
    });
  } catch (err) {
    console.error("Update Profile Picture Error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (client) client.release();
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  let client;
  try {
    const { email } = req.body;

    client = await pool.connect();

    const user = await client.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (!user.rows.length) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await client.query(
      `UPDATE users
       SET reset_token=$1, reset_token_expiry=$2
       WHERE email=$3`,
      [resetToken, expiry, email]
    );

    const link = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      email,
      "Reset Password",
      forgotEmail(user.rows[0].name, link)
    );

    res.json({ message: "Reset link sent to email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error during password reset request" });
  } finally {
    if (client) client.release();
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  let client;
  try {
    const { token } = req.params;
    const { password } = req.body;

    client = await pool.connect();

    const user = await client.query(
      `SELECT * FROM users
       WHERE reset_token=$1
       AND reset_token_expiry > NOW()`,
      [token]
    );

    if (!user.rows.length) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await client.query(
      `UPDATE users
       SET password=$1,
           reset_token=NULL,
           reset_token_expiry=NULL
       WHERE id=$2`,
      [hashed, user.rows[0].id]
    );

    await sendEmail(
      user.rows[0].email,
      "Password Updated",
      resetSuccessEmail(user.rows[0].name)
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error during password reset" });
  } finally {
    if (client) client.release();
  }
};

/* ================= PRODUCTS ================= */
// backend/controllers/authController.js
// Update the getProducts function with better error handling

export const getProducts = async (req, res) => {
  let client;
  try {
    console.log('🔍 Fetching products for user:', req.userId);
    
    client = await pool.connect();
    
    // First check if products table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('⚠️ Products table does not exist');
      return res.json([]);
    }
    
    const result = await client.query(
      `SELECT * FROM products
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    );
    
    console.log(`✅ Found ${result.rows.length} products for user ${req.userId}`);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Fetch Products Error:", error);
    console.error("Error details:", error.message);
    // Return empty array instead of error
    res.status(200).json([]);
  } finally {
    if (client) client.release();
  }
};

export const createProduct = async (req, res) => {
  let client;
  try {
    const { name, description, price, rating } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    client = await pool.connect();

    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

    const result = await client.query(
      `INSERT INTO products(
        user_id, name, description, price, active, image, rating, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *`,
      [req.userId, name, description || "", Number(price), true, imagePath, rating ? Number(rating) : 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Failed to create product" });
  } finally {
    if (client) client.release();
  }
};

export const updateProduct = async (req, res) => {
  let client;
  try {
    const { id } = req.params;
    const { name, description, price, rating, active } = req.body;
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

    client = await pool.connect();

    const result = await client.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, rating = $4, active = $5,
           image = COALESCE($6, image)
       WHERE id = $7 AND user_id = $8 RETURNING *`,
      [name, description, Number(price), rating ? Number(rating) : 0, active ?? true, imagePath, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Failed to update product" });
  } finally {
    if (client) client.release();
  }
};

export const deleteProduct = async (req, res) => {
  let client;
  try {
    const { id } = req.params;

    client = await pool.connect();

    const old = await client.query(
      "SELECT image FROM products WHERE id=$1 AND user_id=$2",
      [id, req.userId]
    );

    if (!old.rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (old.rows[0].image) {
      const oldPath = path.join("public", old.rows[0].image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await client.query("DELETE FROM products WHERE id=$1 AND user_id=$2", [id, req.userId]);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  } finally {
    if (client) client.release();
  }
};

/* ================= ORDERS ================= */
export const createOrder = async (req, res) => {
  let client;
  try {
    const buyerId = req.userId;
    const { productId, quantity } = req.body;

    client = await pool.connect();

    const productRes = await client.query("SELECT * FROM products WHERE id = $1", [productId]);

    if (productRes.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productRes.rows[0];

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const totalAmount = product.price * quantity;

    const orderRes = await client.query(
      `INSERT INTO orders (buyer_id, seller_id, product_id, quantity, price, total_amount, status, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [buyerId, product.user_id, product.id, quantity, product.price, totalAmount, 'pending', 'unpaid']
    );

    await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [quantity, product.id]);

    res.status(201).json(orderRes.rows[0]);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (client) client.release();
  }
};

export const getOrders = async (req, res) => {
  let client;
  try {
    const userId = req.userId;

    console.log('📦 Fetching orders for user:', userId);

    client = await pool.connect();

    const ordersRes = await client.query(
      `SELECT 
        o.*, 
        p.name AS product_name, 
        p.image AS image_url
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.buyer_id = $1 OR o.seller_id = $1
      ORDER BY o.created_at DESC`,
      [userId]
    );

    console.log(`✅ Found ${ordersRes.rows.length} orders`);
    res.json(ordersRes.rows);
  } catch (err) {
    console.error("Get orders error:", err);
    // Return empty array instead of error to prevent frontend crashes
    res.status(200).json([]);
  } finally {
    if (client) {
      client.release();
      console.log('🔓 Released order connection');
    }
  }
};

export const updateOrderStatus = async (req, res) => {
  let client;
  try {
    const sellerId = req.userId;
    const { orderId, status } = req.body;

    client = await pool.connect();

    const orderRes = await client.query(
      "SELECT * FROM orders WHERE id = $1 AND seller_id = $2",
      [orderId, sellerId]
    );
    if (orderRes.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRes.rows[0];

    const allowedTransitions = {
      Pending: ["Confirmed", "Cancelled"],
      Confirmed: ["Shipped"],
      Shipped: ["Delivered"]
    };

    if (!allowedTransitions[order.status] || !allowedTransitions[order.status].includes(status)) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    const updateRes = await client.query(
      "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
      [status, orderId]
    );

    res.json(updateRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (client) client.release();
  }
};

/* ================= REVIEWS ================= */
export const getAllReviews = async (req, res) => {
  let client;
  try {
    const userId = req.userId;
    console.log('📝 Fetching reviews for user:', userId);

    client = await pool.connect();
    
    // Check if reviews table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'reviews'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('⚠️ Reviews table does not exist');
      return res.json([]);
    }

    const reviewsRes = await client.query(
      `SELECT r.*, u.name as user_name, p.name as product_name
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN products p ON r.product_id = p.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    console.log(`✅ Found ${reviewsRes.rows.length} reviews`);
    res.json(reviewsRes.rows);
  } catch (err) {
    console.error("Get reviews error:", err);
    // Return empty array instead of error
    res.status(200).json([]);
  } finally {
    if (client) {
      client.release();
      console.log('🔓 Released review connection');
    }
  }
};

/* ================= PUBLIC PRODUCTS (FOR BUYERS) ================= */
export const getPublicProducts = async (req, res) => {
  let client;
  try {
    console.log('🛍️ Fetching public products for buyers');
    
    client = await pool.connect();
    
    const result = await client.query(
      `SELECT p.*, u.name as seller_name, u.id as seller_id
       FROM products p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.active = true
       ORDER BY p.created_at DESC`
    );
    
    console.log(`✅ Found ${result.rows.length} products from sellers`);
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch public products error:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  } finally {
    if (client) {
      client.release();
      console.log('🔓 Released public products connection');
    }
  }
};
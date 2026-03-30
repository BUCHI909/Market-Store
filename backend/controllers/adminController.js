// backend/controllers/adminController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// ========== AUTH FUNCTIONS ==========
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('👑 Admin login attempt:', email);

    const result = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ Admin not found:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    
    if (!validPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    await pool.query(
      'UPDATE admin_users SET last_login = NOW() WHERE id = $1',
      [admin.id]
    );

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    console.log('✅ Admin logged in:', email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    console.log('👤 Fetching admin profile...');
    console.log('req.adminId:', req.adminId); // Debug log
    
    const adminId = req.adminId;
    
    if (!adminId) {
      console.log('❌ No admin ID found in request');
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    const result = await pool.query(
      'SELECT id, name, email, role, last_login, created_at FROM admin_users WHERE id = $1',
      [adminId]
    );

    console.log('Query result rows:', result.rows.length);

    if (result.rows.length === 0) {
      console.log('❌ Admin not found in database');
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    console.log('✅ Admin profile fetched successfully');
    res.json({ 
      success: true, 
      admin: result.rows[0] 
    });

  } catch (error) {
    console.error('❌ Error fetching admin profile:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};


// ========== DASHBOARD STATS - CORRECTED WITH buyer_id ==========

export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
    
    res.json({
      total: parseInt(totalUsers.rows[0].count) || 0,
      newToday: 0,
      sellers: 0
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(200).json({ total: 0, newToday: 0, sellers: 0 });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await pool.query('SELECT COUNT(*) FROM orders');
    
    const revenueResult = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'paid'"
    );
    
    const pendingOrders = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status = 'pending'"
    );

    res.json({
      total: parseInt(totalOrders.rows[0].count) || 0,
      revenue: parseFloat(revenueResult.rows[0].sum) || 0,
      pending: parseInt(pendingOrders.rows[0].count) || 0
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    res.status(200).json({ total: 0, revenue: 0, pending: 0 });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id,
        o.total_amount as amount,
        o.status,
        o.created_at,
        u.name as customer_name
      FROM orders o
      LEFT JOIN users u ON o.buyer_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting recent orders:', error);
    res.status(200).json([]);
  }
};

export const getRecentUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        email,
        created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const usersWithStoreCount = result.rows.map(user => ({
      ...user,
      store_count: 0
    }));

    res.json(usersWithStoreCount);
  } catch (error) {
    console.error('Error getting recent users:', error);
    res.status(200).json([]);
  }
};

export const getWeeklyAnalytics = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(DATE_TRUNC('day', created_at), 'Dy') as day,
        COALESCE(SUM(total_amount), 0) as value
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY DATE_TRUNC('day', created_at)
    `);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => {
      const found = result.rows.find(r => r.day === day);
      return {
        day,
        value: found ? parseFloat(found.value) : 0
      };
    });

    res.json(data);
  } catch (error) {
    console.error('Error getting weekly analytics:', error);
    res.json([
      { day: 'Mon', value: 450000 },
      { day: 'Tue', value: 520000 },
      { day: 'Wed', value: 480000 },
      { day: 'Thu', value: 610000 },
      { day: 'Fri', value: 750000 },
      { day: 'Sat', value: 820000 },
      { day: 'Sun', value: 680000 }
    ]);
  }
};

// Store stats remain as is (you don't have stores table yet)
export const getStoreStats = async (req, res) => {
  res.status(200).json({ total: 0, active: 0, pending: 0 });
};

export const getProductStats = async (req, res) => {
  try {
    const totalProducts = await pool.query('SELECT COUNT(*) FROM products');
    res.json({
      total: parseInt(totalProducts.rows[0].count) || 0,
      active: 0,
      lowStock: 0
    });
  } catch (error) {
    console.error('Error getting product stats:', error);
    res.status(200).json({ total: 0, active: 0, lowStock: 0 });
  }
};

// ========== USER MANAGEMENT ==========
export const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      role = 'all',
      status = 'all' 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.role,
        u.created_at,
        u.avatar,
        COUNT(DISTINCT s.id) as store_count,
        COUNT(DISTINCT o.id) as order_count
      FROM users u
      LEFT JOIN stores s ON u.id = s.user_id
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;
    
    if (search) {
      query += ` AND (u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    if (role !== 'all') {
      query += ` AND u.role = $${paramIndex}`;
      queryParams.push(role);
      paramIndex++;
    }
    
    query += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);
    
    const result = await pool.query(query, queryParams);
    
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      users: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const userResult = await pool.query(`
      SELECT 
        u.*,
        COUNT(DISTINCT s.id) as store_count,
        COUNT(DISTINCT o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN stores s ON u.id = s.user_id
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.id = $1
      GROUP BY u.id
    `, [id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = userResult.rows[0];
    
    const stores = await pool.query(`
      SELECT * FROM stores WHERE user_id = $1
    `, [id]);
    
    const orders = await pool.query(`
      SELECT o.*, p.name as product_name 
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      LIMIT 10
    `, [id]);
    
    res.json({
      ...user,
      stores: stores.rows,
      recentOrders: orders.rows
    });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const validRoles = ['user', 'seller', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'User role updated successfully',
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2',
      [status, id]
    );
    
    res.json({
      message: `User ${status === 'suspended' ? 'suspended' : 'activated'} successfully`,
      userId: id,
      status
    });
    
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const stores = await pool.query('SELECT COUNT(*) FROM stores WHERE user_id = $1', [id]);
    const products = await pool.query('SELECT COUNT(*) FROM products WHERE user_id = $1', [id]);
    const orders = await pool.query('SELECT COUNT(*) FROM orders WHERE user_id = $1', [id]);
    
    if (parseInt(stores.rows[0].count) > 0 || 
        parseInt(products.rows[0].count) > 0 || 
        parseInt(orders.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with existing stores, products, or orders. Suspend instead.' 
      });
    }
    
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: 'User deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== STORE MANAGEMENT ==========
export const getAllStores = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = 'all' 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        s.*,
        u.name as owner_name,
        u.email as owner_email,
        COUNT(DISTINCT p.id) as product_count,
        COALESCE(SUM(o.total_amount), 0) as total_sales
      FROM stores s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN products p ON s.user_id = p.user_id
      LEFT JOIN orders o ON p.id = o.product_id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;
    
    if (search) {
      query += ` AND (s.store_name ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    if (status !== 'all') {
      query += ` AND s.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }
    
    query += ` GROUP BY s.id, u.id ORDER BY s.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);
    
    const result = await pool.query(query, queryParams);
    
    const countResult = await pool.query('SELECT COUNT(*) FROM stores');
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      stores: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const storeResult = await pool.query(`
      SELECT 
        s.*,
        u.name as owner_name,
        u.email as owner_email,
        u.phone as owner_phone
      FROM stores s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `, [id]);
    
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    const store = storeResult.rows[0];
    
    const products = await pool.query(`
      SELECT * FROM products WHERE user_id = $1
    `, [store.user_id]);
    
    const orders = await pool.query(`
      SELECT o.*, u.name as customer_name 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.seller_id = $1
      ORDER BY o.created_at DESC
      LIMIT 10
    `, [store.user_id]);
    
    res.json({
      ...store,
      products: products.rows,
      recentOrders: orders.rows
    });
    
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStoreStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    const result = await pool.query(
      `UPDATE stores 
       SET status = $1, 
           reviewed_at = NOW(),
           review_notes = $2
       WHERE id = $3 
       RETURNING *`,
      [status, reason, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    if (status === 'approved') {
      await pool.query(
        'UPDATE users SET role = $1 WHERE id = $2',
        ['seller', result.rows[0].user_id]
      );
    }
    
    res.json({
      message: `Store ${status} successfully`,
      store: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error updating store status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
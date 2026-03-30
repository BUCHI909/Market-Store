// backend/routes/adminRoutes.js
import express from 'express';
import { 
  adminLogin,
  getAdminProfile,
  getUserStats,
  getStoreStats,
  getProductStats,
  getOrderStats,
  getRecentOrders,
  getRecentUsers,
  getWeeklyAnalytics,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getAllStores,
  getStoreById,
  updateStoreStatus
} from '../controllers/adminController.js'; // ← This should match your exports
import { protectAdmin } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes
router.use(protectAdmin);

// Profile
router.get('/profile', getAdminProfile);

// Dashboard stats
router.get('/users/stats', getUserStats);
router.get('/stores/stats', getStoreStats);
router.get('/products/stats', getProductStats);
router.get('/orders/stats', getOrderStats);
router.get('/orders/recent', getRecentOrders);
router.get('/users/recent', getRecentUsers);
router.get('/analytics/weekly', getWeeklyAnalytics);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Store management
router.get('/stores', getAllStores);
router.get('/stores/:id', getStoreById);
router.put('/stores/:id/status', updateStoreStatus);

export default router;
// backend/routes/paymentRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createPaymentIntent,
  verifyPayment,
  getTransactions,
  processRefund,
  handleWebhook
} from '../controllers/paymentController.js';

const router = express.Router();

// Public webhook endpoint (no auth) - Paystack calls this
router.post('/webhook', handleWebhook);

// Protected routes (require authentication)
router.post('/create-intent', protect, createPaymentIntent);
router.get('/verify/:reference', protect, verifyPayment);
router.get('/transactions', protect, getTransactions);
router.post('/refund', protect, processRefund);

export default router;
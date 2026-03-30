// backend/controllers/paymentController.js
import axios from 'axios';
import pool from '../config/db.js';

// ===== HELPER FUNCTIONS (MUST come before they're used) =====
async function handleSuccessfulPayment(data) {
  console.log('💰 Processing successful payment:', data.reference);
  
  // Update transaction status
  await pool.query(
    `UPDATE transactions 
     SET status = 'success', paid_at = NOW() 
     WHERE reference = $1`,
    [data.reference]
  );
  
  // You can also create orders here if needed
  console.log(`✅ Payment ${data.reference} marked as success`);
}

async function handleFailedPayment(data) {
  console.log('❌ Processing failed payment:', data.reference);
  
  await pool.query(
    `UPDATE transactions 
     SET status = 'failed' 
     WHERE reference = $1`,
    [data.reference]
  );
  
  console.log(`❌ Payment ${data.reference} marked as failed`);
}

async function handleRefund(data) {
  console.log('💰 Processing refund:', data.transaction_reference);
  
  await pool.query(
    `UPDATE transactions 
     SET status = 'refunded' 
     WHERE reference = $1`,
    [data.transaction_reference]
  );
  
  console.log(`💰 Payment ${data.transaction_reference} refunded`);
}

// ===== MAIN CONTROLLER FUNCTIONS =====

// @desc    Initialize payment
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, email, metadata } = req.body;
    
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: amount * 100,
        email,
        metadata,
        callback_url: `${process.env.FRONTEND_URL}/payment/verify`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Save transaction to database
    await pool.query(
      `INSERT INTO transactions 
       (user_id, reference, amount, status, metadata) 
       VALUES ($1, $2, $3, $4, $5)`,
      [req.userId, response.data.data.reference, amount, 'pending', JSON.stringify(metadata)]
    );

    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to initialize payment' 
    });
  }
};

// @desc    Verify payment
// @route   GET /api/payments/verify/:reference
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const { data } = response.data;

    if (data.status === 'success') {
      // Update transaction status
      await pool.query(
        `UPDATE transactions 
         SET status = 'success', 
             paid_at = NOW() 
         WHERE reference = $1`,
        [reference]
      );

      // Get transaction details
      const transaction = await pool.query(
        'SELECT * FROM transactions WHERE reference = $1',
        [reference]
      );

      if (transaction.rows.length > 0) {
        const metadata = transaction.rows[0].metadata;
        
        // Create orders for items
        for (const item of metadata.items) {
          await pool.query(
            `INSERT INTO orders 
             (user_id, product_id, quantity, total_amount, transaction_id, status)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              req.userId,
              item.id,
              item.quantity,
              item.price * item.quantity,
              reference,
              'paid'
            ]
          );
        }
      }
    }

    res.json({
      success: data.status === 'success',
      data
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify payment' 
    });
  }
};

// @desc    Get transaction history
// @route   GET /api/payments/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const transactions = await pool.query(
      `SELECT * FROM transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.userId]
    );

    res.json(transactions.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private
export const processRefund = async (req, res) => {
  try {
    const { transactionId, amount } = req.body;

    const transaction = await pool.query(
      'SELECT * FROM transactions WHERE reference = $1 AND user_id = $2',
      [transactionId, req.userId]
    );

    if (transaction.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const response = await axios.post(
      'https://api.paystack.co/refund',
      {
        transaction: transactionId,
        amount: amount * 100
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    await pool.query(
      `UPDATE transactions 
       SET status = 'refunded' 
       WHERE reference = $1`,
      [transactionId]
    );

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: response.data
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process refund' 
    });
  }
};

// @desc    Webhook handler for Paystack
// @route   POST /api/payments/webhook
// @access  Public
export const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    
    console.log('🔔 Webhook received:', event.event);
    console.log('📦 Webhook data:', JSON.stringify(event.data, null, 2));

    // Verify webhook signature (optional but recommended)
    // You can add signature verification here
    
    switch (event.event) {
      case 'charge.success':
        console.log(`✅ Charge successful: ${event.data.reference}`);
        await handleSuccessfulPayment(event.data);
        break;
        
      case 'charge.failed':
        console.log(`❌ Charge failed: ${event.data.reference}`);
        await handleFailedPayment(event.data);
        break;
        
      case 'refund.processed':
        console.log(`💰 Refund processed: ${event.data.transaction_reference}`);
        await handleRefund(event.data);
        break;
        
      default:
        console.log(`ℹ️ Unhandled event type: ${event.event}`);
    }

    // Always return 200 OK to acknowledge receipt
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Webhook error:', error);
    // Still return 200 to prevent Paystack from retrying
    res.sendStatus(200);
  }
};
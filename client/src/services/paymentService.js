// client/src/services/paymentService.js
import { createPaymentIntent, verifyPayment } from '../utils/api';

class PaymentService {
  constructor() {
    this.paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    this.scriptLoadPromise = null;

    if (!this.paystackPublicKey) {
      console.error('❌ Paystack public key not found in .env file');
    }
  }

  generateReference() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN_${timestamp}_${random}`;
  }

  // Handle browser tracking prevention
  async ensureStorageAccess() {
    // Check if we're in a browser that needs storage access
    if (document.hasStorageAccess) {
      try {
        const hasAccess = await document.hasStorageAccess();
        if (!hasAccess && document.requestStorageAccess) {
          console.log('📦 Requesting storage access...');
          await document.requestStorageAccess();
          console.log('✅ Storage access granted');
        }
      } catch (err) {
        console.warn('Storage access not available:', err);
      }
    }
  }

  async loadPaystackScript() {
    // First ensure we have storage access
    await this.ensureStorageAccess();

    if (window.PaystackPop) {
      return Promise.resolve();
    }

    if (this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    this.scriptLoadPromise = new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.getElementById('paystack-script')) {
        // Script tag exists, wait for it to load
        const checkInterval = setInterval(() => {
          if (window.PaystackPop) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Paystack script load timeout'));
        }, 10000);

        return;
      }

      // Create and load script
      const script = document.createElement('script');
      script.id = 'paystack-script';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.referrerPolicy = 'no-referrer-when-downgrade';

      script.onload = () => {
        console.log('✅ Paystack script loaded');
        setTimeout(() => {
          if (window.PaystackPop) {
            resolve();
          } else {
            reject(new Error('Paystack not initialized'));
          }
        }, 500);
      };

      script.onerror = (e) => {
        console.error('❌ Failed to load Paystack script:', e);
        this.scriptLoadPromise = null;
        reject(new Error('Failed to load Paystack script'));
      };

      document.head.appendChild(script);
    });

    return this.scriptLoadPromise;
  }

  // In paymentService.js - Replace the initializePaystackPayment method

  async initializePaystackPayment({ email, amount, metadata, onSuccess, onClose }) {
    console.log('🚀 Starting payment initialization...');
    console.log('📧 Email:', email);
    console.log('💰 Amount:', amount);
    console.log('🔑 Key exists:', !!this.paystackPublicKey);

    try {
      // Check Paystack library
      console.log('1. Checking if Paystack is loaded...');
      if (!window.PaystackPop) {
        console.log('2. Paystack not loaded, attempting to load...');
        try {
          await this.loadPaystackScript();
          console.log('3. Paystack loaded successfully');
        } catch (loadError) {
          console.error('❌ Failed to load Paystack:', loadError);
          alert('Payment system failed to load. Please check your internet connection.');
          if (onClose) onClose();
          return;
        }
      } else {
        console.log('2. Paystack already loaded');
      }

      // Verify Paystack is ready
      console.log('4. Verifying Paystack object...');
      console.log('window.PaystackPop type:', typeof window.PaystackPop);
      console.log('setup function exists:', typeof window.PaystackPop?.setup === 'function');

      if (!window.PaystackPop || typeof window.PaystackPop.setup !== 'function') {
        throw new Error('Paystack library not properly initialized');
      }

      // Validate inputs
      console.log('5. Validating inputs...');
      if (!email) {
        console.error('❌ Email is missing');
        throw new Error('Email is required for payment');
      }

      if (!amount || amount <= 0) {
        console.error('❌ Invalid amount:', amount);
        throw new Error('Valid amount is required');
      }

      if (!this.paystackPublicKey) {
        console.error('❌ Paystack public key is missing');
        throw new Error('Payment system not configured');
      }

      // Create reference
      const reference = this.generateReference();
      console.log('6. Generated reference:', reference);

      // Setup Paystack - FIXED CALLBACK
      console.log('7. Setting up Paystack handler...');
      console.log('Using public key:', this.paystackPublicKey.substring(0, 10) + '...');

      // IMPORTANT: Store 'this' reference for use inside callback
      const self = this;

      const handler = window.PaystackPop.setup({
        key: this.paystackPublicKey,
        email: email,
        amount: amount * 100,
        currency: 'NGN',
        ref: reference,
        metadata: metadata,
        // FIXED: Not using async function directly
        callback: function (response) {
          console.log('✅ Paystack success callback:', response);

          // Use the stored 'self' reference to call verifyPayment
          self.verifyPayment(response.reference)
            .then(verified => {
              console.log('Verification result:', verified);

              if (verified) {
                console.log('✅ Payment verified successfully');
                onSuccess(response);
              } else {
                console.error('❌ Payment verification failed');
                alert('Payment verification failed. Please contact support with reference: ' + response.reference);
              }
            })
            .catch(verifyError => {
              console.error('❌ Verification error:', verifyError);
              alert('Payment completed but verification failed. Please contact support.');
            });
        },
        onClose: function () {
          console.log('❌ Paystack window closed by user');
          if (onClose) onClose();
        }
      });

      console.log('8. Handler created, opening iframe...');
      handler.openIframe();
      console.log('9. Iframe opened successfully');

    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      let errorMessage = 'Payment failed. Please try again or contact support.';
      alert(errorMessage);
      console.log('Showing error to user:', errorMessage);

      if (onClose) onClose();
    }
  }

  async createPaymentIntent(orderData) {
    const response = await createPaymentIntent(orderData);
    return response.data;
  }

  async verifyPayment(reference) {
    try {
      const response = await verifyPayment(reference);
      return response.data?.success === true;
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      return false;
    }
  }
}

export default new PaymentService();
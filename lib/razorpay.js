import Razorpay from 'razorpay';

// Initialize Razorpay instance (server-side only)
export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export async function createRazorpayOrder(amount, currency = 'INR', receipt) {
  try {
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise (smallest currency unit)
      currency: currency,
      receipt: receipt,
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return { success: false, error: error.message };
  }
}

// Verify Razorpay payment signature
export function verifyRazorpaySignature(orderId, paymentId, signature) {
  const crypto = require('crypto');
  
  const text = orderId + '|' + paymentId;
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');

  return generatedSignature === signature;
}

// Get payment details
export async function getRazorpayPayment(paymentId) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return { success: true, payment };
  } catch (error) {
    console.error('Razorpay payment fetch error:', error);
    return { success: false, error: error.message };
  }
}

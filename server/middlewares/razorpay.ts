import Razorpay from 'razorpay';
import crypto from 'crypto';
import { RazorpayOrder, RazorpayVerification } from '@shared/schema';

// Razorpay API keys
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_key';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order
export const createRazorpayOrder = async (options: {
  amount: number;
  currency: string;
  receipt: string;
}): Promise<RazorpayOrder> => {
  try {
    const order = await razorpay.orders.create(options);
    return order as RazorpayOrder;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error('Failed to create Razorpay order');
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = (paymentData: RazorpayVerification): boolean => {
  try {
    // Generate signature from order_id and payment_id
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${paymentData.razorpay_order_id}|${paymentData.razorpay_payment_id}`)
      .digest('hex');
    
    // Verify the signature
    return generatedSignature === paymentData.razorpay_signature;
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    return false;
  }
};

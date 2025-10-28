'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaCreditCard, FaLock, FaCheckCircle, FaMobileAlt } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

function CheckoutForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, clearCart, getTotalPrice } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'cod'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please login to checkout');
      router.push('/auth/signin?callbackUrl=/checkout');
    }
  }, [status, router]);

  // Pre-fill email from session
  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({
        ...prev,
        email: session.user.email,
        name: session.user.name || '',
      }));
    }
  }, [session]);

  const total = getTotalPrice();
  const tax = total * 0.18; // 18% GST for India
  const grandTotal = total + tax;

  // Show loading while checking auth
  if (status === 'loading') {
    return <LoadingSpinner fullScreen />;
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate phone number for Indian format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create order in database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            },
          },
          items: items.map((item) => ({
            product: item.id,
            quantity: item.quantity,
          })),
          paymentMethod: paymentMethod,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // If Cash on Delivery, skip payment and confirm order
      if (paymentMethod === 'cod') {
        clearCart();
        toast.success('Order placed successfully! Pay on delivery.');
        router.push(`/order-success?orderId=${orderData.data.order._id}`);
        return;
      }

      // Step 2: Create Razorpay order (only for online payment)
      const razorpayResponse = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderData.data.order._id,
        }),
      });

      const razorpayData = await razorpayResponse.json();

      if (!razorpayData.success) {
        throw new Error(razorpayData.error || 'Failed to initialize payment');
      }

      // Step 3: Open Razorpay payment modal
      const options = {
        key: razorpayData.data.key,
        amount: razorpayData.data.amount,
        currency: razorpayData.data.currency,
        name: 'Dishari Cyber Café',
        description: `Order #${orderData.data.order._id}`,
        order_id: razorpayData.data.orderId,
        handler: async function (response) {
          // Show payment verification loader
          setVerifyingPayment(true);
          
          try {
            // Step 4: Verify payment
            const verifyResponse = await fetch('/api/payment/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.data.order._id,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              clearCart();
              toast.success('Payment successful! Order confirmed.');
              
              // Keep the loader showing while redirecting
              // Small delay to let user see the success message
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Redirect to order success page
              router.push(`/order-success?orderId=${orderData.data.order._id}`);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.message || 'Payment verification failed');
            setVerifyingPayment(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.street}, ${formData.city}, ${formData.state}`,
        },
        theme: {
          color: '#dc2626', // Primary red color
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push('/shop')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="street">Street Address *</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="zipCode">ZIP Code *</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="country">Country *</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
          <div className="flex items-center text-gray-600">
            <FaLock className="mr-2" />
            <span className="text-sm">Secure Payment</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4 mb-6">
          {/* Online Payment */}
          <div
            onClick={() => setPaymentMethod('razorpay')}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              paymentMethod === 'razorpay'
                ? 'border-primary-600 bg-gradient-to-r from-red-50 to-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary-600"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Online Payment</h3>
                  <p className="text-sm text-gray-600">Pay securely with UPI, Cards, NetBanking, Wallets</p>
                </div>
              </div>
              <img 
                src="https://razorpay.com/assets/razorpay-glyph.svg" 
                alt="Razorpay" 
                className="h-8"
              />
            </div>
            {paymentMethod === 'razorpay' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t">
                <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm">
                  <FaMobileAlt className="text-primary-600 mr-2" />
                  <span className="text-sm font-medium">UPI</span>
                </div>
                <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm">
                  <FaCreditCard className="text-primary-600 mr-2" />
                  <span className="text-sm font-medium">Cards</span>
                </div>
                <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-sm font-medium">NetBanking</span>
                </div>
                <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-sm font-medium">Wallets</span>
                </div>
              </div>
            )}
          </div>

          {/* Cash on Delivery */}
          <div
            onClick={() => setPaymentMethod('cod')}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              paymentMethod === 'cod'
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-green-600"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cash on Delivery (COD)</h3>
                <p className="text-sm text-gray-600">Pay with cash when your order is delivered</p>
              </div>
            </div>
            {paymentMethod === 'cod' && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-green-600 mt-0.5" />
                  <p>No online payment required. Pay the delivery person when you receive your order.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 flex items-center">
          <FaLock className="inline mr-2" />
          {paymentMethod === 'razorpay' 
            ? 'Your payment information is encrypted and secure. Complete payment on next page.'
            : 'Keep exact cash ready for a smooth delivery experience.'}
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-gray-700">
                {item.title} × {item.quantity}
              </span>
              <span className="font-semibold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax (GST 18%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span className="text-primary-600">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            <span className="ml-2">Processing...</span>
          </>
        ) : (
          <>
            <FaCheckCircle className="inline mr-2" />
            {paymentMethod === 'cod' 
              ? `Place Order - ₹${grandTotal.toFixed(2)}` 
              : `Proceed to Payment - ₹${grandTotal.toFixed(2)}`}
          </>
        )}
      </Button>
    </form>

    {/* Payment Verification Loader Modal */}
    {verifyingPayment && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
        >
          <div className="mb-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Verifying Payment
          </h3>
          
          <p className="text-gray-600 mb-6">
            Please wait while we confirm your payment...
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            🔒 Your payment is secure
          </p>
        </motion.div>
      </div>
    )}
    </>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
        >
          Checkout
        </motion.h1>

        <CheckoutForm />
      </div>
    </div>
  );
}
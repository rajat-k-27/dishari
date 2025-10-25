'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaBox, FaCalendar, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please login to view your profile');
      router.push('/auth/signin?callbackUrl=/profile');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/user');
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FaClock className="text-purple-500" />;
      case 'processing':
        return <FaClock className="text-blue-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'cancelled':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container-custom max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
        >
          My Profile
        </motion.h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mb-4">
                  <span className="text-white font-bold text-4xl">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {session?.user?.name || 'User'}
                </h2>
                <p className="text-gray-600">{session?.user?.email}</p>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <FaUser className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <FaBox className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="font-semibold text-xl">{orders.length}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <FaEnvelope className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-sm break-all">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Orders History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaBox className="mr-3 text-primary-600" />
                Order History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-4">No orders yet</p>
                  <button
                    onClick={() => router.push('/shop')}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <FaCalendar className="mr-2" />
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2 mt-3 md:mt-0">
                          {/* Order Status */}
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-gray-600 min-w-[110px]">Order Status:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(order.orderStatus)}`}>
                              {getStatusIcon(order.orderStatus)}
                              <span className="capitalize">{order.orderStatus}</span>
                            </span>
                          </div>
                          
                          {/* Payment Status */}
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-gray-600 min-w-[110px]">Payment Status:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                          
                          {/* Payment Method */}
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-gray-600 min-w-[110px]">Payment Method:</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold capitalize">
                              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod || 'Razorpay'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                              <p className="font-bold text-primary-600">
                                ₹{(item.quantity * item.price).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="border-t mt-4 pt-4 flex justify-between items-center">
                          <div>
                            {order.paymentDetails?.method && (
                              <p className="text-sm text-gray-600">
                                Payment Via: <span className="font-semibold uppercase">{order.paymentDetails.method}</span>
                              </p>
                            )}
                            {order.paymentDetails?.paidAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Paid on: {new Date(order.paymentDetails.paidAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900">
                              ₹{order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {order.customerInfo?.address && (
                          <div className="border-t mt-4 pt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Delivery Address:</p>
                            <p className="text-sm text-gray-600">
                              {order.customerInfo.address.street}, {order.customerInfo.address.city}
                              <br />
                              {order.customerInfo.address.state} {order.customerInfo.address.zipCode}, {order.customerInfo.address.country}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

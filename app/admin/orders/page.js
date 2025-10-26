'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaSearch, FaShoppingCart } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewModal, setViewModal] = useState({ show: false, order: null });
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        console.log('Fetched orders:', data.data);
        // Log first cancelled order to check cancelledBy field
        const cancelledOrder = data.data?.find(o => o.orderStatus === 'cancelled');
        if (cancelledOrder) {
          console.log('Cancelled order sample:', {
            id: cancelledOrder._id,
            status: cancelledOrder.orderStatus,
            cancelledBy: cancelledOrder.cancelledBy
          });
        }
        setOrders(data.data || data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('Updating order status:', orderId, 'to', newStatus);
      
      // Prepare the update body
      const updateBody = { orderStatus: newStatus };
      
      // If status is being changed to cancelled, mark it as cancelled by admin
      if (newStatus === 'cancelled') {
        updateBody.cancelledBy = 'admin';
      }
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateBody),
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (data.success) {
        toast.success('Status updated successfully!');
        setSelectedStatus(''); // Reset selection
        
        console.log('Updated order data:', data.data);
        
        // Update the order in the orders list immediately
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId ? data.data : order
          )
        );
        
        // Update the view modal if it's open for this order
        if (viewModal.order?._id === orderId) {
          setViewModal({ show: true, order: data.data });
        }
        
        // Also refresh the full orders list
        await fetchOrders();
      } else {
        console.error('Update failed:', data.error);
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
            <p className="text-gray-600">View and manage customer orders</p>
          </div>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FaShoppingCart className="text-primary-600 text-xl" />
              </div>
            </div>
          </motion.div>

          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status, index) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm capitalize">{status}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {Array.isArray(orders) ? orders.filter(o => o.orderStatus === status).length : 0}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
              <p className="text-gray-500">
                {orders.length === 0
                  ? 'No orders have been placed yet'
                  : 'No orders match your search criteria'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Order</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{order.orderNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{order.customerInfo.name}</div>
                          <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900">{order.items.length} items</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            ₹{order.totalAmount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              order.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-700' 
                                : order.paymentStatus === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.paymentStatus}
                            </span>
                            <div className="text-xs text-gray-500 capitalize">
                              {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                            {order.orderStatus === 'cancelled' && order.cancelledBy && (
                              <span className="ml-1 text-xs">
                                (by {order.cancelledBy})
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setViewModal({ show: true, order })}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* View Order Modal */}
      <Modal
        isOpen={viewModal.show}
        onClose={() => setViewModal({ show: false, order: null })}
        title="Order Details"
      >
        {viewModal.order && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
              <p className="text-sm text-gray-600">Order Number: <strong>{viewModal.order.orderNumber}</strong></p>
              <p className="text-sm text-gray-600">Date: {new Date(viewModal.order.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Details</h3>
              <p className="text-sm text-gray-600">Name: {viewModal.order.customerInfo.name}</p>
              <p className="text-sm text-gray-600">Email: {viewModal.order.customerInfo.email}</p>
              <p className="text-sm text-gray-600">Phone: {viewModal.order.customerInfo.phone}</p>
              <p className="text-sm text-gray-600">
                Address: {viewModal.order.customerInfo.address.street}, {viewModal.order.customerInfo.address.city}, 
                {viewModal.order.customerInfo.address.state} - {viewModal.order.customerInfo.address.zipCode}
              </p>
              {viewModal.order.orderStatus === 'cancelled' && viewModal.order.cancelledBy && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-red-800">
                    ⚠️ Order cancelled by: <span className="capitalize">{viewModal.order.cancelledBy}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Items ({viewModal.order.items.length})</h3>
              <div className="space-y-2">
                {viewModal.order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.product?.title || 'Product'} x {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-2 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>₹{viewModal.order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Update Status</h3>
              <div className="space-y-3">
                <select
                  value={selectedStatus || viewModal.order.orderStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button
                  variant="primary"
                  onClick={() => {
                    updateOrderStatus(viewModal.order._id, selectedStatus || viewModal.order.orderStatus);
                  }}
                  className="w-full"
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

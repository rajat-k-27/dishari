'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBox, FaShoppingCart, FaEnvelope, FaDollarSign, FaChartLine, FaUsers } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

const statCards = [
  {
    title: 'Total Products',
    icon: FaBox,
    color: 'from-blue-500 to-blue-700',
    key: 'products',
  },
  {
    title: 'Total Orders',
    icon: FaShoppingCart,
    color: 'from-green-500 to-green-700',
    key: 'orders',
  },
  {
    title: 'Messages',
    icon: FaEnvelope,
    color: 'from-purple-500 to-purple-700',
    key: 'messages',
  },
  {
    title: 'Revenue',
    icon: FaDollarSign,
    color: 'from-yellow-500 to-yellow-700',
    key: 'revenue',
  },
];

const quickLinks = [
  { title: 'Manage Products', href: '/admin/products', icon: FaBox, color: 'bg-blue-500', desc: 'Add, edit, delete products' },
  { title: 'View Orders', href: '/admin/orders', icon: FaShoppingCart, color: 'bg-green-500', desc: 'Manage customer orders' },
  { title: 'Contact Messages', href: '/admin/contacts', icon: FaEnvelope, color: 'bg-purple-500', desc: 'View customer inquiries' },
  { title: 'Add New Product', href: '/admin/products/new', icon: FaBox, color: 'bg-primary-600', desc: 'Quick add product' },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    messages: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/');
      } else {
        fetchStats();
      }
    }
  }, [status, session, router]);

  const fetchStats = async () => {
    try {
      // Fetch products count
      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();

      // Fetch orders
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();

      // Fetch messages
      const messagesRes = await fetch('/api/contact');
      const messagesData = await messagesRes.json();

      // Calculate revenue - include paid orders and delivered COD orders
      const revenue = ordersData.success
        ? ordersData.data.reduce((sum, order) => {
            // Include if payment is completed OR if it's COD and order is delivered
            const shouldInclude = 
              order.paymentStatus === 'paid' || 
              (order.paymentMethod === 'cod' && order.orderStatus === 'delivered');
            return shouldInclude ? sum + order.totalAmount : sum;
          }, 0)
        : 0;

      setStats({
        products: productsData.success ? productsData.data.length : 0,
        orders: ordersData.success ? ordersData.data.length : 0,
        messages: messagesData.success ? messagesData.data.filter((m) => m.status === 'new').length : 0,
        revenue: revenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your cyber café today.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 font-semibold">{card.title}</h3>
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center text-white`}>
                  <card.icon className="text-2xl" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {card.key === 'revenue' ? `₹${stats[card.key].toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : stats[card.key]}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer group"
                >
                  <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    <link.icon className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{link.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                <FaShoppingCart />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">New order received</p>
                <p className="text-sm text-gray-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <FaBox />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Product stock updated</p>
                <p className="text-sm text-gray-600">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                <FaEnvelope />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">New message received</p>
                <p className="text-sm text-gray-600">3 hours ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

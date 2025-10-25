'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaGamepad, FaWifi, FaCoffee, FaUsers, FaArrowRight, FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';

const services = [
  {
    icon: FaGamepad,
    title: 'Gaming Zone',
    description: 'High-end gaming PCs with the latest titles and competitive gaming.',
  },
  {
    icon: FaWifi,
    title: 'High-Speed Internet',
    description: 'Lightning-fast fiber optic internet for seamless browsing.',
  },
  {
    icon: FaCoffee,
    title: 'Café & Snacks',
    description: 'Fresh coffee, snacks, and beverages to keep you energized.',
  },
  {
    icon: FaUsers,
    title: 'Group Sessions',
    description: 'Private rooms for team gaming and collaborative work.',
  },
];

const stats = [
  { number: '500+', label: 'Happy Customers' },
  { number: '50+', label: 'Gaming Stations' },
  { number: '24/7', label: 'Available' },
  { number: '100%', label: 'Satisfaction' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch('/api/products?featured=true&limit=4');
      const data = await res.json();
      if (data.success) {
        setFeaturedProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden gradient-bg">
        {/* Animated Background Circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2"
        />

        <div className="container-custom relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Welcome to <span className="text-primary-100">Dishari</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-50"
            >
              Your ultimate cyber café destination for gaming, browsing, and connecting with friends
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/shop">
                <Button size="lg" className="bg-primary-600 border-2 border-white text-white hover:bg-white hover:text-primary-600 hover:shadow-2xl group">
                  Visit Our Shop
                  <FaArrowRight className="inline-block ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>

              <Link href="/services">
                <Button size="lg" className="bg-primary-600 border-2 border-white text-white hover:bg-white hover:text-primary-600 hover:shadow-2xl">
                  Explore Services
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1, duration: 0.5 },
            y: { duration: 2, repeat: Infinity },
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                  className="text-4xl md:text-5xl font-bold text-primary-600 mb-2"
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for an amazing cyber café experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="card text-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full text-white text-3xl mb-4"
                >
                  <service.icon />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/services">
              <Button size="lg">
                View All Services
                <FaArrowRight className="inline-block ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out our hand-picked selection of snacks, beverages, and accessories
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-shimmer h-96 rounded-xl" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-lg">No featured products available yet.</p>
            </motion.div>
          )}

          {featuredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mt-12"
            >
              <Link href="/shop">
                <Button size="lg">
                  Browse All Products
                  <FaArrowRight className="inline-block ml-2" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-bg text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <FaStar className="text-6xl mx-auto mb-6 text-primary-200" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience Dishari?
            </h2>
            <p className="text-xl mb-8 text-primary-50">
              Join hundreds of satisfied customers who trust us for their gaming and browsing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary-600 border-2 border-white text-white hover:bg-white hover:text-primary-600 hover:shadow-2xl">
                  Get In Touch
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" className="bg-primary-600 border-2 border-white text-white hover:bg-white hover:text-primary-600 hover:shadow-2xl">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

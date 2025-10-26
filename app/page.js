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
  const [typedText, setTypedText] = useState('');
  const fullText = 'Dishari';

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150); // 150ms delay between each character

    return () => clearInterval(typingInterval);
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
        {/* Animated Background Bubbles */}
        {[...Array(10)].map((_, i) => {
          const size = Math.random() * 20 + 10; // Random size between 10-50px
          const delay = Math.random() * 8;
          const duration = Math.random() * 8 + 10; // Random duration 10-18s
          const startX = Math.random() * 100; // Random X position
          const startY = 100 + Math.random() * 20; // Start from bottom
          
          return (
            <motion.div
              key={i}
              animate={{
                y: [0, typeof window !== 'undefined' ? -window.innerHeight - 100 : -1000],
                x: [0, Math.sin(i) * 50, Math.cos(i) * 30],
                opacity: [0, 0.4, 0.6, 0.4, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: 'linear',
                delay: delay,
              }}
              className="absolute rounded-full bg-white"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${startX}%`,
                top: `${startY}%`,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
              }}
            />
          );
        })}

        <div className="container-custom relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/30 shadow-lg"
            >
              <span className="text-primary-100 font-semibold flex items-center gap-2">
                {/* <FaStar className="text-yellow-300" /> */}
                Premium Cyber Café Experience
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              Welcome to <span className="text-white" >{typedText}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-primary-50 leading-relaxed"
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
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 opacity-5 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all"
              >
                <motion.h3
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2"
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-600 font-semibold text-sm md:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 opacity-5 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-2 bg-primary-50 rounded-full"
            >
              <span className="text-primary-600 font-semibold text-sm">WHAT WE OFFER</span>
            </motion.div>
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
                whileHover={{ y: -10, scale: 1.03 }}
                className="card text-center group cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl text-white text-4xl mb-4 shadow-lg"
                >
                  <service.icon />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                
                {/* Hover indicator */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  className="h-1 bg-gradient-to-r from-primary-500 to-primary-700 mt-4 rounded-full mx-auto"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-16"
          >
            <Link href="/services">
              <Button size="lg" className="group">
                View All Services
                <FaArrowRight className="inline-block ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary-400 opacity-5 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-2 bg-primary-50 rounded-full"
            >
              <span className="text-primary-600 font-semibold text-sm">SHOP WITH US</span>
            </motion.div>
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
                <div key={i} className="animate-shimmer h-96 rounded-xl bg-gray-200" />
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
              className="text-center mt-16"
            >
              <Link href="/shop">
                <Button size="lg" className="group">
                  Browse All Products
                  <FaArrowRight className="inline-block ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-bg text-white relative overflow-hidden">
        {/* Animated Bubbles for CTA */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -40, -20],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block"
            >
              <FaStar className="text-6xl mx-auto mb-6 text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ WebkitTextStroke: '2px white' }} />
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Experience <span className="text-primary-100">Dishari</span>?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-primary-50 leading-relaxed">
              Join hundreds of satisfied customers who trust us for their gaming and browsing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary-600 border-2 border-white text-white hover:bg-white hover:text-primary-600 hover:shadow-2xl group">
                  Get In Touch
                  <FaArrowRight className="inline-block ml-2 group-hover:translate-x-2 transition-transform" />
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

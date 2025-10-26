'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaFilter, FaSearch } from 'react-icons/fa';

const categories = [
  { value: '', label: 'All Products' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'services', label: 'Services' },
];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setFilteredProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center gradient-bg text-white overflow-hidden">
        {/* Animated Background Bubbles */}
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 40 + 10;
          const delay = Math.random() * 8;
          const duration = Math.random() * 8 + 10;
          const startX = Math.random() * 100;
          const startY = 100 + Math.random() * 20;
          
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
        
        <div className="container-custom relative z-10 text-center py-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Our <span className="text-primary-100">Shop</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto text-primary-50"
          >
            Browse our collection of snacks, beverages, and gaming accessories
          </motion.p>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaSearch className="inline mr-2" />
                  Search Products
                </label>
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaFilter className="inline mr-2" />
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useMemo } from 'react';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  // Memoize image URL extraction to avoid hydration issues
  const imageUrl = useMemo(() => {
    if (!product.images || product.images.length === 0 || !product.images[0]) {
      return null;
    }
    return typeof product.images[0] === 'string' 
      ? product.images[0] 
      : product.images[0]?.url;
  }, [product.images]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addItem(product);
    toast.success('Added to cart!', {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#22c55e',
        color: '#fff',
      },
    });
  };

  return (
    <Link href={`/shop/${product._id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <span className="text-primary-600 text-4xl font-bold">
                {product.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 flex items-center justify-center space-x-4 opacity-0 hover:opacity-100 transition-all duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="bg-white text-primary-600 p-3 rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingCart className="text-xl" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white text-primary-600 p-3 rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-colors"
            >
              <FaEye className="text-xl" />
            </motion.button>
          </div>

          {/* Stock Badge */}
          {product.stock <= 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </div>
          )}

          {product.featured && (
            <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-primary-600 font-semibold uppercase">
              {product.category}
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.stock}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              ₹{product.price.toFixed(2)}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

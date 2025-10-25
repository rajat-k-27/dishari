'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FaShoppingCart, FaMinus, FaPlus, FaHeart, FaShare, FaCheck } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  // Memoize image URL extraction
  const currentImageUrl = useMemo(() => {
    if (!product?.images || product.images.length === 0 || !product.images[selectedImage]) {
      return null;
    }
    const img = product.images[selectedImage];
    return typeof img === 'string' ? img : img?.url;
  }, [product?.images, selectedImage]);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
      } else {
        toast.error('Product not found');
        router.push('/shop');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    addItem(product, quantity);
    toast.success(`Added ${quantity} item(s) to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#22c55e',
        color: '#fff',
      },
    });
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${product.stock} items available`);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return null;
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-square"
                >
                  {currentImageUrl ? (
                    <Image
                      src={currentImageUrl}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <span className="text-primary-600 text-6xl font-bold">
                        {product.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {!inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-6 py-3 rounded-full text-xl font-bold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => {
                  const imageUrl = typeof image === 'string' ? image : image?.url;
                  
                  return imageUrl ? (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                        selectedImage === index
                          ? 'ring-4 ring-primary-600'
                          : 'ring-2 ring-gray-200'
                      }`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ) : null;
                })}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Category Badge */}
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-primary-100 text-primary-600 px-4 py-1 rounded-full text-sm font-semibold uppercase mb-4"
              >
                {product.category}
              </motion.span>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                {product.title}
              </motion.h1>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-baseline mb-6"
              >
                <span className="text-5xl font-bold text-primary-600">
                  ₹{product.price.toFixed(2)}
                </span>
              </motion.div>

              {/* Stock Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="flex items-center space-x-2">
                  {inStock ? (
                    <>
                      <FaCheck className="text-green-500" />
                      <span className="text-green-600 font-semibold">
                        In Stock ({product.stock} available)
                      </span>
                    </>
                  ) : (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </motion.div>

              {/* Quantity Selector */}
              {inStock && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={decrementQuantity}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FaMinus />
                      </motion.button>
                      <span className="px-6 py-2 font-bold text-lg">{quantity}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={incrementQuantity}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FaPlus />
                      </motion.button>
                    </div>
                    <span className="text-gray-600">
                      Subtotal: <span className="font-bold text-primary-600">
                        ₹{(product.price * quantity).toFixed(2)}
                      </span>
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  fullWidth
                  size="lg"
                >
                  <FaShoppingCart className="inline mr-2" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" fullWidth>
                    <FaHeart className="inline mr-2" />
                    Wishlist
                  </Button>
                  <Button variant="outline" fullWidth>
                    <FaShare className="inline mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

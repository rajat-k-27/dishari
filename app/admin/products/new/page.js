'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUpload, FaTimes, FaImage, FaArrowLeft } from 'react-icons/fa';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'gaming',
    stock: '',
    featured: false,
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  if (status === 'loading') {
    return <LoadingSpinner fullScreen />;
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    router.push('/admin/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImages([...images, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const uploadedUrls = [];

    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          uploadedUrls.push({
            url: data.url,
            public_id: data.public_id || data.data?.public_id || ''
          });
        } else {
          throw new Error(data.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        throw error;
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!formData.title || !formData.description || !formData.price || !formData.stock) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }

      if (images.length === 0) {
        toast.error('Please upload at least one image');
        setLoading(false);
        return;
      }

      // Upload images
      setUploading(true);
      toast.loading('Uploading images...');
      const imageUrls = await uploadImages();
      toast.dismiss();
      setUploading(false);

      // Create product
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: imageUrls,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Product created successfully!');
        router.push('/admin/products');
      } else {
        toast.error(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 flex items-center justify-center">
      <div className="container max-w-4xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="mb-4"
          >
            <FaArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">Fill in the details to add a new product to your inventory</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <label className="form-label">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Gaming Mouse RGB"
                className="input-field"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="form-label">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed product description..."
                rows="5"
                className="input-field"
                required
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="form-label">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="form-label">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="gaming">Gaming</option>
                <option value="printing">Printing</option>
                <option value="accessories">Accessories</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <label htmlFor="featured" className="text-gray-700 font-medium cursor-pointer">
                Feature this product on homepage
              </label>
            </div>

            {/* Image Upload */}
            <div>
              <label className="form-label">
                Product Images <span className="text-red-500">*</span>
                <span className="text-sm font-normal text-gray-500 ml-2">(Max 5 images)</span>
              </label>

              {/* Upload Button */}
              <div className="mt-2">
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors">
                  <FaUpload />
                  <span>Upload Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={images.length >= 5}
                  />
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading || uploading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">
                      {uploading ? 'Uploading Images...' : 'Creating Product...'}
                    </span>
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

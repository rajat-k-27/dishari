'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUpload, FaTimes, FaArrowLeft } from 'react-icons/fa';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'gaming',
    stock: '',
    featured: false,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchProduct();
    }
  }, [status, session]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();

      if (data.success) {
        const product = data.data; // Fixed: API returns data.data, not data.product
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          featured: product.featured || false,
        });
        setExistingImages(product.images || []);
      } else {
        toast.error('Product not found');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setNewImages([...newImages, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  const uploadNewImages = async () => {
    const uploadedUrls = [];

    for (const image of newImages) {
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
    setSaving(true);

    try {
      // Validate
      if (!formData.title || !formData.description || !formData.price || formData.stock === '') {
        toast.error('Please fill all required fields');
        setSaving(false);
        return;
      }

      const totalImages = existingImages.length + newImages.length;
      if (totalImages === 0) {
        toast.error('Please upload at least one image');
        setSaving(false);
        return;
      }

      // Upload new images if any
      let allImages = [...existingImages];
      if (newImages.length > 0) {
        setUploading(true);
        toast.loading('Uploading images...');
        const newImageUrls = await uploadNewImages();
        toast.dismiss();
        allImages = [...allImages, ...newImageUrls];
        setUploading(false);
      }

      // Update product
      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: allImages,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Product updated successfully!');
        router.push('/admin/products');
      } else {
        toast.error(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container max-w-4xl">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
          <p className="text-gray-600">Update product details and images</p>
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

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="form-label">Current Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <motion.div
                      key={`existing-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={typeof image === 'string' ? image : image.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <label className="form-label">
                Add More Images
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Total: {existingImages.length + newImages.length}/5)
                </span>
              </label>

              {existingImages.length + newImages.length < 5 && (
                <div className="mt-2">
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors">
                    <FaUpload />
                    <span>Upload Images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {newImagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <motion.div
                      key={`new-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-primary-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-1 bg-primary-500 text-white text-xs rounded">
                        New
                      </span>
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
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
                disabled={saving || uploading}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">
                      {uploading ? 'Uploading Images...' : 'Updating Product...'}
                    </span>
                  </>
                ) : (
                  'Update Product'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={saving}
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

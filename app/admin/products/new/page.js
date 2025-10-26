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

  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if too large
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Check file sizes and compress if needed
    const processedFiles = [];
    const toastId = toast.loading('Processing images...');

    for (const file of files) {
      try {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 5MB.`);
          continue;
        }

        // Compress image if it's larger than 1MB
        let processedFile = file;
        if (file.size > 1024 * 1024 && file.type.startsWith('image/')) {
          processedFile = await compressImage(file);
          console.log(`Compressed ${file.name}: ${(file.size / 1024).toFixed(2)}KB → ${(processedFile.size / 1024).toFixed(2)}KB`);
        }

        processedFiles.push(processedFile);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(processedFile);
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error(`Failed to process ${file.name}`);
      }
    }

    toast.dismiss(toastId);
    if (processedFiles.length > 0) {
      setImages([...images, ...processedFiles]);
      toast.success(`${processedFiles.length} image(s) added`);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    let uploadCount = 0;

    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image);

      try {
        uploadCount++;
        toast.loading(`Uploading image ${uploadCount}/${images.length}...`);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || data.message || `Upload failed with status ${response.status}`);
        }

        if (data.success) {
          uploadedUrls.push({
            url: data.url,
            public_id: data.public_id || data.data?.public_id || ''
          });
          toast.dismiss();
        } else {
          throw new Error(data.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        toast.dismiss();
        toast.error(`Failed to upload image ${uploadCount}: ${error.message}`);
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
      let imageUrls = [];
      
      try {
        imageUrls = await uploadImages();
        toast.success('Images uploaded successfully!');
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        toast.error('Image upload failed. Please try again with smaller images.');
        setUploading(false);
        setLoading(false);
        return;
      }
      
      setUploading(false);

      // Create product
      toast.loading('Creating product...');
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
      toast.dismiss();

      if (data.success) {
        toast.success('Product created successfully!');
        router.push('/admin/products');
      } else {
        console.error('Product creation failed:', data);
        toast.error(data.error || data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(`Failed to create product: ${error.message}`);
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
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors">
                  <FaUpload />
                  <span>Upload Images</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={images.length >= 5}
                  />
                </label>
                <p className="text-sm text-gray-500">
                  Maximum 5 images, 5MB each. Images will be automatically compressed for optimal upload.
                </p>
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

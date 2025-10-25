require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  images: mongoose.Schema.Types.Mixed,
  featured: Boolean,
  active: Boolean,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function fixProductImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let fixedCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      const fixedImages = [];

      if (product.images && Array.isArray(product.images)) {
        for (const img of product.images) {
          // If image is a string, convert to object
          if (typeof img === 'string') {
            fixedImages.push({
              url: img,
              public_id: ''
            });
            needsUpdate = true;
          } else {
            // Already an object, keep as is
            fixedImages.push(img);
          }
        }
      }

      if (needsUpdate) {
        product.images = fixedImages;
        await product.save();
        fixedCount++;
        console.log(`✅ Fixed images for: ${product.title}`);
        console.log(`   Images: ${JSON.stringify(fixedImages, null, 2)}`);
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} products`);
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixProductImages();

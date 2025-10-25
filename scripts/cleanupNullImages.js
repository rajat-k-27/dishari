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

async function cleanupNullImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const products = await Product.find({});
    console.log(`Found ${products.length} products\n`);

    let fixedCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      
      if (product.images && product.images.length > 0) {
        // Filter out null images
        const validImages = product.images.filter(img => img !== null && img !== undefined);
        
        if (validImages.length !== product.images.length) {
          product.images = validImages;
          await product.save();
          fixedCount++;
          console.log(`✅ Cleaned null images from: ${product.title}`);
          console.log(`   Original count: ${product.images.length}, Valid count: ${validImages.length}`);
        }
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

cleanupNullImages();

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

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const products = await Product.find({});
    console.log(`Found ${products.length} products\n`);

    for (const product of products) {
      console.log('==================================');
      console.log(`Product: ${product.title}`);
      console.log(`Category: ${product.category}`);
      console.log(`Price: ₹${product.price}`);
      console.log(`Stock: ${product.stock}`);
      console.log(`Images (${product.images?.length || 0}):`);
      
      if (product.images && product.images.length > 0) {
        product.images.forEach((img, index) => {
          console.log(`  [${index}] Type: ${typeof img}`);
          console.log(`      Value: ${JSON.stringify(img, null, 2)}`);
          if (img === null || img === undefined) {
            console.log(`      ⚠️  Image is ${img}`);
          } else if (typeof img === 'string') {
            console.log(`      String Value: "${img}"`);
            console.log(`      Length: ${img.length} characters`);
          } else {
            console.log(`      url: "${img.url || '(empty)'}"`);
            console.log(`      url length: ${img.url ? img.url.length : 0} characters`);
            console.log(`      public_id: "${img.public_id || '(empty)'}"`);
          }
        });
      } else {
        console.log('  No images');
      }
      console.log('==================================\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();

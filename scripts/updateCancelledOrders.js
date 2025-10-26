const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const OrderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

async function updateCancelledOrders() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in .env.local');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all cancelled orders that don't have cancelledBy field set
    // We'll mark them as cancelled by admin since we don't know who cancelled them
    const result = await Order.updateMany(
      { 
        orderStatus: 'cancelled',
        $or: [
          { cancelledBy: null },
          { cancelledBy: { $exists: false } }
        ]
      },
      { 
        $set: { cancelledBy: 'admin' } 
      }
    );

    console.log(`\n✅ Updated ${result.modifiedCount} cancelled orders`);
    console.log('All cancelled orders now have cancelledBy field set to "admin"');

    // Verify
    const cancelledOrders = await Order.find({ orderStatus: 'cancelled' });
    console.log('\n=== VERIFICATION ===');
    cancelledOrders.forEach((order, index) => {
      console.log(`Order ${index + 1}: ${order.orderNumber} - cancelledBy: ${order.cancelledBy}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateCancelledOrders();

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const OrderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

async function checkCancelledOrders() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in .env.local');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const cancelledOrders = await Order.find({ orderStatus: 'cancelled' });
    
    console.log('\n=== CANCELLED ORDERS ===');
    console.log(`Total cancelled orders: ${cancelledOrders.length}\n`);
    
    cancelledOrders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`);
      console.log(`  ID: ${order._id}`);
      console.log(`  Order Number: ${order.orderNumber}`);
      console.log(`  Status: ${order.orderStatus}`);
      console.log(`  CancelledBy: ${order.cancelledBy || 'NOT SET'}`);
      console.log('---');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCancelledOrders();

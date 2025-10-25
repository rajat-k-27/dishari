import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerInfo: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
      },
      email: {
        type: String,
        required: [true, 'Customer email is required'],
      },
      phone: {
        type: String,
        required: [true, 'Customer phone is required'],
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        title: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        image: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'razorpay', 'cash', 'cod'],
      default: 'razorpay',
    },
    stripePaymentIntentId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paymentDetails: {
      method: String, // 'upi', 'card', 'netbanking', 'wallet'
      razorpayOrderId: String,
      razorpayPaymentId: String,
      paidAt: Date,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number with retry logic
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber && this.isNew) {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        
        // Get current count of orders with this year-month prefix
        const count = await mongoose.models.Order.countDocuments({
          orderNumber: { $regex: `^DISH-${year}${month}-` }
        });
        
        // Generate sequential number with random offset if retrying
        const randomOffset = attempts > 0 ? Math.floor(Math.random() * 1000) : 0;
        const nextNumber = count + 1 + randomOffset;
        
        const proposedOrderNumber = `DISH-${year}${month}-${String(nextNumber).padStart(5, '0')}`;
        
        // Check if this order number already exists
        const existing = await mongoose.models.Order.findOne({ orderNumber: proposedOrderNumber });
        
        if (!existing) {
          this.orderNumber = proposedOrderNumber;
          break;
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Unable to generate unique order number after multiple attempts');
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          return next(error);
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }
  next();
});

OrderSchema.index({ 'customerInfo.email': 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ user: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { orderSchema } from '@/lib/validations';
import Product from '@/models/Product';

// GET all orders (admin only)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = {};
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();

    // Validate request body
    const validatedData = orderSchema.parse(body);

    // Fetch product details and calculate total
    let totalAmount = 0;
    const orderItems = [];
    const productsToUpdate = []; // Store products for later stock update

    for (const item of validatedData.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.product}` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.title}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url || '',
      });

      // Store product info for stock update - don't update yet
      productsToUpdate.push({
        productId: product._id,
        quantity: item.quantity
      });
    }

    // Create order (without payment intent - Razorpay order will be created separately)
    const paymentMethod = body.paymentMethod || 'razorpay';
    
    // Retry logic for order creation in case of duplicate key error
    let order;
    let retries = 3;
    
    while (retries > 0) {
      try {
        order = await Order.create({
          user: session.user.id,
          customerInfo: validatedData.customerInfo,
          items: orderItems,
          totalAmount,
          paymentMethod: paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
          orderStatus: paymentMethod === 'cod' ? 'processing' : 'pending',
        });
        break; // Success, exit loop
      } catch (err) {
        if (err.code === 11000 && retries > 1) {
          // Duplicate key error, retry
          console.log('Duplicate order number, retrying...', retries);
          retries--;
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          throw err; // Re-throw if not duplicate or last retry
        }
      }
    }

    // Only reduce stock for COD orders (they're confirmed immediately)
    // For online payment, stock will be reduced after payment verification
    if (paymentMethod === 'cod') {
      for (const item of productsToUpdate) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock -= item.quantity;
          await product.save();
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          order,
          productsToUpdate: paymentMethod !== 'cod' ? productsToUpdate : null, // Send to frontend for payment verification
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 400 }
    );
  }
}

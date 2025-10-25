import { NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Create Razorpay order
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { orderId } = body;

    // Get order details
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order belongs to current user
    if (order.user.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      order.totalAmount,
      'INR',
      order.orderNumber
    );

    if (!razorpayOrder.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to create payment order' },
        { status: 500 }
      );
    }

    // Update order with Razorpay order ID
    order.paymentDetails = {
      ...order.paymentDetails,
      razorpayOrderId: razorpayOrder.order.id,
    };
    await order.save();

    return NextResponse.json({
      success: true,
      data: {
        orderId: razorpayOrder.order.id,
        amount: razorpayOrder.order.amount,
        currency: razorpayOrder.order.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

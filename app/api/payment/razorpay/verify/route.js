import { NextResponse } from 'next/server';
import { verifyRazorpaySignature, getRazorpayPayment } from '@/lib/razorpay';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Verify Razorpay payment
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
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = body;

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Get payment details from Razorpay
    const paymentResult = await getRazorpayPayment(razorpay_payment_id);

    if (!paymentResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch payment details' },
        { status: 500 }
      );
    }

    const payment = paymentResult.payment;

    // Update order status
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

    // Update order with payment details
    order.paymentStatus = 'paid';
    order.paymentDetails = {
      method: payment.method, // card, upi, netbanking, wallet, etc.
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: new Date(),
    };
    order.orderStatus = 'processing';

    await order.save();

    // Reduce stock for all items after successful payment
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        console.log(`Stock reduced for ${product.title}: ${item.quantity} units`);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        message: 'Payment successful!',
      },
    });
  } catch (error) {
    console.error('Verify Razorpay payment error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

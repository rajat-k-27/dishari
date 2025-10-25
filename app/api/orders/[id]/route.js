import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET single order
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const order = await Order.findById(id).populate('items.product');

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT update order status (admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const body = await request.json();
    console.log('Updating order:', id, 'with data:', body);

    // Get the current order first
    const currentOrder = await Order.findById(id);
    
    if (!currentOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Current order status:', currentOrder.orderStatus, 'Payment method:', currentOrder.paymentMethod);

    // Auto-update payment status for COD orders when marked as delivered
    if (body.orderStatus === 'delivered' && currentOrder.paymentMethod === 'cod') {
      body.paymentStatus = 'paid';
      body.paymentDetails = {
        ...currentOrder.paymentDetails,
        paidAt: new Date()
      };
      console.log('Auto-updating COD payment status to paid');
    }

    const order = await Order.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate('items.product');

    console.log('Order updated successfully:', order.orderStatus, 'Payment status:', order.paymentStatus);

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order' },
      { status: 400 }
    );
  }
}

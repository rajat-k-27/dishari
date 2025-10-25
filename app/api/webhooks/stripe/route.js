import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { constructWebhookEvent } from '@/lib/stripe';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = constructWebhookEvent(body, signature);

    await dbConnect();

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;

        // Update order payment status
        const order = await Order.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          {
            paymentStatus: 'paid',
            orderStatus: 'processing',
          },
          { new: true }
        ).populate('items.product');

        if (order) {
          // Send order confirmation email
          sendOrderConfirmation(order).catch((err) =>
            console.error('Email sending failed:', err)
          );
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;

        // Update order payment status
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          {
            paymentStatus: 'failed',
          }
        );

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failed' },
      { status: 400 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Order } from '@/models/order';
import { Product } from '@/models/product'; // Import Product model for stock updates
import { User } from '@/models/users'; // Import User model for order history updates
import { currentUser } from '@clerk/nextjs/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json();

    // 1. Verify Razorpay Signature (CRITICAL SECURITY STEP)
    const razorpaySecret = process.env.RAZORPAY_SECRET;
    if (!razorpaySecret) {
      throw new Error('Razorpay secret key is not configured.');
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // If signature is invalid, update the order to 'failed' to prevent fulfillment
      await Order.findByIdAndUpdate(orderId, { 'payment.status': 'failed', status: 'cancelled' });
      return NextResponse.json({ success: false, message: 'Invalid payment signature.' }, { status: 400 });
    }

    // 2. Update the Order in the database to 'paid' and 'processing'
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        'payment.status': 'paid',
        'payment.razorpayPaymentId': razorpay_payment_id,
        'payment.razorpaySignature': razorpay_signature,
        status: 'processing',
      },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    // 3. Decrement stock for each product in the order
    const stockUpdatePromises = updatedOrder.items.map((item) =>
      Product.updateOne(
        { _id: item.productId },
        // Use $inc to decrement the stock by the quantity purchased
        { $inc: { stock: -item.quantity } }
      )
    );
    await Promise.all(stockUpdatePromises);
    console.log('Stock updated for all products in order:', updatedOrder._id);


    // 4. Add the Order ID to the User's orderHistory
    await User.findOneAndUpdate(
        { clerkId: user.id },
        { $push: { orderHistory: updatedOrder._id } }
    );
    console.log(`Order ${updatedOrder._id} added to history for user ${user.id}`);


    return NextResponse.json({
      success: true,
      message: 'Payment verified and order finalized successfully.',
      orderId: updatedOrder._id,
    }, { status: 200 });

  } catch (error) {
    console.error('API Error in /api/payment/verify:', error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Order } from '@/models/order';
import { User } from '@/models/users'; // Import User to update order history
// Import Product for schema registration
import '@/models/product';
import { currentUser } from '@clerk/nextjs/server';
import Razorpay from 'razorpay';

// --- GET: Fetch order history for the logged-in user ---
export async function GET() {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    await connectDB();

    // Find all orders where the user's clerkId matches the logged-in user
    const orders = await Order.find({ 'user.clerkId': user.id })
      .sort({ createdAt: -1 }) // Show most recent orders first
      .populate('items.productId', 'name images') // Optionally populate some product details
      .exec();

    return NextResponse.json({
      success: true,
      data: orders,
    }, { status: 200 });

  } catch (error) {
    console.error('API Error GET /api/orders:', error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unknown server error occurred' }, { status: 500 });
  }
}

// --- POST: Create a new order and initiate payment with Razorpay ---
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    await connectDB();
    const { orderDetails } = await request.json();
    const { formData, items, pricing } = orderDetails;
    const { total } = pricing;
    
    // Determine the amount to be paid
    const amountToPay = formData.paymentMethod === 'cod' ? total * 0.25 : total;

    // 1. Initialize Razorpay SDK
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });

    // 2. Create an Order with Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amountToPay * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    });

    if (!razorpayOrder) {
      return NextResponse.json({ success: false, message: 'Failed to create Razorpay order.' }, { status: 500 });
    }

    // 3. Create a 'pending' order in your MongoDB database
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder = new Order({
      orderId: orderId,
      user: {
        clerkId: user.id,
        email: formData.email,
        fullName: `${formData.firstName} ${formData.lastName}`,
      },
      items: items.map((item: { product: { _id: string; name: string; images: string[]; price: { original: number } }; quantity: number; selectedColor?: string }) => ({
        productId: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.price.original,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
      })),
      shippingAddress: formData,
      pricing: {
        subtotal: pricing.subtotal,
        shipping: pricing.shipping,
        tax: 0,
        total: pricing.total
      },
      payment: {
        method: formData.paymentMethod,
        status: 'pending',
        razorpayOrderId: razorpayOrder.id,
      },
      status: 'pending',
    });

    const savedOrder = await newOrder.save();
    
    // 4. Add the Order ID to the User's orderHistory
    await User.findOneAndUpdate(
        { clerkId: user.id },
        { $push: { orderHistory: savedOrder._id } },
        { upsert: true } // Create user profile if it doesn't exist
    );

    // 5. Return the necessary details to the frontend
    return NextResponse.json({
      success: true,
      message: 'Order created, awaiting payment.',
      order: savedOrder,
      razorpayOrder,
    }, { status: 201 });

  } catch (error) {
    console.error('API Error POST /api/orders:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ success: false, message: `Validation Error: ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}




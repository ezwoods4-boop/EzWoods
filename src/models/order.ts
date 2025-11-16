
import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the shape of a single item within an order
const OrderItemSchema = new Schema({
  productId: { type: Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  selectedColor: { type: String },
}, { _id: false });

export interface IOrder extends Document {
  orderId: string;
  user: {
    clerkId: string;
    email: string;
    fullName: string;
  };
  items: Array<{
    productId: Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
    selectedColor?: string;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pricing: {
    subtotal: number;
    shipping: number;
    tax?: number;
    total: number;
  };
  payment: {
    method: 'razorpay' | 'cod';
    status: 'pending' | 'paid' | 'failed';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  user: {
    clerkId: { type: String, required: true },
    email: { type: String, required: true },
    fullName: { type: String, required: true },
  },
  items: [OrderItemSchema],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  pricing: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: false, default: 0 },
    total: { type: Number, required: true },
  },
  payment: {
    method: { type: String, required: true, enum: ['razorpay', 'cod'] },
    status: { type: String, required: true, default: 'pending', enum: ['pending', 'paid', 'failed'] },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  status: { type: String, required: true, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
}, {
  timestamps: true,
});

// Force recompilation of the model to pick up schema changes
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export const Order = mongoose.model<IOrder>('Order', OrderSchema);


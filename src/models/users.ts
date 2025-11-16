import mongoose, { Schema, model, Document, Types } from 'mongoose';

// Interface for the User document, now including orderHistory
export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  phone?: string;
  imageUrl?: string;
  wishlist: Types.ObjectId[]; // An array of Product IDs
  orderHistory: Types.ObjectId[]; // An array of Order IDs
}

// User Schema optimized for Clerk integration, with orderHistory added
const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String },
  imageUrl: { type: String },
  wishlist: [{ type: Types.ObjectId, ref: 'Product' }],
  // ADDED: A field to store references to the user's orders
  orderHistory: [{ type: Types.ObjectId, ref: 'Order' }],
}, {
  timestamps: true,
});




// Indexes for scalability and performance
// Note: email index is already created by unique: true in schema
UserSchema.index({ 'wishlist': 1 });

export const User = mongoose.models.User || model<IUser>('User', UserSchema);
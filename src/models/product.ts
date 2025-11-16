// File: models/product.ts

import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './category'; // Import for type safety

// --- Sub-document Interfaces ---
export interface IReview extends Document {
  user: { 
    name: string; 
    avatar: string; 
    clerkId: string; // Add Clerk user ID for proper user identification
  };
  title: string;
  body: string;
  images: string[];
  rating: number;
}

export interface IPrice extends Document {
  original: number;
  discounted?: number;
}

export interface IDimensions extends Document {
  height: number;
  width: number;
  depth: number;
  unit: string;
}

// --- Main Product Interface ---
export interface IProduct extends Document {
  name: string;
  description: string;
  category: ICategory['_id']; // Stores the category ID (reference)
  categoryName: string;      // Stores the category name (denormalized)
  price: IPrice;
  stock: number;
  dimensions: IDimensions;
  material: string[];
  images: string[];
  status: 'active' | 'inactive';
  reviews: IReview[];
}

const ReviewSchema: Schema = new Schema({
    user: { 
      name: { type: String, required: true }, 
      avatar: { type: String },
      clerkId: { type: String, required: true } // Add Clerk user ID
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    images: [{ type: String }],
    rating: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required.'],
  },
  // ADDED: Storing the category name directly on the product
  categoryName: {
    type: String,
    required: [true, 'Category name is required.'],
  },
  price: {
    original: { type: Number, required: true },
    discounted: { type: Number },
  },
  stock: { type: Number, default: 0 },
  dimensions: {
    height: { type: Number },
    width: { type: Number },
    depth: { type: Number },
    unit: { type: String, default: 'cm' },
  },
  material: [{ type: String }],
  images: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  reviews: [ReviewSchema]
}, {
  timestamps: true
});

 export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);


// File: models/category.ts

import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Category document, now including the parent reference
export interface ICategory extends Document {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  parent?: ICategory['_id']; // Optional reference to a parent category
  image?: string; // URL of the category image
  productCount?: number; // This will be a virtual field, not stored in DB
}

// Mongoose schema for the Category model
const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required.'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // This creates the self-referencing relationship
    default: null,   // Top-level categories will have a null parent
  },
  image: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
  // Important: Ensure virtuals are included when converting to JSON/object
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// VIRTUAL FIELD: for dynamically calculating the number of products in a category.
// This is more efficient than storing a count that needs constant updates.
CategorySchema.virtual('productCount', {
  ref: 'Product',       // The model to use for the count
  localField: '_id',      // Find Products where `localField` (_id of the category)
  foreignField: 'category', // matches the `foreignField` (the category field in Product)
  count: true           // And only return the count, not the documents
});

// Prevent model overwrite in Next.js hot-reloading environment
 export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);




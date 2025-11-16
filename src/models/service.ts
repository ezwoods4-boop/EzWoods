// File: models/service.ts

import mongoose, { Schema, Document } from 'mongoose';

// Reusable interface for reviews
export interface IReview extends Document {
  user: { 
    name: string; 
    avatar: string; 
    clerkId: string; // Match product model exactly
  };
  title: string;
  body: string;
  images: string[];
  rating: number;
}

// Main interface for the Service document
export interface IService extends Document {
  name: string;
  category: 'Consultation' | 'Interior Design' | 'Renovation';
  description: string;
  price :string;
  whatsIncluded: string[];
  images: string[];
  duration: string;
  status: 'active' | 'inactive'; // Added status field
  reviews: IReview[];
}

// Reusable schema for nested reviews
const ReviewSchema: Schema = new Schema({
  user: { 
    name: { type: String, required: true }, 
    avatar: { type: String },
    clerkId: { type: String, required: true } // Match product model exactly
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  images: [{ type: String }],
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

// Main schema for the Service model
const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Consultation', 'Interior Design', 'Renovation'],
  },
  description: { type: String, required: true, trim: true },
  price: { type: String, required: true, trim: true },
  whatsIncluded: { type: [String], default: [] },
  images: { type: [String], default: [] },
  duration: { type: String, required: true, trim: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }, // Added status field
  reviews: [ReviewSchema],
}, { timestamps: true });

// Prevent model overwrite in Next.js hot-reloading environment
 export const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);



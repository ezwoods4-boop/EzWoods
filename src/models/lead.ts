// File: models/lead.ts

import mongoose, { Schema, Document } from 'mongoose';

// --- Interface Definition for Type Safety ---

// Main interface for the Lead document
export interface ILead extends Document {
  customerName: string;
  email: string;
  mobileNumber: string;
  preferredDate: Date;
  timeSlot: '9am-12pm' | '12pm-3pm' | '3pm-6pm';
  projectType: 'Residential' | 'Commercial' | 'Renovation' | 'New Construction';
  budgetRange: 'Under Rs 10000' | '10000-25000' | '25000-50000' | '50000-100000' | 'Over Rs 100000';
  status: 'New' | 'Contacted' | 'Converted' | 'Closed';
  additionalMessage?: string;
}

// --- Mongoose Schema ---

// The main schema for the Lead model
const LeadSchema: Schema = new Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    trim: true,
    lowercase: true,
    // Basic email format validation
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required.'],
    trim: true,
  },
  preferredDate: {
    type: Date,
    required: [true, 'A preferred date is required.'],
  },
  timeSlot: {
    type: String,
    required: [true, 'A time slot is required.'],
    enum: {
      values: ['9am-12pm', '12pm-3pm', '3pm-6pm'],
      message: '{VALUE} is not a supported time slot.',
    },
  },
  projectType: {
    type: String,
    required: [true, 'Project type is required.'],
    enum: {
      values: ['Residential', 'Commercial', 'Renovation', 'New Construction'],
      message: '{VALUE} is not a supported project type.',
    },
  },
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required.'],
    enum: {
      values: ['Under Rs 10000', '10000-25000', '25000-50000', '50000-100000', 'Over Rs 100000'],
      message: '{VALUE} is not a supported budget range.',
    },
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['New', 'Contacted', 'Converted', 'Closed'],
      message: '{VALUE} is not a supported status.',
    },
    default: 'New', // Default status for a new lead
  },
  additionalMessage: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// --- Model Export ---

// Prevent model overwrite in Next.js hot-reloading environment
export const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
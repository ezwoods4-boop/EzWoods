import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Lead } from '@/models/lead'; // Adjust path if your models folder is elsewhere

// This function handles POST requests to /api/leads
export async function POST(request: Request) {
  try {
    await connectDB();

    // Get the form data from the request body
    const body = await request.json();
    
    // Basic validation to ensure required fields are present
    if (!body.customerName || !body.email || !body.mobileNumber || !body.preferredDate || !body.timeSlot) {
        return NextResponse.json({ success: false, message: 'Missing required lead information.' }, { status: 400 });
    }

    // Create a new lead document using the Mongoose model
    const newLead = new Lead(body);
    
    // Save the new lead to the database
    const savedLead = await newLead.save();

    return NextResponse.json({
      success: true,
      message: 'Consultation request submitted successfully.',
      data: savedLead,
    }, { status: 201 });

  } catch (error) {
    console.error('API Error in /api/leads:', error);
    // Handle potential validation errors from Mongoose
    if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unknown server error occurred' }, { status: 500 });
  }
}

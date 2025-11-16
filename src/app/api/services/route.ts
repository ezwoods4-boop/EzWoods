import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Service } from '@/models/service'; // Adjust path if your models folder is elsewhere

export async function GET() {
  try {
    await connectDB();

    // Find all services that are currently active
    const services = await Service.find({ status: 'active' })
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();

    return NextResponse.json({
      success: true,
      data: services,
    }, { status: 200 });

  } catch (error) {
    console.error('API Error in /api/services:', error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unknown server error occurred' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Service } from '@/models/service'; // Adjust path if your models folder is elsewhere

// This interface defines the shape of the context object provided by Next.js
interface IParams {
  params: Promise<{
    serviceId: string;
  }>;
}

// This function handles GET requests to /api/services/{serviceId}
export async function GET(request: Request, { params }: IParams) {
  try {
    await connectDB();

    const { serviceId } = await params;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!serviceId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid service ID format.' }, { status: 400 });
    }

    // Find the service by its unique ID
    const service = await Service.findById(serviceId).exec();

    // If no service is found for the given ID, return a 404 error
    if (!service) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    // If the service is found, return it
    return NextResponse.json({
      success: true,
      data: service,
    }, { status: 200 });

  } catch (error) {
    console.error(`API Error in /api/services/[serviceId]:`, error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unknown server error occurred' }, { status: 500 });
  }
}
import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Service } from '@/models/service';
import { currentUser, getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials from your .env.local file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define the shape of the context object from Next.js
interface RouteContext {
  params: Promise<{
    serviceId: string;
  }>;
}

// --- POST: Add a new review to a service ---
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    await connectDB();
    const { serviceId } = await params;
    const body = await request.json();
    const { rating, title, comment, images } = body;

    if (!rating || !title || !comment) {
      return NextResponse.json({ success: false, message: 'Rating, title, and comment are required.' }, { status: 400 });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    let uploadedImageUrls: string[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      const uploadPromises = images.map((base64Image: string) => 
        cloudinary.uploader.upload(base64Image, { folder: `service-reviews/${serviceId}` })
      );
      const uploadResults = await Promise.all(uploadPromises);
      uploadedImageUrls = uploadResults.map(result => result.secure_url);
    }

    const newReview = {
      user: {
        clerkId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User',
        avatar: user.imageUrl || '',
      },
      rating,
      title,
      body: comment,
      images: uploadedImageUrls,
    };

    console.log('New review being created:', JSON.stringify(newReview, null, 2));
    console.log('Current service reviews count:', service.reviews.length);
    
    // Check existing reviews for clerkId issues
    const reviewsWithoutClerkId = service.reviews.filter((review: { user: { clerkId?: string } }) => !review.user.clerkId);
    if (reviewsWithoutClerkId.length > 0) {
      console.log('Found reviews without clerkId:', reviewsWithoutClerkId.length);
      // Fix existing reviews by adding a default clerkId
      reviewsWithoutClerkId.forEach((review: { user: { clerkId?: string } }) => {
        review.user.clerkId = 'legacy-user';
      });
    }

    service.reviews.push(newReview);
    console.log('About to save service with reviews...');
    await service.save();
    console.log('Service saved successfully!');
    
    // Verify the saved review
    const savedReview = service.reviews[service.reviews.length - 1];
    console.log('Saved review verification:', JSON.stringify(savedReview, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Review added successfully.',
      data: service.reviews[service.reviews.length - 1],
    }, { status: 201 });

  } catch (error) {
    const { serviceId } = await params;
    console.error(`API Error POST /api/services/${serviceId}/reviews:`, error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

// --- DELETE: Remove a review from a service ---
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = getAuth(request);
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    await connectDB();
    const { serviceId } = await params;
    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json({ success: false, message: 'Review ID is required.' }, { status: 400 });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json({ success: false, message: 'Service not found.' }, { status: 404 });
    }

    const review = service.reviews.id(reviewId);
    if (!review) {
      return NextResponse.json({ success: false, message: 'Review not found.' }, { status: 404 });
    }

    // CRITICAL SECURITY CHECK: Ensure the user deleting the review is the one who created it.
    if (review.user.clerkId !== session.userId) {
      return NextResponse.json({ success: false, message: 'You are not authorized to delete this review.' }, { status: 403 });
    }
    
    // Use the $pull operator to remove the review from the array by its _id
    await Service.updateOne(
      { _id: serviceId },
      { $pull: { reviews: { _id: reviewId } } }
    );

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully.',
    }, { status: 200 });

  } catch (error) {
    const { serviceId } = await params;
    console.error(`API Error DELETE /api/services/${serviceId}/reviews:`, error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

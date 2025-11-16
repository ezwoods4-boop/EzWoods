import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Product } from '@/models/product';
import { getAuth, currentUser } from '@clerk/nextjs/server';
import { ensureUserInDatabase } from '@/utils/userUtils';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials from your .env.local file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface IParams {
  params: Promise<{
    productId: string;
  }>;
}

// --- POST: Add a new review to a product ---
export async function POST(request: NextRequest, { params }: IParams) {
  try {
    const session = getAuth(request);
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    // Ensure user exists in MongoDB database
    await ensureUserInDatabase(request);
    const user = await currentUser();
    
    console.log('Session userId:', session.userId);
    console.log('User from currentUser:', user?.id);
    console.log('User firstName:', user?.firstName);
    console.log('User lastName:', user?.lastName);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 401 });
    }

    await connectDB();
    const { productId } = await params;
    const body = await request.json();
    const { rating, title, comment, images } = body; // 'images' is an array of base64 strings

    if (!rating || !title || !comment) {
      return NextResponse.json({ success: false, message: 'Rating, title, and comment are required.' }, { status: 400 });
    }

    // Ensure we have a valid clerkId
    const clerkId = session.userId || user.id;
    console.log('Final clerkId being used:', clerkId);
    console.log('Type of clerkId:', typeof clerkId);
    
    if (!clerkId) {
      console.log('ERROR: No clerkId found!');
      return NextResponse.json({ success: false, message: 'User ID not found.' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    // --- Cloudinary Image Upload Logic ---
    let uploadedImageUrls: string[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      const uploadPromises = images.map((base64Image: string) => {
        return cloudinary.uploader.upload(base64Image, {
          folder: `reviews/${productId}`, // Organize uploads into folders
        });
      });
      
      const uploadResults = await Promise.all(uploadPromises);
      uploadedImageUrls = uploadResults.map(result => result.secure_url);
    }
    // --- End of Cloudinary Logic ---

    const newReview = {
      user: {
        clerkId: clerkId,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous User',
        avatar: user.imageUrl || '',
      },
      rating,
      title,
      body: comment,
      images: uploadedImageUrls,
    };

    console.log('Review object being created:', JSON.stringify(newReview, null, 2));
    console.log('Current product reviews count:', product.reviews.length);
    console.log('Existing reviews:', JSON.stringify(product.reviews, null, 2));

    product.reviews.push(newReview);
    console.log('About to save product with reviews...');
    await product.save();
    console.log('Product saved successfully!');

    return NextResponse.json({
      success: true,
      message: 'Review added successfully.',
      data: product.reviews[product.reviews.length - 1],
    }, { status: 201 });

  } catch (error) {
    const { productId } = await params;
    console.error(`API Error POST /api/products/${productId}/reviews:`, error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unknown server error occurred' }, { status: 500 });
  }
}


// --- DELETE: Remove a review from a product ---
export async function DELETE(request: NextRequest, { params }: IParams) {
  try {
    const session = getAuth(request);
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    await connectDB();
    const { productId } = await params;
    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json({ success: false, message: 'Review ID is required.' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return NextResponse.json({ success: false, message: 'Review not found.' }, { status: 404 });
    }

    // CRITICAL SECURITY CHECK: Ensure the user deleting the review is the one who created it.
    if (review.user.clerkId !== session.userId) {
      return NextResponse.json({ success: false, message: 'You are not authorized to delete this review.' }, { status: 403 });
    }
    
    // Use the $pull operator to remove the review from the array by its _id
    await Product.updateOne(
      { _id: productId },
      { $pull: { reviews: { _id: reviewId } } }
    );

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully.',
    }, { status: 200 });

  } catch (error) {
    const { productId } = await params;
    console.error(`API Error DELETE /api/products/${productId}/reviews:`, error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unknown server error occurred' }, { status: 500 });
  }
}


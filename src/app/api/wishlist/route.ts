import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/utils/connectDB';
import { User } from '@/models/users';
// Import Product to populate
import { getAuth } from '@clerk/nextjs/server';
import { ensureUserInDatabase } from '@/utils/userUtils';

// --- GET: Fetch the user's full wishlist ---
export async function GET(request: NextRequest) {
  try {
    const session = getAuth(request);
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    // Ensure user exists in MongoDB database
    await ensureUserInDatabase(request);

    await connectDB();

    const userWithWishlist = await User.findOne({ clerkId: session.userId })
      .populate('wishlist') // This populates the product details
      .exec();

    if (!userWithWishlist) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: userWithWishlist.wishlist }, { status: 200 });

  } catch (error) {
    console.error('API Error GET /api/wishlist:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}


// --- POST: Add or remove an item from the wishlist ---
export async function POST(request: NextRequest) {
  try {
    const session = getAuth(request);
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Authentication required.' }, { status: 401 });
    }

    // Ensure user exists in MongoDB database
    await ensureUserInDatabase(request);

    await connectDB();
    const { productId, action } = await request.json(); // action can be 'add' or 'remove'

    if (!productId || !action) {
      return NextResponse.json({ success: false, message: 'Product ID and action are required.' }, { status: 400 });
    }

    let updateOperation;
    if (action === 'add') {
      // Use $addToSet to add the productId only if it's not already in the array
      updateOperation = { $addToSet: { wishlist: productId } };
    } else if (action === 'remove') {
      // Use $pull to remove the productId from the array
      updateOperation = { $pull: { wishlist: productId } };
    } else {
      return NextResponse.json({ success: false, message: 'Invalid action.' }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: session.userId },
      updateOperation,
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Product ${action === 'add' ? 'added to' : 'removed from'} wishlist.`,
      data: updatedUser.wishlist,
    }, { status: 200 });

  } catch (error) {
    console.error('API Error POST /api/wishlist:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}


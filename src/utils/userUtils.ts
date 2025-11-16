import { getAuth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/utils/connectDB';
import { User } from '@/models/users';
import { NextRequest } from 'next/server';

/**
 * Ensures user data exists in MongoDB and returns the user document
 * This function will create the user if they don't exist in the database
 */
export async function ensureUserInDatabase(request: NextRequest) {
  try {
    const session = getAuth(request);
    if (!session || !session.userId) {
      throw new Error('Authentication required');
    }

    await connectDB();

    // Check if user exists in MongoDB
    let user = await User.findOne({ clerkId: session.userId });
    
    if (!user) {
      // User doesn't exist in MongoDB, get their data from Clerk and create them
      const clerkUser = await currentUser();
      if (!clerkUser) {
        throw new Error('User not found in Clerk');
      }

      // Create user in MongoDB
      user = await User.create({
        clerkId: session.userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        phone: clerkUser.phoneNumbers[0]?.phoneNumber || '',
        imageUrl: clerkUser.imageUrl || '',
        wishlist: [],
        orderHistory: []
      });

      console.log(`User ${session.userId} was created in MongoDB via ensureUserInDatabase`);
    }

    return user;
  } catch (error) {
    console.error('Error in ensureUserInDatabase:', error);
    throw error;
  }
}

/**
 * Gets user data from MongoDB by Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    await connectDB();
    return await User.findOne({ clerkId });
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error);
    throw error;
  }
}

/**
 * Updates user data in MongoDB
 */
export async function updateUserInDatabase(clerkId: string, updateData: Partial<typeof User>) {
  try {
    await connectDB();
    return await User.findOneAndUpdate(
      { clerkId },
      updateData,
      { new: true, upsert: true }
    );
  } catch (error) {
    console.error('Error updating user in database:', error);
    throw error;
  }
}

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import connectDB from '@/utils/connectDB';
import { User } from '@/models/users';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local');
  }

  // Get the headers
  const headerObj = await headers();
  const svix_id = headerObj.get("svix-id");
  const svix_timestamp = headerObj.get("svix-timestamp");
  const svix_signature = headerObj.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  const eventType = evt.type;
  
  // Handle user creation and updates
  if (eventType === 'user.created' || eventType === 'user.updated') {
    try {
      await connectDB();
      
      const { id, email_addresses, first_name, last_name, phone_numbers, image_url } = evt.data;

      // Get primary email address
      const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id)?.email_address || 
                          email_addresses?.[0]?.email_address;

      // Get primary phone number
      const primaryPhone = phone_numbers?.find(phone => phone.id === evt.data.primary_phone_number_id)?.phone_number ||
                          phone_numbers?.[0]?.phone_number;

      // Create or update user document in MongoDB
      const userData = {
        clerkId: id,
        email: primaryEmail,
        name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
        phone: primaryPhone,
        imageUrl: image_url,
        // Wishlist and orderHistory will be empty by default for new users
        ...(eventType === 'user.created' && {
          wishlist: [],
          orderHistory: []
        })
      };

      const user = await User.findOneAndUpdate(
        { clerkId: id }, // Find the user by their Clerk ID
        userData,
        { upsert: true, new: true } // 'upsert: true' creates the user if they don't exist
      );
      
      console.log(`User ${id} was successfully ${eventType === 'user.created' ? 'created' : 'updated'} in the database.`);
      return NextResponse.json({ 
        success: true, 
        message: `User ${eventType === 'user.created' ? 'created' : 'updated'}`,
        userId: user._id 
      }, { status: eventType === 'user.created' ? 201 : 200 });

    } catch (error) {
      console.error(`Error ${eventType === 'user.created' ? 'creating' : 'updating'} user in database:`, error);
      return NextResponse.json({ 
        success: false, 
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  }

  // Handle user deletion
  if (eventType === 'user.deleted') {
    try {
      await connectDB();
      
      const { id } = evt.data;
      
      // Optionally, you might want to anonymize the user data instead of deleting
      // For now, we'll delete the user document
      const deletedUser = await User.findOneAndDelete({ clerkId: id });
      
      if (deletedUser) {
        console.log(`User ${id} was successfully deleted from the database.`);
        return NextResponse.json({ success: true, message: 'User deleted' }, { status: 200 });
      } else {
        console.log(`User ${id} was not found in the database.`);
        return NextResponse.json({ success: true, message: 'User not found' }, { status: 200 });
      }

    } catch (error) {
      console.error("Error deleting user from database:", error);
      return NextResponse.json({ 
        success: false, 
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  }

  // If it's a different event type, we can just acknowledge it
  return NextResponse.json({ success: true, message: 'Webhook received' }, { status: 200 });
}



import mongoose from 'mongoose';

// A type for our cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global NodeJS object to cache our connection
// This prevents multiple connections in a serverless environment
declare global {
  var mongoose: MongooseCache;
}

// Initialize the cache if it doesn't exist
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If we have a cached connection, use it
  if (cached.conn) {
    console.log('Using cached MongoDB connection.');
    return cached.conn;
  }

  // If there's no active promise to connect, create one
  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }

    console.log('Creating new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Recommended for performance
    }).then((mongooseInstance) => {
      console.log('MongoDB connected successfully.');
      return mongooseInstance;
    });
  }
  
  try {
    // Await the connection promise and cache the result
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, reset the promise and re-throw the error
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;


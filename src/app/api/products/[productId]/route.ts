import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Product } from '@/models/product'; // Adjust path if your models folder is elsewhere

// This interface defines the shape of the context object provided by Next.js
// which contains the dynamic route parameters.
interface IParams {
  params: Promise<{
    productId: string;
  }>;
}

// This function handles GET requests to /api/products/{productId}
export async function GET(request: Request, { params }: IParams) {
  try {
    await connectDB();

    const { productId } = await params;

    // A crucial validation step: check if the provided ID is a valid MongoDB ObjectId.
    // This prevents database errors for malformed IDs.
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid product ID format.' }, { status: 400 });
    }

    // Find the product by its unique ID.
    // We can also .populate('category') here if we wanted to embed the full category document.
    const product = await Product.findById(productId).exec();

    // If no product is found for the given ID, return a 404 Not Found error.
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    // If the product is found, return it with a 200 OK status.
    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 200 });

  } catch (error) {
    console.error(`API Error in /api/products/[productId]:`, error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unknown server error occurred' }, { status: 500 });
  }
}

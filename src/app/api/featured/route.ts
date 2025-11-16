import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Product } from '@/models/product'; // Adjust this import path to match your models folder

export async function GET() {
  try {
    await connectDB();

    // Define the specific categories you want to feature
    const targetCategories = ['Drawing Room', 'Bedroom', 'Kitchen'];

    // Create a case-insensitive regular expression for each category for the initial match
    const caseInsensitiveCategories = targetCategories.map(cat => new RegExp(`^${cat}$`, 'i'));

    const aggregationPipeline = [
      // Step 1: Find all products that are in one of our target categories (case-insensitive).
      {
        $match: {
          categoryName: { $in: caseInsensitiveCategories }
        }
      },
      // Step 2: Sort all the matched products by newest first.
      {
        $sort: {
          createdAt: -1 
        }
      },
      // Step 3: Group by the normalized category name and take only the FIRST document (which is the latest one).
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$categoryName" } } }, // Group by normalized name
          latestProduct: { $first: '$$ROOT' } // Get the entire document of the most recent product in each group
        }
      },
      // Step 4: Reshape the output to be cleaner.
      {
        $project: {
          _id: 0, // Exclude the default _id field
          category: '$latestProduct.categoryName', // Get the original category name from the product
          product: '$latestProduct' // The product document itself
        }
      }
    ];

    // Fix: Mongoose expects $sort values to be 1 or -1, not just any number.
    // The original code is correct, but the type error is likely due to the type of -1 being inferred as number.
    // To fix, explicitly type -1 as -1.
    aggregationPipeline[1] = {
      $sort: {
        createdAt: -1 as -1
      }
    };

    // Explicitly cast aggregationPipeline as PipelineStage[] to satisfy TypeScript
    const results = await Product.aggregate(aggregationPipeline as import('mongoose').PipelineStage[]);

    // Convert the array of results into a key-value object for the final response.
    // e.g., { "Living Room": {product_object}, "Bedroom": {product_object} }
    const featuredProducts = results.reduce<Record<string, unknown>>(
      (acc: Record<string, unknown>, result: { category: string; product: unknown }) => {
        // Find the original target category to use as the key, preserving capitalization
        const originalCategory = targetCategories.find(
          (c: string) => c.toLowerCase() === result.category.toLowerCase().trim()
        );
        if (originalCategory) {
          // Assign the single product object directly to the category key
          acc[originalCategory] = result.product; 
        }
        return acc;
    }, {} as Record<string, unknown>);

    return NextResponse.json({
      success: true,
      data: featuredProducts
    }, { status: 200 });

  } catch (error) {
    console.error('API Error in /api/featured:', error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unknown server error occurred' }, { status: 500 });
  }
}


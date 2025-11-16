import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Product } from '@/models/product';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    console.log('\n--- NEW API REQUEST (ADVANCED DEBUG) ---');
    await connectDB();
    
    // --- ADVANCED DEBUGGING LOGS ---
    const connection = mongoose.connection;
    if (connection.db) {
      console.log(`Successfully connected to database: "${connection.db.databaseName}"`);
      const collections = await connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log('Collections found in this database:', collectionNames);
    } else {
      console.warn('Warning: connection.db is undefined. Could not log database name or collections.');
    }
    // --- END ADVANCED DEBUGGING LOGS ---

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const filter: Record<string, unknown> = {};

    if (category && category !== 'All') {
      filter.categoryName = category;
    }

    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) {
        priceFilter.$gte = Number(minPrice);
      }
      if (maxPrice) {
        priceFilter.$lte = Number(maxPrice);
      }
      filter['price.original'] = priceFilter;
    }
    
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };

    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          sortOptions = { 'price.original': 1 };
          break;
        case 'price-high':
          sortOptions = { 'price.original': -1 };
          break;
        case 'name':
          sortOptions = { name: 1 };
          break;
      }
    }

    const totalProductsMatchingFilter = await Product.countDocuments(filter);
    
    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    console.log(`Found ${products.length} products to return.`);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProductsMatchingFilter / limit),
        totalProducts: totalProductsMatchingFilter,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('--- API CATCH BLOCK ERROR ---:', error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: 'An unknown error occurred' }, { status: 500 });
  }
}


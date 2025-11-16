import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Product } from '@/models/product';
import { Category } from '@/models/category';

export async function POST() {
  try {
    await connectDB();

    // First, create categories
    const categories = [
      { name: 'Living Room', description: 'Comfortable seating and entertainment furniture' },
      { name: 'Bedroom', description: 'Bedroom furniture and storage solutions' },
      { name: 'Dining Room', description: 'Dining tables, chairs, and storage' },
      { name: 'Kitchen', description: 'Kitchen furniture and storage' },
      { name: 'Office', description: 'Office desks, chairs, and storage' }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Created categories:', createdCategories.length);

    // Create sample products that match the schema
    const sampleProducts = [
      {
        name: 'Modern Sectional Sofa',
        description: 'A luxurious modern sectional sofa with premium fabric upholstery and ergonomic design.',
        category: createdCategories[0]._id, // Living Room
        categoryName: 'Living Room',
        price: {
          original: 1299,
          discounted: 1199
        },
        stock: 10,
        dimensions: {
          height: 85,
          width: 240,
          depth: 160,
          unit: 'cm'
        },
        material: ['Premium Fabric', 'Hardwood Frame', 'High-Density Foam'],
        images: [
          'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&crop=center'
        ],
        status: 'active',
        reviews: []
      },
      {
        name: 'Rustic Dining Table',
        description: 'Handcrafted solid wood dining table with rustic finish. Seats up to 6 people comfortably.',
        category: createdCategories[2]._id, // Dining Room
        categoryName: 'Dining Room',
        price: {
          original: 899
        },
        stock: 5,
        dimensions: {
          height: 75,
          width: 180,
          depth: 90,
          unit: 'cm'
        },
        material: ['Solid Oak Wood'],
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center'
        ],
        status: 'active',
        reviews: []
      },
      {
        name: 'King Size Bed Frame',
        description: 'Elegant king size bed frame with upholstered headboard and built-in storage.',
        category: createdCategories[1]._id, // Bedroom
        categoryName: 'Bedroom',
        price: {
          original: 1599,
          discounted: 1399
        },
        stock: 8,
        dimensions: {
          height: 120,
          width: 200,
          depth: 220,
          unit: 'cm'
        },
        material: ['Upholstered Fabric', 'Solid Wood Frame'],
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop&crop=center'
        ],
        status: 'active',
        reviews: []
      },
      {
        name: 'Kitchen Island',
        description: 'Modern kitchen island with granite countertop and built-in storage.',
        category: createdCategories[3]._id, // Kitchen
        categoryName: 'Kitchen',
        price: {
          original: 2299
        },
        stock: 3,
        dimensions: {
          height: 90,
          width: 120,
          depth: 60,
          unit: 'cm'
        },
        material: ['Granite', 'Solid Wood', 'Stainless Steel'],
        images: [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center'
        ],
        status: 'active',
        reviews: []
      },
      {
        name: 'Executive Office Desk',
        description: 'Spacious executive desk with built-in drawers and cable management.',
        category: createdCategories[4]._id, // Office
        categoryName: 'Office',
        price: {
          original: 799,
          discounted: 699
        },
        stock: 12,
        dimensions: {
          height: 75,
          width: 160,
          depth: 80,
          unit: 'cm'
        },
        material: ['Solid Wood', 'Metal Hardware'],
        images: [
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&crop=center'
        ],
        status: 'active',
        reviews: []
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log('Created products:', createdProducts.length);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded database with ${createdCategories.length} categories and ${createdProducts.length} products`,
      data: {
        categories: createdCategories.length,
        products: createdProducts.length
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Seeding error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ 
        success: false, 
        message: error.message 
      }, { status: 500 });
    }
    return NextResponse.json({ 
      success: false, 
      message: 'An unknown error occurred during seeding' 
    }, { status: 500 });
  }
}

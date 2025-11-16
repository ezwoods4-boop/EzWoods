import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ICategory } from '@/models/category';
import connectDB from '@/utils/connectDB';
import { Category } from '@/models/category';
import { Product } from '@/models/product';

// This function now runs directly on the server, fetching data from MongoDB.
async function getCategories(): Promise<(ICategory & { productCount: number })[]> {
  try {
    await connectDB();
    
    // Get all active categories
    const categories = await Category.find({ status: 'active' })
      .sort({ name: 1 })
      .lean() 
      .exec();
    
    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id,
          status: 'active' 
        });
        return {
          ...category,
          productCount
        };
      })
    );
    
    return JSON.parse(JSON.stringify(categoriesWithCounts));
  } catch (error) {
    console.error("Error directly fetching categories:", error);
    return []; 
  }
}

// The page is an async Server Component
export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-playfair text-4xl font-bold text-furniture-darkBrown mb-4">
          Furniture Categories
        </h1>
        <p className="font-inter text-lg text-furniture-charcoal max-w-2xl mx-auto">
          Explore our complete range of furniture organized by room and function.
        </p>
      </div>

      {/* Categories Grid - Populated with data fetched directly from the database */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <Card 
              key={String(category._id)} 
              className="group overflow-hidden border-furniture-sand hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <Image
                  // Use the 'image' field from the category data, with a fallback to a placeholder.
                    src={category.image ?? `/shop?category=${encodeURIComponent(category.name)}`}
                  alt={category.name}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                
                <Badge className="absolute top-4 right-4 bg-white text-furniture-darkBrown shadow">
                  {category.productCount} items
                </Badge>
                
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-playfair text-2xl font-bold mb-1">
                    {category.name}
                  </h3>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="font-inter text-furniture-charcoal mb-4 min-h-[40px]">
                  {category.description}
                </p>

                <Button 
                  className="w-full mt-4 bg-furniture-brown hover:bg-furniture-darkBrown font-inter"
                  size="sm"
                  asChild
                >
                  <Link href={`/shop?category=${encodeURIComponent(category.name)}`}>
                    Shop {category.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No categories could be loaded at this time.
          </p>
        )}
      </div>
    </div>
  );
};


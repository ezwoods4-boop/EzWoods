import HeroSection from '@/components/hero-section';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Truck, Shield, Headphones, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { IProduct } from '@/models/product';
import { ICategory } from '@/models/category';
import connectDB from '@/utils/connectDB';
import { Product } from '@/models/product';
import { Category } from '@/models/category';
import type { PipelineStage } from 'mongoose';

// --- DATA FETCHING FUNCTIONS (RUN ON SERVER) ---

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    await connectDB();
    const targetCategories = ['Drawing Room', 'Living Room', 'Bedroom', 'Kitchen'];
    const caseInsensitiveCategories = targetCategories.map(cat => new RegExp(`^${cat}$`, 'i'));

    const aggregationPipeline: PipelineStage[] = [
      { $match: { categoryName: { $in: caseInsensitiveCategories } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { $toLower: { $trim: { input: "$categoryName" } } },
          originalCategoryName: { $first: '$categoryName' },
          products: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          category: '$originalCategoryName',
          products: { $slice: ['$products', 3] },
          _id: 0
        }
      }
    ];

    const results = await Product.aggregate(aggregationPipeline);
    const featuredProducts = results.flatMap((group: { products: IProduct[] }) => group.products);
    return JSON.parse(JSON.stringify(featuredProducts));
  } catch (error) {
    console.error("Error directly fetching featured products:", error);
    return [];
  }
}

async function getCategories(): Promise<ICategory[]> {
  try {
    await connectDB();
    const categories = await Category.find({ status: 'active' })
      .sort({ name: 1 })
      .populate('productCount')
      .limit(3) // Fetching 3 categories for the homepage section
      .lean()
      .exec();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error directly fetching categories:", error);
    return [];
  }
}

// --- HOMEPAGE COMPONENT ---

const HomePage = async () => {
  // Fetch both sets of data in parallel for better performance
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ]);

  const features = [
    { icon: Truck, title: 'Free Shipping', description: 'Free shipping on orders over ₹500' },
    { icon: Shield, title: 'Quality Guarantee', description: '5-year warranty on all products' },
    { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
    { icon: Headphones, title: '24/7 Support', description: 'Customer support available anytime' }
  ];

  return (
    <div className="animate-fade-in">
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-b from-furniture-cream/30 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold text-furniture-darkBrown mb-6">Featured Products</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-furniture-brown to-furniture-sage mx-auto"></div>
          </div>
          <ProductGrid products={featuredProducts} />
          <div className="text-center mt-16">
            <Link href="/shop">
              <Button size="lg" className="bg-furniture-brown hover:bg-furniture-darkBrown font-inter px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                View All Products
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Now fully dynamic */}
      <section className="py-20 bg-gradient-to-b from-white to-furniture-cream/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold text-furniture-darkBrown mb-6">Shop by Category</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-furniture-brown to-furniture-sage mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={String(category._id)} href={`/shop?category=${encodeURIComponent(category.name)}`} className="group block">
                <Card className="overflow-hidden border-furniture-sand/50 group-hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white/90 backdrop-blur-sm">
                  <div className="relative">
                    <Image
                      src={category.image || '/placeholder-image.svg'}
                      alt={category.name}
                      width={500}
                      height={320}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                    <div className="absolute bottom-8 left-8 text-white transform group-hover:translate-y-[-8px] transition-transform duration-500">
                      <h3 className="font-playfair text-3xl font-bold mb-2">{category.name}</h3>
                      <p className="font-inter text-sm opacity-90">{category.productCount} Items</p>
                      <div className="w-12 h-0.5 bg-white mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200"></div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
        </div>
      </section>

      {/* Features Section - Moved to bottom */}
      <section className="py-20 bg-gradient-to-b from-furniture-cream/20 to-furniture-cream/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold text-furniture-darkBrown mb-6">Why Choose Us</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-furniture-brown to-furniture-sage mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-furniture-sand/50 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                <CardContent className="p-8">
                  <div className="relative inline-block mb-6">
                    <feature.icon className="w-12 h-12 text-furniture-sage mx-auto group-hover:scale-110 transition-all duration-300 group-hover:text-furniture-brown" />
                    <div className="absolute inset-0 bg-furniture-sage/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
                  <h3 className="font-inter font-semibold text-furniture-darkBrown mb-3 group-hover:text-furniture-brown transition-colors duration-300">{feature.title}</h3>
                  <p className="text-sm text-gray-600 font-inter leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


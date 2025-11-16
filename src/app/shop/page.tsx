"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductGrid from '@/components/products/ProductGrid';
import { IProduct } from '@/models/product';
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Wrapper to use Suspense with useSearchParams
const ShopPageWrapper = () => (
  <Suspense fallback={<ShopSkeleton />}>
    <Shop />
  </Suspense>
);

const Shop = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  // State for products and API data
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Effect to fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      // Construct the query string from the current filter states
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (sortBy) params.append('sortBy', sortBy);
      // You can add more filters here like price, etc.
      
      try {
        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sortBy]);

  // Function to seed the database
  // const seedDatabase = async () => {
  //   try {
  //     const response = await fetch('/api/seed', { method: 'POST' });
  //     const data = await response.json();
  //     if (data.success) {
  //       alert('Database seeded successfully!');
  //       // Refresh the products
  //       window.location.reload();
  //     } else {
  //       alert('Failed to seed database: ' + data.message);
  //     }
  //   } catch (error) {
  //     console.error('Failed to seed database:', error);
  //     alert('Failed to seed database');
  //   }
  // };

  // Effect to fetch categories for the filter sidebar only once
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            // Assuming you have an API endpoint for categories
            const response = await fetch('/api/categories'); 
            const data = await response.json();
            if(data.success) {
                setCategories(['All', ...data.data.map((cat: { name: string }) => cat.name)]);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories(['All']); // Fallback
        }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-4xl font-bold text-furniture-darkBrown mb-4">
          Shop Furniture
        </h1>
        <p className="font-inter text-lg text-furniture-charcoal">
          Discover our complete collection of premium furniture
        </p>
      </div>

      {/* Search and Top Controls Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="w-full lg:w-96">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`${isFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-6`}>
          <Card>
            <CardHeader>
              <CardTitle className="font-inter text-sm font-semibold">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.length > 1 ? categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategory === category}
                    onCheckedChange={() => setSelectedCategory(category)}
                  />
                  <label htmlFor={category} className="font-inter text-sm cursor-pointer">
                    {category}
                  </label>
                </div>
              )) : <Skeleton className="h-4 w-2/3" />}
            </CardContent>
          </Card>
          {/* Price Range Filter can be added here */}
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          {isLoading ? (
            <ShopSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="font-playfair text-2xl font-semibold text-furniture-darkBrown mb-4">
                No Products Found
              </h3>
              <p className="font-inter text-gray-600 mb-6">
                No products found matching your criteria.
              </p>
             
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </main>
      </div>
    </div>
  );
};

// A skeleton component to show while the shop is loading
const ShopSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        ))}
    </div>
);

export default ShopPageWrapper;


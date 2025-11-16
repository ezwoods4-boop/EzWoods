"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IProduct } from '@/models/product';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useState } from 'react';

interface ProductCardProps {
  product: IProduct;
  viewMode?: 'grid' | 'list'; // To handle different layouts
}

const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  
  const isInWishlistProduct = isInWishlist(product._id?.toString() || '');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop the event from bubbling up to the Link component
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlistProduct) {
      await removeFromWishlist(product._id?.toString() || '');
    } else {
      await addToWishlist(product._id?.toString() || '');
    }
  };
  
  // Grid View Layout
  if (viewMode === 'grid') {
    return (
      <Card className="group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-furniture-sand bg-white/80 backdrop-blur-sm">
        <Link href={`/product/${product._id}`} className="block cursor-pointer">
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110"
            />
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <Button 
                variant="secondary" 
                size="icon" 
                className="w-10 h-10 bg-white/90" 
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
              >
                <Heart className={`w-4 h-4 transition-all duration-300 ${isInWishlistProduct ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
              <Button variant="secondary" size="icon" className="w-10 h-10 bg-white/90" onClick={handleAddToCart} disabled={product.stock <= 0}>
                <ShoppingCart className={`w-4 h-4 transition-all duration-300 ${isAdding ? 'text-green-600' : 'text-gray-600'}`} />
              </Button>
            </div>
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-medium px-4 py-2 bg-black/30 rounded-full">Out of Stock</span>
              </div>
            )}
          </div>
          <CardContent className="p-6">
             <h3 className="font-inter font-semibold text-furniture-charcoal mb-2 group-hover:text-furniture-brown transition-colors duration-300 leading-tight truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{product.categoryName}</p>
            <div className="font-playfair font-bold text-lg text-furniture-darkBrown">
              ₹
              {typeof product.price?.original === 'number'
                ? Number(product.price.original).toFixed(2)
                : typeof product.price === 'number'
                  ? Number(product.price).toFixed(2)
                  : '0.00'}
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // List View Layout
  return (
    <Card className="group transition-all duration-300 hover:shadow-lg border-furniture-sand bg-white/80 backdrop-blur-sm w-full">
      <Link href={`/product/${product._id}`} className="flex flex-col sm:flex-row gap-4 cursor-pointer">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={200}
          height={200}
          className="w-full sm:w-48 h-48 sm:h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-r-none"
        />
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.categoryName}</p>
            <h3 className="font-inter font-semibold text-lg text-furniture-charcoal mb-2 group-hover:text-furniture-brown transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 hidden md:block">
              {product.description.substring(0, 100)}...
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-playfair font-bold text-xl text-furniture-darkBrown">
              ₹
              {typeof product.price?.original === 'number'
                ? Number(product.price.original).toFixed(2)
                : typeof product.price === 'number'
                  ? Number(product.price).toFixed(2)
                  : '0.00'}
            </span>
            <Button onClick={handleAddToCart} disabled={product.stock <= 0} size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;


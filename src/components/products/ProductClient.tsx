"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Heart, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/components/ui/use-toast';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewDisplay from '@/components/reviews/ReviewDisplay';
import { IProduct } from '@/models/product'; // Using the interface from your Mongoose model

// Define the shape of the data submitted by the review form
interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  images: string[];
}

const ProductClient = ({ product, productId }: { product: IProduct; productId: string }) => {
  const { addItem, clearCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  const { toast } = useToast();
  const router = useRouter();
  
  const [selectedImage, setSelectedImage] = useState(0);
  // Safely initialize selectedColor from the product's material array
  const [selectedColor, setSelectedColor] = useState(product.material?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  
  // Check if product is in wishlist
  const isInWishlistProduct = isInWishlist(productId);

  // Dynamically calculate the average rating from the product's reviews
  const averageRating = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) {
      return 0;
    }
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / product.reviews.length;
  }, [product.reviews]);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    // Clear the cart first to ensure only this product is in the cart
    clearCart();
    // Add the product to cart
    addItem(product, quantity, selectedColor);
    // Navigate to checkout
    router.push('/checkout');
    toast({
      title: "Proceeding to checkout",
      description: `${quantity} x ${product.name} added to cart.`,
    });
  };

  const handleWishlistToggle = async () => {
    if (isInWishlistProduct) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const handleReviewSubmit = async (reviewData: ReviewFormData) => {
    try {
      const response = await fetch(`/api/products/${productId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          images: reviewData.images,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({ 
          title: "Review Submitted", 
          description: "Thank you for your valuable feedback!" 
        });
        // Optionally refresh the page to show the new review
        window.location.reload();
      } else {
        toast({ 
          title: "Error", 
          description: result.message || "Failed to submit review. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({ 
        title: "Error", 
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const features = [
    { icon: Truck, text: 'Free shipping on orders over ₹500' },
    { icon: Shield, text: '5-year warranty included' },
    { icon: RotateCcw, text: '30-day return policy' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-furniture-cream">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover transition-opacity duration-300"
              priority
            />
          </div>
          <div className="flex space-x-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-furniture-brown' : 'border-furniture-sand hover:border-furniture-brown/50'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <p className="font-inter text-sm text-furniture-sage mb-2">{product.categoryName}</p>
            <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-4">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="font-inter text-sm text-gray-600">{averageRating.toFixed(1)} ({product.reviews?.length || 0} reviews)</span>
            </div>
            <div className="flex items-center space-x-3 mb-6">
              <span className="font-playfair text-3xl font-bold text-furniture-darkBrown">₹{product.price.original.toFixed(2)}</span>
              {product.price.discounted && (
                <span className="text-xl text-gray-500 line-through">₹{product.price.discounted.toFixed(2)}</span>
              )}
            </div>
          </div>

          <p className="font-inter text-furniture-charcoal leading-relaxed">{product.description}</p>

          {product.material && product.material.length > 0 && (
            <div>
              <h3 className="font-inter font-semibold mb-3">Material / Color</h3>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select an option" /></SelectTrigger>
                <SelectContent>
                  {product.material.map((mat) => (<SelectItem key={mat} value={mat}>{mat}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <h3 className="font-inter font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-inter font-medium w-12 text-center text-lg">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex space-x-4">
              <Button onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-1 bg-furniture-brown hover:bg-furniture-darkBrown font-inter" size="lg">
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleWishlistToggle} 
                disabled={wishlistLoading}
                className="px-6"
              >
                <Heart className={`w-5 h-5 transition-all duration-300 ${isInWishlistProduct ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
              </Button>
            </div>
            <Button 
              onClick={handleBuyNow} 
              disabled={product.stock <= 0} 
              className="w-full font-inter" 
              size="lg"
              style={{ 
                backgroundColor: product.stock > 0 ? '#a7c957' : undefined,
                color: product.stock > 0 ? 'white' : undefined
              }}
            >
              {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
            </Button>
          </div>
          
          <div className="space-y-3 pt-6 border-t border-furniture-sand">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <feature.icon className="w-5 h-5 text-furniture-sage" />
                <span className="font-inter text-sm text-furniture-charcoal">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Product Information Tabs */}
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews?.length || 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="specifications">
             <Card className="border-furniture-sand">
               <CardContent className="p-6">
                 <h3 className="font-playfair text-xl font-semibold mb-4">Specifications</h3>
                 <div className="space-y-3 text-sm">
                   {product.dimensions && (
                     <div className="flex justify-between border-b pb-2">
                       <span className="text-gray-600">Dimensions ({product.dimensions.unit}):</span>
                       <span className="font-medium">{`${product.dimensions.width} W x ${product.dimensions.depth} D x ${product.dimensions.height} H`}</span>
                     </div>
                   )}
                   {product.material && product.material.length > 0 && (
                     <div className="flex justify-between border-b pb-2">
                       <span className="text-gray-600">Materials:</span>
                       <span className="font-medium">{product.material.join(', ')}</span>
                     </div>
                   )}
                 </div>
               </CardContent>
             </Card>
        </TabsContent>
        <TabsContent value="reviews">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="font-playfair text-xl font-semibold mb-6">Customer Reviews</h3>
                    {/* Pass IReview directly to ReviewDisplay */}
                    <ReviewDisplay 
                      productId={productId}
                      reviews={product.reviews || []} 
                      onReviewDeleted={() => {
                        // Refresh the page to show updated reviews
                        window.location.reload();
                      }}
                    />
                </div>
                <div>
                    <ReviewForm onSubmit={handleReviewSubmit} />
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductClient;


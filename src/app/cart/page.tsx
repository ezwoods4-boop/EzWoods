
"use client";

import  Link  from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

const Cart = () => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  
  // Helper function to safely get product price
  const getProductPrice = (product: { price?: { original?: number } | number }): number => {
    if (product.price && typeof product.price === 'object' && 'original' in product.price && typeof product.price.original === 'number') {
      return product.price.original;
    }
    if (typeof product.price === 'number') {
      return product.price;
    }
    return 0;
  };
  

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 text-furniture-sage mx-auto mb-6" />
        <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-4">
          Your Cart is Empty
        </h1>
        <p className="font-inter text-furniture-charcoal mb-8">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Link href="/shop">
          <Button size="lg" className="bg-furniture-brown hover:bg-furniture-darkBrown font-inter">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SignedOut>
        <div className="text-center py-16">
          <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-4">Please sign in to view your cart</h1>
          <SignInButton mode="modal">
            <Button className="bg-furniture-brown hover:bg-furniture-darkBrown">Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-8">
          Shopping Cart ({state.itemCount} items)
        </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item, index) => (
            <Card key={`${item.product._id || index}-${item.selectedColor || 'default'}`} className="border-furniture-sand">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-inter font-semibold text-furniture-darkBrown">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600">{item.product.categoryName}</p>
                        {item.selectedColor && (
                          <p className="text-sm text-furniture-sage">Color: {item.selectedColor}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product._id?.toString() || '')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product._id?.toString() || '', item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-inter font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product._id?.toString() || '', item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-playfair font-bold text-furniture-darkBrown">
                          ₹{(getProductPrice(item.product) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₹{getProductPrice(item.product).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Clear Cart */}
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-furniture-sand sticky top-24">
            <CardContent className="p-6">
              <h2 className="font-inter font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="font-inter text-gray-600">Subtotal</span>
                  <span className="font-inter">₹{state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-inter text-gray-600">Shipping</span>
                  <span className="font-inter">
                    {state.total >= 500 ? 'Free' : '₹50.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-inter text-gray-600">Tax</span>
                  <span className="font-inter">₹{(state.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-furniture-sand pt-3">
                  <div className="flex justify-between">
                    <span className="font-inter font-semibold">Total</span>
                    <span className="font-playfair font-bold text-lg text-furniture-darkBrown">
                      ₹{(state.total + (state.total >= 500 ? 0 : 50) + state.total * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {state.total < 500 && (
                <div className="bg-furniture-cream p-3 rounded-lg mb-6">
                  <p className="text-sm font-inter text-furniture-charcoal">
                    Add ₹{(500 - state.total).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-furniture-brown hover:bg-furniture-darkBrown font-inter">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/shop" className="block">
                  <Button variant="outline" className="w-full font-inter">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </SignedIn>
    </div>
  );
};

export default Cart;

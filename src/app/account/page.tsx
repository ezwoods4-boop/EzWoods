"use client";

import { useState, useEffect, FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Package, Heart, Trash2 } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { IProduct } from '@/models/product';
import { IOrder } from '@/models/order'; // Import the order type

const AccountPage: FC = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // State for fetched data
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState({ orders: true, wishlist: true });

  // Fetch Order History
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const result = await response.json();
        if (result.success) {
          setOrders(result.data);
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, orders: false }));
      }
    };
    fetchOrders();
  }, []);

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist');
        const result = await response.json();
        if (result.success) {
          setWishlist(result.data);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, wishlist: false }));
      }
    };
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
        const response = await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, action: 'remove' })
        });
        const result = await response.json();
        if(result.success) {
            toast({ title: "Removed from wishlist" });
            setWishlist(prev => prev.filter(p => p._id !== productId));
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    } catch {
        toast({ title: "Error", description: "Could not remove item.", variant: 'destructive' });
    }
  };

  const handleAddToCart = (product: IProduct) => {
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SignedOut>
        <div className="text-center py-16">
          <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-4">Please sign in to view your account</h1>
          <SignInButton mode="modal">
            <Button className="bg-furniture-brown hover:bg-furniture-darkBrown">Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
      <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-8">
        My Account
      </h1>
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders" className="flex items-center space-x-2"><Package className="w-4 h-4" /><span>Orders</span></TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center space-x-2"><Heart className="w-4 h-4" /><span>Wishlist</span></TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card className="border-furniture-sand">
            <CardHeader><CardTitle className="font-inter">Order History</CardTitle></CardHeader>
            <CardContent>
              {isLoading.orders ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p>You haven&apos;t placed any orders yet.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={String(order._id)} className="border border-furniture-sand rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-inter font-semibold">Order #{String(order._id).slice(-6)}</h3>
                          <p className="text-sm text-gray-600">Placed on {new Date((order as IOrder & { createdAt: string }).createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <p className="font-playfair font-bold text-lg mt-1">₹{order.pricing.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Items:</p>
                        <ul className="text-sm list-disc pl-5">
                          {order.items.map((item, index) => (
                            <li key={index} className="font-inter">{item.name} (x{item.quantity})</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card className="border-furniture-sand">
            <CardHeader><CardTitle className="font-inter">My Wishlist</CardTitle></CardHeader>
            <CardContent>
              {isLoading.wishlist ? (
                <p>Loading wishlist...</p>
              ) : wishlist.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                  <Link href="/shop"><Button className="bg-furniture-brown hover:bg-furniture-darkBrown">Start Shopping</Button></Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((product) => (
                    <div key={String(product._id)} className="border border-furniture-sand rounded-lg p-4">
                      <Link href={`/product/${product._id}`}>
                        <Image
                          src={product.images[0] || '/placeholder.svg'}
                          alt={product.name}
                          width={300}
                          height={192}
                          className="w-full h-48 object-cover rounded-lg mb-4 hover:opacity-90"
                        />
                      </Link>
                      <h3 className="font-inter font-semibold mb-2">{product.name}</h3>
                      <p className="font-playfair font-bold text-furniture-darkBrown mb-4">₹{product.price.original}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-furniture-brown hover:bg-furniture-darkBrown" onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                        <Button variant="outline" size="sm" onClick={() => handleRemoveFromWishlist(String(product._id))}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </SignedIn>
    </div>
  );
};

export default AccountPage;

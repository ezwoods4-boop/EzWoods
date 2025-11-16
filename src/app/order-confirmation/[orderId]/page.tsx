import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Truck, Home } from 'lucide-react';
import Link from 'next/link';

// This is now a simple Server Component that only reads from its parameters.
// It does not fetch any data from the database.
export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-6 sm:mb-8">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-3 sm:mb-4" />
          <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-furniture-darkBrown mb-2">
            Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Thank you for your purchase. You will receive a confirmation email shortly.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Order ID: #{orderId.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Order Status Timeline (Static) */}
        <Card className="mb-4 sm:mb-6 border-furniture-sand">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="font-inter text-base sm:text-lg">Order Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-2 md:space-x-4">
              <div className="flex items-center space-x-2 text-green-600 mb-2 sm:mb-0">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">Processing</span>
              </div>
              <div className="hidden sm:block flex-1 h-px bg-gray-200"></div>
              <div className="block sm:hidden w-full h-px bg-gray-200 mb-2"></div>
              <div className="flex items-center space-x-2 text-gray-400 mb-2 sm:mb-0">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Shipped</span>
              </div>
              <div className="hidden sm:block flex-1 h-px bg-gray-200"></div>
              <div className="block sm:hidden w-full h-px bg-gray-200 mb-2"></div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">Delivered</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next? Card */}
        <Card className="mb-6 sm:mb-8 border-furniture-sand">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="font-inter text-base sm:text-lg">What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We&apos;ve sent a confirmation to your email address. You will receive another email with tracking information once your order has shipped.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
          <Button asChild className="bg-furniture-brown hover:bg-furniture-darkBrown text-sm sm:text-base py-2 sm:py-3">
            <Link href="/account">View Order History</Link>
          </Button>
          <Button asChild variant="outline" className="border-furniture-brown text-furniture-brown hover:bg-furniture-cream text-sm sm:text-base py-2 sm:py-3">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

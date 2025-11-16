'use client'
import  Link  from 'next/link';
import { Heart, Calendar, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IService } from '@/models/service';
import { useState } from 'react';
import Image from 'next/image';

interface ServiceCardProps {
  service: IService;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleBookMeeting = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBooking(true);
    
    const quickBookingData = {
      action: 'QUICK_SERVICE_BOOKING',
      serviceId: String(service._id),
      serviceName: service.name,
      serviceCategory: service.category,
      startingPrice: service.price,
      duration: service.duration,
      timestamp: new Date().toISOString()
    };

    console.log('Quick Service Booking Data for Backend:', quickBookingData);
    
    // Brief animation delay
    setTimeout(() => setIsBooking(false), 600);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    const serviceWishlistData = {
      action: newLikedState ? 'ADD_SERVICE_TO_WISHLIST' : 'REMOVE_SERVICE_FROM_WISHLIST',
      serviceId: String(service._id),
      serviceName: service.name,
      servicePrice: service.price,
      timestamp: new Date().toISOString()
    };

    console.log('Service Wishlist Action:', serviceWishlistData);
  };

  return (
    <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-furniture-sand bg-white/80 backdrop-blur-sm">
      <Link href={`/service/${service._id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={service.images?.[0] || 'https://placehold.co/400x300/EFE8E2/5A4A3A?text=Service'}
            alt={service.name}
            width={400}
            height={256}
            className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Featured Badge */}
          {false && (
            <div className="absolute top-3 left-3 bg-furniture-brown text-white px-3 py-1 text-xs font-medium rounded-full animate-pulse shadow-lg">
              Featured
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <Button
              variant="secondary"
              size="sm"
              className={`w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110 ${isLiked ? 'scale-110' : ''}`}
              onClick={handleLike}
            >
              <Heart 
                className={`w-4 h-4 transition-all duration-300 ${
                  isLiked 
                    ? 'fill-red-500 text-red-500 scale-110' 
                    : 'text-gray-600 hover:text-red-400'
                }`} 
              />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className={`w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110 ${isBooking ? 'scale-95' : ''}`}
              onClick={handleBookMeeting}
              disabled={service.status !== 'active'}
            >
              <Calendar className={`w-4 h-4 text-gray-600 transition-all duration-300 ${isBooking ? 'text-green-600' : 'hover:text-furniture-brown'}`} />
            </Button>
          </div>

          {/* Availability Status */}
          {service.status !== 'active' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-medium px-4 py-2 bg-black/30 rounded-full">Coming Soon</span>
            </div>
          )}
        </div>

        <CardContent className="p-6 bg-gradient-to-b from-white to-furniture-cream/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 transition-all duration-300 ${
                    i < Math.floor(service.reviews?.length ? service.reviews.reduce((acc, review) => acc + review.rating, 0) / service.reviews.length : 0) 
                      ? 'fill-yellow-400 text-yellow-400 scale-110' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                ({service.reviews?.length || 0})
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {service.duration}
            </div>
          </div>

          <h3 className="font-inter font-semibold text-furniture-charcoal mb-2 group-hover:text-furniture-brown transition-all duration-300 leading-tight">
            {service.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {service.category}
          </p>

          <p className="text-xs text-gray-600 mb-4 line-clamp-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            {service.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">Starting from</span>
              <div className="font-playfair font-bold text-lg text-furniture-darkBrown group-hover:scale-105 transition-transform duration-300">
              ₹ {service.price}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBookMeeting}
              disabled={service.status !== 'active'}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-furniture-brown hover:text-white"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Book
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ServiceCard;
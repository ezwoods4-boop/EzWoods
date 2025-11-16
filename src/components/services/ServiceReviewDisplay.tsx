"use client";

import { useState, FC } from 'react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { Star, ThumbsUp, Calendar, ChevronLeft, ChevronRight, Trash2, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { IReview } from '@/models/service'; // Using the interface from your Service Mongoose model

interface ServiceReviewDisplayProps {
  serviceId: string;
  reviews: IReview[];
  onReviewDeleted?: (reviewId: string) => void; // Optional callback to update parent state
}

const ServiceReviewDisplay: FC<ServiceReviewDisplayProps> = ({ serviceId, reviews, onReviewDeleted }) => {
  const { user, isLoaded } = useUser(); // Get the currently logged-in user
  const { toast } = useToast();
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
    
    
    try {
      const response = await fetch(`/api/services/${serviceId}/review`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({ title: 'Review Deleted Successfully' });
        onReviewDeleted?.(reviewId); // Notify the parent component to update the UI
      } else {
        toast({ title: 'Error Deleting Review', description: result.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Could not connect to the server to delete review.', variant: 'destructive' });
    }
  };

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      newSet.has(reviewId) ? newSet.delete(reviewId) : newSet.add(reviewId);
      return newSet;
    });
    // In a real app, you would also send this "helpful" action to an API endpoint
    console.log('Helpful clicked for review:', reviewId);
  };

  const MediaCarousel = ({ images }: { images?: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    if (!images || images.length === 0) return null;

    const nextMedia = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevMedia = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
      <div className="relative mt-4">
        <div className="aspect-video bg-furniture-cream rounded-lg overflow-hidden">
          <Image
            src={images[currentIndex]}
            alt="Review media"
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        
        {images.length > 1 && (
          <>
            <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </>
        )}
      </div>
    );
  };

  // Show loading state while user data is being loaded
  if (!isLoaded) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this service!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review._id?.toString() || Math.random().toString()} className="border-furniture-sand hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {review.user.avatar ? (
                  <Image src={review.user.avatar} alt={review.user.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <UserCircle className="w-10 h-10 text-gray-400" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-inter font-medium text-furniture-charcoal">{review.user.name}</h4>
                    {/* Assuming a 'verified' field might exist on the review */}
                    {/* {review.verified && <CheckCircle className="w-4 h-4 text-green-600" />} */}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate((review as { createdAt?: string }).createdAt || new Date().toISOString())}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>

            <h3 className="font-inter font-semibold text-furniture-darkBrown mb-2">{review.title}</h3>
            <p className="text-furniture-charcoal leading-relaxed mb-4">{review.body}</p>
            
            <MediaCarousel images={review.images} />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-furniture-sand">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpful(review._id?.toString() || '')}
                  className={`text-sm ${helpfulReviews.has(review._id?.toString() || '') ? 'text-furniture-brown' : 'text-gray-500 hover:text-furniture-brown'}`}
                >
                  <ThumbsUp className={`w-4 h-4 mr-1 ${helpfulReviews.has(review._id?.toString() || '') ? 'fill-current' : ''}`} />
                  Helpful
                </Button>
              </div>
              
              {/* Show delete button ONLY if the logged-in user is the author of the review */}
              {user && user.id === review.user.clerkId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(review._id?.toString() || '')}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceReviewDisplay;

"use client";

import { useState, FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {  Clock, Star, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { IService } from '@/models/service';
import { useUser } from '@clerk/nextjs';
import ServiceReviewForm from './ServiceReviewForm';
import ServiceReviewDisplay from './ServiceReviewDisplay';

// Define a specific type for the form's data structure
interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  timeSlot: string;
  projectType: string;
  budget: string;
  message: string;
}

const ServiceDetailClient: FC<{ service: IService }> = ({ service }) => {
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviews, setReviews] = useState(service.reviews || []);

  // Debug logging
  console.log('ServiceDetailClient - User state:', { user, isLoaded, userId: user?.id });
  const [bookingData, setBookingData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    timeSlot: '',
    projectType: '',
    budget: '',
    message: ''
  });

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.preferredDate) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const leadPayload = {
        customerName: bookingData.name,
        email: bookingData.email,
        mobileNumber: bookingData.phone,
        preferredDate: bookingData.preferredDate,
        timeSlot: bookingData.timeSlot,
        projectType: bookingData.projectType,
        budgetRange: bookingData.budget,
        additionalMessage: bookingData.message,
    };

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadPayload)
        });

        const result = await response.json();

        if (result.success) {
            toast({
              title: "Consultation Booked!",
              description: "We'll contact you within 24 hours to confirm.",
            });
            // Reset form
            setBookingData({ name: '', email: '', phone: '', preferredDate: '', timeSlot: '', projectType: '', budget: '', message: '' });
        } else {
            toast({ title: "Submission Failed", description: result.message || "Please try again.", variant: "destructive" });
        }
    } catch (error) {
        console.error("Failed to submit booking form:", error);
        toast({ title: "An Error Occurred", description: "Could not submit your request.", variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleReviewSubmit = async (reviewData: { rating: number; title: string; comment: string; images: string[] }) => {
    try {
      const response = await fetch(`/api/services/${service._id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (result.success) {
        // Add the new review to the local state
        setReviews(prev => [...prev, result.data]);
        toast({
          title: "Review submitted successfully!",
          description: "Thank you for your feedback.",
        });
      } else {
        toast({
          title: "Failed to submit review",
          description: result.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast({
        title: "Error",
        description: "Could not submit your review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReviewDeleted = (reviewId: string) => {
    setReviews(prev => prev.filter(review => review._id?.toString() !== reviewId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-furniture-cream via-white to-furniture-sand/30">
      <div className="bg-furniture-charcoal text-white py-6">
        <div className="container mx-auto px-4">
          <Link 
            href="/services" 
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
          <h1 className="text-3xl md:text-4xl font-playfair font-bold">{service.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Service Details */}
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src={service.images?.[0] || 'https://placehold.co/800x600/EFE8E2/5A4A3A?text=Service'}
                alt={service.name}
                width={800}
                height={600}
                className="w-full h-96 object-cover"
                priority
              />
               {false && (
                <Badge className="absolute top-4 left-4 bg-furniture-brown text-white">
                  Featured
                </Badge>
              )}
            </div>
            
            <p className="text-furniture-charcoal/80 leading-relaxed text-lg">
              {service.description}
            </p>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                 <span className="font-medium">{reviews?.length ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) : '0.0'}</span>
                 <span className="text-furniture-charcoal/60">({reviews?.length || 0} reviews)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-furniture-brown" />
                <span className="text-furniture-charcoal/80">{service.duration}</span>
              </div>
            </div>

            <Card className="bg-white border-furniture-sand/30">
              <CardHeader>
                <CardTitle className="text-xl font-playfair font-bold text-furniture-charcoal">What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.whatsIncluded?.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-furniture-charcoal/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card className="sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-furniture-charcoal">
                  Book Free Consultation
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-furniture-brown">
                  ₹{service.price}
                  </span>
                  <Badge variant="outline" className="text-furniture-brown border-furniture-brown">{service.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" value={bookingData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={bookingData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" value={bookingData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input id="date" type="date" value={bookingData.preferredDate} onChange={(e) => handleInputChange('preferredDate', e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div>
                      <Label htmlFor="time">Time Slot</Label>
                      <Select value={bookingData.timeSlot} onValueChange={(value) => handleInputChange('timeSlot', value)}>
                        <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9am-12pm">9am-12pm</SelectItem>
                          <SelectItem value="12pm-3pm">12pm-3pm</SelectItem>
                          <SelectItem value="3pm-6pm">3pm-6pm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="projectType">Project Type</Label>
                        <Select value={bookingData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Residential">Residential</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Renovation">Renovation</SelectItem>
                            <SelectItem value="New Construction">New Construction</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select value={bookingData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                          <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Under Rs 10000">Under Rs 10000</SelectItem>
                            <SelectItem value="10000-25000">10000-25000</SelectItem>
                            <SelectItem value="25000-50000">25000-50000</SelectItem>
                            <SelectItem value="50000-100000">50000-100000</SelectItem>
                            <SelectItem value="Over Rs 100000">Over Rs 100000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                   </div>
                  <div>
                    <Label htmlFor="message">Additional Details</Label>
                    <Textarea id="message" value={bookingData.message} onChange={(e) => handleInputChange('message', e.target.value)} rows={4} />
                  </div>
                  <Button type="submit" className="w-full bg-furniture-brown hover:bg-furniture-brown/90 text-white py-3 text-lg" disabled={isProcessing}>
                    {isProcessing ? 'Submitting...' : 'Book Consultation'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-playfair font-bold text-furniture-charcoal mb-8">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reviews Display */}
              <div className="lg:col-span-2">
                <ServiceReviewDisplay 
                  serviceId={service._id?.toString() || ''} 
                  reviews={reviews} 
                  onReviewDeleted={handleReviewDeleted}
                />
              </div>
              
              {/* Review Form */}
              <div>
                {user ? (
                  <ServiceReviewForm 
                    serviceId={service._id?.toString() || ''} 
                    onSubmit={handleReviewSubmit}
                  />
                ) : (
                  <Card className="border-furniture-sand">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-playfair text-furniture-darkBrown mb-4">Sign in to leave a review</h3>
                      <p className="text-furniture-charcoal/80 mb-4">
                        Share your experience with this service to help other customers.
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/sign-in'}
                        className="bg-furniture-brown hover:bg-furniture-darkBrown"
                      >
                        Sign In
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailClient;

"use client";

import { useState, FC } from 'react';
import Image from 'next/image';
import { Star, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

// Define the shape of the data that the parent component's onSubmit function will receive
interface ReviewSubmitData {
  rating: number;
  title: string;
  comment: string;
  images: string[]; // This will be an array of base64 strings
}

interface ServiceReviewFormProps {
  serviceId: string;
  onSubmit: (reviewData: ReviewSubmitData) => void;
}

const ServiceReviewForm: FC<ServiceReviewFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images.",
        variant: "destructive"
      });
      return;
    }

    setImageFiles(prev => [...prev, ...files]);
    
    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreviews(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Helper function to convert a File to a base64 string
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || !title.trim() || !comment.trim()) {
      toast({ title: "Missing information", description: "Please provide a rating, title, and comment.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert all selected image files to base64 strings
      const imageBase64Strings = await Promise.all(imageFiles.map(file => toBase64(file)));
      
      // Call the parent component's submit function with the correct data structure
      onSubmit({
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images: imageBase64Strings, // Pass the array of base64 strings
      });
      
      // Reset form state after successful submission
      setRating(0);
      setTitle('');
      setComment('');
      setImageFiles([]);
      setImagePreviews([]);

      toast({
        title: "Review submitted",
        description: "Thank you for your valuable feedback!",
      });

    } catch (error) {
        console.error("Failed to process images:", error);
        toast({ title: "Image Upload Failed", description: "Could not process images. Please try again.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-furniture-sand">
      <CardHeader>
        <CardTitle className="font-playfair text-furniture-darkBrown">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Overall Rating *</Label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform duration-200 hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors duration-200 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              className="mt-2"
              required
            />
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience with this service..."
              className="mt-2 min-h-[120px]"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Add Photos (Optional)</Label>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="image-upload"
                  className="flex items-center space-x-2 px-4 py-2 border border-furniture-sand rounded-lg cursor-pointer hover:bg-furniture-cream/50 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Add Photos</span>
                </Label>
                <span className="text-xs text-gray-500">Max 5 images</span>
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-furniture-brown hover:bg-furniture-darkBrown"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceReviewForm;

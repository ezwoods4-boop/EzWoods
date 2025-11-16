export interface Service {
  id: string;
  name: string;
  startingPrice: number;
  description: string;
  category: string;
  images: string[];
  duration: string;
  rating: number;
  reviewCount: number;
  features: string[];
  portfolio: string[];
  featured: boolean;
  available: boolean;
}
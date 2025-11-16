import { Service } from '@/types/service';

export const services: Service[] = [
  {
    id: '1',
    name: 'Complete Living Room Makeover',
    startingPrice: 5000,
    description: 'Transform your living space with our comprehensive design service including furniture selection, color coordination, and space optimization.',
    category: 'Interior Design',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&crop=center'
    ],
    duration: '4-6 weeks',
    rating: 4.9,
    reviewCount: 32,
    features: ['3D Design Visualization', 'Furniture Selection', 'Color Consultation', 'Space Planning'],
    portfolio: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&crop=center'
    ],
    featured: true,
    available: true
  },
  {
    id: '2',
    name: 'Kitchen Renovation & Design',
    startingPrice: 8000,
    description: 'Modern kitchen design with functional layouts, premium appliances, and contemporary finishes that maximize both style and efficiency.',
    category: 'Renovation',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center'
    ],
    duration: '6-8 weeks',
    rating: 4.8,
    reviewCount: 28,
    features: ['Cabinet Design', 'Appliance Selection', 'Lighting Design', 'Countertop Selection'],
    portfolio: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center'
    ],
    featured: true,
    available: true
  },
  {
    id: '3',
    name: 'Bedroom Suite Design',
    startingPrice: 3500,
    description: 'Create your perfect sanctuary with custom bedroom design including furniture placement, lighting, and personalized décor elements.',
    category: 'Interior Design',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop&crop=center'
    ],
    duration: '3-4 weeks',
    rating: 4.7,
    reviewCount: 24,
    features: ['Mood Board Creation', 'Furniture Layout', 'Textile Selection', 'Custom Storage Solutions'],
    portfolio: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop&crop=center'
    ],
    featured: false,
    available: true
  },
  {
    id: '4',
    name: 'Bathroom Renovation',
    startingPrice: 6000,
    description: 'Complete bathroom transformation with modern fixtures, elegant tiles, and optimized storage solutions for ultimate comfort and style.',
    category: 'Renovation',
    images: [
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center'
    ],
    duration: '5-7 weeks',
    rating: 4.6,
    reviewCount: 19,
    features: ['Fixture Selection', 'Tile Design', 'Plumbing Layout', 'Ventilation Planning'],
    portfolio: [
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop&crop=center'
    ],
    featured: true,
    available: true
  },
  {
    id: '5',
    name: 'Office Space Design',
    startingPrice: 4000,
    description: 'Professional office design that enhances productivity with ergonomic furniture, efficient layouts, and inspiring work environments.',
    category: 'Interior Design',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center'
    ],
    duration: '3-5 weeks',
    rating: 4.5,
    reviewCount: 16,
    features: ['Ergonomic Planning', 'Technology Integration', 'Storage Solutions', 'Acoustic Design'],
    portfolio: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
    ],
    featured: false,
    available: true
  },
  {
    id: '6',
    name: 'Outdoor Patio Design',
    startingPrice: 3000,
    description: 'Transform your outdoor space into a beautiful entertaining area with weather-resistant furniture and stunning landscape integration.',
    category: 'Outdoor Design',
    images: [
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop&crop=center'
    ],
    duration: '2-4 weeks',
    rating: 4.4,
    reviewCount: 12,
    features: ['Weather-Resistant Materials', 'Landscape Integration', 'Lighting Design', 'Furniture Selection'],
    portfolio: [
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=400&h=300&fit=crop&crop=center'
    ],
    featured: false,
    available: false
  }
];

export const serviceCategories = [
  'All',
  'Interior Design',
  'Renovation',
  'Outdoor Design'
];

export const priceRanges = [
  { label: 'Under ₹3,000', min: 0, max: 3000 },
  { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
  { label: '₹5,000 - ₹8,000', min: 5000, max: 8000 },
  { label: 'Over ₹8,000', min: 8000, max: Infinity }
];
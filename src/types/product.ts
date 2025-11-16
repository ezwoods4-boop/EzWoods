
export interface Product {
  id: string;
  name: string;
  discounted: number;
  original?: number;
  description: string;
  category: string;
  subCategory?: string;
  images: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  materials?: string[];
  colors?: string[];
  featured?: boolean;
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  videos?: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

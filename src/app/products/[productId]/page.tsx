import { notFound } from 'next/navigation';
import ProductClient from '@/components/products/ProductClient';
import type { Metadata } from 'next';
import { IProduct } from '@/models/product';

// This helper function now fetches data from your API endpoint
async function getProductDetails(productId: string): Promise<IProduct | null> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products/${productId}`, {
      cache: 'no-store', // Ensures you always get the latest product data
    });
   

    if (!res.ok) {
      // If the API returns a 404 or other error, return null
      return null;
    }

    const data = await res.json();
    console.log(data)
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    return null; // Return null on any exception
  }
}

// generateMetadata also uses the new API fetching function
export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProductDetails(productId);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | Luxe Home`,
    description: product.description,
  };
}

// This remains a Server Component, but its data source is now the API
export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = await getProductDetails(productId);

  // If the API call fails or returns no product, show the 404 page
  if (!product) {
    notFound();
  }
  
  // The API already returns a plain JSON object, so no need for JSON.parse(JSON.stringify())
  return <ProductClient product={product} productId={productId} />;
}


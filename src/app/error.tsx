'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TriangleAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-16 text-center">
      <div>
        <TriangleAlert className="mx-auto h-16 w-16 text-furniture-brown/50" />
        <h1 className="mt-4 font-playfair text-4xl font-bold text-furniture-darkBrown">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-lg text-furniture-charcoal">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="mt-8 inline-block">
          <Button size="lg" className="bg-furniture-brown hover:bg-furniture-darkBrown">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}

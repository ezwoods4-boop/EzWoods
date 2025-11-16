import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com','res.cloudinary.com','img.clerk.com'],
  },
  async rewrites() {
    return [
      { source: '/product/:id', destination: '/products/:id' },
      { source: '/service/:id', destination: '/services/:id' },
    ];
  },
};

export default nextConfig;

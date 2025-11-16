import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the routes that are publicly accessible and do not require a user to be logged in.
const isPublicRoute = createRouteMatcher([
  '/',             // Homepage
  '/sign-in(.*)',  // Sign-in and related pages
  '/sign-up(.*)',  // Sign-up and related pages
  '/shop(.*)',    // The main shop page
  '/product/(.*)', // All individual product pages
  '/categories(.*)',// The categories page
  '/services(.*)', // All service pages
  '/api/webhooks/user', // The Clerk webhook needs to be public
]);

export default clerkMiddleware((auth, req) => {
  // Protect all routes that are NOT defined as public.
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  // This matcher configuration is crucial. It tells the middleware to run on
  // every page and API route, EXCEPT for static files (like images or CSS)
  // and Next.js internal paths.
  matcher: [
    // Skip Next.js internal paths
    '/((?!.*\\..*|_next).*)', 
    // Match the root
    '/', 
    // Match all API and TRPC routes, which is what fixes your error
    '/(api|trpc)(.*)'
  ],
};


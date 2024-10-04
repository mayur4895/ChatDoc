import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/uploadthing(.*)',
  
]);

// Define root route
const isRootRoute = createRouteMatcher(['/']);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth(); // Get userId from the auth object

  // Check if the request is for the root route
  if (isRootRoute(req)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);  
    }
  }

 
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);  
    }
    
  }

 
  if (!isPublicRoute(req)) {
    auth().protect(); // Protect route using Clerk's authentication
  }
});

// Middleware configuration
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // Match API routes
  ],
};

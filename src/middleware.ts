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

// Middleware
export default clerkMiddleware((auth, req) => {
  const { userId } = auth(); // Get userId from the auth object

  // Redirect unauthenticated users trying to access the /dashboard to the sign-in page
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow access to the root route without authentication
  if (isRootRoute(req)) {
    return NextResponse.next(); // Allow access to the home page
  }

  // Protect all other routes
  if (!isPublicRoute(req)) {
    auth().protect();  
  }
});

// Middleware configuration
export const config = {
  matcher: [
    '/dashboard/(.*)', // Explicitly include dashboard paths
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // Match API routes
  ],
};

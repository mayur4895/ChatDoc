import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Ensure the correct route for uploadthing is public (adjust if needed)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing(.*)'])
const isRootRoute = createRouteMatcher(['/'])

export default clerkMiddleware((auth, req) => {
  const { userId } = auth()

 
  if (isRootRoute(req)) {
   
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      return NextResponse.redirect(signInUrl)
    }
  }

 
  if (!isPublicRoute(req)) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

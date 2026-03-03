import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/remedies',
    '/shop',
    '/courses',
    '/about',
    '/blog',
    '/contact',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks',
    '/api/(.*)'
  ],
  afterAuth: (auth, req) => {
    // Handle authenticated users accessing public routes
    if (auth.userId && new URL(req.url).pathname === '/') {
      // User is signed in and on home page, allow access
      return NextResponse.next()
    }
    
    // Handle unauthenticated users
    if (!auth.userId) {
      const isPublicRoute = [
        '/',
        '/remedies',
        '/shop',
        '/courses',
        '/about',
        '/blog',
        '/contact',
        '/sign-in',
        '/sign-up',
        '/api/webhooks'
      ].some(path => req.nextUrl.pathname.startsWith(path))
      
      if (!isPublicRoute) {
        const signInUrl = new URL('/sign-in', req.url)
        signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname)
        return NextResponse.redirect(signInUrl)
      }
    }
    
    return NextResponse.next()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*)*)']
}

import { withClerkMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export default withClerkMiddleware((req) => {
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
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.*\\..*)*)'],
}

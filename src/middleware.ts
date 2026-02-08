import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const pathname = req.nextUrl.pathname

    // Protect admin routes - require admin role
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(pathname), req.url))
      }
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // Protect dashboard routes - require authentication
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(pathname), req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*'
  ]
}

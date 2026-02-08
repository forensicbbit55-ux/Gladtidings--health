import { NextResponse } from 'next/server';
;import { addSecurityHeaders, rateLimits, logSecurityEvent } from '@/lib/security'
;
;// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map()

export function middleware(request) {
  const response = NextResponse.next()
  
  // Add security headers to all responses
  addSecurityHeaders(response)
  
  // Log security events
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Rate limiting for sensitive endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth') || 
      request.nextUrl.pathname.startsWith('/api/contact') ||
      request.nextUrl.pathname.startsWith('/api/newsletter')) {
    
    const rateLimitResult = checkRateLimit(ip, request.nextUrl.pathname)
    
    if (!rateLimitResult.success) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        ip,
        userAgent,
        path: request.nextUrl.pathname
      })
      
      return new NextResponse(
        JSON.stringify({ error: rateLimitResult.error }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            ...rateLimitResult.headers
          }
        }
      )
    }
    
    // Add rate limit headers to response
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }
  
  // Log suspicious activity
  if (isSuspiciousRequest(request)) {
    logSecurityEvent('SUSPICIOUS_REQUEST', {
      ip,
      userAgent,
      path: request.nextUrl.pathname,
      method: request.method,
      query: Object.fromEntries(request.nextUrl.searchParams)
    })
  }
  
  return response
};

function checkRateLimit(ip, path) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const max = getMaxRequests(path)
  
  const key = `${ip}:${path}`
  let requests = rateLimitStore.get(key) || []
  
  // Remove old requests outside the window
  requests = requests.filter(timestamp => timestamp > now - windowMs)
  
  if (requests.length >= max) {
    return {
      success: false,
      error: 'Too many requests, please try again later.',
      headers: {
        'X-RateLimit-Limit': max.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
      }
    }
  }
  
  // Add current request
  requests.push(now)
  rateLimitStore.set(key, requests)
  
  // Cleanup old entries
  setTimeout(() => {
    const currentRequests = rateLimitStore.get(key) || []
    const validRequests = currentRequests.filter(timestamp => timestamp > now - windowMs)
    if (validRequests.length === 0) {
      rateLimitStore.delete(key)
    } else {
      rateLimitStore.set(key, validRequests)
    }
  }, windowMs)
  
  return {
    success: true,
    headers: {
      'X-RateLimit-Limit': max.toString(),
      'X-RateLimit-Remaining': Math.max(0, max - requests.length).toString(),
      'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
    }
  }
}

function getMaxRequests(path) {
  if (path.startsWith('/api/auth')) return 5
  if (path.startsWith('/api/contact')) return 3
  if (path.startsWith('/api/newsletter')) return 5
  return 100
}

function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  return request.ip || 'unknown'
}

function isSuspiciousRequest(request) {
  const userAgent = request.headers.get('user-agent') || ''
  const referer = request.headers.get('referer') || ''
  const path = request.nextUrl.pathname
  
  // Check for suspicious user agents
  const suspiciousAgents = [
    /bot/i,
    /crawler/i,
    /scanner/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /perl/i,
    /php/i
  ]
  
  if (suspiciousAgents.some(agent => agent.test(userAgent))) {
    return true
  }
  
  // Check for missing referer on POST requests
  if (request.method === 'POST' && !referer && !path.startsWith('/api/')) {
    return true
  }
  
  // Check for suspicious query parameters
  const suspiciousParams = [
    'exec',
    'eval',
    'system',
    'shell',
    'cmd',
    'script',
    'alert',
    'document.cookie',
    '<script',
    'javascript:',
    'vbscript:',
    'onload=',
    'onerror='
  ]
  
  const query = request.nextUrl.searchParams.toString()
  if (suspiciousParams.some(param => query.toLowerCase().includes(param.toLowerCase()))) {
    return true
  }
  
  return false
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

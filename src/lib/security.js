import { NextResponse } from 'next/server';
;import { getServerSession } from 'next-auth/nextjs'
;
;// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map()

// Rate limiting middleware
export function createRateLimit(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => getClientIP(req),
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options

  return async function rateLimit(req) {
    const key = keyGenerator(req)
    const now = Date.now()
    const windowStart = now - windowMs

    // Get existing records for this IP
    let records = rateLimitStore.get(key) || []
    
    // Remove old records outside the window
    records = records.filter(record => record.timestamp > windowStart)
    
    // Check if limit exceeded
    if (records.length >= max) {
      return {
        success: false,
        error: message,
        headers: {
          'X-RateLimit-Limit': max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
        }
      }
    }

    // Add current request
    records.push({
      timestamp: now,
      success: true
    })

    // Update store
    rateLimitStore.set(key, records)

    // Set expiration for cleanup
    setTimeout(() => {
      const currentRecords = rateLimitStore.get(key) || []
      const validRecords = currentRecords.filter(record => record.timestamp > windowStart)
      if (validRecords.length === 0) {
        rateLimitStore.delete(key)
      } else {
        rateLimitStore.set(key, validRecords)
      }
    }, windowMs)

    return {
      success: true,
      headers: {
        'X-RateLimit-Limit': max.toString(),
        'X-RateLimit-Remaining': Math.max(0, max - records.length).toString(),
        'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
      }
    }
  }
};

// CSRF protection
export function generateCSRFToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function validateCSRFToken(token, sessionToken) {
  // In production, store tokens in session or database
  // For now, validate token format
  if (!token || typeof token !== 'string') {
    return false
  }
  
  // Token should be 64 hex characters (32 bytes)
  return /^[a-f0-9]{64}$/i.test(token)
}

// SQL injection prevention
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input
  }
  
  // Remove potentially dangerous characters
  return input
    .replace(/['";\\]/g, '') // Remove quotes, semicolons, backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b/gi, '') // Remove SQL keywords
    .trim()
}

export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
};

export function validateUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export function validatePhoneNumber(phone) {
  // Basic phone validation - adjust based on your requirements
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

// Secure headers middleware
export function addSecurityHeaders(response) {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  )
  
  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }
  
  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()'
    ].join(', ')
  )
  
  return response
}

// Input validation middleware
export function validateInput(data, schema) {
  const errors = []
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]
    
    // Required validation
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`)
      continue
    }
    
    // Skip validation if field is not provided and not required
    if (value === undefined || value === null || value === '') {
      continue
    }
    
    // Type validation
    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be of type ${rules.type}`)
      continue
    }
    
    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters long`)
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field} must not exceed ${rules.maxLength} characters`)
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${field} format is invalid`)
    }
    
    // Custom validation
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value)
      if (customError) {
        errors.push(customError)
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
};

// Authentication middleware
export async function requireAuth(req, options = {}) {
  const { adminOnly = false, allowGuest = false } = options
  
  const session = await getServerSession()
  
  if (!session && !allowGuest) {
    return {
      success: false,
      error: 'Authentication required',
      status: 401
    }
  }
  
  if (adminOnly && session?.user?.role !== 'ADMIN') {
    return {
      success: false,
      error: 'Admin access required',
      status: 403
    }
  }
  
  return {
    success: true,
    user: session?.user
  }
}

// Get client IP address
export function getClientIP(req) {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')
  const clientIP = req.ip
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  return clientIP || 'unknown'
}

// Error handling middleware
export function handleSecurityError(error, context = '') {
  console.error(`Security error in ${context}:`, error)
  
  // Don';t expose sensitive error details to client
  return {
    error: 'An error occurred while processing your request',
    status: 500
  }
}

// Security audit logging
export function logSecurityEvent(event, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: details.ip || 'unknown',
    userAgent: details.userAgent || 'unknown'
  }
  
  )
  
  // In production, send to security monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to security monitoring service
  }
};

// Password strength validation
export function validatePasswordStrength(password) {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const errors = []
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`)
  }
  
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!hasNumbers) {
    errors.push('Password must contain at least one number')
  }
  
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  }
}

function calculatePasswordStrength(password) {
  let strength = 0
  
  // Length contributes to strength
  if (password.length >= 8) strength += 1
  if (password.length >= 12) strength += 1
  
  // Character variety contributes to strength
  if (/[A-Z]/.test(password)) strength += 1
  if (/[a-z]/.test(password)) strength += 1
  if (/\d/.test(password)) strength += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1
  
  // Avoid common patterns
  if (!/(.)\1{2,}/.test(password)) strength += 1 // No repeated characters
  if (!/123|abc|password/i.test(password)) strength += 1 // No common patterns
  
  return Math.min(strength, 5) // Max strength of 5
}

// File upload security
export function validateFileUpload(file, options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
  } = options
  
  const errors = []
  
  if (file.size > maxSize) {
    errors.push(`File size must not exceed ${maxSize / 1024 / 1024}MB`)
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`)
  }
  
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push(`File extension ${fileExtension} is not allowed`)
  }
  
  // Check for malicious file content
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i
  ]
  
  // In a real implementation, you would scan the file content
  // For now, just check the filename
  const filename = file.name.toLowerCase()
  for (const pattern of maliciousPatterns) {
    if (pattern.test(filename)) {
      errors.push('File contains potentially malicious content')
      break
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Rate limiting presets
export const rateLimits = {
  auth: createRateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), // 5 requests per 15 minutes
  api: createRateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), // 100 requests per 15 minutes
  upload: createRateLimit({ windowMs: 60 * 60 * 1000, max: 10 }), // 10 requests per hour
  contact: createRateLimit({ windowMs: 60 * 60 * 1000, max: 3 }), // 3 requests per hour
  newsletter: createRateLimit({ windowMs: 60 * 60 * 1000, max: 5 }) // 5 requests per hour
}

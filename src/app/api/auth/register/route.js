import { NextRequest, NextResponse } from "next/server";
;import { PrismaClient } from "@prisma/client";
;import bcrypt from "bcryptjs";
;import { 
  rateLimits, 
  validateInput, 
  sanitizeInput, 
  validateEmail, 
  validatePasswordStrength,
  logSecurityEvent,
  handleSecurityError,
  getClientIP,
  addSecurityHeaders 
} from "@/lib/security"

;const prisma = new PrismaClient()

export async function POST(request) {
  const response = NextResponse.next()
  
  // Add security headers
  addSecurityHeaders(response)
  
  try {
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Rate limiting
    const rateLimitResult = await rateLimits.auth(request)
    if (!rateLimitResult.success) {
      logSecurityEvent('REGISTER_RATE_LIMIT_EXCEEDED', {
        ip,
        userAgent
      })
      
      return NextResponse.json(
        { error: rateLimitResult.error },
        { 
          status: 429,
          headers: rateLimitResult.headers
        }
      )
    }

    const { name, email, password } = await request.json()

    // Input validation schema
    const validationSchema = {
      name: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z\s'-]+$/
      },
      email: {
        required: true,
        type: 'string',
        validate: validateEmail
      },
      password: {
        required: true,
        type: 'string',
        minLength: 8,
        maxLength: 128,
        validate: validatePasswordStrength
      }
    }

    const validation = validateInput({ name, email, password }, validationSchema)
    if (!validation.isValid) {
      logSecurityEvent('REGISTER_VALIDATION_FAILED', {
        ip,
        userAgent,
        email,
        errors: validation.errors
      })
      
      return NextResponse.json(
        { error: "Invalid input format", details: validation.errors },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name.trim())
    const sanitizedEmail = sanitizeInput(email.trim()).toLowerCase()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    })

    if (existingUser) {
      logSecurityEvent('REGISTER_USER_EXISTS', {
        ip,
        userAgent,
        email: sanitizedEmail,
        userId: existingUser.id
      })
      
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password with proper salt rounds
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user with default role
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword, // Changed from passwordHash to password to match schema
        role: 'USER', // Explicitly set role
        emailVerified: null, // Initialize as null
        image: null // Initialize as null
      }
    })

    // Log successful registration
    logSecurityEvent('REGISTER_SUCCESS', {
      ip,
      userAgent,
      email: sanitizedEmail,
      userId: user.id
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    const successResponse = NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    )
    
    // Add security headers to success response
    addSecurityHeaders(successResponse)
    return successResponse
    
  } catch (error) {
    console.error("Registration error:", error)
    
    const errorResponse = handleSecurityError(error, 'registration')
    return NextResponse.json(
      errorResponse,
      { status: errorResponse.status || 500 }
    )
  }
};

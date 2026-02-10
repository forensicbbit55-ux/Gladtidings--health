import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from 'c:/Users/Administrator/Documents/GLADTIDINGS/gladtiding/lib/prisma';
import bcrypt from 'bcryptjs';
;import { 
  rateLimits, 
  validateInput, 
  sanitizeInput, 
  validateEmail, 
  validatePasswordStrength,
  logSecurityEvent,
  handleSecurityError,
  getClientIP 
} from '@/lib/security'

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        try {
          const ip = getClientIP(req)
          const userAgent = req.headers.get('user-agent') || 'unknown'
          
          // Rate limiting check
          const rateLimitResult = await rateLimits.auth(req)
          if (!rateLimitResult.success) {
            logSecurityEvent('AUTH_RATE_LIMIT_EXCEEDED', {
              ip,
              userAgent,
              email: credentials?.email
            })
            throw new Error('Too many login attempts. Please try again later.')
          }
          
          // Input validation
          const validationSchema = {
            email: {
              required: true,
              type: 'string',
              validate: validateEmail
            },
            password: {
              required: true,
              type: 'string',
              minLength: 8
            }
          }
          
          const validation = validateInput(credentials, validationSchema)
          if (!validation.isValid) {
            logSecurityEvent('AUTH_VALIDATION_FAILED', {
              ip,
              userAgent,
              email: credentials?.email,
              errors: validation.errors
            })
            throw new Error('Invalid input format')
          }
          
          // Sanitize inputs
          const email = sanitizeInput(credentials.email).toLowerCase()
          const password = credentials.password
          
          // Find user
          const user = await prisma.user.findUnique({
            where: { email }
          })
          
          if (!user) {
            logSecurityEvent('AUTH_USER_NOT_FOUND', {
              ip,
              userAgent,
              email
            })
            throw new Error('Invalid credentials')
          }
          
          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (!isPasswordValid) {
            logSecurityEvent('AUTH_INVALID_PASSWORD', {
              ip,
              userAgent,
              email,
              userId: user.id
            })
            throw new Error('Invalid credentials')
          }
          
          // Check if user is active
          if (user.role === 'INACTIVE') {
            logSecurityEvent('AUTH_INACTIVE_USER', {
              ip,
              userAgent,
              email,
              userId: user.id
            })
            throw new Error('Account is inactive')
          }
          
          logSecurityEvent('AUTH_SUCCESS', {
            ip,
            userAgent,
            email,
            userId: user.id
          })
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
          
        } catch (error) {
          console.error('Authentication error:', error)
          throw error
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }

import { NextResponse } from 'next/server';
import { 
  rateLimits, 
  validateInput, 
  sanitizeInput, 
  validateEmail, 
  validateCSRFToken,
  logSecurityEvent,
  handleSecurityError,
  getClientIP,
  addSecurityHeaders 
} from '@/lib/security';
import nodemailer from 'nodemailer';
;// Spam keywords to block
const SPAM_KEYWORDS = [
  'viagra', 'cialis', 'lottery', 'winner', 'congratulations',
  'free money', 'click here', 'limited time', 'act now',
  'guaranteed', 'risk free', 'million dollars', 'weight loss',
  'casino', 'poker', 'blackjack', 'roulette', 'betting',
  'make money fast', 'work from home', 'multi-level marketing',
  'pyramid scheme', 'scam', 'fraud', 'illegal', 'drugs',
  'pharmacy', 'medication', 'prescription', 'overnight',
  'miracle', 'breakthrough', 'secret', 'exclusive', 'urgent',
  'act immediately', 'limited offer', 'special promotion'
]

// Check if message contains spam keywords
function containsSpamKeywords(message) {
  const lowerMessage = message.toLowerCase()
  return SPAM_KEYWORDS.some(keyword => lowerMessage.includes(keyword))
};

// Create Nodemailer transporter
function createTransporter() {
  try {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  } catch (error) {
    console.error('Failed to create email transporter:', error)
    return null
  }
}

// Send email notification
async function sendContactEmail(contactData) {
  const transporter = createTransporter()
  
  if (!transporter) {
    console.error('Email transporter not available - skipping email notification')
    return false
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || `"Glad Tidings" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #666;">From:</strong> ${contactData.name} &lt;${contactData.email}&gt;
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #666;">Subject:</strong> ${contactData.subject}
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #666;">Message:</strong>
                <div style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 5px; white-space: pre-wrap;">
                  ${contactData.message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #666;">Submitted:</strong> ${new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export async function POST(request) {
  const response = NextResponse.next()
  
  // Add security headers
  addSecurityHeaders(response)
  
  try {
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Rate limiting
    const rateLimitResult = await rateLimits.contact(request)
    if (!rateLimitResult.success) {
      logSecurityEvent('CONTACT_RATE_LIMIT_EXCEEDED', {
        ip,
        userAgent
      })
      
      return NextResponse.json({
        success: false,
        error: rateLimitResult.error,
        message: `Rate limit exceeded. Please try again later.`,
        type: 'rate_limit'
      }, { 
        status: 429,
        headers: rateLimitResult.headers
      })
    }

    const body = await request.json()
    const { name, email, subject, message, honeypot, csrf_token } = body

    // CSRF token validation
    if (!csrf_token || !validateCSRFToken(csrf_token)) {
      logSecurityEvent('CONTACT_CSRUF_INVALID', {
        ip,
        userAgent,
        email
      })
      
      return NextResponse.json({
        success: false,
        error: 'Invalid security token',
        type: 'csrf'
      }, { status: 400 })
    }

    // Check honeypot field (should be empty/absent)
    if (honeypot) {
      logSecurityEvent('CONTACT_HONEYPOT_TRIGGERED', {
        ip,
        userAgent,
        email,
        honeypot
      })
      
      return NextResponse.json({
        success: false,
        error: 'Invalid submission detected',
        type: 'honeypot'
      }, { status: 400 })
    }

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
      subject: {
        required: true,
        type: 'string',
        minLength: 3,
        maxLength: 200
      },
      message: {
        required: true,
        type: 'string',
        minLength: 10,
        maxLength: 2000
      }
    }

    const validation = validateInput({ name, email, subject, message }, validationSchema)
    if (!validation.isValid) {
      logSecurityEvent('CONTACT_VALIDATION_FAILED', {
        ip,
        userAgent,
        email,
        errors: validation.errors
      })
      
      return NextResponse.json({
        success: false,
        error: 'Invalid input format',
        details: validation.errors,
        type: 'validation'
      }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name.trim())
    const sanitizedEmail = sanitizeInput(email.trim()).toLowerCase()
    const sanitizedSubject = sanitizeInput(subject.trim())
    const sanitizedMessage = sanitizeInput(message.trim())

    // Check for spam keywords
    if (containsSpamKeywords(sanitizedMessage)) {
      logSecurityEvent('CONTACT_SPAM_DETECTED', {
        ip,
        userAgent,
        email: sanitizedEmail,
        message: sanitizedMessage
      })
      
      return NextResponse.json({
        success: false,
        error: 'Message contains content that appears to be spam',
        type: 'spam_filter'
      }, { status: 400 })
    }

    // Store in database (using mock storage for now)
    const contactData = {
      id: Date.now().toString(),
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      status: 'new',
      ip,
      userAgent,
      createdAt: new Date().toISOString()
    }

    // Try to send email notification
    const emailSent = await sendContactEmail(contactData)

    // Log successful submission
    logSecurityEvent('CONTACT_SUCCESS', {
      ip,
      userAgent,
      email: sanitizedEmail,
      emailSent
    })

    const successResponse = NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We will respond as soon as possible.',
      contact: {
        id: contactData.id,
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        status: contactData.status,
        created_at: contactData.createdAt
      },
      emailSent
    })
    
    // Add security headers to success response
    addSecurityHeaders(successResponse)
    return successResponse

  } catch (error) {
    console.error('Contact form submission error:', error)
    
    const errorResponse = handleSecurityError(error, 'contact')
    return NextResponse.json(
      errorResponse,
      { status: errorResponse.status || 500 }
    )
  }
};

export async function GET() {
  try {
    // Check SMTP configuration
    const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
    
    return NextResponse.json({
      success: true,
      smtp_configured: smtpConfigured,
      message: 'Contact system is ready with enhanced security',
      smtp_status: smtpConfigured 
        ? 'SMTP is configured - email notifications will be sent'
        : 'SMTP is not configured - emails will not be sent',
      protection: {
        rate_limit: '3 requests per hour per IP',
        csrf_protection: 'CSRF token validation',
        input_validation: 'Comprehensive input validation',
        spam_filter: 'Keyword-based spam detection',
        honeypot: 'Hidden field spam detection',
        security_headers: 'Secure headers applied'
      }
    })

  } catch (error) {
    console.error('Contact API health check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check contact API status'
    }, { status: 500 })
  }
}

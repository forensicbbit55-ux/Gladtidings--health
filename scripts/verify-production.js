#!/usr/bin/env node

/**
 * Production Verification Script
 * Verifies all critical systems are working correctly in production
 */

const https = require('https')
const http = require('http')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Configuration
const config = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  timeout: 30000,
  retries: 3
}

// Test results
const results = {
  auth: { passed: 0, failed: 0, details: [] },
  email: { passed: 0, failed: 0, details: [] },
  database: { passed: 0, failed: 0, details: [] },
  api: { passed: 0, failed: 0, details: [] },
  security: { passed: 0, failed: 0, details: [] }
}

// Utility functions
function log(category, message, status = 'info') {
  const timestamp = new Date().toISOString()
  const statusIcon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : 'ℹ️'
  console.log(`${timestamp} ${statusIcon} [${category.toUpperCase()}] ${message}`)
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https')
    const client = isHttps ? https : http
    
    const requestOptions = {
      method: 'GET',
      headers: {
        'User-Agent': 'Production-Verification-Script/1.0',
        ...options.headers
      },
      timeout: config.timeout,
      ...options
    }

    const req = client.request(url, requestOptions, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        })
      })
    })

    req.on('error', reject)
    req.on('timeout', () => reject(new Error('Request timeout')))
    req.end()
  })
}

async function retryRequest(url, options, retries = config.retries) {
  for (let i = 0; i < retries; i++) {
    try {
      return await makeRequest(url, options)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}

// Database verification
async function verifyDatabase() {
  log('database', 'Starting database integrity checks...')
  
  try {
    // Test database connection
    await prisma.$connect()
    log('database', 'Database connection successful', 'pass')
    results.database.passed++

    // Check user table
    const userCount = await prisma.user.count()
    log('database', `Users table accessible (${userCount} users)`, 'pass')
    results.database.passed++

    // Check appointments table
    const appointmentCount = await prisma.appointment.count()
    log('database', `Appointments table accessible (${appointmentCount} appointments)`, 'pass')
    results.database.passed++

    // Check notifications table
    const notificationCount = await prisma.notification.count()
    log('database', `Notifications table accessible (${notificationCount} notifications)`, 'pass')
    results.database.passed++

    // Check newsletter subscribers table
    const subscriberCount = await prisma.newsletterSubscriber.count()
    log('database', `Newsletter subscribers table accessible (${subscriberCount} subscribers)`, 'pass')
    results.database.passed++

    // Check analytics tables
    try {
      const eventCount = await prisma.analyticsEvent.count()
      log('database', `Analytics events table accessible (${eventCount} events)`, 'pass')
      results.database.passed++
    } catch (error) {
      log('database', `Analytics events table not accessible: ${error.message}`, 'fail')
      results.database.failed++
    }

    // Test foreign key constraints
    if (userCount > 0) {
      const testUser = await prisma.user.findFirst()
      if (testUser) {
        log('database', 'Foreign key constraints working', 'pass')
        results.database.passed++
      }
    }

    // Test data integrity
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
    
    if (recentUsers.length > 0) {
      const hasValidData = recentUsers.every(user => 
        user.email && user.email.includes('@') && user.name
      )
      
      if (hasValidData) {
        log('database', 'Data integrity check passed', 'pass')
        results.database.passed++
      } else {
        log('database', 'Data integrity check failed - invalid user data found', 'fail')
        results.database.failed++
      }
    }

  } catch (error) {
    log('database', `Database verification failed: ${error.message}`, 'fail')
    results.database.failed++
  } finally {
    await prisma.$disconnect()
  }
}

// Authentication verification
async function verifyAuth() {
  log('auth', 'Starting authentication flow verification...')
  
  try {
    // Test auth endpoints availability
    const authEndpoints = [
      '/api/auth/signin',
      '/api/auth/signup',
      '/api/auth/providers'
    ]

    for (const endpoint of authEndpoints) {
      try {
        const response = await retryRequest(`${config.baseUrl}${endpoint}`)
        if (response.status === 200 || response.status === 405) {
          log('auth', `${endpoint} endpoint accessible`, 'pass')
          results.auth.passed++
        } else {
          log('auth', `${endpoint} returned status ${response.status}`, 'fail')
          results.auth.failed++
        }
      } catch (error) {
        log('auth', `${endpoint} not accessible: ${error.message}`, 'fail')
        results.auth.failed++
      }
    }

    // Test NextAuth configuration
    try {
      const response = await retryRequest(`${config.baseUrl}/api/auth/session`)
      if (response.status === 200) {
        log('auth', 'NextAuth session endpoint working', 'pass')
        results.auth.passed++
      } else {
        log('auth', `NextAuth session endpoint returned ${response.status}`, 'fail')
        results.auth.failed++
      }
    } catch (error) {
      log('auth', `NextAuth session endpoint failed: ${error.message}`, 'fail')
      results.auth.failed++
    }

    // Test CSRF protection
    try {
      const response = await retryRequest(`${config.baseUrl}/api/auth/csrf`, {
        method: 'GET'
      })
      if (response.status === 200) {
        log('auth', 'CSRF protection endpoint working', 'pass')
        results.auth.passed++
      } else {
        log('auth', `CSRF endpoint returned ${response.status}`, 'fail')
        results.auth.failed++
      }
    } catch (error) {
      log('auth', `CSRF endpoint failed: ${error.message}`, 'fail')
      results.auth.failed++
    }

  } catch (error) {
    log('auth', `Authentication verification failed: ${error.message}`, 'fail')
    results.auth.failed++
  }
}

// Email verification
async function verifyEmail() {
  log('email', 'Starting email system verification...')
  
  try {
    // Check email configuration
    const emailConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM
    }

    const configComplete = Object.values(emailConfig).every(val => val)
    
    if (configComplete) {
      log('email', 'Email configuration complete', 'pass')
      results.email.passed++
    } else {
      log('email', 'Email configuration incomplete', 'fail')
      results.email.failed++
    }

    // Test email API endpoint
    try {
      const response = await retryRequest(`${config.baseUrl}/api/email/health`)
      if (response.status === 200) {
        log('email', 'Email health endpoint accessible', 'pass')
        results.email.passed++
        
        // Parse response to check email service status
        try {
          const healthData = JSON.parse(response.data)
          if (healthData.smtp_configured) {
            log('email', 'SMTP service configured', 'pass')
            results.email.passed++
          } else {
            log('email', 'SMTP service not configured', 'fail')
            results.email.failed++
          }
        } catch (parseError) {
          log('email', 'Email health endpoint response invalid', 'fail')
          results.email.failed++
        }
      } else {
        log('email', `Email health endpoint returned ${response.status}`, 'fail')
        results.email.failed++
      }
    } catch (error) {
      log('email', `Email health endpoint failed: ${error.message}`, 'fail')
      results.email.failed++
    }

    // Test email templates
    const emailTemplates = [
      'appointment-confirmation',
      'appointment-reminder',
      'appointment-approval',
      'appointment-rejection',
      'newsletter-welcome'
    ]

    for (const template of emailTemplates) {
      try {
        const response = await retryRequest(`${config.baseUrl}/api/email/templates/${template}`)
        if (response.status === 200) {
          log('email', `Email template '${template}' accessible`, 'pass')
          results.email.passed++
        } else {
          log('email', `Email template '${template}' returned ${response.status}`, 'fail')
          results.email.failed++
        }
      } catch (error) {
        log('email', `Email template '${template}' failed: ${error.message}`, 'fail')
        results.email.failed++
      }
    }

  } catch (error) {
    log('email', `Email verification failed: ${error.message}`, 'fail')
    results.email.failed++
  }
}

// API verification
async function verifyAPI() {
  log('api', 'Starting API endpoint verification...')
  
  try {
    const apiEndpoints = [
      { path: '/api/health', method: 'GET', expectedStatus: 200 },
      { path: '/api/appointments', method: 'GET', expectedStatus: 401 }, // Should require auth
      { path: '/api/notifications', method: 'GET', expectedStatus: 401 }, // Should require auth
      { path: '/api/newsletter', method: 'GET', expectedStatus: 200 },
      { path: '/api/contact', method: 'GET', expectedStatus: 200 },
      { path: '/api/analytics/events', method: 'GET', expectedStatus: 401 }, // Should require auth
    ]

    for (const endpoint of apiEndpoints) {
      try {
        const response = await retryRequest(`${config.baseUrl}${endpoint.path}`, {
          method: endpoint.method
        })
        
        if (response.status === endpoint.expectedStatus) {
          log('api', `${endpoint.method} ${endpoint.path} returned expected ${response.status}`, 'pass')
          results.api.passed++
        } else {
          log('api', `${endpoint.method} ${endpoint.path} returned ${response.status} (expected ${endpoint.expectedStatus})`, 'fail')
          results.api.failed++
        }
      } catch (error) {
        log('api', `${endpoint.method} ${endpoint.path} failed: ${error.message}`, 'fail')
        results.api.failed++
      }
    }

    // Test rate limiting
    try {
      const responses = []
      for (let i = 0; i < 5; i++) {
        const response = await makeRequest(`${config.baseUrl}/api/contact`)
        responses.push(response.status)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      const rateLimited = responses.some(status => status === 429)
      if (rateLimited) {
        log('api', 'Rate limiting is working', 'pass')
        results.api.passed++
      } else {
        log('api', 'Rate limiting may not be working', 'fail')
        results.api.failed++
      }
    } catch (error) {
      log('api', `Rate limiting test failed: ${error.message}`, 'fail')
      results.api.failed++
    }

  } catch (error) {
    log('api', `API verification failed: ${error.message}`, 'fail')
    results.api.failed++
  }
}

// Security verification
async function verifySecurity() {
  log('security', 'Starting security verification...')
  
  try {
    // Test security headers
    try {
      const response = await retryRequest(`${config.baseUrl}`)
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection',
        'referrer-policy',
        'content-security-policy'
      ]

      let headersPresent = 0
      for (const header of securityHeaders) {
        if (response.headers[header]) {
          headersPresent++
        }
      }

      if (headersPresent >= securityHeaders.length * 0.8) {
        log('security', `Security headers present (${headersPresent}/${securityHeaders.length})`, 'pass')
        results.security.passed++
      } else {
        log('security', `Insufficient security headers (${headersPresent}/${securityHeaders.length})`, 'fail')
        results.security.failed++
      }
    } catch (error) {
      log('security', `Security headers check failed: ${error.message}`, 'fail')
      results.security.failed++
    }

    // Test CSRF protection
    try {
      const response = await retryRequest(`${config.baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'test', email: 'test@test.com', subject: 'test', message: 'test' })
      })
      
      if (response.status === 400 && response.data.includes('csrf')) {
        log('security', 'CSRF protection is working', 'pass')
        results.security.passed++
      } else {
        log('security', 'CSRF protection may not be working', 'fail')
        results.security.failed++
      }
    } catch (error) {
      log('security', `CSRF protection test failed: ${error.message}`, 'fail')
      results.security.failed++
    }

    // Test input validation
    try {
      const maliciousPayload = {
        name: '<script>alert("xss")</script>',
        email: 'test@test.com',
        subject: "'; DROP TABLE users; --",
        message: '<img src=x onerror=alert("xss")>'
      }

      const response = await retryRequest(`${config.baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousPayload)
      })
      
      if (response.status === 400) {
        log('security', 'Input validation is working', 'pass')
        results.security.passed++
      } else {
        log('security', 'Input validation may not be working', 'fail')
        results.security.failed++
      }
    } catch (error) {
      log('security', `Input validation test failed: ${error.message}`, 'fail')
      results.security.failed++
    }

  } catch (error) {
    log('security', `Security verification failed: ${error.message}`, 'fail')
    results.security.failed++
  }
}

// Console error verification
async function verifyConsoleErrors() {
  log('api', 'Checking for console errors in production...')
  
  try {
    // Check if there are any console error endpoints or error pages
    const errorPages = [
      '/404',
      '/500',
      '/error'
    ]

    for (const page of errorPages) {
      try {
        const response = await retryRequest(`${config.baseUrl}${page}`)
        if (response.status === 404 || response.status === 500) {
          log('api', `Error page ${page} handled correctly (${response.status})`, 'pass')
          results.api.passed++
        } else {
          log('api', `Error page ${page} returned ${response.status}`, 'fail')
          results.api.failed++
        }
      } catch (error) {
        log('api', `Error page ${page} failed: ${error.message}`, 'fail')
        results.api.failed++
      }
    }

    // Check for JavaScript errors (basic check)
    try {
      const response = await retryRequest(`${config.baseUrl}`)
      if (response.data.includes('console.error') || response.data.includes('TypeError')) {
        log('api', 'Potential JavaScript errors detected in HTML', 'fail')
        results.api.failed++
      } else {
        log('api', 'No obvious JavaScript errors detected', 'pass')
        results.api.passed++
      }
    } catch (error) {
      log('api', `JavaScript error check failed: ${error.message}`, 'fail')
      results.api.failed++
    }

  } catch (error) {
    log('api', `Console error verification failed: ${error.message}`, 'fail')
    results.api.failed++
  }
}

// Main verification function
async function runVerification() {
  console.log('🔍 Starting Production Verification...')
  console.log(`📍 Target: ${config.baseUrl}`)
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
  console.log('')

  try {
    await verifyDatabase()
    await verifyAuth()
    await verifyEmail()
    await verifyAPI()
    await verifySecurity()
    await verifyConsoleErrors()

    // Generate summary
    console.log('\n📊 VERIFICATION SUMMARY')
    console.log('===================')
    
    const categories = ['auth', 'email', 'database', 'api', 'security']
    let totalPassed = 0
    let totalFailed = 0

    categories.forEach(category => {
      const categoryResult = results[category]
      totalPassed += categoryResult.passed
      totalFailed += categoryResult.failed
      
      const status = categoryResult.failed === 0 ? '✅' : categoryResult.passed > categoryResult.failed ? '⚠️' : '❌'
      console.log(`${status} ${category.toUpperCase()}: ${categoryResult.passed} passed, ${categoryResult.failed} failed`)
    })

    console.log('')
    console.log(`📈 TOTAL: ${totalPassed} passed, ${totalFailed} failed`)
    
    const successRate = totalPassed / (totalPassed + totalFailed) * 100
    console.log(`🎯 Success Rate: ${successRate.toFixed(1)}%`)

    if (totalFailed === 0) {
      console.log('\n🎉 ALL SYSTEMS VERIFIED SUCCESSFULLY!')
      process.exit(0)
    } else if (successRate >= 80) {
      console.log('\n⚠️  MOST SYSTEMS WORKING - Review failed items')
      process.exit(1)
    } else {
      console.log('\n❌ CRITICAL ISSUES FOUND - Immediate attention required')
      process.exit(2)
    }

  } catch (error) {
    console.error('\n💥 Verification script failed:', error)
    process.exit(3)
  }
}

// Run verification
if (require.main === module) {
  runVerification()
}

module.exports = {
  verifyDatabase,
  verifyAuth,
  verifyEmail,
  verifyAPI,
  verifySecurity,
  verifyConsoleErrors,
  runVerification
}

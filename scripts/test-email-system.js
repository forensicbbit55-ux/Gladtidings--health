#!/usr/bin/env node

/**
 * Email System Testing Script
 * Tests email sending functionality in production
 */

const nodemailer = require('nodemailer')

// Configuration
const config = {
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },
  testEmail: process.env.TEST_EMAIL || 'test@example.com',
  fromEmail: process.env.SMTP_FROM || process.env.SMTP_USER
}

// Test results
const results = {
  connection: { success: false, error: null },
  authentication: { success: false, error: null },
  sending: { success: false, error: null },
  templates: { success: false, error: null }
}

// Utility functions
function log(message, status = 'info') {
  const timestamp = new Date().toISOString()
  const statusIcon = status === 'success' ? '✅' : status === 'error' ? '❌' : 'ℹ️'
  console.log(`${timestamp} ${statusIcon} ${message}`)
}

// Test SMTP connection
async function testConnection() {
  log('Testing SMTP connection...')
  
  try {
    const transporter = nodemailer.createTransporter(config.smtp)
    
    // Verify connection
    await transporter.verify()
    
    log('SMTP connection successful', 'success')
    results.connection.success = true
    
  } catch (error) {
    log(`SMTP connection failed: ${error.message}`, 'error')
    results.connection.error = error.message
  }
}

// Test SMTP authentication
async function testAuthentication() {
  log('Testing SMTP authentication...')
  
  try {
    const transporter = nodemailer.createTransporter(config.smtp)
    
    // Test authentication by trying to verify
    await transporter.verify()
    
    log('SMTP authentication successful', 'success')
    results.authentication.success = true
    
  } catch (error) {
    log(`SMTP authentication failed: ${error.message}`, 'error')
    results.authentication.error = error.message
  }
}

// Test email sending
async function testEmailSending() {
  log('Testing email sending...')
  
  try {
    const transporter = nodemailer.createTransporter(config.smtp)
    
    const mailOptions = {
      from: config.fromEmail,
      to: config.testEmail,
      subject: '🧪 Glad Tidings - Email System Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🧪 Email System Test</h1>
            <p style="margin: 10px 0 0 0;">Glad Tidings Production Verification</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">Test Results</h2>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
              <p style="margin: 0;"><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 10px 0 0 0;"><strong>SMTP Server:</strong> ${config.smtp.host}:${config.smtp.port}</p>
              <p style="margin: 10px 0 0 0;"><strong>From:</strong> ${config.fromEmail}</p>
              <p style="margin: 10px 0 0 0;"><strong>To:</strong> ${config.testEmail}</p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; border-left: 4px solid #10b981;">
              <p style="margin: 0; color: #065f46;">
                <strong>✅ Email system is working correctly!</strong><br>
                This test email confirms that the Glad Tidings email system is functioning properly in production.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p style="margin: 0;">This is an automated test email from Glad Tidings</p>
          </div>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    
    log(`Email sent successfully! Message ID: ${info.messageId}`, 'success')
    results.sending.success = true
    results.sending.messageId = info.messageId
    
  } catch (error) {
    log(`Email sending failed: ${error.message}`, 'error')
    results.sending.error = error.message
  }
}

// Test email templates
async function testEmailTemplates() {
  log('Testing email templates...')
  
  try {
    const transporter = nodemailer.createTransporter(config.smtp)
    
    const templates = [
      {
        name: 'Appointment Confirmation',
        subject: '📅 Appointment Confirmation Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>📅 Appointment Confirmation Test</h2>
            <p>This is a test of the appointment confirmation template.</p>
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Service:</strong> Test Consultation</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Time:</strong> 10:00 AM</p>
            </div>
          </div>
        `
      },
      {
        name: 'Newsletter Welcome',
        subject: '🎉 Welcome to Glad Tidings Newsletter',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>🎉 Welcome to Our Newsletter!</h2>
            <p>Thank you for subscribing to the Glad Tidings newsletter.</p>
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p>You'll receive updates about:</p>
              <ul>
                <li>Natural health tips</li>
                <li>Wellness workshops</li>
                <li>Special offers</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        name: 'Password Reset',
        subject: '🔐 Password Reset Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>🔐 Password Reset Test</h2>
            <p>This is a test of the password reset template.</p>
            <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Reset Code:</strong> 123456</p>
              <p><strong>Expires:</strong> 1 hour</p>
            </div>
          </div>
        `
      }
    ]

    const sentEmails = []
    
    for (const template of templates) {
      const mailOptions = {
        from: config.fromEmail,
        to: config.testEmail,
        subject: template.subject,
        html: template.html
      }

      try {
        const info = await transporter.sendMail(mailOptions)
        sentEmails.push({
          template: template.name,
          success: true,
          messageId: info.messageId
        })
        log(`Template '${template.name}' sent successfully`, 'success')
      } catch (error) {
        sentEmails.push({
          template: template.name,
          success: false,
          error: error.message
        })
        log(`Template '${template.name}' failed: ${error.message}`, 'error')
      }
    }

    const successCount = sentEmails.filter(e => e.success).length
    log(`Email templates: ${successCount}/${templates.length} sent successfully`, 
        successCount === templates.length ? 'success' : 'error')
    
    results.templates.success = successCount === templates.length
    results.templates.details = sentEmails
    
  } catch (error) {
    log(`Email template testing failed: ${error.message}`, 'error')
    results.templates.error = error.message
  }
}

// Test email configuration
function testConfiguration() {
  log('Checking email configuration...')
  
  const requiredConfig = [
    'SMTP_HOST',
    'SMTP_USER', 
    'SMTP_PASS',
    'NEXT_PUBLIC_APP_URL'
  ]
  
  const missingConfig = requiredConfig.filter(key => !process.env[key])
  
  if (missingConfig.length === 0) {
    log('All required environment variables are set', 'success')
  } else {
    log(`Missing environment variables: ${missingConfig.join(', ')}`, 'error')
  }
  
  // Log configuration (without sensitive data)
  log(`SMTP Host: ${config.smtp.host}`)
  log(`SMTP Port: ${config.smtp.port}`)
  log(`SMTP Secure: ${config.smtp.secure}`)
  log(`From Email: ${config.fromEmail}`)
  log(`Test Email: ${config.testEmail}`)
}

// Test email delivery time
async function testEmailDeliveryTime() {
  log('Testing email delivery time...')
  
  try {
    const transporter = nodemailer.createTransporter(config.smtp)
    
    const startTime = Date.now()
    
    const mailOptions = {
      from: config.fromEmail,
      to: config.testEmail,
      subject: '⏱️ Email Delivery Time Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>⏱️ Email Delivery Time Test</h2>
          <p>This email was sent at: ${new Date().toISOString()}</p>
          <p>Check the received time to calculate delivery delay.</p>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    const endTime = Date.now()
    const deliveryTime = endTime - startTime
    
    log(`Email sent in ${deliveryTime}ms`, 'success')
    
    if (deliveryTime < 5000) {
      log('Email delivery time is excellent (< 5s)', 'success')
    } else if (deliveryTime < 10000) {
      log('Email delivery time is good (< 10s)', 'success')
    } else {
      log('Email delivery time is slow (> 10s)', 'error')
    }
    
  } catch (error) {
    log(`Email delivery time test failed: ${error.message}`, 'error')
  }
}

// Main test function
async function runEmailTests() {
  console.log('📧 Starting Email System Tests...')
  console.log(`📧 SMTP Server: ${config.smtp.host}:${config.smtp.port}`)
  console.log(`📧 Test Email: ${config.testEmail}`)
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
  console.log('')

  try {
    testConfiguration()
    console.log('')
    
    await testConnection()
    console.log('')
    
    await testAuthentication()
    console.log('')
    
    await testEmailSending()
    console.log('')
    
    await testEmailTemplates()
    console.log('')
    
    await testEmailDeliveryTime()
    console.log('')

    // Generate summary
    console.log('📊 EMAIL SYSTEM TEST SUMMARY')
    console.log('============================')
    
    const tests = [
      { name: 'Connection', result: results.connection },
      { name: 'Authentication', result: results.authentication },
      { name: 'Sending', result: results.sending },
      { name: 'Templates', result: results.templates }
    ]
    
    let passedTests = 0
    let totalTests = tests.length

    tests.forEach(test => {
      if (test.result.success) {
        console.log(`✅ ${test.name}: PASSED`)
        passedTests++
      } else {
        console.log(`❌ ${test.name}: FAILED`)
        if (test.result.error) {
          console.log(`   Error: ${test.result.error}`)
        }
      }
    })

    console.log('')
    console.log(`📈 Results: ${passedTests}/${totalTests} tests passed`)
    
    const successRate = (passedTests / totalTests) * 100
    console.log(`🎯 Success Rate: ${successRate.toFixed(1)}%`)

    if (passedTests === totalTests) {
      console.log('\n🎉 EMAIL SYSTEM IS WORKING PERFECTLY!')
      console.log('📧 All email functionality has been verified successfully.')
    } else if (successRate >= 75) {
      console.log('\n⚠️  EMAIL SYSTEM MOSTLY WORKING')
      console.log('📧 Some email functionality may need attention.')
    } else {
      console.log('\n❌ EMAIL SYSTEM HAS ISSUES')
      console.log('📧 Email functionality needs immediate attention.')
    }

    console.log('\n📋 Next Steps:')
    console.log('1. Check your email inbox for test messages')
    console.log('2. Verify email templates render correctly')
    console.log('3. Test email delivery in production environment')
    console.log('4. Monitor email bounce rates and delivery issues')

  } catch (error) {
    console.error('\n💥 Email testing failed:', error)
  }
}

// Run tests
if (require.main === module) {
  runEmailTests()
}

module.exports = {
  testConnection,
  testAuthentication,
  testEmailSending,
  testEmailTemplates,
  testEmailDeliveryTime,
  runEmailTests
}

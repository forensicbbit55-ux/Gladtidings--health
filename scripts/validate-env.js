// Startup environment validation
// This script runs during server startup to ensure all required environment variables are present

const requiredEnvVars = {
  DATABASE_URL: 'Neon PostgreSQL database connection string'
}

const optionalEnvVars = {
  NEXT_PUBLIC_BASE_URL: 'Base URL for client-side API calls',
  NEXT_PUBLIC_API_URL: 'API URL for external services',
  SMTP_HOST: 'SMTP server hostname',
  SMTP_PORT: 'SMTP server port',
  SMTP_USER: 'SMTP username for email sending',
  SMTP_PASS: 'SMTP password for email sending',
  SMTP_FROM: 'From email address for outgoing emails'
}

function validateEnvironment() {
  const errors = []
  const warnings = []

  console.log('🔍 Validating environment variables...\n')

  // Check required environment variables
  Object.entries(requiredEnvVars).forEach(([key, description]) => {
    const value = process.env[key]
    if (!value) {
      errors.push(`❌ Missing required environment variable: ${key}`)
      errors.push(`   Description: ${description}`)
    } else {
      console.log(`✅ ${key}: Present`)
      
      // Validate DATABASE_URL format
      if (key === 'DATABASE_URL') {
        if (!value.startsWith('postgresql://')) {
          errors.push(`❌ Invalid DATABASE_URL format. Must start with 'postgresql://'`)
        } else {
          console.log(`✅ DATABASE_URL: Valid format`)
        }
        
        if (!value.includes('sslmode=require')) {
          warnings.push(`⚠️  DATABASE_URL should include 'sslmode=require' for secure connections`)
        } else {
          console.log(`✅ DATABASE_URL: SSL enabled`)
        }
      }
    }
  })

  // Check optional environment variables
  Object.entries(optionalEnvVars).forEach(([key, description]) => {
    const value = process.env[key]
    if (value) {
      console.log(`✅ ${key}: Present (${value})`)
    } else {
      console.log(`⚪ ${key}: Not set (optional)`)
    }
  })

  // Check for dangerous client exposures
  console.log('\n🔒 Checking for client-side exposures...')
  Object.keys(requiredEnvVars).forEach(key => {
    if (process.env[`NEXT_PUBLIC_${key}`]) {
      errors.push(`❌ DANGEROUS: Server secret '${key}' is exposed to client as 'NEXT_PUBLIC_${key}'`)
      errors.push(`   This could expose sensitive data to the browser!`)
    } else {
      console.log(`✅ No client-side exposure of ${key}`)
    }
  })

  // Check environment-specific security
  if (process.env.NODE_ENV === 'production') {
    console.log('\n🏭 Production security checks...')
    if (!process.env.DATABASE_URL?.includes('sslmode=require')) {
      errors.push(`❌ Production DATABASE_URL must use SSL (sslmode=require)`)
    } else {
      console.log(`✅ Production: SSL required for database`)
    }
    
    // Check SMTP configuration for production
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      warnings.push(`⚠️  Production: SMTP not configured - contact form emails will not be sent`)
    } else {
      console.log(`✅ Production: SMTP configured for email notifications`)
    }
  }

  // Report results
  console.log('\n' + '='.repeat(50))
  
  if (errors.length > 0) {
    console.log('❌ ENVIRONMENT VALIDATION FAILED')
    console.log('\nErrors:')
    errors.forEach(error => console.log(`  ${error}`))
    
    if (warnings.length > 0) {
      console.log('\nWarnings:')
      warnings.forEach(warning => console.log(`  ${warning}`))
    }
    
    console.log('\n💡 Please fix the errors above before starting the server.')
    process.exit(1)
  } else {
    console.log('✅ ENVIRONMENT VALIDATION PASSED')
    
    if (warnings.length > 0) {
      console.log('\nWarnings:')
      warnings.forEach(warning => console.log(`  ${warning}`))
    }
    
    console.log('\n🚀 Environment is ready for startup!')
  }
}

// Run validation if this file is executed directly
if (require.main === module) {
  validateEnvironment()
}

module.exports = { validateEnvironment }

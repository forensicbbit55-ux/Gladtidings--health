import { NextResponse } from 'next/server'
;
;// Environment variable validation
const requiredEnvVars = {
  // Server-side only (never exposed to client)
  DATABASE_URL: {
    required: true,
    description: 'Neon PostgreSQL database connection string',
    exposeToClient: false
  }
}

const optionalEnvVars = {
  // Client-safe variables (NEXT_PUBLIC_ prefix)
  NEXT_PUBLIC_BASE_URL: {
    required: false,
    description: 'Base URL for client-side API calls',
    exposeToClient: true,
    defaultValue: 'http://localhost:3001'
  },
  NEXT_PUBLIC_API_URL: {
    required: false,
    description: 'API URL for external services',
    exposeToClient: true,
    defaultValue: 'http://localhost:5000/api'
  }
}

function validateEnvironment() {
  const errors = []
  const warnings = []

  // Check required environment variables
  Object.entries(requiredEnvVars).forEach(([key, config]) => {
    const value = process.env[key]
    if (!value) {
      errors.push(`❌ Missing required environment variable: ${key}`)
      errors.push(`   Description: ${config.description}`)
    } else {
      // Validate format if it's DATABASE_URL
      if (key === 'DATABASE_URL') {
        if (!value.startsWith('postgresql://') && !value.startsWith('psql ')) {
          errors.push(`❌ Invalid DATABASE_URL format. Must start with 'postgresql://' or 'psql '`)
        }
        if (!value.includes('sslmode=require')) {
          warnings.push(`⚠️  DATABASE_URL should include 'sslmode=require' for secure connections`)
        }
      }
    }
  })

  // Check optional environment variables
  Object.entries(optionalEnvVars).forEach(([key, config]) => {
    const value = process.env[key]
    if (!value && config.required) {
      errors.push(`❌ Missing environment variable: ${key}`)
      errors.push(`   Description: ${config.description}`)
    }
  })

  // Check for dangerous client exposures
  Object.keys(requiredEnvVars).forEach(key => {
    if (process.env[`NEXT_PUBLIC_${key}`]) {
      errors.push(`❌ DANGEROUS: Server secret '${key}' is exposed to client as 'NEXT_PUBLIC_${key}'`)
      errors.push(`   This could expose sensitive data to the browser!`)
    }
  })

  // Check for common security issues
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.DATABASE_URL?.includes('sslmode=require')) {
      errors.push(`❌ Production DATABASE_URL must use SSL (sslmode=require)`)
    }
  }

  return { errors, warnings }
};

export async function GET() {
  const validation = validateEnvironment()
  
  if (validation.errors.length > 0) {
    return NextResponse.json({
      success: false,
      status: 'error',
      errors: validation.errors,
      warnings: validation.warnings
    }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    status: 'healthy',
    message: 'Environment variables are properly configured',
    warnings: validation.warnings,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      clientVars: Object.keys(optionalEnvVars).filter(key => process.env[key])
    }
  })
}

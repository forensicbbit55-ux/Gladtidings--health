import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Create a singleton pattern for the database connection
const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('Database URL environment variable is not set. Please set NEON_DATABASE_URL or DATABASE_URL')
}

// Disable prefetch as it is not supported for "neon-serverless"
const client = postgres(connectionString, { 
  ssl: 'require',
  prepare: false
})

export const db = drizzle(client)

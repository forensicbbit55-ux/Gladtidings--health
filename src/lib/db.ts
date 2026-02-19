/**
 * Neon Database Connection Helper
 * 
 * Use pooled connection string from Neon (ends with -pooler...) for better performance in serverless
 * For high traffic, consider Pool from @neondatabase/serverless package later
 */

import { neon } from '@neondatabase/serverless';

/**
 * Get database connection instance
 * @returns {NeonQueryFunction} - Neon database connection
 * @throws {Error} - If DATABASE_URL is not set
 */
export async function getDb() {
  const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    const error = new Error('Database URL environment variable is not set. Please set NEON_DATABASE_URL or DATABASE_URL');
    console.error('Database connection error:', error.message);
    
    // In development, provide more helpful error message
    if (process.env.NODE_ENV === 'development') {
      error.message += '\n\nPlease set DATABASE_URL in your .env.local file:\n' +
        'DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require\n\n' +
        'For production, set this environment variable in your Vercel dashboard.';
    }
    
    throw error;
  }

  // Create and return Neon connection
  const sql = neon(databaseUrl);
  return sql;
}

/**
 * Direct export for convenience - use when you don't need async/await
 * Note: This will throw immediately if DATABASE_URL is missing
 */
export const sql = neon(process.env.NEON_DATABASE_URL || process.env.DATABASE_URL!);

/**
 * Test database connection
 * @returns {Promise<boolean>} - True if connection is successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    const db = await getDb();
    await db`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * Helper for executing queries with error handling
 * @param query - SQL query template
 * @param values - Query values
 * @returns {Promise<any[]>} - Query results
 */
export async function executeQuery<T = any>(
  query: TemplateStringsArray,
  ...values: any[]
): Promise<T[]> {
  try {
    const db = await getDb();
    const result = await db(query, ...values);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

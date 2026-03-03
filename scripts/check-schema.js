require('dotenv').config();
const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');
const { sql } = require('drizzle-orm');

// Database connection
const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database URL environment variable is not set');
}

const client = postgres(connectionString, { 
  ssl: 'require',
  prepare: false
});

const db = drizzle(client);

async function checkRemediesSchema() {
  try {
    console.log('🔍 Checking remedies table structure...');
    
    // Get table info
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'remedies' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Remedies table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkRemediesSchema();

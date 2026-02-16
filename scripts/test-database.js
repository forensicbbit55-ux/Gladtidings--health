/**
 * Database Connection Test Script
 * Run this to test your Neon database connection and check existing tables
 */

const { neon } = require('@neondatabase/serverless');

// Use your DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_IdA7HbwVk9Fo@ep-cool-dawn-ahordcwy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

console.log('🔍 Testing Database Connection...');
console.log('Database URL:', databaseUrl.replace(/\/\/.*@/, '//***:***@'));

async function testDatabase() {
  try {
    const sql = neon(databaseUrl);
    
    // Test basic connection
    console.log('\n1. Testing basic connection...');
    const timeResult = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connection successful!');
    console.log('   Database time:', timeResult[0].current_time);

    // Check existing tables
    console.log('\n2. Checking existing tables...');
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Found tables:');
    if (tablesResult.length === 0) {
      console.log('   No tables found. You need to run migrations!');
    } else {
      tablesResult.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }

    // Check if our expected tables exist
    console.log('\n3. Checking for required tables...');
    const expectedTables = ['products', 'blogs', 'subscribers', 'users', 'appointments'];
    const existingTables = tablesResult.map(t => t.table_name);
    
    expectedTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`✅ ${table} - exists`);
        
        // Check table structure
        sql`
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = ${table}
          ORDER BY ordinal_position
        `.then(columns => {
          console.log(`   Columns: ${columns.map(c => `${c.column_name}(${c.data_type})`).join(', ')}`);
        });
      } else {
        console.log(`❌ ${table} - missing`);
      }
    });

    // Test creating a simple table if needed
    console.log('\n4. Testing table creation...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS test_table (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `;
      console.log('✅ Test table creation successful');
      
      // Test insert
      await sql`INSERT INTO test_table (name) VALUES ('Test Entry') RETURNING id, name, created_at`;
      console.log('✅ Test insert successful');
      
      // Test select
      const testResult = await sql`SELECT * FROM test_table`;
      console.log('✅ Test select successful:', testResult[0]);
      
      // Clean up
      await sql`DROP TABLE IF EXISTS test_table`;
      console.log('✅ Test cleanup successful');
      
    } catch (error) {
      console.log('❌ Table operations failed:', error.message);
    }

  } catch (error) {
    console.error('\n❌ Database connection failed:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Possible fixes:');
      console.log('   1. Check your DATABASE_URL format');
      console.log('   2. Verify Neon database is active');
      console.log('   3. Check if username/password are correct');
    }
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('\n💡 Possible fixes:');
      console.log('   1. Check hostname in DATABASE_URL');
      console.log('   2. Verify network connection');
      console.log('   3. Check if Neon database is running');
    }
  }
}

// Run the test
testDatabase().then(() => {
  console.log('\n🏁 Database test completed!');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Test failed:', error);
  process.exit(1);
});

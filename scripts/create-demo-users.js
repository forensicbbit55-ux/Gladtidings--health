/**
 * Create Demo Users Script
 * Creates admin, staff, and user accounts for testing
 */

const { neon } = require('@neondatabase/serverless');

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_IdA7HbwVk9Fo@ep-cool-dawn-ahordcwy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const bcrypt = require('bcryptjs');

console.log('🔧 Creating Demo Users...');

async function createDemoUsers() {
  try {
    const sql = neon(databaseUrl);
    
    // Check existing users
    console.log('\n1. Checking existing users...');
    const existingUsers = await sql`SELECT email, role FROM users`;
    console.log('Existing users:', existingUsers.map(u => `${u.email} (${u.role})`));
    
    // Demo users to create
    const demoUsers = [
      {
        email: 'admin@gladtidings.com',
        name: 'Admin User',
        password: 'admin123',
        role: 'ADMIN'
      },
      {
        email: 'staff@gladtidings.com', 
        name: 'Staff User',
        password: 'staff123',
        role: 'STAFF'
      },
      {
        email: 'user@gladtidings.com',
        name: 'Regular User', 
        password: 'user123',
        role: 'USER'
      }
    ];
    
    console.log('\n2. Creating/updating demo users...');
    
    for (const user of demoUsers) {
      const existingUser = existingUsers.find(u => u.email === user.email);
      
      // Hash password
      const passwordHash = await bcrypt.hash(user.password, 12);
      
      if (existingUser) {
        // Update existing user
        await sql`
          UPDATE users 
          SET name = ${user.name}, password_hash = ${passwordHash}, role = ${user.role}, updated_at = NOW()
          WHERE email = ${user.email}
        `;
        console.log(`✅ Updated: ${user.email} (${user.role})`);
      } else {
        // Create new user
        await sql`
          INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at)
          VALUES (gen_random_uuid(), ${user.email}, ${user.name}, ${passwordHash}, ${user.role}, NOW(), NOW())
        `;
        console.log(`✅ Created: ${user.email} (${user.role})`);
      }
    }
    
    // Verify users were created
    console.log('\n3. Verifying users...');
    const finalUsers = await sql`SELECT email, name, role, created_at FROM users ORDER BY role, email`;
    
    console.log('\n📋 All Users:');
    finalUsers.forEach(user => {
      console.log(`   ${user.email} - ${user.name} (${user.role})`);
    });
    
    console.log('\n🎯 Login Credentials:');
    console.log('   Admin: admin@gladtidings.com / admin123');
    console.log('   Staff: staff@gladtidings.com / staff123'); 
    console.log('   User:  user@gladtidings.com / user123');
    
    console.log('\n✅ Demo users ready! You can now login at http://localhost:3000/login');
    
  } catch (error) {
    console.error('\n❌ Error creating demo users:', error);
    
    if (error.message.includes('relation "users" does not exist')) {
      console.log('\n💡 Fix: Run Prisma migrations first:');
      console.log('   npx prisma migrate dev');
      console.log('   npx prisma generate');
    }
  }
}

createDemoUsers().then(() => {
  console.log('\n🏁 Demo user creation completed!');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Script failed:', error);
  process.exit(1);
});

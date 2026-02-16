/**
 * Debug Authentication Script
 * Checks Prisma connection and user authentication
 */

const { PrismaClient } = require('@prisma/client');

console.log('🔍 Debugging Authentication...\n');

async function debugAuth() {
  try {
    console.log('1. Testing Prisma connection...');
    
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_IdA7HbwVk9Fo@ep-cool-dawn-ahordcwy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require'
        }
      }
    });
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');
    
    // Check users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        passwordHash: true
      }
    });
    
    console.log(`\n2. Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`   ${user.email} (${user.role}) - Has password: ${!!user.passwordHash}`);
    });
    
    // Test password verification for admin
    const adminUser = users.find(u => u.email === 'admin@gladtidings.com');
    if (adminUser) {
      const bcrypt = require('bcryptjs');
      const isValid = await bcrypt.compare('admin123', adminUser.passwordHash);
      console.log(`\n3. Admin password verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    }
    
    // Test NextAuth configuration
    console.log('\n4. Environment variables:');
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
    console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || '❌ Missing'}`);
    console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`   NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || '❌ Missing'}`);
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('\n❌ Debug failed:', error.message);
    
    if (error.message.includes('relation "users" does not exist')) {
      console.log('\n💡 Fix: Run Prisma migrations');
      console.log('   npx prisma migrate dev --name init');
      console.log('   npx prisma generate');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Fix: Check DATABASE_URL format');
    }
  }
}

debugAuth().then(() => {
  console.log('\n🏁 Debug completed!');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Debug failed:', error);
  process.exit(1);
});

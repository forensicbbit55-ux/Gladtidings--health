/**
 * Check Password Hashes
 * Verifies user passwords are correctly stored
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

console.log('🔐 Checking User Passwords...\n');

async function checkPasswords() {
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'postgresql://neondb_owner:npg_IdA7HbwVk9Fo@ep-cool-dawn-ahordcwy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require'
        }
      }
    });

    await prisma.$connect();
    console.log('✅ Connected to database');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        passwordHash: true
      }
    });

    console.log(`\n📋 Found ${users.length} users:`);

    // Test each user's password
    const testPasswords = [
      { email: 'admin@gladtidings.com', password: 'admin123' },
      { email: 'staff@gladtidings.com', password: 'staff123' },
      { email: 'user@gladtidings.com', password: 'user123' }
    ];

    for (const testUser of testPasswords) {
      const user = users.find(u => u.email === testUser.email);
      
      if (user) {
        console.log(`\n🔍 Testing ${testUser.email}:`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Has password: ${!!user.passwordHash}`);
        
        if (user.passwordHash) {
          const isValid = await bcrypt.compare(testUser.password, user.passwordHash);
          console.log(`   Password "${testUser.password}": ${isValid ? '✅ Valid' : '❌ Invalid'}`);
          
          if (!isValid) {
            console.log(`   🔧 Recreating password hash...`);
            const newHash = await bcrypt.hash(testUser.password, 12);
            await prisma.user.update({
              where: { email: testUser.email },
              data: { passwordHash: newHash }
            });
            console.log(`   ✅ Password hash updated`);
          }
        } else {
          console.log(`   ❌ No password hash found`);
        }
      } else {
        console.log(`\n❌ User ${testUser.email} not found in database`);
      }
    }

    // Verify final state
    console.log('\n🔄 Final verification:');
    for (const testUser of testPasswords) {
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
        select: { passwordHash: true }
      });
      
      if (user && user.passwordHash) {
        const isValid = await bcrypt.compare(testUser.password, user.passwordHash);
        console.log(`   ${testUser.email}: ${isValid ? '✅ Working' : '❌ Still broken'}`);
      }
    }

    await prisma.$disconnect();
    
  } catch (error) {
    console.error('\n❌ Error checking passwords:', error.message);
  }
}

checkPasswords().then(() => {
  console.log('\n🏁 Password check completed!');
  console.log('\n🚀 Try login again:');
  console.log('   Email: admin@gladtidings.com');
  console.log('   Password: admin123');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Script failed:', error);
  process.exit(1);
});

/**
 * Debug Login Issue Right Now
 * Quick check of current login state
 */

console.log('🔍 Debugging Login Issue...\n');

async function debugLogin() {
  try {
    console.log('1. Checking current NextAuth session...');
    
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session');
    
    if (sessionResponse.ok) {
      const session = await sessionResponse.json();
      console.log('✅ Session endpoint working');
      console.log('   Current session:', session);
    } else {
      console.log('❌ Session endpoint failed');
    }

    console.log('\n2. Testing login with exact credentials...');
    
    // Test login exactly as browser would send
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'next-auth.csrf-token=test'
      },
      body: new URLSearchParams({
        email: 'admin@gladtidings.com',
        password: 'admin123',
        csrfToken: 'test',
        redirect: 'false',
        json: 'true'
      })
    });

    console.log(`Login Status: ${loginResponse.status}`);
    
    if (loginResponse.ok) {
      const result = await loginResponse.json();
      console.log('✅ Login API response:', result);
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed:', errorText);
    }

    console.log('\n3. Checking database users directly...');
    
    // Check database directly
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcryptjs');
    
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'postgresql://neondb_owner:npg_IdA7HbwVk9Fo@ep-cool-dawn-ahordcwy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require'
        }
      }
    });

    await prisma.$connect();
    
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@gladtidings.com' }
    });

    if (adminUser) {
      console.log('✅ Admin user found in database');
      console.log('   Email:', adminUser.email);
      console.log('   Role:', adminUser.role);
      console.log('   Has password:', !!adminUser.passwordHash);
      
      // Test password
      const isPasswordValid = await bcrypt.compare('admin123', adminUser.passwordHash);
      console.log('   Password "admin123" valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('🔧 Fixing password hash...');
        const newHash = await bcrypt.hash('admin123', 12);
        await prisma.user.update({
          where: { email: 'admin@gladtidings.com' },
          data: { passwordHash: newHash }
        });
        console.log('✅ Password hash updated');
      }
    } else {
      console.log('❌ Admin user not found in database');
    }

    await prisma.$disconnect();

    console.log('\n4. Quick Fix Options:');
    console.log('Option 1: Clear browser cache and retry');
    console.log('Option 2: Use incognito/private window');
    console.log('Option 3: Check browser console for JavaScript errors');
    console.log('Option 4: Verify email spelling: admin@gladtidings.com');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugLogin().then(() => {
  console.log('\n🎯 Immediate Actions:');
  console.log('1. Go to: http://localhost:3000/login');
  console.log('2. Use EXACT: admin@gladtidings.com');
  console.log('3. Use EXACT: admin123');
  console.log('4. Check for typos');
  console.log('5. Try incognito window');
  
  console.log('\n🔧 If Still Fails:');
  console.log('The issue might be:');
  console.log('- Browser cache/cookies');
  console.log('- JavaScript errors on login page');
  console.log('- Network issues');
  console.log('- Server needs restart');
}).catch(error => {
  console.error('\n💥 Debug failed:', error);
});

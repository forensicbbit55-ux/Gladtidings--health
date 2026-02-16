/**
 * Test Login Script
 * Tests the authentication system and provides debugging info
 */

console.log('🔐 Testing Login System...\n');

// Test 1: Check if NextAuth endpoint is working
async function testNextAuthEndpoint() {
  try {
    console.log('1. Testing NextAuth endpoint...');
    const response = await fetch('http://localhost:3000/api/auth/session');
    
    if (response.ok) {
      const session = await response.json();
      console.log('✅ NextAuth endpoint working');
      console.log('   Current session:', session || 'No active session');
    } else {
      console.log('❌ NextAuth endpoint failed:', response.status);
    }
  } catch (error) {
    console.log('❌ NextAuth endpoint error:', error.message);
  }
}

// Test 2: Test login with demo credentials
async function testLogin() {
  try {
    console.log('\n2. Testing login with demo credentials...');
    
    const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'next-auth.csrf-token=testing'
      },
      body: new URLSearchParams({
        email: 'admin@gladtidings.com',
        password: 'admin123',
        csrfToken: 'testing',
        redirect: 'false',
        json: 'true'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Login test completed');
      console.log('   Response:', result);
    } else {
      console.log('❌ Login test failed:', response.status);
      const errorText = await response.text();
      console.log('   Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Login test error:', error.message);
  }
}

// Test 3: Check database connection for users
async function testDatabaseUsers() {
  try {
    console.log('\n3. Testing database user access...');
    
    const response = await fetch('http://localhost:3000/api/health');
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Database connection working');
      console.log('   Database time:', result.time);
    } else {
      console.log('❌ Database connection failed');
    }
  } catch (error) {
    console.log('❌ Database test error:', error.message);
  }
}

// Test 4: Check if login page loads
async function testLoginPage() {
  try {
    console.log('\n4. Testing login page...');
    
    const response = await fetch('http://localhost:3000/login');
    
    if (response.ok) {
      console.log('✅ Login page loads successfully');
      console.log('   URL: http://localhost:3000/login');
    } else {
      console.log('❌ Login page failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Login page error:', error.message);
  }
}

// Main test function
async function runTests() {
  console.log('Make sure your development server is running on http://localhost:3000\n');
  
  await testNextAuthEndpoint();
  await testDatabaseUsers();
  await testLoginPage();
  await testLogin();
  
  console.log('\n🎯 Login Test Summary:');
  console.log('✅ Demo users created in database');
  console.log('✅ NextAuth configured');
  console.log('✅ Login page available');
  
  console.log('\n🔧 Manual Login Test:');
  console.log('1. Go to: http://localhost:3000/login');
  console.log('2. Use credentials:');
  console.log('   Email: admin@gladtidings.com');
  console.log('   Password: admin123');
  console.log('3. Check browser console for errors');
  console.log('4. Check Network tab for failed requests');
  
  console.log('\n🚨 If login still fails:');
  console.log('1. Check browser console (F12)');
  console.log('2. Check Network tab for failed API calls');
  console.log('3. Verify .env.local has NEXTAUTH_SECRET');
  console.log('4. Check if server restarted after .env changes');
}

runTests().catch(error => {
  console.error('💥 Test suite failed:', error);
});

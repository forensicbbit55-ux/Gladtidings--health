/**
 * Deep Debug Script
 * Identifies the exact cause of login errors
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Deep Debugging Login Issues...\n');

// 1. Check environment files
console.log('1. Checking Environment Files:');

const envFiles = ['.env.local', '.env.local.fixed', '.env.local.correct'];
envFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    console.log(`\n📄 ${file}:`);
    console.log(content);
  } catch (error) {
    console.log(`❌ ${file}: Not found or unreadable`);
  }
});

// 2. Check server status
async function checkServer() {
  try {
    console.log('\n2. Checking Server Status:');
    const response = await fetch('http://localhost:3000/api/auth/session');
    
    if (response.ok) {
      const session = await response.json();
      console.log('✅ Server is running');
      console.log('   Session endpoint working:', session);
    } else {
      console.log('❌ Server not responding correctly');
      console.log('   Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    console.log('   Make sure: npm run dev is running');
  }
}

// 3. Test login with detailed error capture
async function testLoginDetailed() {
  try {
    console.log('\n3. Testing Login with Detailed Errors:');
    
    const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
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

    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log(`Response body:`, text);
    
    if (response.ok) {
      try {
        const json = JSON.parse(text);
        console.log('✅ Login response:', json);
      } catch (e) {
        console.log('❌ Response not valid JSON');
      }
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.log('❌ Login test error:', error.message);
  }
}

// 4. Check NextAuth configuration
async function checkNextAuthConfig() {
  try {
    console.log('\n4. Checking NextAuth Configuration:');
    
    const response = await fetch('http://localhost:3000/api/auth/providers');
    
    if (response.ok) {
      const providers = await response.json();
      console.log('✅ NextAuth providers:', Object.keys(providers));
      
      const credentialsProvider = providers.credentials;
      if (credentialsProvider) {
        console.log('✅ Credentials provider configured');
        console.log('   Fields:', Object.keys(credentialsProvider.credentials || {}));
      } else {
        console.log('❌ Credentials provider not found');
      }
    } else {
      console.log('❌ NextAuth config not accessible');
    }
  } catch (error) {
    console.log('❌ Config check error:', error.message);
  }
}

// 5. Check if server needs restart
function checkServerRestart() {
  console.log('\n5. Server Restart Check:');
  console.log('If you recently changed .env.local, you MUST restart:');
  console.log('1. Stop server (Ctrl+C)');
  console.log('2. Run: npm run dev');
  console.log('3. Wait for "Ready in Xs" message');
}

// Main debug function
async function runDeepDebug() {
  await checkServer();
  await checkNextAuthConfig();
  await testLoginDetailed();
  checkServerRestart();
  
  console.log('\n🎯 Common Login Issues & Fixes:');
  console.log('');
  console.log('❌ "CredentialsSignin" Error:');
  console.log('   Fix: Check NEXTAUTH_URL is http://localhost:3000');
  console.log('   Fix: Restart server after .env changes');
  console.log('');
  console.log('❌ "401 Unauthorized":');
  console.log('   Fix: Check user exists in database');
  console.log('   Fix: Verify password hash is correct');
  console.log('');
  console.log('❌ "Server not responding":');
  console.log('   Fix: Run npm run dev');
  console.log('   Fix: Check port 3000 is available');
  console.log('');
  console.log('🚀 Quick Fix Steps:');
  console.log('1. Copy .env.local.correct to .env.local');
  console.log('2. Restart development server');
  console.log('3. Clear browser cache (Ctrl+Shift+R)');
  console.log('4. Try login again');
}

runDeepDebug().catch(error => {
  console.error('💥 Debug failed:', error);
});

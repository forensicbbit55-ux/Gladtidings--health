/**
 * Restart Check Script
 * Verifies environment variables after server restart
 */

console.log('🔄 Checking if server needs restart...\n');

async function checkEnvironment() {
  try {
    console.log('1. Testing current server environment...');
    
    const response = await fetch('http://localhost:3000/api/auth/session');
    
    if (response.ok) {
      // Check if cookies show production URL
      const setCookie = response.headers.get('set-cookie');
      if (setCookie && setCookie.includes('gladtidings-health.vercel.app')) {
        console.log('❌ Server still using production URLs');
        console.log('   You MUST restart the server!');
        console.log('');
        console.log('🔧 Restart Steps:');
        console.log('1. Stop server (Ctrl+C)');
        console.log('2. Run: npm run dev');
        console.log('3. Wait for "Ready in Xs" message');
        console.log('4. Try login again');
      } else {
        console.log('✅ Server using localhost URLs');
        console.log('   Login should work now!');
      }
    } else {
      console.log('❌ Server not responding');
    }
    
  } catch (error) {
    console.log('❌ Cannot connect to server:', error.message);
    console.log('   Make sure: npm run dev is running');
  }
}

checkEnvironment();

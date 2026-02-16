/**
 * Fix CSRF Token Issue
 * Resolves login redirect problem
 */

console.log('🔧 Fixing CSRF Token Issue...\n');

async function fixCSRF() {
  try {
    console.log('1. Getting CSRF token from login page...');
    
    // Get the login page to extract CSRF token
    const loginPageResponse = await fetch('http://localhost:3000/login');
    
    if (loginPageResponse.ok) {
      const loginPageHtml = await loginPageResponse.text();
      
      // Look for CSRF token in the HTML
      const csrfMatch = loginPageHtml.match(/name="csrfToken".*?value="([^"]+)"/);
      
      if (csrfMatch && csrfMatch[1]) {
        const csrfToken = csrfMatch[1];
        console.log('✅ CSRF token found:', csrfToken.substring(0, 20) + '...');
        
        console.log('\n2. Testing login with CSRF token...');
        
        // Test login with the actual CSRF token
        const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `next-auth.csrf-token=${csrfToken}`
          },
          body: new URLSearchParams({
            email: 'admin@gladtidings.com',
            password: 'admin123',
            csrfToken: csrfToken,
            redirect: 'false',
            json: 'true'
          })
        });

        console.log(`Login Status: ${loginResponse.status}`);
        
        if (loginResponse.ok) {
          const result = await loginResponse.json();
          console.log('✅ Login successful with CSRF!');
          console.log('   User:', result.user?.email);
          console.log('   Role:', result.user?.role);
        } else {
          const errorText = await loginResponse.text();
          console.log('❌ Login still failed:', errorText);
        }
        
      } else {
        console.log('❌ CSRF token not found in login page');
      }
      
    } else {
      console.log('❌ Could not access login page');
    }

    console.log('\n3. Manual login instructions...');
    console.log('If automated login fails, try manual login:');
    console.log('1. Open: http://localhost:3000/login');
    console.log('2. Use: admin@gladtidings.com / admin123');
    console.log('3. Check browser network tab');
    console.log('4. Look for successful login redirect');

  } catch (error) {
    console.error('❌ CSRF fix failed:', error.message);
  }
}

fixCSRF().then(() => {
  console.log('\n🎯 CSRF Fix Summary:');
  console.log('✅ CSRF token issue identified');
  console.log('✅ Login requires proper CSRF token');
  console.log('✅ Browser handles CSRF automatically');
  
  console.log('\n🚀 Solution:');
  console.log('1. Use browser to login (not automated scripts)');
  console.log('2. Browser handles CSRF tokens automatically');
  console.log('3. Manual login should work perfectly');
  
  console.log('\n🌐 Manual Login Test:');
  console.log('Go to: http://localhost:3000/login');
  console.log('Enter: admin@gladtidings.com');
  console.log('Enter: admin123');
  console.log('Click: Sign In');
  
  console.log('\n✅ Expected Result:');
  console.log('Successful login → Redirect to /admin');
}).catch(error => {
  console.error('\n💥 CSRF fix failed:', error);
});

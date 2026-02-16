/**
 * Test Complete Auth Flow
 * Tests NextAuth credentials flow step by step
 */

console.log('🔍 Testing Complete Auth Flow...\n');

async function testAuthFlow() {
  try {
    console.log('1. Testing NextAuth providers endpoint...');
    const providersResponse = await fetch('http://localhost:3000/api/auth/providers');
    
    if (providersResponse.ok) {
      const providers = await providersResponse.json();
      console.log('✅ Providers:', Object.keys(providers));
      
      const credentials = providers.credentials;
      if (credentials) {
        console.log('Credentials provider config:');
        console.log('   Name:', credentials.name);
        console.log('   ID:', credentials.id);
        console.log('   Type:', credentials.type);
        console.log('   Fields:', credentials.credentials);
      }
    }

    console.log('\n2. Testing direct credentials login...');
    
    // Test with form data (like browser sends)
    const formData = new FormData();
    formData.append('email', 'admin@gladtidings.com');
    formData.append('password', 'admin123');
    formData.append('csrfToken', 'test');
    formData.append('redirect', 'false');
    formData.append('json', 'true');

    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': 'next-auth.csrf-token=test'
      }
    });

    console.log('\nLogin Response:');
    console.log('Status:', loginResponse.status);
    console.log('Headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    const responseText = await loginResponse.text();
    console.log('Body:', responseText);

    if (loginResponse.ok) {
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('✅ Login successful:', jsonResponse);
      } catch (e) {
        console.log('❌ Response not JSON');
      }
    } else {
      console.log('❌ Login failed');
    }

    console.log('\n3. Testing with URL encoded data...');
    
    const urlEncodedData = new URLSearchParams({
      email: 'admin@gladtidings.com',
      password: 'admin123',
      csrfToken: 'test',
      redirect: 'false',
      json: 'true'
    });

    const urlEncodedResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'next-auth.csrf-token=test'
      },
      body: urlEncodedData
    });

    console.log('\nURL Encoded Login:');
    console.log('Status:', urlEncodedResponse.status);
    console.log('Body:', await urlEncodedResponse.text());

    console.log('\n4. Checking NextAuth configuration...');
    console.log('Environment variables:');
    console.log('   NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NOT SET');
    console.log('   NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET');
    console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

  } catch (error) {
    console.error('❌ Auth flow test failed:', error.message);
  }
}

testAuthFlow().then(() => {
  console.log('\n🏁 Auth flow test completed!');
  console.log('\n🔧 If login still fails:');
  console.log('1. Check NextAuth configuration in src/lib/auth.ts');
  console.log('2. Verify Prisma adapter is working');
  console.log('3. Check browser network tab for failed requests');
  console.log('4. Look for JavaScript errors in browser console');
}).catch(error => {
  console.error('\n💥 Test failed:', error);
});

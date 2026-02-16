/**
 * API Test Script
 * Test all your APIs to make sure they work with the database
 */

const base_url = 'http://localhost:3000';

console.log('🧪 Testing APIs...\n');

// Test 1: Health Check
async function testHealth() {
  try {
    console.log('1. Testing Health Check...');
    const response = await fetch(`${base_url}/api/health`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Health check passed');
      console.log(`   Database time: ${data.time}`);
    } else {
      console.log('❌ Health check failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
  }
}

// Test 2: Newsletter Subscription
async function testNewsletter() {
  try {
    console.log('\n2. Testing Newsletter Subscription...');
    const response = await fetch(`${base_url}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Newsletter subscription successful');
      console.log(`   Email: ${data.data.email}`);
      console.log(`   ID: ${data.data.id}`);
    } else {
      console.log('❌ Newsletter subscription failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Newsletter subscription error:', error.message);
  }
}

// Test 3: Products
async function testProducts() {
  try {
    console.log('\n3. Testing Products API...');
    
    // Get all products
    const response = await fetch(`${base_url}/api/products`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Products API working');
      console.log(`   Found ${data.data.length} products`);
      
      if (data.data.length > 0) {
        console.log('   Sample product:', data.data[0].title || data.data[0].name);
      }
    } else {
      console.log('❌ Products API failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Products API error:', error.message);
  }
}

// Test 4: Create a Product
async function testCreateProduct() {
  try {
    console.log('\n4. Testing Product Creation...');
    const response = await fetch(`${base_url}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Herbal Remedy',
        description: 'This is a test product for wellness',
        price: 29.99,
        category: 'test-remedy',
        stock: 100
      })
    });
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Product creation successful');
      console.log(`   Product ID: ${data.data.id}`);
      console.log(`   Name: ${data.data.name || data.data.title}`);
      console.log(`   Price: $${data.data.price}`);
    } else {
      console.log('❌ Product creation failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Product creation error:', error.message);
  }
}

// Test 5: Blogs
async function testBlogs() {
  try {
    console.log('\n5. Testing Blogs API...');
    
    // Get all blogs
    const response = await fetch(`${base_url}/api/blogs`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Blogs API working');
      console.log(`   Found ${data.data.length} blog posts`);
      
      if (data.data.length > 0) {
        console.log('   Sample blog:', data.data[0].title);
      }
    } else {
      console.log('❌ Blogs API failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Blogs API error:', error.message);
  }
}

// Test 6: Create a Blog Post
async function testCreateBlog() {
  try {
    console.log('\n6. Testing Blog Creation...');
    const response = await fetch(`${base_url}/api/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Wellness Article',
        content: '<p>This is a test blog post about wellness and natural health remedies.</p>',
        category: 'wellness-tips',
        author: 'Test Author'
      })
    });
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Blog creation successful');
      console.log(`   Blog ID: ${data.data.id}`);
      console.log(`   Title: ${data.data.title}`);
      console.log(`   Slug: ${data.data.slug}`);
    } else {
      console.log('❌ Blog creation failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Blog creation error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('Make sure your development server is running on http://localhost:3000\n');
  
  await testHealth();
  await testNewsletter();
  await testProducts();
  await testCreateProduct();
  await testBlogs();
  await testCreateBlog();
  
  console.log('\n🎉 API Testing Complete!');
  console.log('\n💡 Next Steps:');
  console.log('1. Check your Neon dashboard to see the data');
  console.log('2. Set up your admin panel to manage content');
  console.log('3. Test the frontend integration');
}

runAllTests().catch(error => {
  console.error('💥 Test suite failed:', error);
});

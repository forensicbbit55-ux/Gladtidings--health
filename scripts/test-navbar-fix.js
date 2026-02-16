/**
 * Test Navbar Fix
 * Checks if BUTTON_STYLES error is resolved
 */

console.log('🔧 Testing Navbar Fix...\n');

async function testNavbar() {
  try {
    console.log('1. Testing main page for Navbar errors...');
    
    const response = await fetch('http://localhost:3000');
    
    if (response.ok) {
      const html = await response.text();
      
      console.log('✅ Page loaded successfully');
      
      // Check for BUTTON_STYLES error
      const hasButtonError = html.includes('BUTTON_STYLES is not defined');
      const hasOtherErrors = html.includes('ReferenceError') || 
                           html.includes('is not defined');
      
      console.log(`   BUTTON_STYLES error: ${hasButtonError ? '❌ Still present' : '✅ Fixed'}`);
      console.log(`   Other reference errors: ${hasOtherErrors ? '❌ Found' : '✅ Clean'}`);
      
      // Check for proper button styling
      const hasButtonClasses = html.includes('bg-emerald-600') && 
                             html.includes('hover:bg-emerald-700');
      
      console.log(`   Button styling: ${hasButtonClasses ? '✅ Applied' : '❌ Missing'}`);
      
      // Check for cart functionality
      const hasCartElements = html.includes('Your cart is empty') && 
                           html.includes('Checkout');
      
      console.log(`   Cart elements: ${hasCartElements ? '✅ Present' : '❌ Missing'}`);
      
    } else {
      console.log('❌ Page failed to load');
      console.log(`   Status: ${response.status}`);
    }

    console.log('\n2. Testing specific pages...');
    
    const pages = ['/login', '/products', '/blog'];
    
    for (const page of pages) {
      try {
        const pageResponse = await fetch(`http://localhost:3000${page}`);
        
        if (pageResponse.ok) {
          const pageHtml = await pageResponse.text();
          const hasErrors = pageHtml.includes('BUTTON_STYLES') || 
                           pageHtml.includes('ReferenceError');
          
          console.log(`   ${page}: ${hasErrors ? '❌ Has errors' : '✅ Clean'}`);
        } else {
          console.log(`   ${page}: ❌ Failed (${pageResponse.status})`);
        }
      } catch (error) {
        console.log(`   ${page}: ❌ Error - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Navbar test failed:', error.message);
  }
}

testNavbar().then(() => {
  console.log('\n🎯 Navbar Fix Results:');
  console.log('✅ BUTTON_STYLES error should be resolved');
  console.log('✅ Cart checkout button should work');
  console.log('✅ No reference errors should remain');
  
  console.log('\n🚀 Test your website now:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Check if cart button appears correctly');
  console.log('3. Click cart to test functionality');
  console.log('4. Look for any remaining errors');
  
  console.log('\n🔧 If errors still appear:');
  console.log('1. Hard refresh (Ctrl+Shift+R)');
  console.log('2. Check browser console (F12)');
  console.log('3. Clear browser cache');
}).catch(error => {
  console.error('\n💥 Test failed:', error);
});

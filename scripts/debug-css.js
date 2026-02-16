/**
 * CSS Debug Script
 * Checks if CSS is loading properly
 */

console.log('🎨 Debugging CSS Issues...\n');

async function checkCSS() {
  try {
    console.log('1. Checking if CSS files are being served...');
    
    // Check main CSS file
    const cssResponse = await fetch('http://localhost:3000/_next/static/css/app/layout.css');
    
    if (cssResponse.ok) {
      const cssContent = await cssResponse.text();
      console.log('✅ Main CSS file is being served');
      console.log(`   Size: ${cssContent.length} characters`);
      console.log(`   Contains Tailwind: ${cssContent.includes('tailwind') ? 'Yes' : 'No'}`);
      console.log(`   Contains custom styles: ${cssContent.includes('custom') ? 'Yes' : 'No'}`);
      
      // Check for common Tailwind classes
      const hasTailwindClasses = cssContent.includes('.bg-emerald-600') || 
                              cssContent.includes('.flex') || 
                              cssContent.includes('.text-center');
      console.log(`   Tailwind classes found: ${hasTailwindClasses ? 'Yes' : 'No'}`);
      
    } else {
      console.log('❌ Main CSS file not accessible');
      console.log(`   Status: ${cssResponse.status}`);
    }

    console.log('\n2. Checking page HTML for CSS links...');
    
    // Check main page
    const pageResponse = await fetch('http://localhost:3000');
    
    if (pageResponse.ok) {
      const htmlContent = await pageResponse.text();
      console.log('✅ Page HTML loaded');
      
      // Check for CSS link tags
      const hasCSSLink = htmlContent.includes('rel="stylesheet"') && 
                       htmlContent.includes('css');
      console.log(`   CSS link tags found: ${hasCSSLink ? 'Yes' : 'No'}`);
      
      // Check for Tailwind classes in HTML
      const hasTailwindInHTML = htmlContent.includes('className=') && 
                             (htmlContent.includes('bg-') || 
                              htmlContent.includes('text-') || 
                              htmlContent.includes('flex'));
      console.log(`   Tailwind classes in HTML: ${hasTailwindInHTML ? 'Yes' : 'No'}`);
      
    } else {
      console.log('❌ Page not accessible');
      console.log(`   Status: ${pageResponse.status}`);
    }

    console.log('\n3. Checking Tailwind configuration...');
    
    // Check if Tailwind is configured correctly
    try {
      const fs = require('fs');
      const tailwindConfig = fs.readFileSync('./tailwind.config.js', 'utf8');
      console.log('✅ Tailwind config exists');
      
      const hasCorrectContent = tailwindConfig.includes('content:') && 
                             tailwindConfig.includes('./src/app/**');
      console.log(`   Content paths configured: ${hasCorrectContent ? 'Yes' : 'No'}`);
      
    } catch (error) {
      console.log('❌ Tailwind config not found');
    }

    console.log('\n4. Checking for CSS build issues...');
    
    // Check if there are build errors
    const buildResponse = await fetch('http://localhost:3000');
    const buildHTML = await buildResponse.text();
    
    const hasBuildErrors = buildHTML.includes('error') || 
                        buildHTML.includes('Error') || 
                        buildHTML.includes('failed');
    console.log(`   Build errors detected: ${hasBuildErrors ? 'Yes' : 'No'}`);

  } catch (error) {
    console.error('❌ CSS debug failed:', error.message);
  }
}

checkCSS().then(() => {
  console.log('\n🎯 CSS Debug Summary:');
  console.log('✅ If CSS is missing, check:');
  console.log('   1. Tailwind CSS is being generated');
  console.log('   2. CSS files are being served');
  console.log('   3. HTML includes CSS links');
  console.log('   4. No build errors');
  
  console.log('\n🔧 Quick Fixes:');
  console.log('1. Restart dev server: npm run dev');
  console.log('2. Clear .next cache: rm -rf .next');
  console.log('3. Reinstall dependencies: npm install');
  console.log('4. Check browser console for CSS errors');
  
  console.log('\n🚀 Test styling:');
  console.log('1. Open http://localhost:3000');
  console.log('2. Check if page has colors, fonts, spacing');
  console.log('3. Use browser dev tools to inspect styles');
}).catch(error => {
  console.error('\n💥 CSS debug failed:', error);
});

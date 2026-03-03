// Test script to check what the remedies page is doing
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('Browser console:', msg.text());
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });
  
  try {
    console.log('🔍 Navigating to remedies page...');
    await page.goto('http://localhost:3000/remedies', { waitUntil: 'networkidle' });
    
    // Wait a bit for any dynamic content
    await page.waitForTimeout(2000);
    
    // Check if remedies are visible
    const remedyElements = await page.$$('.grid > div');
    console.log(`Found ${remedyElements.length} remedy elements on page`);
    
    // Get page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Check for "No Remedies Yet" message
    const noRemediesText = await page.textContent('body');
    if (noRemediesText.includes('No Remedies Yet')) {
      console.log('❌ Page shows "No Remedies Yet" - data not reaching frontend');
    } else {
      console.log('✅ Page does not show "No Remedies Yet"');
    }
    
  } catch (error) {
    console.error('Error testing page:', error);
  } finally {
    await browser.close();
  }
})();

/**
 * Check for Common File Errors
 * Diagnoses issues with recently fixed files
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for File Errors...\n');

function checkFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`✅ ${filePath}: Readable`);
      
      // Check for common syntax errors
      const hasUnclosedBraces = (content.match(/{/g) || []).length !== (content.match(/}/g) || []).length);
      const hasUnclosedParens = (content.match(/\(/g) || []).length !== (content.match(/\)/g) || []).length);
      const hasStringIssues = content.includes("'") && !content.includes("\\'");
      
      console.log(`   Syntax check: ${hasUnclosedBraces || hasUnclosedParens || hasStringIssues ? '⚠️ Issues found' : '✅ Clean'}`);
      
      return { readable: true, hasIssues: hasUnclosedBraces || hasUnclosedParens || hasStringIssues };
    } else {
      console.log(`❌ ${filePath}: File not found`);
      return { readable: false, hasIssues: true };
    }
  } catch (error) {
    console.log(`❌ ${filePath}: ${error.message}`);
    return { readable: false, hasIssues: true, error: error.message };
  }
}

console.log('1. Checking recently fixed files...');

// Check OpenGraphMeta.js
const openGraphResult = checkFile('src/components/OpenGraphMeta.js');
console.log(`   OpenGraphMeta.js: ${openGraphResult.readable ? '✅ OK' : '❌ Error'}`);

// Check Navbar.js  
const navbarResult = checkFile('src/components/Navbar.js');
console.log(`   Navbar.js: ${navbarResult.readable ? '✅ OK' : '❌ Error'}`);

// Check if logo files exist
const logoPaths = [
  'public/logo.png',
  'public/images/logo.png',
  'public/images/gladtidings-logo.png'
];

console.log('\n2. Checking logo files...');
logoPaths.forEach(logoPath => {
  if (fs.existsSync(logoPath)) {
    const stats = fs.statSync(logoPath);
    console.log(`   ✅ ${logoPath}: ${stats.size} bytes`);
  } else {
    console.log(`   ❌ ${logoPath}: Not found`);
  }
});

console.log('\n3. Checking for common IDE issues...');

// Check for encoding issues
try {
  const openGraphContent = fs.readFileSync('src/components/OpenGraphMeta.js', 'utf8');
  const hasEncodingIssues = openGraphContent.includes('�') || openGraphContent.includes('');
  console.log(`   File encoding: ${hasEncodingIssues ? '⚠️ Issues detected' : '✅ Clean'}`);
} catch (error) {
  console.log(`   Encoding check: ❌ ${error.message}`);
}

console.log('\n🎯 Common Error Messages & Solutions:');
console.log('');
console.log('❌ "Cannot read file":');
console.log('   → File might be corrupted or have encoding issues');
console.log('   → Try: Reopen file, check file permissions');
console.log('');
console.log('❌ "Unexpected token" or "Syntax error":');
console.log('   → JavaScript syntax issues in recently edited files');
console.log('   → Try: Check braces, parentheses, quotes');
console.log('');
console.log('❌ "File not found":');
console.log('   → Logo files missing or wrong path');
console.log('   → Try: Check /public/images/ folder');

console.log('\n🔧 Quick Fixes:');
console.log('1. Restart IDE/editor');
console.log('2. Check file encoding (UTF-8)');
console.log('3. Verify file permissions');
console.log('4. Check for syntax errors in recently modified files');

console.log('\n📋 Files Recently Modified:');
console.log('- src/components/OpenGraphMeta.js (structured data fix)');
console.log('- src/components/Navbar.js (BUTTON_STYLES fix)');
console.log('- .env.local (environment variables fix)');

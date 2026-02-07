#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define valid routes in your application
const validRoutes = [
  '/',
  '/about',
  '/blog',
  '/blog/[slug]',
  '/cart',
  '/checkout',
  '/contact',
  '/consultation',
  '/devotional',
  '/products',
  '/products/[id]',
  '/services',
  '/admin',
  '/admin/announcements',
  '/admin/auth',
  '/admin/blog',
  '/admin/login',
  '/admin/media',
  '/admin/messages',
  '/admin/missions',
  '/admin/page',
  '/admin/products',
  '/admin/products/add',
  '/admin/sermons',
  '/admin/settings',
  '/admin/simple',
  '/admin/test',
  '/admin/test-routing',
  '/admin/users',
  '/not-found'
];

// Function to extract links from a file
function extractLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const links = [];
  
  // Extract href attributes
  const hrefRegex = /href=["']([^"']+)["']/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    links.push(match[1]);
  }
  
  // Extract src attributes
  const srcRegex = /src=["']([^"']+)["']/g;
  while ((match = srcRegex.exec(content)) !== null) {
    links.push(match[1]);
  }
  
  return links;
}

// Function to check if a link is valid
function isValidLink(link) {
  // Skip external links
  if (link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('tel:')) {
    return true;
  }
  
  // Skip anchor links
  if (link.startsWith('#')) {
    return true;
  }
  
  // Skip API routes
  if (link.startsWith('/api/')) {
    return true;
  }
  
  // Check if it's a valid route
  const cleanLink = link.split('?')[0]; // Remove query parameters
  
  // Handle dynamic routes
  if (cleanLink.includes('/blog/') && cleanLink !== '/blog') {
    return true; // Individual blog posts
  }
  
  if (cleanLink.includes('/products/') && cleanLink !== '/products') {
    return true; // Individual product pages
  }
  
  return validRoutes.includes(cleanLink);
}

// Function to scan directory for files
function scanDirectory(dir, extensions = ['.js', '.jsx']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main function
function main() {
  const srcDir = path.join(__dirname, '../src');
  const files = scanDirectory(srcDir);
  
  console.log('🔍 Scanning for broken links...\n');
  
  let totalLinks = 0;
  let brokenLinks = [];
  
  for (const file of files) {
    const links = extractLinks(file);
    const relativePath = path.relative(srcDir, file);
    
    for (const link of links) {
      totalLinks++;
      
      if (!isValidLink(link)) {
        brokenLinks.push({
          file: relativePath,
          link: link
        });
      }
    }
  }
  
  console.log(`📊 Results:`);
  console.log(`   Total links found: ${totalLinks}`);
  console.log(`   Broken links: ${brokenLinks.length}`);
  
  if (brokenLinks.length > 0) {
    console.log('\n❌ Broken Links:');
    brokenLinks.forEach(({ file, link }) => {
      console.log(`   ${file}: ${link}`);
    });
  } else {
    console.log('\n✅ No broken links found!');
  }
  
  // Check for missing images
  console.log('\n🖼️  Checking for missing images...');
  const publicDir = path.join(__dirname, '../public');
  const imageLinks = [];
  
  for (const file of files) {
    const links = extractLinks(file);
    for (const link of links) {
      if (link.includes('/images/') || link.includes('.jpg') || link.includes('.png') || link.includes('.svg')) {
        imageLinks.push(link);
      }
    }
  }
  
  let missingImages = [];
  
  for (const imageLink of imageLinks) {
    const imagePath = path.join(publicDir, imageLink.replace(/^\//, ''));
    
    if (!fs.existsSync(imagePath)) {
      missingImages.push(imageLink);
    }
  }
  
  console.log(`   Total image references: ${imageLinks.length}`);
  console.log(`   Missing images: ${missingImages.length}`);
  
  if (missingImages.length > 0) {
    console.log('\n❌ Missing Images:');
    missingImages.forEach(image => {
      console.log(`   ${image}`);
    });
  } else {
    console.log('\n✅ All images found!');
  }
  
  // Check 404 page
  const notFoundPath = path.join(srcDir, 'app/not-found.js');
  if (fs.existsSync(notFoundPath)) {
    console.log('\n✅ 404 page exists');
  } else {
    console.log('\n❌ 404 page missing');
  }
  
  console.log('\n🎉 Link check complete!');
}

if (require.main === module) {
  main();
}

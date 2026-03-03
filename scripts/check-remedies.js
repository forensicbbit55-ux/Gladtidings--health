require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRemedies() {
  try {
    console.log('🔍 Checking remedies in database...');
    
    const remedies = await prisma.remedy.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`\n📋 Found ${remedies.length} remedies:\n`);
    
    remedies.forEach((remedy, index) => {
      console.log(`${index + 1}. ${remedy.title}`);
      console.log(`   Price: KSH ${remedy.price}`);
      console.log(`   Category: ${remedy.category?.name || 'No category'}`);
      console.log(`   Published: ${remedy.isPublished ? 'Yes' : 'No'}`);
      console.log(`   Images: ${remedy.images.length} image(s)`);
      console.log(`   Created: ${remedy.createdAt.toLocaleString()}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking remedies:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRemedies();

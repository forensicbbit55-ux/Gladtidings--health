const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function setupDatabase() {
  try {
    console.log('Setting up authentication database...')

    // Create default admin user if not exists
    const adminEmail = 'admin@gladtidings.com'
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const admin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: adminEmail,
          passwordHash: hashedPassword,
          role: 'ADMIN'
        }
      })

      console.log('✅ Default admin user created:', {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        password: 'admin123' // Only for development
      })
    } else {
      console.log('✅ Admin user already exists')
    }

    // Create default staff user if not exists
    const staffEmail = 'staff@gladtidings.com'
    const existingStaff = await prisma.user.findUnique({
      where: { email: staffEmail }
    })

    if (!existingStaff) {
      const hashedPassword = await bcrypt.hash('staff123', 12)
      
      const staff = await prisma.user.create({
        data: {
          name: 'Staff User',
          email: staffEmail,
          passwordHash: hashedPassword,
          role: 'STAFF'
        }
      })

      console.log('✅ Default staff user created:', {
        id: staff.id,
        email: staff.email,
        role: staff.role,
        password: 'staff123' // Only for development
      })
    } else {
      console.log('✅ Staff user already exists')
    }

    // Create test regular user if not exists
    const userEmail = 'user@gladtidings.com'
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('user123', 12)
      
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: userEmail,
          passwordHash: hashedPassword,
          role: 'USER'
        }
      })

      console.log('✅ Default test user created:', {
        id: user.id,
        email: user.email,
        role: user.role,
        password: 'user123' // Only for development
      })
    } else {
      console.log('✅ Test user already exists')
    }

    console.log('✅ Database setup completed successfully!')
    
    // Display all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log('\n📋 All users in database:')
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`)
    })

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

module.exports = { setupDatabase }

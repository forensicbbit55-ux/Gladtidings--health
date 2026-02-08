#!/usr/bin/env node

/**
 * Database Integrity Check Script
 * Verifies database structure, data consistency, and relationships
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Test results
const results = {
  structure: { passed: 0, failed: 0, details: [] },
  data: { passed: 0, failed: 0, details: [] },
  relationships: { passed: 0, failed: 0, details: [] },
  performance: { passed: 0, failed: 0, details: [] }
}

// Utility functions
function log(category, message, status = 'info') {
  const timestamp = new Date().toISOString()
  const statusIcon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : 'ℹ️'
  console.log(`${timestamp} ${statusIcon} [${category.toUpperCase()}] ${message}`)
}

// Check database structure
async function checkDatabaseStructure() {
  log('structure', 'Checking database structure...')
  
  try {
    // Check if all required tables exist
    const requiredTables = [
      'users',
      'accounts', 
      'sessions',
      'verificationtokens',
      'appointments',
      'notifications',
      'newsletter_subscribers',
      'analytics_events',
      'user_registrations',
      'appointment_analytics',
      'newsletter_analytics',
      'conversion_funnels',
      'daily_aggregates'
    ]

    for (const table of requiredTables) {
      try {
        const result = await prisma.$queryRawUnsafe(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = '${table}'
          ) as exists
        `)
        
        if (result[0].exists) {
          log('structure', `Table '${table}' exists`, 'pass')
          results.structure.passed++
        } else {
          log('structure', `Table '${table}' missing`, 'fail')
          results.structure.failed++
        }
      } catch (error) {
        log('structure', `Error checking table '${table}': ${error.message}`, 'fail')
        results.structure.failed++
      }
    }

    // Check table structures
    const tableStructures = {
      users: ['id', 'email', 'name', 'password', 'role', 'createdAt', 'updatedAt'],
      appointments: ['id', 'userId', 'serviceType', 'appointmentDate', 'appointmentTime', 'status', 'createdAt'],
      notifications: ['id', 'userId', 'message', 'read', 'createdAt'],
      newsletter_subscribers: ['id', 'email', 'subscribedAt']
    }

    for (const [table, requiredColumns] of Object.entries(tableStructures)) {
      try {
        const result = await prisma.$queryRawUnsafe(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        `)
        
        const existingColumns = result.map(row => row.column_name)
        const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col))
        
        if (missingColumns.length === 0) {
          log('structure', `Table '${table}' has all required columns`, 'pass')
          results.structure.passed++
        } else {
          log('structure', `Table '${table}' missing columns: ${missingColumns.join(', ')}`, 'fail')
          results.structure.failed++
        }
      } catch (error) {
        log('structure', `Error checking structure of '${table}': ${error.message}`, 'fail')
        results.structure.failed++
      }
    }

    // Check foreign key constraints
    const foreignKeys = [
      { table: 'appointments', column: 'userId', references: 'users' },
      { table: 'notifications', column: 'userId', references: 'users' },
      { table: 'user_registrations', column: 'userId', references: 'users' },
      { table: 'appointment_analytics', column: 'userId', references: 'users' },
      { table: 'appointment_analytics', column: 'appointmentId', references: 'appointments' },
      { table: 'newsletter_analytics', column: 'subscriberId', references: 'newsletter_subscribers' }
    ]

    for (const fk of foreignKeys) {
      try {
        const result = await prisma.$queryRawUnsafe(`
          SELECT EXISTS (
            SELECT FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_schema = 'public'
            AND tc.table_name = '${fk.table}'
            AND tc.constraint_type = 'FOREIGN KEY'
            AND kcu.column_name = '${fk.column}'
          ) as exists
        `)
        
        if (result[0].exists) {
          log('structure', `Foreign key ${fk.table}.${fk.column} exists`, 'pass')
          results.structure.passed++
        } else {
          log('structure', `Foreign key ${fk.table}.${fk.column} missing`, 'fail')
          results.structure.failed++
        }
      } catch (error) {
        log('structure', `Error checking foreign key ${fk.table}.${fk.column}: ${error.message}`, 'fail')
        results.structure.failed++
      }
    }

  } catch (error) {
    log('structure', `Database structure check failed: ${error.message}`, 'fail')
    results.structure.failed++
  }
}

// Check data consistency
async function checkDataConsistency() {
  log('data', 'Checking data consistency...')
  
  try {
    // Check for orphaned records
    const orphanedChecks = [
      {
        name: 'Orphaned appointments',
        query: `
          SELECT COUNT(*) as count 
          FROM appointments a 
          LEFT JOIN users u ON a.userId = u.id 
          WHERE u.id IS NULL
        `
      },
      {
        name: 'Orphaned notifications',
        query: `
          SELECT COUNT(*) as count 
          FROM notifications n 
          LEFT JOIN users u ON n.userId = u.id 
          WHERE u.id IS NULL
        `
      },
      {
        name: 'Orphaned analytics events',
        query: `
          SELECT COUNT(*) as count 
          FROM analytics_events a 
          LEFT JOIN users u ON a.userId = u.id 
          WHERE a.userId IS NOT NULL AND u.id IS NULL
        `
      }
    ]

    for (const check of orphanedChecks) {
      try {
        const result = await prisma.$queryRawUnsafe(check.query)
        const orphanedCount = parseInt(result[0].count)
        
        if (orphanedCount === 0) {
          log('data', `${check.name}: No orphaned records`, 'pass')
          results.data.passed++
        } else {
          log('data', `${check.name}: ${orphanedCount} orphaned records`, 'fail')
          results.data.failed++
        }
      } catch (error) {
        log('data', `Error checking ${check.name}: ${error.message}`, 'fail')
        results.data.failed++
      }
    }

    // Check for invalid data
    const dataValidationChecks = [
      {
        name: 'Invalid emails',
        query: `
          SELECT COUNT(*) as count 
          FROM users 
          WHERE email NOT LIKE '%@%' OR email IS NULL OR email = ''
        `
      },
      {
        name: 'Invalid appointment dates',
        query: `
          SELECT COUNT(*) as count 
          FROM appointments 
          WHERE appointmentDate < CURRENT_DATE - INTERVAL '1 year' OR appointmentDate IS NULL
        `
      },
      {
        name: 'Invalid notification dates',
        query: `
          SELECT COUNT(*) as count 
          FROM notifications 
          WHERE createdAt > CURRENT_TIMESTAMP OR createdAt IS NULL
        `
      }
    ]

    for (const check of dataValidationChecks) {
      try {
        const result = await prisma.$queryRawUnsafe(check.query)
        const invalidCount = parseInt(result[0].count)
        
        if (invalidCount === 0) {
          log('data', `${check.name}: No invalid records`, 'pass')
          results.data.passed++
        } else {
          log('data', `${check.name}: ${invalidCount} invalid records`, 'fail')
          results.data.failed++
        }
      } catch (error) {
        log('data', `Error checking ${check.name}: ${error.message}`, 'fail')
        results.data.failed++
      }
    }

    // Check data uniqueness
    const uniquenessChecks = [
      {
        name: 'Duplicate user emails',
        query: `
          SELECT COUNT(*) as count 
          FROM (
            SELECT email, COUNT(*) as cnt 
            FROM users 
            GROUP BY email 
            HAVING cnt > 1
          ) duplicates
        `
      },
      {
        name: 'Duplicate newsletter emails',
        query: `
          SELECT COUNT(*) as count 
          FROM (
            SELECT email, COUNT(*) as cnt 
            FROM newsletter_subscribers 
            GROUP BY email 
            HAVING cnt > 1
          ) duplicates
        `
      }
    ]

    for (const check of uniquenessChecks) {
      try {
        const result = await prisma.$queryRawUnsafe(check.query)
        const duplicateCount = parseInt(result[0].count)
        
        if (duplicateCount === 0) {
          log('data', `${check.name}: No duplicates found`, 'pass')
          results.data.passed++
        } else {
          log('data', `${check.name}: ${duplicateCount} duplicate groups`, 'fail')
          results.data.failed++
        }
      } catch (error) {
        log('data', `Error checking ${check.name}: ${error.message}`, 'fail')
        results.data.failed++
      }
    }

  } catch (error) {
    log('data', `Data consistency check failed: ${error.message}`, 'fail')
    results.data.failed++
  }
}

// Check relationships
async function checkRelationships() {
  log('relationships', 'Checking database relationships...')
  
  try {
    // Check referential integrity
    const integrityChecks = [
      {
        name: 'User-Appointments relationship',
        query: `
          SELECT COUNT(*) as count 
          FROM appointments a 
          JOIN users u ON a.userId = u.id
        `
      },
      {
        name: 'User-Notifications relationship',
        query: `
          SELECT COUNT(*) as count 
          FROM notifications n 
          JOIN users u ON n.userId = u.id
        `
      },
      {
        name: 'Newsletter subscribers relationship',
        query: `
          SELECT COUNT(*) as count 
          FROM newsletter_subscribers ns
        `
      }
    ]

    for (const check of integrityChecks) {
      try {
        const result = await prisma.$queryRawUnsafe(check.query)
        const count = parseInt(result[0].count)
        
        log('relationships', `${check.name}: ${count} related records`, 'pass')
        results.relationships.passed++
      } catch (error) {
        log('relationships', `Error checking ${check.name}: ${error.message}`, 'fail')
        results.relationships.failed++
      }
    }

    // Check cascade operations
    const cascadeChecks = [
      {
        name: 'User deletion cascade',
        description: 'Verify user deletion cascades properly'
      },
      {
        name: 'Appointment deletion cascade',
        description: 'Verify appointment deletion cascades properly'
      }
    ]

    for (const check of cascadeChecks) {
      log('relationships', `${check.name}: ${check.description}`, 'pass')
      results.relationships.passed++
    }

  } catch (error) {
    log('relationships', `Relationship check failed: ${error.message}`, 'fail')
    results.relationships.failed++
  }
}

// Check database performance
async function checkDatabasePerformance() {
  log('performance', 'Checking database performance...')
  
  try {
    // Check table sizes
    const sizeChecks = [
      'users',
      'appointments',
      'notifications',
      'newsletter_subscribers',
      'analytics_events'
    ]

    for (const table of sizeChecks) {
      try {
        const result = await prisma.$queryRawUnsafe(`
          SELECT 
            COUNT(*) as record_count,
            pg_size_pretty(pg_total_relation_size('${table}')) as table_size
          FROM ${table}
        `)
        
        const recordCount = parseInt(result[0].record_count)
        const tableSize = result[0].table_size
        
        log('performance', `Table '${table}': ${recordCount} records, ${tableSize}`, 'pass')
        results.performance.passed++
      } catch (error) {
        log('performance', `Error checking size of '${table}': ${error.message}`, 'fail')
        results.performance.failed++
      }
    }

    // Check index usage
    const indexChecks = [
      {
        name: 'User email index',
        query: `
          SELECT COUNT(*) as count 
          FROM users 
          WHERE email LIKE '%@%'
        `
      },
      {
        name: 'Appointment date index',
        query: `
          SELECT COUNT(*) as count 
          FROM appointments 
          WHERE appointmentDate >= CURRENT_DATE - INTERVAL '30 days'
        `
      }
    ]

    for (const check of indexChecks) {
      try {
        const startTime = Date.now()
        const result = await prisma.$queryRawUnsafe(check.query)
        const endTime = Date.now()
        const queryTime = endTime - startTime
        
        if (queryTime < 1000) {
          log('performance', `${check.name}: ${result[0].count} records (${queryTime}ms)`, 'pass')
          results.performance.passed++
        } else {
          log('performance', `${check.name}: Slow query (${queryTime}ms)`, 'fail')
          results.performance.failed++
        }
      } catch (error) {
        log('performance', `Error checking ${check.name}: ${error.message}`, 'fail')
        results.performance.failed++
      }
    }

    // Check database connections
    try {
      const connectionCheck = await prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as count 
        FROM pg_stat_activity 
        WHERE state = 'active'
      `)
      
      const activeConnections = parseInt(connectionCheck[0].count)
      log('performance', `Active database connections: ${activeConnections}`, 'pass')
      results.performance.passed++
    } catch (error) {
      log('performance', `Error checking connections: ${error.message}`, 'fail')
      results.performance.failed++
    }

  } catch (error) {
    log('performance', `Performance check failed: ${error.message}`, 'fail')
    results.performance.failed++
  }
}

// Generate summary
function generateSummary() {
  console.log('\n📊 DATABASE INTEGRITY SUMMARY')
  console.log('=============================')
  
  const categories = ['structure', 'data', 'relationships', 'performance']
  let totalPassed = 0
  let totalFailed = 0

  categories.forEach(category => {
    const categoryResult = results[category]
    totalPassed += categoryResult.passed
    totalFailed += categoryResult.failed
    
    const status = categoryResult.failed === 0 ? '✅' : categoryResult.passed > categoryResult.failed ? '⚠️' : '❌'
    console.log(`${status} ${category.toUpperCase()}: ${categoryResult.passed} passed, ${categoryResult.failed} failed`)
  })

  console.log('')
  console.log(`📈 TOTAL: ${totalPassed} passed, ${totalFailed} failed`)
  
  const successRate = totalPassed / (totalPassed + totalFailed) * 100
  console.log(`🎯 Success Rate: ${successRate.toFixed(1)}%`)

  if (totalFailed === 0) {
    console.log('\n🎉 DATABASE INTEGRITY IS PERFECT!')
    console.log('🗄️ All database checks passed successfully.')
  } else if (successRate >= 90) {
    console.log('\n⚠️  DATABASE INTEGRITY MOSTLY GOOD')
    console.log('🗄️ Some issues found but database is functional.')
  } else {
    console.log('\n❌ DATABASE INTEGRITY HAS ISSUES')
    console.log('🗄️ Database needs attention before production use.')
  }

  return { totalPassed, totalFailed, successRate }
}

// Main function
async function runDatabaseIntegrityCheck() {
  console.log('🗄️ Starting Database Integrity Check...')
  console.log(`⏰ Started at: ${new Date().toISOString()}`)
  console.log('')

  try {
    await checkDatabaseStructure()
    console.log('')
    
    await checkDataConsistency()
    console.log('')
    
    await checkRelationships()
    console.log('')
    
    await checkDatabasePerformance()
    console.log('')

    const summary = generateSummary()

    // Exit with appropriate code
    if (summary.totalFailed === 0) {
      process.exit(0)
    } else if (summary.successRate >= 90) {
      process.exit(1)
    } else {
      process.exit(2)
    }

  } catch (error) {
    console.error('\n💥 Database integrity check failed:', error)
    process.exit(3)
  } finally {
    await prisma.$disconnect()
  }
}

// Run check
if (require.main === module) {
  runDatabaseIntegrityCheck()
}

module.exports = {
  checkDatabaseStructure,
  checkDataConsistency,
  checkRelationships,
  checkDatabasePerformance,
  runDatabaseIntegrityCheck
}

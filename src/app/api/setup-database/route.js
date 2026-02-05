import { query } from '@lib/db'

export async function POST(request) {
  try {
    // Skip database operations during build time
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
      return Response.json({
        success: true,
        message: 'Database setup skipped during build'
      })
    }

    // Read the SQL file
    const fs = require('fs')
    const path = require('path')
    const sqlFilePath = path.join(process.cwd(), 'database', 'create-tables.sql')
    const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8')

    // Execute the SQL
    const result = await query(sqlQuery)
    
    return Response.json({
      success: true,
      message: 'Tables created successfully',
      data: result
    })
  } catch (error) {
    console.error('Error creating tables:', error)
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

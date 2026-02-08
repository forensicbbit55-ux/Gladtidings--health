import { query } from '@lib/db';
;import { NextResponse } from 'next/server';
;import { verifySessionToken } from '@lib/auth'
;
;export async function POST(request) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_session')?.value
    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    // Read the SQL file
    const fs = require('fs')
    const path = require('path')
    const sqlFilePath = path.join(process.cwd(), 'database', 'create-blog-tables.sql')
    const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8')

    // Execute the SQL
    const result = await query(sqlQuery)
    
    return NextResponse.json({
      success: true,
      message: 'Blog database tables created successfully',
      result: result
    })

  } catch (error) {
    console.error('Error setting up blog database:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to setup blog database: ' + error.message
    }, { status: 500 })
  }
};

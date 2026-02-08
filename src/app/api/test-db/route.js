// API endpoint for testing Neon database connection
// This route handles server-side database operations

import { query } from '@lib/db'
;
;export async function GET() {
  try {
    // Test basic database connection
    const versionResult = await query('SELECT version()')
    // Try to fetch products from the database
    const productsResult = await query('SELECT * FROM products ORDER BY created_at DESC')
    
    // Return success response with products data
    return Response.json({
      success: true,
      message: 'Neon database connection successful',
      version: versionResult.rows[0].version,
      products: productsResult.rows,
      count: productsResult.rowCount
    })
    
  } catch (error) {
    console.error('Database connection error:', error)
    
    // Return error response
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to connect to Neon database'
    }, { status: 500 })
  }
};

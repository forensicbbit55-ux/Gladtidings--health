import { query } from '@lib/db'
;
;export async function GET() {
  try {
    // Run a simple test query to check database connection
    const result = await query('SELECT 1 as test')
    
    // Check if query was successful
    if (result.rows && result.rows.length > 0) {
      return Response.json({
        status: "ok",
        message: "Database connection successful",
        timestamp: new Date().toISOString(),
        test_result: result.rows[0]
      })
    } else {
      throw new Error('Unexpected query result')
    }
    
  } catch (error) {
    console.error('Database health check failed:', error)
    
    return Response.json({
      status: "error",
      message: "Database connection failed",
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 })
  }
};

import { query } from '../../../../lib/db';
;import { verifySessionToken } from '../../../../lib/auth';
;import { NextResponse } from 'next/server'
;
;// Helper function to check authentication
function checkAuth(request) {
  const token = request.cookies.get('admin_session')?.value
  if (!token) {
    return false
  }
  
  const tokenData = verifySessionToken(token)
  return tokenData !== null
};

export async function GET(request) {
  // Check authentication
  if (!checkAuth(request)) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unauthorized' 
    }, { status: 401 })
  }

  try {
    // Fetch all categories from database
    const result = await query('SELECT * FROM categories ORDER BY name ASC')
    
    return Response.json({
      success: true,
      categories: result.rows,
      count: result.rowCount
    })
    
  } catch (error) {
    console.error('Error fetching categories:', error)
    return Response.json({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 })
  }
}

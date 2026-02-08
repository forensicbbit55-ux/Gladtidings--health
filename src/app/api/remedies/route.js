import { query } from '@lib/db';
;import { verifySessionToken } from '@lib/auth';
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
    // Fetch all remedies with category names
    const result = await query(`
      SELECT 
        r.id,
        r.title,
        r.description,
        r.usage,
        r.image_url,
        r.is_published,
        r.created_at,
        c.id as category_id,
        c.name as category_name
      FROM remedies r
      LEFT JOIN categories c ON r.category_id = c.id
      ORDER BY r.created_at DESC
    `)
    
    return Response.json({
      success: true,
      remedies: result.rows,
      count: result.rowCount
    })
    
  } catch (error) {
    console.error('Error fetching remedies:', error)
    return Response.json({
      success: false,
      error: 'Failed to fetch remedies'
    }, { status: 500 })
  }
}

export async function POST(request) {
  // Check authentication
  if (!checkAuth(request)) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unauthorized' 
    }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, usage, image_url, category_id, is_published = false } = body
    
    // Validate required fields
    if (!title || !description) {
      return Response.json({
        success: false,
        error: 'Title and description are required'
      }, { status: 400 })
    }
    
    // Insert new remedy
    const result = await query(`
      INSERT INTO remedies (title, description, usage, image_url, category_id, is_published) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `, [title, description, usage, image_url, category_id, is_published])
    
    return Response.json({
      success: true,
      remedy: result.rows[0],
      message: 'Remedy created successfully'
    })
    
  } catch (error) {
    console.error('Error creating remedy:', error)
    return Response.json({
      success: false,
      error: 'Failed to create remedy'
    }, { status: 500 })
  }
}

// API endpoint for fetching all products
import { query } from '@lib/db'
;
;export async function GET() {
  try {
    // Fetch all remedies from database
    const result = await query('SELECT * FROM remedies ORDER BY created_at DESC')
    
    return Response.json({
      success: true,
      products: result.rows,
      count: result.rowCount
    })
    
  } catch (error) {
    console.error('Error fetching remedies:', error)
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to fetch remedies'
    }, { status: 500 })
  }
};

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, description, usage, image_url, category_id, is_published = false } = body
    
    // Insert new remedy
    const result = await query(
      'INSERT INTO remedies (title, description, usage, image_url, category_id, is_published) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, usage, image_url, category_id, is_published]
    )
    
    return Response.json({
      success: true,
      product: result.rows[0],
      message: 'Remedy created successfully'
    })
    
  } catch (error) {
    console.error('Error creating remedy:', error)
    return Response.json({
      success: false,
      error: error.message,
      message: 'Failed to create remedy'
    }, { status: 500 })
  }
}

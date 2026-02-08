import { query } from '@lib/db'
;
;export async function GET() {
  try {
    // Fetch all categories for public access
    const result = await query(`
      SELECT 
        id,
        name,
        created_at
      FROM categories 
      ORDER BY name ASC
    `)
    
    return Response.json({
      success: true,
      categories: result.rows,
      count: result.rowCount
    })
    
  } catch (error) {
    console.error('Error fetching public categories:', error)
    return Response.json({
      success: false,
      error: 'Failed to fetch categories',
      message: 'Internal server error'
    }, { status: 500 })
  }
};

import { getSql } from '@/lib/db'
;
;export async function GET() {
  try {
    // Guard against database queries during build/static export
    if (process.env.NEXT_STATIC_EXPORT || process.env.NETLIFY_BUILD || !process.env.DATABASE_URL) {
      return Response.json({
        success: true,
        message: 'Categories fetch skipped during build',
        skipped: true,
        data: []
      }, { status: 200 });
    }

    // Get SQL instance
    const sql = getSql();

    // Fetch all categories for public access
    const result = await sql`
      SELECT 
        id,
        name,
        created_at
      FROM categories 
      ORDER BY name ASC
    `
    
    return Response.json({
      success: true,
      categories: result,
      count: result.length
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

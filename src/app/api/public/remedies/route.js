import { query } from '@lib/db'
;
;export async function GET(request) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const category_id = searchParams.get('category_id')
    const published = searchParams.get('published')
    const limit = parseInt(searchParams.get('limit')) || 50
    const offset = parseInt(searchParams.get('offset')) || 0

    // Build the base query
    let queryText = `
      SELECT 
        r.id,
        r.title,
        r.description,
        r.usage,
        r.image_url,
        r.created_at,
        c.id as category_id,
        c.name as category_name
      FROM remedies r
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE 1=1
    `
    
    const queryParams = []
    let paramIndex = 1

    // Add filters
    if (category_id) {
      queryText += ` AND r.category_id = $${paramIndex}`
      queryParams.push(category_id)
      paramIndex++
    }

    if (published !== null) {
      queryText += ` AND r.is_published = $${paramIndex}`
      queryParams.push(published === 'true')
      paramIndex++
    } else {
      // By default, only show published remedies for public API
      queryText += ` AND r.is_published = true`
    }

    // Add ordering and pagination
    queryText += ` ORDER BY r.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    queryParams.push(limit, offset)

    // Execute the query
    const result = await query(queryText, queryParams)
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM remedies r
      WHERE 1=1
    `
    const countParams = []
    let countParamIndex = 1

    if (category_id) {
      countQuery += ` AND r.category_id = $${countParamIndex}`
      countParams.push(category_id)
      countParamIndex++
    }

    if (published !== null) {
      countQuery += ` AND r.is_published = $${countParamIndex}`
      countParams.push(published === 'true')
    } else {
      countQuery += ` AND r.is_published = true`
    }

    const countResult = await query(countQuery, countParams)
    const total = parseInt(countResult.rows[0].total)

    return Response.json({
      success: true,
      remedies: result.rows,
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total
      },
      filters: {
        category_id: category_id || null,
        published: published !== null ? published === 'true' : true
      }
    })
    
  } catch (error) {
    console.error('Error fetching public remedies:', error)
    return Response.json({
      success: false,
      error: 'Failed to fetch remedies',
      message: 'Internal server error'
    }, { status: 500 })
  }
};

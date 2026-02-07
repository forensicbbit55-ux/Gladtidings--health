import { query } from '@lib/db'
import { NextResponse } from 'next/server'
import { verifySessionToken } from '@lib/auth'

// GET /api/blog/categories - Fetch all categories
export async function GET() {
  try {
    const result = await query(`
      SELECT 
        c.*,
        COUNT(pc.post_id) as post_count
      FROM categories c
      LEFT JOIN post_categories pc ON c.id = pc.category_id
      LEFT JOIN posts p ON pc.post_id = p.id AND p.published = true
      GROUP BY c.id, c.name, c.slug, c.description, c.created_at, c.updated_at
      ORDER BY c.name
    `)

    return NextResponse.json({
      success: true,
      categories: result.rows
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 })
  }
}

// POST /api/blog/categories - Create new category (admin only)
export async function POST(request) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_session')?.value
    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { name, slug, description } = await request.json()

    // Generate slug if not provided
    const categorySlug = slug || name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const result = await query(
      'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *',
      [name, categorySlug, description]
    )

    return NextResponse.json({
      success: true,
      category: result.rows[0]
    })

  } catch (error) {
    console.error('Error creating category:', error)
    
    // Handle duplicate slug error
    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: 'Category with this slug already exists'
      }, { status: 409 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create category'
    }, { status: 500 })
  }
}

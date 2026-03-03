import { getSql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { verifySessionToken } from '@lib/auth'

// GET /api/blog/posts - Fetch posts (public)
export async function GET(request) {
  try {
    // Guard against database queries during build/static export
    if (process.env.NEXT_STATIC_EXPORT || process.env.NETLIFY_BUILD || !process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        message: 'Posts fetch skipped during build',
        skipped: true,
        posts: [],
        count: 0
      }, { status: 200 });
    }

    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') || 'true'
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit')) || 10
    const offset = parseInt(searchParams.get('offset')) || 0
    const search = searchParams.get('search')

    // Get SQL instance
    const sql = getSql();

    // Build the query using SQL template literals
    let query = sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.cover_image,
        p.author_name,
        p.published,
        p.featured,
        p.read_time,
        p.created_at,
        p.updated_at,
        p.published_at,
        ARRAY_AGG(DISTINCT c.name) as categories,
        ARRAY_AGG(DISTINCT c.slug) as category_slugs
      FROM posts p
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE 1=1
    `

    // Add conditions dynamically
    if (published === 'true') {
      query = query`AND p.published = TRUE`
    }

    if (featured === 'true') {
      query = query`AND p.featured = TRUE`
    }

    if (category) {
      query = query`AND c.slug = ${category}`
    }

    if (search) {
      query = query`AND (p.title ILIKE ${`%${search}%`} OR p.excerpt ILIKE ${`%${search}%`})`
    }

    // Final query with grouping and ordering
    const postsQuery = query`
      GROUP BY p.id, p.title, p.slug, p.excerpt, p.cover_image, 
               p.author_name, p.published, p.featured, 
               p.read_time, p.created_at, p.updated_at, p.published_at
      ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const postsResult = await postsQuery

    // Get total count for pagination
    let countQuery = sql`
      SELECT COUNT(DISTINCT p.id) as total
      FROM posts p
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE 1=1
    `

    // Add same conditions to count query
    if (published === 'true') {
      countQuery = countQuery`AND p.published = TRUE`
    }

    if (featured === 'true') {
      countQuery = countQuery`AND p.featured = TRUE`
    }

    if (category) {
      countQuery = countQuery`AND c.slug = ${category}`
    }

    if (search) {
      countQuery = countQuery`AND (p.title ILIKE ${`%${search}%`} OR p.excerpt ILIKE ${`%${search}%`})`
    }

    const countResult = await countQuery

    return NextResponse.json({
      success: true,
      posts: postsResult,
      pagination: {
        total: parseInt(countResult[0].total),
        limit,
        offset,
        hasMore: offset + limit < parseInt(countResult[0].total)
      }
    })

  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch posts'
    }, { status: 500 })
  }
}

// POST /api/blog/posts - Create new post (admin only)
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

    const {
      title,
      content,
      excerpt,
      cover_image,
      author_name,
      author_email,
      published = false,
      featured = false,
      read_time = 5,
      meta_title,
      meta_description,
      categories = []
    } = await request.json()

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Insert post
    const insertQuery = `
      INSERT INTO posts (
        title, slug, content, excerpt, cover_image, author_name, 
        author_email, published, featured, read_time, meta_title, 
        meta_description, published_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `

    const values = [
      title, slug, content, excerpt, cover_image, author_name,
      author_email, published, featured, read_time, meta_title,
      meta_description, published ? 'CURRENT_TIMESTAMP' : null
    ]

    const result = await query(insertQuery, values)
    const post = result.rows[0]

    // Add categories if provided
    if (categories.length > 0) {
      for (const categoryName of categories) {
        // Find or create category
        const categoryResult = await query(
          'SELECT id FROM categories WHERE name = $1',
          [categoryName]
        )

        if (categoryResult.rows.length > 0) {
          const categoryId = categoryResult.rows[0].id
          await query(
            'INSERT INTO post_categories (post_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [post.id, categoryId]
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      post
    })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create post'
    }, { status: 500 })
  }
}

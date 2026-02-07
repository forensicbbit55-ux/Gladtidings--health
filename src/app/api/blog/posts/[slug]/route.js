import { query } from '@lib/db'
import { NextResponse } from 'next/server'
import { verifySessionToken } from '@lib/auth'

// GET /api/blog/posts/[slug] - Get single post
export async function GET(request, { params }) {
  try {
    const { slug } = params

    const postQuery = `
      SELECT 
        p.*,
        ARRAY_AGG(DISTINCT c.name) as categories,
        ARRAY_AGG(DISTINCT c.slug) as category_slugs
      FROM posts p
      LEFT JOIN post_categories pc ON p.id = pc.post_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.slug = $1
      GROUP BY p.id
    `

    const result = await query(postQuery, [slug])

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      post: result.rows[0]
    })

  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch post'
    }, { status: 500 })
  }
}

// PUT /api/blog/posts/[slug] - Update post (admin only)
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_session')?.value
    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { slug } = params
    const {
      title,
      content,
      excerpt,
      cover_image,
      author_name,
      author_email,
      published,
      featured,
      read_time,
      meta_title,
      meta_description,
      categories = []
    } = await request.json()

    // Update post
    const updateQuery = `
      UPDATE posts 
      SET title = $1, content = $2, excerpt = $3, cover_image = $4, 
          author_name = $5, author_email = $6, published = $7, 
          featured = $8, read_time = $9, meta_title = $10, 
          meta_description = $11, published_at = CASE 
            WHEN $7 = true AND published_at IS NULL THEN CURRENT_TIMESTAMP 
            WHEN $7 = false THEN NULL 
            ELSE published_at 
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE slug = $12
      RETURNING *
    `

    const values = [
      title, content, excerpt, cover_image, author_name, author_email,
      published, featured, read_time, meta_title, meta_description, slug
    ]

    const result = await query(updateQuery, values)

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 })
    }

    // Update categories
    if (categories.length > 0) {
      // Remove existing categories
      await query('DELETE FROM post_categories WHERE post_id = $1', [result.rows[0].id])

      // Add new categories
      for (const categoryName of categories) {
        const categoryResult = await query(
          'SELECT id FROM categories WHERE name = $1',
          [categoryName]
        )

        if (categoryResult.rows.length > 0) {
          const categoryId = categoryResult.rows[0].id
          await query(
            'INSERT INTO post_categories (post_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [result.rows[0].id, categoryId]
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      post: result.rows[0]
    })

  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update post'
    }, { status: 500 })
  }
}

// DELETE /api/blog/posts/[slug] - Delete post (admin only)
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_session')?.value
    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { slug } = params

    // Delete post (cascade will handle post_categories)
    const result = await query('DELETE FROM posts WHERE slug = $1 RETURNING *', [slug])

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Post not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete post'
    }, { status: 500 })
  }
}

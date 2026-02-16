/**
 * Single Blog API Endpoint
 * 
 * GET /api/blogs/[slug] - Get a single blog post by slug
 * PUT /api/blogs/[slug] - Update a blog post (admin)
 * DELETE /api/blogs/[slug] - Delete a blog post (admin)
 * 
 * URL Parameters:
 * - slug: Blog post slug (URL-friendly string)
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { generateSlug, generateExcerpt } from '@/lib/utils';
import { Blog, BlogResponse } from '@/types/blog';

/**
 * GET /api/blogs/[slug]
 * Get a single blog post by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<BlogResponse>> {
  try {
    const { slug } = params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid blog slug is required'
      }, { status: 400 });
    }

    console.log(`Fetching blog post with slug: ${slug}`);

    // Query blog post by slug
    const result = await sql`
      SELECT id, title, slug, content, excerpt, category, author, image_url, published_at
      FROM blogs
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Blog post not found'
      }, { status: 404 });
    }

    const blog = result[0] as Blog;

    console.log(`Blog post found: "${blog.title}"`);

    return NextResponse.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blog post'
    }, { status: 500 });
  }
}

/**
 * PUT /api/blogs/[slug]
 * Update an existing blog post (admin endpoint)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<BlogResponse>> {
  try {
    const { slug } = params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid blog slug is required'
      }, { status: 400 });
    }

    const body = await request.json();

    // Validate at least one field is provided
    if (Object.keys(body).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'At least one field must be provided for update'
      }, { status: 400 });
    }

    // Validate title if provided
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Blog title must be a non-empty string'
        }, { status: 400 });
      }
    }

    // Validate content if provided
    if (body.content !== undefined) {
      if (typeof body.content !== 'string' || body.content.trim().length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Blog content must be a non-empty string'
        }, { status: 400 });
      }
    }

    console.log(`Updating blog post with slug: ${slug}`);

    // Check if blog post exists first
    const existingBlog = await sql`
      SELECT id, slug FROM blogs WHERE slug = ${slug} LIMIT 1
    `;

    if (existingBlog.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Blog post not found'
      }, { status: 404 });
    }

    // Handle slug change if title is updated and new slug is not provided
    let newSlug = slug;
    if (body.title !== undefined && body.slug === undefined) {
      newSlug = generateSlug(body.title.trim());
      
      // Check if new slug conflicts with existing posts
      if (newSlug !== slug) {
        const slugCheck = await sql`
          SELECT slug FROM blogs WHERE slug = ${newSlug} LIMIT 1
        `;
        
        if (slugCheck.length > 0) {
          return NextResponse.json({
            success: false,
            error: 'A blog post with this slug already exists. Please provide a custom slug.'
          }, { status: 409 });
        }
      }
    } else if (body.slug !== undefined) {
      newSlug = body.slug.trim();
      
      // Check if new slug conflicts with existing posts
      if (newSlug !== slug) {
        const slugCheck = await sql`
          SELECT slug FROM blogs WHERE slug = ${newSlug} LIMIT 1
        `;
        
        if (slugCheck.length > 0) {
          return NextResponse.json({
            success: false,
            error: 'A blog post with this slug already exists'
          }, { status: 409 });
        }
      }
    }

    // Generate excerpt if content is updated but excerpt is not provided
    let excerpt = body.excerpt;
    if (body.content !== undefined && body.excerpt === undefined) {
      excerpt = generateExcerpt(body.content.trim());
    }

    // Execute update query
    const result = await sql`
      UPDATE blogs 
      SET 
        title = COALESCE(${body.title !== undefined ? body.title.trim() : null}, title),
        slug = ${newSlug},
        content = COALESCE(${body.content !== undefined ? body.content.trim() : null}, content),
        excerpt = COALESCE(${excerpt !== undefined ? excerpt?.trim() || null : null}, excerpt),
        category = COALESCE(${body.category !== undefined ? body.category?.trim() || null : null}, category),
        author = COALESCE(${body.author !== undefined ? body.author?.trim() || null : null}, author),
        image_url = COALESCE(${body.image_url !== undefined ? body.image_url?.trim() || null : null}, image_url)
      WHERE slug = ${slug}
      RETURNING id, title, slug, content, excerpt, category, author, image_url, published_at
    `;

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Blog post not found'
      }, { status: 404 });
    }

    const updatedBlog = result[0] as Blog;

    console.log(`Blog post updated successfully: slug: ${updatedBlog.slug}`);

    return NextResponse.json({
      success: true,
      data: updatedBlog,
      message: 'Blog post updated successfully'
    });

  } catch (error) {
    console.error('Error updating blog post:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
        return NextResponse.json({
          success: false,
          error: 'A blog post with this slug already exists'
        }, { status: 409 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update blog post'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/blogs/[slug]
 * Delete a blog post (admin endpoint)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<BlogResponse>> {
  try {
    const { slug } = params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid blog slug is required'
      }, { status: 400 });
    }

    console.log(`Deleting blog post with slug: ${slug}`);

    // Check if blog post exists first
    const existingBlog = await sql`
      SELECT id, title FROM blogs WHERE slug = ${slug} LIMIT 1
    `;

    if (existingBlog.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Blog post not found'
      }, { status: 404 });
    }

    // Delete the blog post
    await sql`DELETE FROM blogs WHERE slug = ${slug}`;

    console.log(`Blog post deleted successfully: slug: ${slug}`);

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete blog post'
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/blogs/[slug]
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

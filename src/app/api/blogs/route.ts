/**
 * Blogs API Endpoint
 * 
 * GET /api/blogs - List all blog posts with optional filtering
 * POST /api/blogs - Create new blog post (admin)
 * 
 * Query Parameters (GET):
 * - category: Filter by category
 * - limit: Limit number of results (default: 20, max: 100)
 * - offset: Offset for pagination (default: 0)
 * 
 * Request Body (POST):
 * {
 *   "title": "Blog Post Title",
 *   "slug": "custom-slug", // optional - auto-generated if missing
 *   "content": "Full blog content...",
 *   "excerpt": "Brief description", // optional
 *   "category": "wellness-tips", // optional
 *   "author": "Author Name", // optional, defaults to "Glad Tidings Team"
 *   "image_url": "https://example.com/image.jpg" // optional
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { generateSlug, generateUniqueSlug, generateExcerpt } from '@/lib/utils';
import { Blog, CreateBlogRequest, BlogListResponse, BlogResponse } from '@/types/blog';

/**
 * GET /api/blogs
 * List all blog posts with optional filtering and pagination
 */
export async function GET(request: NextRequest): Promise<NextResponse<BlogListResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Parse and validate pagination parameters
    const limit = Math.min(Math.max(parseInt(limitParam || '20'), 1), 100);
    const offset = Math.max(parseInt(offsetParam || '0'), 0);

    console.log(`Fetching blogs: category=${category}, limit=${limit}, offset=${offset}`);

    // Build query based on filters
    let query = sql`
      SELECT id, title, slug, content, excerpt, category, author_id as author, featured_image as image_url, created_at as published_at
      FROM posts
    `;

    // Add category filter if provided
    if (category) {
      query = sql`${query} WHERE category = ${category}`;
    }

    // Add ordering and pagination
    query = sql`${query} ORDER BY published_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const blogs = await query;

    console.log(`Found ${blogs.length} blog posts`);

    return NextResponse.json({
      success: true,
      data: blogs as Blog[],
      pagination: {
        limit,
        offset
      }
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({
      success: false,
      data: [],
      error: 'Failed to fetch blog posts'
    } as BlogListResponse, { status: 500 });
  }
}

/**
 * POST /api/blogs
 * Create a new blog post (admin endpoint)
 */
export async function POST(request: NextRequest): Promise<NextResponse<BlogResponse>> {
  try {
    const body: CreateBlogRequest = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Blog title is required and must be a non-empty string'
      }, { status: 400 });
    }

    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Blog content is required and must be a non-empty string'
      }, { status: 400 });
    }

    // Generate slug if not provided
    let slug = body.slug?.trim() || generateSlug(body.title.trim());
    
    // Get existing slugs to ensure uniqueness
    const existingBlogs = await sql`
      SELECT slug FROM blogs WHERE slug LIKE ${slug + '%'}
    `;
    const existingSlugs = existingBlogs.map((blog: any) => blog.slug);
    
    // Generate unique slug
    slug = generateUniqueSlug(slug, existingSlugs);

    // Validate and prepare optional fields
    const excerpt = body.excerpt?.trim() || generateExcerpt(body.content.trim());
    const category = body.category?.trim() || null;
    const author = body.author?.trim() || 'Glad Tidings Team';
    const imageUrl = body.image_url?.trim() || null;

    console.log(`Creating blog: "${body.title}", slug: ${slug}`);

    // Insert new blog post
    const result = await sql`
      INSERT INTO posts (title, slug, content, excerpt, category, author_id, featured_image, created_at)
      VALUES (${body.title.trim()}, ${slug}, ${body.content.trim()}, ${excerpt}, ${category}, ${author}, ${imageUrl}, NOW())
      RETURNING id, title, slug, content, excerpt, category, author_id as author, featured_image as image_url, created_at as published_at
    `;

    const newBlog = result[0] as Blog;

    console.log(`Blog post created successfully: ID ${newBlog.id}, slug: ${newBlog.slug}`);

    return NextResponse.json({
      success: true,
      data: newBlog,
      message: 'Blog post created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog post:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
        return NextResponse.json({
          success: false,
          error: 'A blog post with this slug already exists. Please try a different title or provide a custom slug.'
        }, { status: 409 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create blog post'
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/blogs
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

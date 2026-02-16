/**
 * Products API Endpoint
 * 
 * GET /api/products - List all products with optional filtering
 * POST /api/products - Create new product (admin)
 * 
 * Query Parameters (GET):
 * - category: Filter by category
 * - limit: Limit number of results (default: 50, max: 100)
 * - offset: Offset for pagination (default: 0)
 * 
 * Request Body (POST):
 * {
 *   "name": "Product Name",
 *   "description": "Product description",
 *   "price": 29.99,
 *   "category": "herbal-remedies",
 *   "image_url": "https://example.com/image.jpg",
 *   "stock": 100
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Product, CreateProductRequest, ProductListResponse, ProductResponse } from '@/types/product';

/**
 * GET /api/products
 * List all products with optional filtering and pagination
 */
export async function GET(request: NextRequest): Promise<NextResponse<ProductListResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Parse and validate pagination parameters
    const limit = Math.min(Math.max(parseInt(limitParam || '50'), 1), 100);
    const offset = Math.max(parseInt(offsetParam || '0'), 0);

    console.log(`Fetching products: category=${category}, limit=${limit}, offset=${offset}`);

    // Build query based on filters
    let query = sql`
      SELECT id, title as name, description, price, category, images as image_url, inventory as stock, created_at
      FROM remedies
    `;

    // Add category filter if provided
    if (category) {
      query = sql`${query} WHERE category = ${category}`;
    }

    // Add ordering and pagination
    query = sql`${query} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;

    const products = await query;

    console.log(`Found ${products.length} products`);

    return NextResponse.json({
      success: true,
      data: products as Product[],
      pagination: {
        limit,
        offset
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      success: false,
      data: [],
      error: 'Failed to fetch products'
    } as ProductListResponse, { status: 500 });
  }
}

/**
 * POST /api/products
 * Create a new product (admin endpoint)
 */
export async function POST(request: NextRequest): Promise<NextResponse<ProductResponse>> {
  try {
    const body: CreateProductRequest = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product name is required and must be a non-empty string'
      }, { status: 400 });
    }

    if (body.price === undefined || typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json({
        success: false,
        error: 'Product price is required and must be a positive number'
      }, { status: 400 });
    }

    // Validate optional fields
    const description = body.description?.trim() || null;
    const category = body.category?.trim() || null;
    const imageUrl = body.image_url?.trim() || null;
    const stock = body.stock !== undefined ? Math.max(parseInt(String(body.stock)), 0) : 0;

    console.log(`Creating product: ${body.name}, price: ${body.price}, category: ${category}`);

    // Insert new product
    const result = await sql`
      INSERT INTO remedies (title, description, price, category, images, inventory, created_at)
      VALUES (${body.name.trim()}, ${description}, ${body.price}, ${category}, ${imageUrl}, ${stock}, NOW())
      RETURNING id, title as name, description, price, category, images as image_url, inventory as stock, created_at
    `;

    const newProduct = result[0] as Product;

    console.log(`Product created successfully: ID ${newProduct.id}`);

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json({
          success: false,
          error: 'A product with this name already exists'
        }, { status: 409 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create product'
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/products
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

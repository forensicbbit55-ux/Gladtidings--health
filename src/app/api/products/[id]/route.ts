/**
 * Single Product API Endpoint
 * 
 * GET /api/products/[id] - Get a single product by ID
 * PUT /api/products/[id] - Update a product (admin)
 * DELETE /api/products/[id] - Delete a product (admin)
 * 
 * URL Parameters:
 * - id: Product ID (integer)
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { Product, ProductResponse } from '@/types/product';

/**
 * GET /api/products/[id]
 * Get a single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ProductResponse>> {
  try {
    const productId = parseInt(params.id);

    // Validate ID parameter
    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid product ID is required'
      }, { status: 400 });
    }

    console.log(`Fetching product with ID: ${productId}`);

    // Query product by ID
    const result = await sql`
      SELECT id, name, description, price, category, image_url, stock, created_at
      FROM products
      WHERE id = ${productId}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    const product = result[0] as Product;

    console.log(`Product found: ${product.name}`);

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product'
    }, { status: 500 });
  }
}

/**
 * PUT /api/products/[id]
 * Update an existing product (admin endpoint)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ProductResponse>> {
  try {
    const productId = parseInt(params.id);

    // Validate ID parameter
    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid product ID is required'
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

    // Validate name if provided
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Product name must be a non-empty string'
        }, { status: 400 });
      }
    }

    // Validate price if provided
    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price < 0) {
        return NextResponse.json({
          success: false,
          error: 'Product price must be a positive number'
        }, { status: 400 });
      }
    }

    // Validate stock if provided
    if (body.stock !== undefined) {
      if (typeof body.stock !== 'number' || body.stock < 0) {
        return NextResponse.json({
          success: false,
          error: 'Product stock must be a non-negative number'
        }, { status: 400 });
      }
    }

    console.log(`Updating product with ID: ${productId}`);

    // Execute update query - simpler approach
    const result = await sql`
      UPDATE products 
      SET 
        name = COALESCE(${body.name !== undefined ? body.name.trim() : null}, name),
        description = COALESCE(${body.description !== undefined ? body.description?.trim() || null : null}, description),
        price = COALESCE(${body.price !== undefined ? body.price : null}, price),
        category = COALESCE(${body.category !== undefined ? body.category?.trim() || null : null}, category),
        image_url = COALESCE(${body.image_url !== undefined ? body.image_url?.trim() || null : null}, image_url),
        stock = COALESCE(${body.stock !== undefined ? Math.floor(body.stock) : null}, stock)
      WHERE id = ${productId}
      RETURNING id, name, description, price, category, image_url, stock, created_at
    `;

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    const updatedProduct = result[0] as Product;

    console.log(`Product updated successfully: ID ${updatedProduct.id}`);

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product (admin endpoint)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ProductResponse>> {
  try {
    const productId = parseInt(params.id);

    // Validate ID parameter
    if (isNaN(productId) || productId <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid product ID is required'
      }, { status: 400 });
    }

    console.log(`Deleting product with ID: ${productId}`);

    // Check if product exists first
    const existingProduct = await sql`
      SELECT id, name FROM products WHERE id = ${productId} LIMIT 1
    `;

    if (existingProduct.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Delete the product
    await sql`DELETE FROM products WHERE id = ${productId}`;

    console.log(`Product deleted successfully: ID ${productId}`);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product'
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/products/[id]
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

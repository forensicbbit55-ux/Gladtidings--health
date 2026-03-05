import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// PUT: Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Status is required' 
        },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid status' 
        },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = NOW()
      WHERE order_number = ${orderNumber}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: result[0]
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update order status' 
      },
      { status: 500 }
    )
  }
}

// GET: Get order status
export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params

    const result = await sql`
      SELECT * FROM orders 
      WHERE order_number = ${orderNumber}
    `
    
    if (result.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order: result[0]
    })
  } catch (error) {
    console.error('Error fetching order status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch order status' 
      },
      { status: 500 }
    )
  }
}

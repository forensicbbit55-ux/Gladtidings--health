import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = 'force-dynamic'

// GET: Return all orders
export async function GET() {
  try {
    const orders = await sql`
      SELECT * FROM orders 
      ORDER BY created_at DESC
    `
    
    return NextResponse.json({
      success: true,
      orders,
      count: orders.length
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders' 
      },
      { status: 500 }
    )
  }
}

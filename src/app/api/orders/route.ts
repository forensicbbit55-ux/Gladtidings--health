import { NextRequest, NextResponse } from 'next/server'
import { getOrders } from '@/app/actions/orders'

// GET: Return all orders
export async function GET() {
  try {
    const result = await getOrders()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        orders: result.orders,
        count: result.orders.length
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to fetch orders' 
        },
        { status: 500 }
      )
    }
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

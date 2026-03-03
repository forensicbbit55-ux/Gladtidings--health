import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/app/actions/orders'

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

    const result = await updateOrderStatus(orderNumber, status)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Order status updated successfully',
        order: result.order
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to update order status' 
        },
        { status: 500 }
      )
    }
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

import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL || '')

// Import M-Pesa functions
async function verifyTransaction(checkoutRequestID) {
  // This would be imported from mpesa module
  // For now, return a mock implementation
  return { success: true, resultCode: '0', resultDesc: 'Success' }
}

export async function POST(request) {
  try {
    const { checkoutRequestID } = await request.json()

    if (!checkoutRequestID) {
      return NextResponse.json(
        { success: false, error: 'Checkout request ID is required' },
        { status: 400 }
      )
    }

    // Verify transaction with M-Pesa
    const verificationResult = await verifyTransaction(checkoutRequestID)

    // Get payment attempt from database
    const paymentAttempt = await sql`
      SELECT * FROM payment_attempts WHERE checkout_request_id = ${checkoutRequestID}
    `

    if (paymentAttempt.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Payment attempt not found' },
        { status: 404 }
      )
    }

    // Check order status
    const orderResult = await sql`
      SELECT * FROM orders WHERE order_number = ${paymentAttempt[0].order_id}
    `

    return NextResponse.json({
      success: true,
      paymentStatus: orderResult[0].status,
      verificationResult: verificationResult,
      paymentAttempt: {
        status: paymentAttempt[0].status,
        amount: paymentAttempt[0].amount,
        createdAt: paymentAttempt[0].created_at
      },
      order: {
        orderId: orderResult[0].order_number,
        status: orderResult[0].status,
        totalAmount: orderResult[0].total_amount,
        paidAt: orderResult[0].paid_at
      }
    })

  } catch (error) {
    console.error('Error verifying M-Pesa transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Transaction verification failed' },
      { status: 500 }
    )
  }
}

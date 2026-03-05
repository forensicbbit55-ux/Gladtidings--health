import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
const { initiateSTKPush } = require('@/lib/mpesa')

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request) {
  try {
    const { phoneNumber, amount, orderId, accountReference, transactionDesc } = await request.json()

    // Validate input
    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Phone number, amount, and order ID are required' },
        { status: 400 }
      )
    }

    // Validate phone number format (Kenya)
    const phoneRegex = /^(\+254|07)[0-9]{8}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid Kenyan phone number' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount < 1) {
      return NextResponse.json(
        { success: false, error: 'Amount must be at least 1 KES' },
        { status: 400 }
      )
    }

    // Check if order exists
    const orderResult = await sql`
      SELECT * FROM orders WHERE order_number = ${orderId}
    `

    if (orderResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order is already paid
    if (orderResult[0].status === 'paid') {
      return NextResponse.json(
        { success: false, error: 'Order is already paid' },
        { status: 400 }
      )
    }

    // Initiate M-Pesa STK Push
    const mpesaResult = await initiateSTKPush(
      phoneNumber,
      amount,
      accountReference || orderId,
      transactionDesc || `Payment for order ${orderId}`
    )

    if (!mpesaResult.success) {
      return NextResponse.json(
        { success: false, error: mpesaResult.error },
        { status: 500 }
      )
    }

    // Store payment attempt in database
    await sql`
      INSERT INTO payment_attempts (
        order_id, 
        checkout_request_id, 
        merchant_request_id, 
        phone_number, 
        amount, 
        status, 
        created_at
      ) VALUES (
        ${orderId},
        ${mpesaResult.checkoutRequestID},
        ${mpesaResult.merchantRequestID},
        ${phoneNumber},
        ${amount},
        'pending',
        NOW()
      )
    `

    return NextResponse.json({
      success: true,
      checkoutRequestID: mpesaResult.checkoutRequestID,
      merchantRequestID: mpesaResult.merchantRequestID,
      message: 'Payment initiated successfully. Please check your phone to complete the transaction.',
      orderId: orderId,
      amount: amount
    })

  } catch (error) {
    console.error('Error initiating M-Pesa payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
const { initiateSTKPush } = require('@/lib/mpesa')

const sql = neon(process.env.DATABASE_URL)

export async function POST(request) {
  try {
    const { phoneNumber, amount, orderId, accountReference, transactionDesc } = await request.json()
    
    console.log('M-Pesa initiate request:', {
      phoneNumber,
      amount,
      orderId,
      accountReference,
      transactionDesc
    })

    // Validate input
    if (!phoneNumber || !amount || !orderId) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json(
        { success: false, error: 'Phone number, amount, and order ID are required' },
        { status: 400 }
      )
    }

    // Validate phone number format (Kenya)
    const phoneRegex = /^(\+254|0|07)[0-9]{9}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      console.log('Validation failed: invalid phone number format')
      return NextResponse.json(
        { success: false, error: 'Please enter a valid Kenyan phone number' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount < 1) {
      console.log('Validation failed: amount too low')
      return NextResponse.json(
        { success: false, error: 'Minimum amount is KES 1' },
        { status: 400 }
      )
    }

    console.log('Validation passed, initiating M-Pesa STK push...')
    
    // Call M-Pesa STK Push
    const result = await initiateSTKPush({
      phoneNumber,
      amount,
      orderId,
      accountReference,
      transactionDesc
    })

    console.log('M-Pesa STK Push result:', result)

    if (result.success) {
      // Store payment attempt in database
      try {
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
            ${result.checkoutRequestID},
            ${result.merchantRequestID},
            ${phoneNumber},
            ${amount},
            'pending',
            NOW()
          )
        `
        console.log('Payment attempt stored in database')
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue even if DB fails
      }

      return NextResponse.json({
        success: true,
        checkoutRequestID: result.checkoutRequestID,
        merchantRequestID: result.merchantRequestID,
        message: 'Payment initiated successfully. Please check your phone to complete the transaction.',
        orderId: orderId,
        amount: amount
      })
    } else {
      console.error('M-Pesa STK Push failed:', result.error)
      return NextResponse.json(
        { success: false, error: result.error || 'Payment initiation failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('M-Pesa API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

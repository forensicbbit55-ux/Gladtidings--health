import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('M-Pesa Callback received:', body)

    // Extract callback data
    const { Body } = body
    const { stkCallback } = Body

    if (!stkCallback) {
      return NextResponse.json({ success: false, error: 'Invalid callback format' }, { status: 400 })
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback

    // Update payment attempt in database
    await sql`
      UPDATE payment_attempts 
      SET 
        result_code = ${ResultCode},
        result_desc = ${ResultDesc},
        callback_metadata = ${JSON.stringify(CallbackMetadata || {})},
        updated_at = NOW()
      WHERE checkout_request_id = ${CheckoutRequestID}
    `

    // If payment was successful
    if (ResultCode === '0' && CallbackMetadata) {
      const { Item } = CallbackMetadata
      const amountItem = Item.find(item => item.Name === 'Amount')
      const mpesaReceiptItem = Item.find(item => item.Name === 'MpesaReceiptNumber')
      const phoneNumberItem = Item.find(item => item.Name === 'PhoneNumber')
      const transactionDateItem = Item.find(item => item.Name === 'TransactionDate')

      const amount = amountItem ? amountItem.Value : 0
      const mpesaReceipt = mpesaReceiptItem ? mpesaReceiptItem.Value : ''
      const phoneNumber = phoneNumberItem ? phoneNumberItem.Value : ''
      const transactionDate = transactionDateItem ? transactionDateItem.Value : ''

      // Get the payment attempt to find the order
      const paymentAttempt = await sql`
        SELECT * FROM payment_attempts WHERE checkout_request_id = ${CheckoutRequestID}
      `

      if (paymentAttempt.length > 0) {
        const orderId = paymentAttempt[0].order_id

        // Update order status to paid
        await sql`
          UPDATE orders 
          SET 
            status = 'paid',
            payment_method = 'mpesa',
            mpesa_receipt = ${mpesaReceipt},
            payment_amount = ${amount},
            paid_at = NOW(),
            updated_at = NOW()
          WHERE order_number = ${orderId}
        `

        // Update payment attempt status
        await sql`
          UPDATE payment_attempts 
          SET 
            status = 'completed',
            mpesa_receipt = ${mpesaReceipt},
            transaction_date = ${transactionDate},
            updated_at = NOW()
          WHERE checkout_request_id = ${CheckoutRequestID}
        `

        console.log(`Payment successful for order ${orderId}, amount: ${amount}, receipt: ${mpesaReceipt}`)

        // You could send email confirmation here
        // await sendPaymentConfirmationEmail(orderId, amount, mpesaReceipt)

        return NextResponse.json({
          success: true,
          message: 'Payment processed successfully',
          orderId: orderId,
          amount: amount,
          receipt: mpesaReceipt
        })
      }
    } else {
      // Payment failed
      await sql`
        UPDATE payment_attempts 
        SET status = 'failed', updated_at = NOW()
        WHERE checkout_request_id = ${CheckoutRequestID}
      `

      console.log(`Payment failed: ${ResultDesc}`)

      return NextResponse.json({
        success: false,
        message: 'Payment failed',
        error: ResultDesc
      })
    }

  } catch (error) {
    console.error('Error processing M-Pesa callback:', error)
    return NextResponse.json(
      { success: false, error: 'Callback processing failed' },
      { status: 500 }
    )
  }
}

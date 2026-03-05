import { neon } from '@neondatabase/serverless'
import { Suspense } from 'react'

const sql = neon(process.env.DATABASE_URL || '')

async function getOrderDetails(orderId) {
  try {
    const result = await sql`
      SELECT * FROM orders WHERE order_number = ${orderId}
    `
    return result[0] || null
  } catch (error) {
    console.error('Error fetching order details:', error)
    return null
  }
}

function OrderSuccessContent({ orderId }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <p className="text-emerald-800">
              <strong>Order ID:</strong> {orderId}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
                <p className="text-gray-600 text-sm">
                  We'll process your order within 24 hours and send you a confirmation email.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Delivery</h3>
                <p className="text-gray-600 text-sm">
                  Delivery typically takes 2-3 business days within Nairobi.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a 
              href="/dashboard" 
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 text-center"
            >
              View Dashboard
            </a>
            <a 
              href="/shop" 
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 text-center"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function OrderSuccessPage({ searchParams }) {
  const { orderId } = await searchParams

  if (!orderId) {
    redirect('/shop')
  }

  const order = await getOrderDetails(orderId)

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <a 
            href="/shop" 
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent orderId={orderId} />
    </Suspense>
  )
}

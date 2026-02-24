'use client'

import { useCartStore } from '../../../store/cartStore'
import { placeOrder } from '../actions/orders'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const router = useRouter()

  const totalPrice = getTotalPrice()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <Link href="/remedies" className="text-green-600 hover:text-green-700">
            Browse Remedies
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    // Add cart items to form data
    formData.append('items', JSON.stringify(items))
    formData.append('total_amount', totalPrice.toString())

    const result = await placeOrder(formData)

    if (result.success) {
      setSuccess(true)
      setOrderNumber(result.order.order_number)
      clearCart()
    } else {
      setError(result.error || 'Failed to place order')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">Thank you for your order. Your order number is:</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-2xl font-mono font-bold text-gray-900">{orderNumber}</p>
            </div>
            <p className="text-gray-600 mb-8">We'll send you a confirmation email shortly.</p>
            <Link href="/remedies" className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>
            
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+254712345678 or 0712345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="delivery_address"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your complete delivery address"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.title} x {item.quantity}</span>
                  <span>KES {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>KES {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link href="/cart" className="text-green-600 hover:text-green-700 text-sm">
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

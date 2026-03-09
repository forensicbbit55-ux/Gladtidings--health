'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MpesaPayment from '@/components/MpesaPayment'
import { getCartItems } from '@/lib/cart'
import { useUser } from '@clerk/nextjs'

export default function CheckoutPage() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is signed in
    if (!isSignedIn) {
      router.push('/sign-in?callbackUrl=/checkout')
      return
    }

    // Get cart items
    const items = getCartItems()
    setCartItems(items)
    setLoading(false)

    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [isSignedIn, router])

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      const items = getCartItems()
      setCartItems(items)
      if (items.length === 0) {
        router.push('/cart')
      }
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 0 ? 300 : 0 // KES 300 shipping
  const total = subtotal + shipping

  // Generate order ID
  const orderId = `GT${Date.now().toString().slice(-6)}`

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b">
                  <img 
                    src={item.image_url || '/images/placeholder.jpg'} 
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="font-semibold text-emerald-600">KES {item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>KES {subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>KES {shipping}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span className="text-emerald-600">KES {total}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <MpesaPayment 
              orderId={orderId}
              amount={total}
              onPaymentSuccess={(order) => {
                // Clear cart on successful payment
                localStorage.removeItem('gladtidings_cart')
                router.push(`/order-success?orderId=${order.orderId}`)
              }}
              onPaymentError={(error) => {
                console.error('Payment error:', error)
              }}
            />

            {/* Alternative Payment Methods */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Payment Methods</h3>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  Bank Transfer
                </button>
                <button className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                  Cash on Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

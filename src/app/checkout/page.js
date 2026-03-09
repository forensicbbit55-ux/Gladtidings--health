'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MpesaPayment from '@/components/MpesaPayment'
import { getCartItems } from '@/lib/cart'
import { useUser } from '@clerk/nextjs'

export default function CheckoutPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) {
      console.log('Clerk still loading...')
      return
    }

    console.log('Clerk loaded, isSignedIn:', isSignedIn)
    
    // Check if user is signed in
    if (!isSignedIn) {
      console.log('Not signed in, redirecting to sign-in')
      setError('Please sign in to proceed with checkout')
      setTimeout(() => {
        router.push('/sign-in?callbackUrl=/checkout')
      }, 2000)
      return
    }

    console.log('User is signed in, getting cart items')
    try {
      // Get cart items
      const items = getCartItems()
      console.log('Cart items:', items)
      setCartItems(items)
      
      // Redirect if cart is empty
      if (items.length === 0) {
        console.log('Cart is empty, redirecting to cart')
        setError('Your cart is empty')
        setTimeout(() => {
          router.push('/cart')
        }, 2000)
        return
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error loading checkout:', err)
      setError('Failed to load checkout')
      setLoading(false)
    }
  }, [isSignedIn, isLoaded, router])

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const items = getCartItems()
        setCartItems(items)
        if (items.length === 0) {
          setError('Your cart is empty')
          setTimeout(() => {
            router.push('/cart')
          }, 2000)
        }
      } catch (err) {
        console.error('Error updating cart:', err)
      }
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [router])

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
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
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.jpg'
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">KES {item.price} x {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">KES {item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>KES {subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Shipping</span>
                <span>KES {shipping}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>KES {total}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment</h2>
            <MpesaPayment 
              orderId={orderId}
              amount={total}
              onPaymentSuccess={() => {
                console.log('Payment successful')
                router.push('/order-success')
              }}
              onPaymentError={(error) => {
                console.error('Payment error:', error)
                setError('Payment failed: ' + error)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

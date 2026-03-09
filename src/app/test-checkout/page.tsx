'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { getCartItems } from '@/lib/cart'

export default function TestCheckoutPage() {
  const router = useRouter()
  const { isSignedIn, user } = useUser()
  const [cartItems, setCartItems] = useState([])
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    // Collect debug information
    const info = {
      isSignedIn,
      user: user ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      } : null,
      cartItems: getCartItems(),
      cartCount: getCartItems().length,
      localStorage: typeof window !== 'undefined' ? {
        gladtidings_cart: localStorage.getItem('gladtidings_cart')
      } : 'window undefined'
    }
    
    setDebugInfo(info)
    setCartItems(info.cartItems)
  }, [isSignedIn, user])

  const handleTestCheckout = () => {
    console.log('Test checkout clicked')
    console.log('Debug info:', debugInfo)
    
    if (!isSignedIn) {
      console.log('Not signed in, redirecting to sign-in')
      router.push('/sign-in?callbackUrl=/test-checkout')
      return
    }

    if (cartItems.length === 0) {
      console.log('Cart is empty, redirecting to cart')
      router.push('/cart')
      return
    }

    console.log('Proceeding to checkout...')
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout Debug Page</h1>
        
        {/* Debug Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</div>
            <div><strong>User ID:</strong> {user?.id || 'N/A'}</div>
            <div><strong>User Email:</strong> {user?.primaryEmailAddress?.emailAddress || 'N/A'}</div>
            <div><strong>Cart Items:</strong> {cartItems.length}</div>
            <div><strong>Cart Data:</strong> {JSON.stringify(cartItems)}</div>
            <div><strong>LocalStorage:</strong> {JSON.stringify(debugInfo.localStorage)}</div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleTestCheckout}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              Test Proceed to Checkout
            </button>
            
            <button
              onClick={() => router.push('/cart')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-4"
            >
              Go to Cart
            </button>
            
            <button
              onClick={() => router.push('/sign-in')}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ml-4"
            >
              Go to Sign In
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">No items in cart</p>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div key={index} className="border p-3 rounded">
                  <div><strong>Title:</strong> {item.title}</div>
                  <div><strong>Price:</strong> KES {item.price}</div>
                  <div><strong>Quantity:</strong> {item.quantity}</div>
                  <div><strong>Total:</strong> KES {item.price * item.quantity}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Troubleshooting */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>If not signed in, click "Go to Sign In"</li>
            <li>If cart is empty, add items from shop page first</li>
            <li>If signed in and cart has items, test checkout should work</li>
            <li>Check browser console for any errors</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

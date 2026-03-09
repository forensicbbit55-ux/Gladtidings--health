'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { getCartItems, addToCart } from '@/lib/cart'

export default function TestAddCartPage() {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [testProduct] = useState({
    id: 'test-1',
    title: 'Test Natural Remedy',
    price: 150,
    image_url: '/images/placeholder.jpg',
    quantity: 1
  })

  const refreshCart = () => {
    const items = getCartItems()
    setCartItems(items)
  }

  const handleAddToCart = () => {
    console.log('handleAddToCart called')
    console.log('isSignedIn:', isSignedIn)
    
    if (!isSignedIn) {
      console.log('Not signed in, redirecting to sign-in')
      router.push('/sign-in?callbackUrl=/test-add-cart')
      return
    }

    console.log('Adding product to cart:', testProduct)
    addToCart(testProduct)
    
    // Update cart items
    setTimeout(() => {
      refreshCart()
    }, 100)
  }

  const handleClearCart = () => {
    localStorage.removeItem('gladtidings_cart')
    refreshCart()
  }

  // Load initial cart
  useState(() => {
    refreshCart()
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add to Cart Test</h1>
        
        {/* User Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">User Status</h2>
          <div className="space-y-2">
            <p><strong>Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</p>
            <p><strong>Clerk Loaded:</strong> {typeof window !== 'undefined' ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Test Product */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Test Product</h2>
          <div className="bg-gray-50 p-4 rounded mb-4">
            <p><strong>ID:</strong> {testProduct.id}</p>
            <p><strong>Title:</strong> {testProduct.title}</p>
            <p><strong>Price:</strong> KES {testProduct.price}</p>
            <p><strong>Image:</strong> {testProduct.image_url}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
          >
            Add to Cart
          </button>
        </div>

        {/* Cart Contents */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Cart Contents ({cartItems.length} items)</h2>
            <button
              onClick={handleClearCart}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Clear Cart
            </button>
          </div>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <p><strong>Title:</strong> {item.title}</p>
                  <p><strong>Price:</strong> KES {item.price}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>ID:</strong> {item.id}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Steps:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Check if you're signed in with Clerk</li>
            <li>Click "Add to Cart" button</li>
            <li>Check browser console for errors</li>
            <li>Verify cart contents update</li>
            <li>Test localStorage persistence</li>
          </ol>
          <p className="mt-2 text-xs text-yellow-600">
            Open browser console (F12) to see debug logs
          </p>
        </div>
      </div>
    </div>
  )
}

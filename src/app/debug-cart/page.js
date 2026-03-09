'use client'

import { useEffect, useState } from 'react'

export default function DebugCartPage() {
  const [logs, setLogs] = useState([])

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addLog('Page loaded')
    
    // Check localStorage availability
    if (typeof window !== 'undefined') {
      addLog('Window object available')
      
      // Check existing cart
      const existingCart = localStorage.getItem('gladtidings_cart')
      addLog(`Existing cart data: ${existingCart}`)
      
      // Add test product
      const testProduct = {
        id: 'test-moringa',
        title: 'Test Moringa Capsules',
        price: 500,
        image_url: '/images/placeholder.jpg',
        quantity: 1
      }
      
      try {
        localStorage.setItem('gladtidings_cart', JSON.stringify([testProduct]))
        addLog('Test product added to localStorage')
        
        // Verify it was added
        const verifyCart = localStorage.getItem('gladtidings_cart')
        addLog(`Verification: ${verifyCart}`)
        
        // Test getCartItems function
        const parsedCart = JSON.parse(verifyCart)
        addLog(`Parsed cart has ${parsedCart.length} items`)
        
      } catch (error) {
        addLog(`Error: ${error.message}`)
      }
    } else {
      addLog('Window object NOT available')
    }
  }, [])

  const testManualAdd = () => {
    try {
      const testProduct = {
        id: 'manual-test',
        title: 'Manual Test Product',
        price: 300,
        image_url: '/images/placeholder.jpg',
        quantity: 2
      }
      
      localStorage.setItem('gladtidings_cart', JSON.stringify([testProduct]))
      addLog('Manual test product added')
      
      // Refresh the page to see if it persists
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error) {
      addLog(`Manual add error: ${error.message}`)
    }
  }

  const clearCart = () => {
    try {
      localStorage.removeItem('gladtidings_cart')
      addLog('Cart cleared')
      window.location.reload()
    } catch (error) {
      addLog(`Clear error: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Cart Debugging</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Manual Controls</h2>
          <div className="space-y-4">
            <button
              onClick={testManualAdd}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Add Test Product Manually
            </button>
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Links</h2>
          <div className="space-y-2">
            <a href="/shop" className="block text-emerald-600 hover:underline">→ Go to Shop</a>
            <a href="/cart" className="block text-emerald-600 hover:underline">→ Go to Cart</a>
            <a href="/checkout" className="block text-emerald-600 hover:underline">→ Go to Checkout</a>
            <a href="/test-cart" className="block text-emerald-600 hover:underline">→ Test Cart Page</a>
          </div>
        </div>
      </div>
    </div>
  )
}

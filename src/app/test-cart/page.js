'use client'

import { useState, useEffect } from 'react'
import { getCartItems, addToCart, clearCart } from '@/lib/cart'
import { getProducts } from '@/lib/products'

export default function TestCartPage() {
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState([])
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    // Load products
    const allProducts = getProducts()
    setProducts(allProducts)
    
    // Load cart
    const items = getCartItems()
    setCartItems(items)
    
    // Debug info
    setDebugInfo({
      localStorageAvailable: typeof window !== 'undefined',
      cartData: localStorage.getItem('gladtidings_cart'),
      cartLength: items.length,
      windowObject: typeof window
    })
  }, [])

  const handleAddProduct = (product) => {
    addToCart(product)
    const items = getCartItems()
    setCartItems(items)
    setDebugInfo(prev => ({
      ...prev,
      cartData: localStorage.getItem('gladtidings_cart'),
      cartLength: items.length
    }))
  }

  const handleClearCart = () => {
    clearCart()
    setCartItems([])
    setDebugInfo(prev => ({
      ...prev,
      cartData: localStorage.getItem('gladtidings_cart'),
      cartLength: 0
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Cart Debug Page</h1>
        
        {/* Debug Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-gray-600">KES {product.price}</p>
                <button
                  onClick={() => handleAddProduct(product)}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
            <button
              onClick={handleClearCart}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Cart
            </button>
          </div>
          
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">KES {item.price} x {item.quantity}</p>
                  <p className="text-emerald-600 font-semibold">Total: KES {item.price * item.quantity}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <p className="text-xl font-bold">
                  Cart Total: KES {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Test Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Links</h2>
          <div className="space-y-2">
            <a href="/shop" className="block text-emerald-600 hover:underline">Go to Shop</a>
            <a href="/cart" className="block text-emerald-600 hover:underline">Go to Cart Page</a>
            <a href="/checkout" className="block text-emerald-600 hover:underline">Go to Checkout</a>
          </div>
        </div>
      </div>
    </div>
  )
}

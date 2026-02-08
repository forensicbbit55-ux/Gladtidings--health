'use client'

import { useState, useEffect } from 'react'
;
;export default function TestNeon() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    testNeonConnection()
  }, [])

  const testNeonConnection = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Test basic connection using server-side API
      const response = await fetch('/api/test-db')
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data.products || [])
      }
      
    } catch (err) {
      console.error('Neon error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Neon Database Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Connection Status</h2>
          
          {loading && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div>
              <span className="text-gray-600">Connecting to Neon...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-medium">❌ Connection Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {!loading && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-600 font-medium">✅ Connected to Neon successfully!</p>
              <p className="text-green-600">Found {products.length} products</p>
            </div>
          )}
          
          <div className="mt-4">
            <button
              onClick={testNeonConnection}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Test Connection
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Products Data</h2>
          
          {products.length === 0 && !loading && !error ? (
            <div className="text-gray-500 text-center py-8">
              No products found. You may need to create the products table.
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ID:</p>
                      <p className="text-sm text-gray-900">{product.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name:</p>
                      <p className="text-sm text-gray-900">{product.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Price:</p>
                      <p className="text-sm text-gray-900">${product.price}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Category:</p>
                      <p className="text-sm text-gray-900">{product.category}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600">Description:</p>
                    <p className="text-sm text-gray-900">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Raw JSON Data</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(products, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
};;

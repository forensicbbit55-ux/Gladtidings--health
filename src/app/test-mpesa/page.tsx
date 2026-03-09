'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestMpesaPage() {
  const [showConfig, setShowConfig] = useState(false)
  const [showTest, setShowTest] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">M-Pesa Testing Guide</h1>
        
        {/* Quick Start */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">🚀 Quick Start</h2>
          <div className="space-y-3 text-blue-700">
            <p><strong>Step 1:</strong> Add M-Pesa credentials to .env.local</p>
            <p><strong>Step 2:</strong> Test with sandbox environment</p>
            <p><strong>Step 3:</strong> Try a real payment test</p>
          </div>
        </div>

        {/* Environment Setup */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">📋 Environment Setup</h2>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showConfig ? 'Hide' : 'Show'} Config
            </button>
          </div>
          
          {showConfig && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Required Environment Variables:</h3>
                <div className="font-mono text-sm space-y-1">
                  <p>MPESA_CONSUMER_KEY=your_consumer_key</p>
                  <p>MPESA_CONSUMER_SECRET=your_consumer_secret</p>
                  <p>MPESA_SHORTCODE=174379</p>
                  <p>MPESA_PASSKEY=your_passkey</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-4">
                <h3 className="font-semibold text-gray-800 mb-2">How to Get M-Pesa Credentials:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Go to <a href="https://developer.safaricom.co.ke" target="_blank" rel="noopener" className="text-blue-600 underline">Safaricom Developer Portal</a></li>
                  <li>Create an account and sign in</li>
                  <li>Create a new app (or use existing)</li>
                  <li>Add M-Pesa API to your app</li>
                  <li>Get Consumer Key and Consumer Secret</li>
                  <li>Use sandbox credentials for testing:</li>
                  <li className="ml-6 font-mono text-xs">Shortcode: 174379</li>
                  <li className="ml-6 font-mono text-xs">Passkey: bfb279c9769a411b8f6c9e3b4c8e6f3c</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Testing Steps */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">🧪 Testing Steps</h2>
            <button
              onClick={() => setShowTest(!showTest)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {showTest ? 'Hide' : 'Show'} Test Steps
            </button>
          </div>
          
          {showTest && (
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Step 1: Test Environment Setup</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Ensure .env.local has M-Pesa credentials</li>
                  <li>Restart the development server</li>
                  <li>Check browser console for any errors</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Step 2: Add Items to Cart</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Go to <Link href="/shop" className="text-blue-600 underline">Shop Page</Link></li>
                  <li>Add some remedies to cart</li>
                  <li>Proceed to checkout</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Step 3: Test M-Pesa Payment</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Enter a test phone number: <code className="bg-gray-100 px-1">07XXXXXXXX</code></li>
                  <li>Click "Pay with M-Pesa"</li>
                  <li>Check for STK push simulation</li>
                  <li>Enter PIN when prompted (sandbox)</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800 mb-2">Step 4: Verify Payment</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Check payment status updates</li>
                  <li>Verify redirect to order success page</li>
                  <li>Check database for payment records</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Test Phone Numbers */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📱 Test Phone Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Sandbox Test Numbers:</h3>
              <ul className="space-y-1 text-sm">
                <li><code>07XXXXXXXX</code> (any 9-digit number)</li>
                <li><code>+2547XXXXXXXX</code> (international format)</li>
                <li>These are simulated - no real charges</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Real Testing:</h3>
              <ul className="space-y-1 text-sm">
                <li>Use your actual M-Pesa number</li>
                <li>Small amounts (KES 1-10) for testing</li>
                <li>Production environment required</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-800 mb-4">🚨 Troubleshooting</h2>
          <div className="space-y-3 text-red-700">
            <div>
              <strong>Error: "Invalid credentials"</strong>
              <p className="text-sm">→ Check MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET in .env.local</p>
            </div>
            <div>
              <strong>Error: "Payment initiation failed"</strong>
              <p className="text-sm">→ Check MPESA_SHORTCODE and MPESA_PASSKEY</p>
            </div>
            <div>
              <strong>No STK push received</strong>
              <p className="text-sm">→ Check phone number format, ensure sandbox environment</p>
            </div>
            <div>
              <strong>Callback not working</strong>
              <p className="text-sm">→ Check ngrok tunnel or webhook URL configuration</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            🛒 Go to Shop
          </Link>
          <Link
            href="/cart"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            🛍️ View Cart
          </Link>
          <Link
            href="/test-checkout"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            🧪 Test Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
;
;export default function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)

  const setupDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Setup</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create PostgreSQL Tables</h2>
          
          <p className="text-gray-600 mb-6">
            This will create the following tables in your Neon database:
          </p>
          
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li><strong>admins</strong> - Admin user accounts</li>
            <li><strong>categories</strong> - Remedy categories</li>
            <li><strong>remedies</strong> - Medical remedies and treatments</li>
          </ul>

          <button
            onClick={setupDatabase}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Tables...' : 'Create Tables'}
          </button>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? '✅ Success' : '❌ Error'}
              </h3>
              <pre className={`text-sm whitespace-pre-wrap ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Information</h3>
          <p className="text-blue-700 text-sm">
            This setup uses CREATE TABLE IF NOT EXISTS to safely create tables without dropping existing data.
            Sample categories and admin user will be inserted if they don't already exist.
          </p>
        </div>
      </div>
    </div>
  )
};;

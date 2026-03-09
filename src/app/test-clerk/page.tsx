'use client'

import { useUser } from '@clerk/nextjs'

export default function TestClerkPage() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Clerk...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Clerk Configuration Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <strong>Clerk Status:</strong>
            <span className={`ml-2 px-2 py-1 rounded ${isLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isLoaded ? 'Loaded' : 'Not Loaded'}
            </span>
          </div>
          
          <div>
            <strong>Signed In:</strong>
            <span className={`ml-2 px-2 py-1 rounded ${isSignedIn ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {isSignedIn ? 'Yes' : 'No'}
            </span>
          </div>

          <div>
            <strong>User Info:</strong>
            {user ? (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
                <p>Name: {user.firstName} {user.lastName}</p>
                <p>ID: {user.id}</p>
              </div>
            ) : (
              <span className="ml-2 text-gray-500">Not signed in</span>
            )}
          </div>

          <div>
            <strong>Environment Variables:</strong>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 
                <span className={`ml-2 ${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'text-green-600' : 'text-red-600'}`}>
                  {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not Set'}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                (Check your .env.local file for Clerk keys)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">If Clerk is not working:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Check that .env.local contains NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
            <li>Restart the development server (npm run dev)</li>
            <li>Verify Clerk keys from your Clerk dashboard</li>
            <li>Make sure keys are correct and not expired</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useUser, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import { User, Shield, CheckCircle, XCircle } from 'lucide-react'

export default function TestAuthPage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Authentication Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Test your Clerk authentication status and access levels
          </p>
        </div>

        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
              user ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {user ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user ? 'Authenticated' : 'Not Authenticated'}
              </h2>
              <p className="text-gray-600">
                {user ? 'You are successfully logged in' : 'You need to sign in to access protected features'}
              </p>
            </div>
          </div>

          {/* User Info */}
          <SignedIn>
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">User ID</p>
                  <p className="font-mono text-sm text-gray-900">{user.id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-mono text-sm text-gray-900">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">First Name</p>
                  <p className="font-mono text-sm text-gray-900">{user.firstName || 'Not set'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Last Name</p>
                  <p className="font-mono text-sm text-gray-900">{user.lastName || 'Not set'}</p>
                </div>
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="border-t pt-6">
              <div className="text-center">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-6">
                  You need to sign in to view user information and access protected features.
                </p>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </SignedOut>
        </div>

        {/* Access Test */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Access Test</h3>
          
          <div className="space-y-4">
            {/* Public Routes */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-green-900">Public Routes</h4>
                <p className="text-sm text-green-700">Always accessible</p>
              </div>
              <div className="flex gap-2">
                <Link href="/" className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                  Home
                </Link>
                <Link href="/remedies" className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                  Remedies
                </Link>
                <Link href="/shop" className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                  Shop
                </Link>
              </div>
            </div>

            {/* Protected Routes */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-red-900">Protected Routes</h4>
                <p className="text-sm text-red-700">Requires authentication</p>
              </div>
              <div className="flex gap-2">
                <Link 
                  href="/admin/remedies/new" 
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Actions */}
        <SignedIn>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Authentication Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/remedies/new"
                className="flex items-center justify-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <Shield className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-emerald-900">Test Admin Access</span>
              </Link>
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-900">User Profile (via navbar)</span>
              </div>
            </div>
          </div>
        </SignedIn>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

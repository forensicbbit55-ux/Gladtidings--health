'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { SignedIn, SignedOut } from '@clerk/nextjs';

const ADMIN_PASSCODE = 'gladtidings.org2026'; // Updated passcode

function AdminLayoutContent({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const { user } = useUser()
  const pathname = usePathname()

  const handlePasscodeSubmit = (e) => {
    e.preventDefault()
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid passcode')
      setPasscode('')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Products', href: '/admin/products', icon: '🛍️' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Orders', href: '/admin/orders', icon: '📦' },
    { name: 'Blog', href: '/admin/blog', icon: '📝' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ]

  return (
    <>
      <SignedIn>
        {!isAuthenticated ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Admin Access
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Enter passcode to access admin panel
                </p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handlePasscodeSubmit}>
                <div>
                  <label htmlFor="passcode" className="sr-only">Passcode</label>
                  <input
                    id="passcode"
                    name="passcode"
                    type="password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                    placeholder="Enter passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="text-red-600 text-sm text-center">{error}</div>
                )}
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Access Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 flex-shrink-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className={`font-bold text-gray-900 ${sidebarCollapsed ? 'text-xs' : 'text-lg'}`}>
            {sidebarCollapsed ? 'GT' : 'Glad Tidings'}
          </h1>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <nav className="mt-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                pathname === item.href
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.firstName || user.emailAddresses?.[0]?.emailAddress}
                </span>
                <UserButton afterSignOutUrl="/" />
                <a
                  href="/dashboard"
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Back to Dashboard
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-4">Please sign in to access the admin panel.</p>
            <a href="/sign-in" className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Sign In</a>
          </div>
        </div>
      </SignedOut>
    </>
  )
};

export default function AdminLayout({ children }) {
  return (
    <AdminLayoutContent>
      {children}
    </AdminLayoutContent>
  )
};

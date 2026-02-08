'use client'

import { useState, useEffect } from 'react';
;import Link from 'next/link';
;import { usePathname, useRouter } from 'next/navigation';
;import { useAuth } from '@/contexts/NextAuthContext'
;
;function AdminLayoutContent({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, isAdmin, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?callbackUrl=/admin')
        return
      }
      
      if (!isAdmin) {
        router.push('/dashboard')
        return
      }
    }
  }, [user, isAdmin, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null // Will redirect
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
                  {user.name} ({user.role})
                </span>
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
  )
};

export default function AdminLayout({ children }) {
  return (
    <AdminLayoutContent>
      {children}
    </AdminLayoutContent>
  )
};

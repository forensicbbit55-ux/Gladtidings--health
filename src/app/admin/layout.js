'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

function AdminLayoutContent({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/verify')
        const data = await response.json()
        
        if (data.authenticated) {
          setIsAuthenticated(true)
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        router.push('/admin/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the admin panel.</p>
          <Link
            href="/admin/login"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: '/admin'
    },
    {
      id: 'users',
      label: 'Users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      href: '/admin/users'
    },
    {
      id: 'sermons',
      label: 'Sermons / Articles',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      href: '/admin/sermons'
    },
    {
      id: 'missions',
      label: 'Medical Missions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/admin/missions'
    },
    {
      id: 'media',
      label: 'Media Library',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/admin/media'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      href: '/admin/messages'
    },
    {
      id: 'remedies',
      label: 'Natural Remedies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      href: '/admin/remedies'
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      href: '/admin/announcements'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: '/admin/settings'
    }
  ]

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        ${sidebarCollapsed ? 'w-20' : 'w-64'} 
        bg-white border-r border-gray-200 
        fixed left-0 top-0 h-full 
        transition-all duration-300 ease-in-out 
        z-30 shadow-lg
        ${sidebarCollapsed ? 'translate-x-0' : 'translate-x-0 lg:translate-x-0'}
        ${!sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : ''}
      `}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">Glad Tidings</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                ${isActive(item.href) 
                  ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border-l-4 border-teal-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={async () => {
              try {
                await fetch('/api/admin/auth/login', { method: 'DELETE' })
                window.location.href = '/admin/login'
              } catch (error) {
                console.error('Logout error:', error)
              }
            }}
            className={`
              w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
              text-red-600 hover:bg-red-50 hover:text-red-700
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!sidebarCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </nav>

        {/* Collapse Toggle */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-0 lg:ml-64'} transition-all duration-300 ease-in-out`}>
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Toggle & Page Title */}
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {/* Page Title */}
                <div>
                  <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                    {menuItems.find(item => isActive(item.href))?.label || 'Admin Panel'}
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">Manage your medical missionary website</p>
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-2 lg:space-x-3 pl-2 lg:pl-4 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500 capitalize">Administrator</p>
                  </div>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm lg:text-base">
                    A
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="p-4 lg:p-6 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  return (
    <AdminLayoutContent>
      {children}
    </AdminLayoutContent>
  )
}

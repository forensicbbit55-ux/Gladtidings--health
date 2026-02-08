'use client'

import Link from 'next/link';
;import { useEffect } from 'react'
;
;export default function NotFound() {
  useEffect(() => {
    // Set custom 404 status for SEO
    document.title = 'Page Not Found - Glad Tidings'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-emerald-600 opacity-20">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-24 h-24 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0L9 10.343l5.657 5.657a4 4 0 015.657 0l1.414-1.414a4 4 0 000-5.657L14.343 9l5.657-5.657a4 4 0 000 5.657l-1.414 1.414a4 4 0 01-5.657 0L9 13.657l-5.657 5.657a4 4 0 010-5.657l1.414-1.414a4 4 0 015.657 0L9.657 14.343l5.657-5.657a4 4 0 010 5.657l-1.414 1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for seems to have wandered off. 
          Don't worry, even the best remedies can't find everything!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a4 4 0 014 0z" />
            </svg>
            Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-4 py-2 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Browse Remedies
            </Link>
            
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Maybe you were looking for:
          </h2>
          <ul className="space-y-2 text-left">
            <li>
              <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Our Natural Remedies →
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-emerald-600 hover:text-emerald-700 font-medium">
                About Glad Tidings →
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Contact Us →
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Admin Login →
              </Link>
            </li>
          </ul>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
};;

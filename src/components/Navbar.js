'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  // Logo and carousel fixes deployed - Logo visible in production, carousel at original height
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [cartItems, setCartItems] = useState(3);

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              {/* Logo - Left side */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                    {/* Logo */}
                    <img 
                      src="/images/logo.png" 
                      alt="Glad Tidings" 
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="text-white font-bold text-xl">GT</div>';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Glad Tidings</h1>
                  <p className="text-sm text-gray-600 font-medium">Natural Health & Wellness</p>
                </div>
              </div>

              {/* Desktop Navigation - Center */}
              <div className="hidden lg:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Home
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  About
                </Link>
                <Link href="/services" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Services
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Shop
                </Link>
                <Link href="/blog" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Blog
                </Link>
                <Link href="/consultation" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Consultation
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Contact
                </Link>
              </div>

              {/* Right side - Cart & Login */}
              <div className="flex items-center space-x-4">
                {/* Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItems}
                    </span>
                  )}
                </button>

                {/* Login Button */}
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium"
                >
                  Login
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full right-0 left-0 bg-white border-t border-gray-200 shadow-lg transform transition-all duration-300 ease-in-out origin-top">
              <div className="flex flex-col space-y-3 py-4 px-4">
                <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Home
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  About
                </Link>
                <Link href="/services" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Services
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Shop
                </Link>
                <Link href="/blog" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Blog
                </Link>
                <Link href="/consultation" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Consultation
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200">
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              </div>
              <div className="border-t border-gray-200 p-4">
                <button className={`${BUTTON_STYLES.variants.primary} w-full`}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsLoginOpen(false)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{isSignUp ? 'Sign Up' : 'Login'}</h2>
                <button
                  onClick={() => {
                    setIsLoginOpen(false);
                    setIsSignUp(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter your password"
                  />
                </div>
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Confirm your password"
                    />
                  </div>
                )}
                <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium w-full">
                  {isSignUp ? 'Create Account' : 'Login'}
                </button>
              </form>
              
              {/* Toggle Sign Up/Login */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    {isSignUp ? 'Login' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

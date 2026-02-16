'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileMenuClasses = isMobileMenuOpen 
    ? "md:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out z-[60] translate-x-0" 
    : "md:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out z-[60] -translate-x-full";

  return (
    <>
      <nav className="bg-white bg-opacity-90 text-gray-900 shadow-lg fixed w-full top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 rounded-full p-2">
                <span className="text-white font-bold text-lg">GT</span>
              </div>
              <span className="text-xl font-semibold tracking-tight text-gray-900">Glad Tidings</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-emerald-600 border-b-2 border-emerald-600 pb-1 font-medium hover:text-emerald-700 transition">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-emerald-600 transition">
                Shop
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-emerald-600 transition">
                About
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-emerald-600 transition">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-emerald-600 transition">
                Contact
              </Link>
            </div>

            {/* Right Icons / Actions */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Appointment */}
              <Link href="/consultation" className="flex items-center text-emerald-600 hover:text-emerald-700 transition">
                <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Appointment
              </Link>

              {/* Cart */}
              <Link href="/cart" className="flex items-center text-gray-700 hover:text-emerald-600 transition relative">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                <span className="ml-2 text-sm">KSH 0</span>
              </Link>

              {/* Login */}
              <Link href="/login" className="flex items-center text-gray-700 hover:text-emerald-600 transition">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="ml-1.5 hidden lg:inline">Login</span>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-900 focus:outline-none p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={mobileMenuClasses}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-gray-900 font-semibold">Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 py-6 space-y-2">
            <Link href="/" className="block px-3 py-2 text-emerald-600 font-medium rounded hover:bg-gray-100">
              Home
            </Link>
            <Link href="/products" className="block px-3 py-2 text-gray-900 rounded hover:bg-gray-100">
              Shop
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-900 rounded hover:bg-gray-100">
              About
            </Link>
            <Link href="/blog" className="block px-3 py-2 text-gray-900 rounded hover:bg-gray-100">
              Blog
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-900 rounded hover:bg-gray-100">
              Contact
            </Link>
            <hr className="my-4 border-gray-200" />
            <Link href="/consultation" className="block px-3 py-2 text-emerald-600 rounded hover:bg-gray-100">
              Appointment
            </Link>
            <Link href="/cart" className="block px-3 py-2 text-gray-900 rounded hover:bg-gray-100">
              Cart [0] KSH 0
            </Link>
            <Link href="/login" className="block px-3 py-2 text-gray-900 rounded hover:bg-gray-100">
              Login
            </Link>
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[40]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>

      {/* Spacer so content isn't hidden under fixed nav */}
      <div className="h-16"></div>
    </>
  );
}

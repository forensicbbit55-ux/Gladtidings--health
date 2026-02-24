'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ShoppingCart, User, Calendar, Menu, ChevronDown, Settings } from 'lucide-react'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useCartStore } from '../../store/cartStore'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getTotalItems } = useCartStore()
  const cartItemCount = getTotalItems()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-emerald-600 hover:bg-gray-100 relative z-20"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo - Desktop */}
        <div className="hidden md:flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="Glad Tidings Health" 
              width={180} 
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <Link 
            href="/" 
            className="text-emerald-600 font-semibold text-base underline decoration-emerald-600 underline-offset-4 decoration-2"
          >
            Home
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-gray-800 font-medium text-base hover:text-emerald-600 flex items-center gap-1">
                Shop
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px] bg-white border-gray-200 shadow-lg rounded-lg">
              <DropdownMenuItem asChild>
                <Link href="/shop/herbal-remedies" className="text-gray-800 hover:text-emerald-600">
                  Herbal Remedies
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/shop/supplements" className="text-gray-800 hover:text-emerald-600">
                  Supplements
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link 
            href="/about" 
            className="text-gray-800 font-medium text-base hover:text-emerald-600"
          >
            About
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-gray-800 font-medium text-base hover:text-emerald-600 flex items-center gap-1">
                Courses
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px] bg-white border-gray-200 shadow-lg rounded-lg">
              <DropdownMenuItem asChild>
                <Link href="/courses/natural-remedies" className="text-gray-800 hover:text-emerald-600">
                  Natural Remedies
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/courses/wellness" className="text-gray-800 hover:text-emerald-600">
                  Wellness Programs
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            href="/blog" 
            className="text-gray-800 font-medium text-base hover:text-emerald-600"
          >
            Blog
          </Link>
          
          <Link 
            href="/contact" 
            className="text-gray-800 font-medium text-base hover:text-emerald-600"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link 
            href="/admin" 
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
            <span>Admin</span>
          </Link>

          <Link 
            href="/appointment" 
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-all duration-200"
          >
            <Calendar className="h-4 w-4" />
            <span>Appointment</span>
          </Link>

          <Link 
            href="/cart" 
            className="flex items-center space-x-2 text-gray-800 hover:text-emerald-600 p-2 rounded-lg transition-colors relative"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          </Link>

          <SignedIn>
            <div className="flex items-center gap-2 text-gray-800 hover:text-emerald-600">
              <User className="h-5 w-5" />
              <span className="text-sm">Welcome</span>
            </div>
          </SignedIn>

          <SignedOut>
            <Link 
              href="/sign-in" 
              className="flex items-center space-x-2 text-gray-800 hover:text-emerald-600"
            >
              <User className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </SignedOut>
        </div>

        {/* Mobile Menu - Slide Out Drawer */}
        <div className={`fixed inset-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/images/logo.png" 
                  alt="Glad Tidings Health" 
                  width={150} 
                  height={33}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-4 p-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-800 hover:text-emerald-600 py-2"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center justify-between text-gray-800 hover:text-emerald-600 py-2">
                    Shop
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[220px] bg-white border-gray-200 shadow-lg rounded-lg">
                  <DropdownMenuItem asChild>
                    <Link href="/shop/herbal-remedies" className="text-gray-800 hover:text-emerald-600">
                      Herbal Remedies
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shop/supplements" className="text-gray-800 hover:text-emerald-600">
                      Supplements
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link 
                href="/about" 
                className="flex items-center text-gray-800 hover:text-emerald-600 py-2"
                onClick={toggleMobileMenu}
              >
                About
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center justify-between text-gray-800 hover:text-emerald-600 py-2">
                    Courses
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[220px] bg-white border-gray-200 shadow-lg rounded-lg">
                  <DropdownMenuItem asChild>
                    <Link href="/courses/natural-remedies" className="text-gray-800 hover:text-emerald-600">
                      Natural Remedies
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/courses/wellness" className="text-gray-800 hover:text-emerald-600">
                      Wellness Programs
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link 
                href="/blog" 
                className="flex items-center text-gray-800 hover:text-emerald-600 py-2"
                onClick={toggleMobileMenu}
              >
                Blog
              </Link>
              
              <Link 
                href="/contact" 
                className="flex items-center text-gray-800 hover:text-emerald-600 py-2"
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link 
                  href="/appointment" 
                  className="flex items-center justify-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors mb-3"
                  onClick={toggleMobileMenu}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Appointment</span>
                </Link>

                <Link 
                  href="/cart" 
                  className="flex items-center text-gray-800 hover:text-emerald-600 py-2 mb-3"
                  onClick={toggleMobileMenu}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1 py-0.5">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                </Link>

                <Link 
                  href="/admin" 
                  className="flex items-center text-gray-800 hover:text-emerald-600 py-2 mb-3"
                  onClick={toggleMobileMenu}
                >
                  <Settings className="h-5 w-5" />
                  <span className="ml-2">Admin</span>
                </Link>

                <Link 
                  href="/sign-in" 
                  className="flex items-center text-gray-800 hover:text-emerald-600 py-2"
                  onClick={toggleMobileMenu}
                >
                  <User className="h-5 w-5" />
                  <span className="ml-2">Login</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, ShoppingCart, Calendar, ChevronDown, Leaf, Home, ShoppingBag, User, GraduationCap, FileText, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'

export default function Header() {
  const [shopOpen, setShopOpen] = useState(false)
  const [coursesOpen, setCoursesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useUser()

  const shopItems = [
    'Herbal Remedies',
    'Natural Supplements',
    'Wellness Products',
    'Essential Oils',
    'Health Books'
  ]

  const courseItems = [
    'Herbal Medicine Basics',
    'Natural Healing',
    'Wellness Coaching',
    'Nutrition Courses',
    'Meditation & Mindfulness'
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* MOBILE VIEW - Left: Hamburger Menu */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-800 hover:text-emerald-600 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="right" className="w-full sm:w-[400px] bg-white border-l-emerald-200 p-0">
                  {/* Mobile Menu Content */}
                  <div className="flex flex-col h-full">
                    {/* Header with Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-emerald-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-lime-500 rounded-full flex items-center justify-center shadow-lg">
                          <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-lg font-bold text-gray-800">Glad Tidings</span>
                          <span className="text-sm font-medium text-emerald-600 ml-1">Health</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-2">
                      <SheetClose asChild>
                        <Link 
                          href="/" 
                          className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                        >
                          <Home className="h-5 w-5 text-emerald-600" />
                          <span>Home</span>
                        </Link>
                      </SheetClose>

                      {/* Shop Dropdown */}
                      <DropdownMenu open={shopOpen} onOpenChange={setShopOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                          >
                            <ShoppingBag className="h-5 w-5 text-emerald-600" />
                            <span className="flex-1 text-left">Shop</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[280px] bg-white border-emerald-200 shadow-xl">
                          {shopItems.map((item) => (
                            <DropdownMenuItem 
                              key={item}
                              className="text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                              asChild
                            >
                              <SheetClose asChild>
                                <Link href={`/shop/${item.toLowerCase().replace(/\s+/g, '-')}`} className="w-full">
                                  {item}
                                </Link>
                              </SheetClose>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <SheetClose asChild>
                        <Link 
                          href="/about" 
                          className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                        >
                          <User className="h-5 w-5 text-emerald-600" />
                          <span>About</span>
                        </Link>
                      </SheetClose>

                      {/* Courses Dropdown */}
                      <DropdownMenu open={coursesOpen} onOpenChange={setCoursesOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                          >
                            <GraduationCap className="h-5 w-5 text-emerald-600" />
                            <span className="flex-1 text-left">Courses</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${coursesOpen ? 'rotate-180' : ''}`} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[280px] bg-white border-emerald-200 shadow-xl">
                          {courseItems.map((item) => (
                            <DropdownMenuItem 
                              key={item}
                              className="text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                              asChild
                            >
                              <SheetClose asChild>
                                <Link href={`/courses/${item.toLowerCase().replace(/\s+/g, '-')}`} className="w-full">
                                  {item}
                                </Link>
                              </SheetClose>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <SheetClose asChild>
                        <Link 
                          href="/blog" 
                          className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                        >
                          <FileText className="h-5 w-5 text-emerald-600" />
                          <span>Blog</span>
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link 
                          href="/contact" 
                          className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                        >
                          <Phone className="h-5 w-5 text-emerald-600" />
                          <span>Contact</span>
                        </Link>
                      </SheetClose>

                      {/* Divider */}
                      <div className="border-t border-emerald-200 my-4"></div>

                      {/* Special Actions */}
                      <SheetClose asChild>
                        <Link 
                          href="/appointment" 
                          className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                        >
                          <Calendar className="h-5 w-5" />
                          <span>Book Appointment</span>
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <SignedOut>
                          <Link 
                            href="/sign-in" 
                            className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 shadow-lg"
                          >
                            <User className="h-5 w-5" />
                            <span>Login</span>
                          </Link>
                        </SignedOut>
                      </SheetClose>
                    </div>

                    {/* Footer with Tagline */}
                    <div className="p-6 border-t border-emerald-100 bg-emerald-50/50">
                      <p className="text-center text-sm text-emerald-700 italic">
                        Menu
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* MOBILE VIEW - Center: Logo */}
            <div className="flex md:hidden flex-col items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-lime-500 rounded-full flex items-center justify-center shadow-sm mr-2">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Glad Tidings</span>
              </Link>
            </div>

            {/* MOBILE VIEW - Right: Shopping Cart (WhatsApp removed) */}
            <div className="flex md:hidden">
              <Link 
                href="/cart" 
                className="flex items-center space-x-2 text-gray-800 hover:text-emerald-600 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 relative"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  0
                </span>
              </Link>
              
            </div>

            {/* DESKTOP VIEW - Logo, Centered Nav, and Actions */}
            <div className="hidden md:flex items-center w-full">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-lime-500 rounded-full flex items-center justify-center shadow-sm mr-3">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Glad Tidings</span>
                </Link>
              </div>

              <nav className="flex-1 flex justify-center items-center space-x-8">
                <Link href="/" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
                  Home
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1 text-gray-900 hover:text-emerald-600 font-medium">
                      <span>Shop</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[220px] bg-white border-gray-200 shadow-lg rounded-lg">
                    <DropdownMenuItem asChild>
                      <Link href="/shop/herbal-remedies" className="text-gray-900 hover:text-emerald-600">
                        Herbal Remedies
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/shop/supplements" className="text-gray-900 hover:text-emerald-600">
                        Supplements
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/about" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
                  About
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1 text-gray-900 hover:text-emerald-600 font-medium">
                      <span>Courses</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[220px] bg-white border-gray-200 shadow-lg rounded-lg">
                    <DropdownMenuItem asChild>
                      <Link href="/courses/natural-remedies" className="text-gray-900 hover:text-emerald-600">
                        Natural Remedies
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/courses/wellness" className="text-gray-900 hover:text-emerald-600">
                        Wellness Programs
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/blog" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
                  Blog
                </Link>

                <Link href="/contact" className="text-gray-900 hover:text-emerald-600 font-medium transition-colors">
                  Contact
                </Link>
              </nav>

              <div className="flex items-center space-x-6">
                <Link href="/appointment" className="flex items-center space-x-2 text-gray-900 hover:text-emerald-600 font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>Appointment</span>
                </Link>

                <Link href="/cart" className="flex items-center text-gray-900 hover:text-emerald-600 relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="ml-3 text-sm text-gray-700">[ 0 ]</span>
                  <span className="ml-2 text-sm text-gray-500">KSH 0</span>
                </Link>

                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>

                <SignedOut>
                  <Link href="/sign-in" className="flex items-center space-x-2 text-gray-900 hover:text-emerald-600">
                    <User className="h-5 w-5" />
                    <span className="ml-2">Login</span>
                  </Link>
                </SignedOut>

                {/* Admin moved to footer */}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

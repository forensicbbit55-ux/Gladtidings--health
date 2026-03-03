'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ShoppingCart, Calendar, ChevronDown, Home, ShoppingBag, User, GraduationCap, FileText, Phone, X, Search, MessageCircle, Camera, Send, Mail, Youtube, Linkedin, Facebook, Music } from 'lucide-react'
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
import { useCartStore } from '@/store/cartStore'

export default function Header() {
  const [shopOpen, setShopOpen] = useState(false)
  const [coursesOpen, setCoursesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { user } = useUser()
  const pathname = usePathname()
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const totalItems = getTotalItems()

  const shopItems = [
    { name: 'Natural Remedies', href: '/remedies' },
    { name: 'Herbal Remedies', href: '/shop/herbal-remedies' },
    { name: 'Natural Supplements', href: '/shop/supplements' },
    { name: 'Wellness Products', href: '/shop/wellness' },
    { name: 'Essential Oils', href: '/shop/essential-oils' },
    { name: 'Health Books', href: '/shop/books' }
  ]

  const courseItems = [
    { name: 'Herbal Medicine Basics', href: '/courses/herbal-medicine' },
    { name: 'Natural Healing', href: '/courses/natural-healing' },
    { name: 'Wellness Coaching', href: '/courses/wellness-coaching' },
    { name: 'Nutrition Courses', href: '/courses/nutrition' },
    { name: 'Meditation & Mindfulness', href: '/courses/meditation' }
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {/* Contact Info */}
              <span className="flex items-center justify-center sm:justify-start">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm">+254 723 730 980</span>
              </span>
              <span className="hidden sm:block">|</span>
              <span className="hidden sm:flex items-center">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                Mon-Fri: 9AM-6PM
              </span>
              
              {/* Social Media Icons */}
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <Link 
                  href="https://www.youtube.com/@GladTidingsHealth" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-200 transition-colors p-1"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </Link>
                <Link 
                  href="mailto:glad.tidings.health@gmail.com" 
                  className="hover:text-emerald-200 transition-colors p-1"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </Link>
                <Link 
                  href="https://www.linkedin.com/in/glad-tidings-85b3883a9" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-200 transition-colors p-1"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </Link>
                <Link 
                  href="https://www.facebook.com/profile.php?id=61587257731253" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-200 transition-colors p-1"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </Link>
                <Link 
                  href="https://instagram.com/gladtidingshealth" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-200 transition-colors p-1"
                  aria-label="Instagram"
                >
                  <Camera className="w-4 h-4" />
                </Link>
                {/* Custom TikTok Icon */}
              <Link 
                href="https://www.tiktok.com/@gladtidingshealth" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-200 transition-colors p-1"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.05v10.95a3.02 3.02 0 0 1-3.02 3.02c-1.65 0-3.02-1.37-3.02-3.02s1.37-3.02 3.02-3.02V7.9A5.96 5.96 0 0 0 2.75 13.85a5.96 5.96 0 0 0 5.96 5.96 5.96 5.96 0 0 0 5.96-5.96V9.34a7.95 7.95 0 0 0 4.9 1.69v-3.05a4.83 4.83 0 0 1-.02-.29z"/>
                </svg>
              </Link>
                <Link 
                  href="https://t.me/yourusername" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-200 transition-colors p-1"
                  aria-label="Telegram"
                >
                  <Send className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/contact" className="hover:text-emerald-200 transition-colors text-xs sm:text-sm">
                Contact Us
              </Link>
              <Link href="/appointment" className="bg-white text-emerald-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold hover:bg-emerald-50 transition-colors">
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-800 hover:text-emerald-600 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="left" className="w-full sm:w-[400px] bg-white border-r-emerald-200 p-0">
                  {/* Mobile Menu Content */}
                  <div className="flex flex-col h-full">
                    {/* Header with Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-emerald-100">
                      <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                        <Image 
                          src="https://i.postimg.cc/Z5xPtcJS/5f3aa4e5-98d9-4cbc-ae08-6b3c948c48ae-removebg-preview.png" 
                          alt="Glad Tidings Health" 
                          width={80}
                          height={80}
                          className="h-16 w-16 object-contain"
                          priority
                        />
                      </Link>
                      <SheetClose asChild>
                        <Button variant="ghost" size="sm" className="p-2">
                          <X className="h-6 w-6" />
                        </Button>
                      </SheetClose>
                    </div>

                    {/* Navigation Menu */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-2">
                      <SheetClose asChild>
                        <Link 
                          href="/" 
                          className={`flex items-center space-x-3 px-4 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                            isActive('/') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <Home className="h-5 w-5" />
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
                              key={item.name}
                              className="text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                              asChild
                            >
                              <SheetClose asChild>
                                <Link href={item.href} className="w-full">
                                  {item.name}
                                </Link>
                              </SheetClose>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <SheetClose asChild>
                        <Link 
                          href="/about" 
                          className={`flex items-center space-x-3 px-4 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                            isActive('/about') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <User className="h-5 w-5" />
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
                              key={item.name}
                              className="text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                              asChild
                            >
                              <SheetClose asChild>
                                <Link href={item.href} className="w-full">
                                  {item.name}
                                </Link>
                              </SheetClose>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <SheetClose asChild>
                        <Link 
                          href="/blog" 
                          className={`flex items-center space-x-3 px-4 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                            isActive('/blog') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <FileText className="h-5 w-5" />
                          <span>Blog</span>
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link 
                          href="/contact" 
                          className={`flex items-center space-x-3 px-4 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                            isActive('/contact') ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <Phone className="h-5 w-5" />
                          <span>Contact</span>
                        </Link>
                      </SheetClose>

                      {/* Divider */}
                      <div className="border-t border-emerald-200 my-4"></div>

                      {/* Special Actions */}
                      <SheetClose asChild>
                        <Link 
                          href="/appointment" 
                          className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
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
                        "Natural Health for Modern Living"
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo - Left */}
            <div className="flex items-center flex-1 md:flex-none">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                <Image 
                  src="https://i.postimg.cc/Z5xPtcJS/5f3aa4e5-98d9-4cbc-ae08-6b3c948c48ae-removebg-preview.png" 
                  alt="Glad Tidings Health" 
                  width={120}
                  height={120}
                  className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain transition-transform duration-300 hover:scale-105"
                  priority
                />
                <span className="text-sm sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-wider hidden xs:block">
                  Glad Tidings Health
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex items-center space-x-1">
                <Link 
                  href="/" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  Home
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        pathname.startsWith('/shop') 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <span>Shop</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[220px] bg-white border-emerald-200 shadow-lg rounded-lg">
                    {shopItems.map((item) => (
                      <DropdownMenuItem 
                        key={item.name}
                        className="text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                        asChild
                      >
                        <Link href={item.href} className="w-full">
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Link 
                  href="/about" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/about') 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  About
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        pathname.startsWith('/courses') 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <span>Courses</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[220px] bg-white border-emerald-200 shadow-lg rounded-lg">
                    {courseItems.map((item) => (
                      <DropdownMenuItem 
                        key={item.name}
                        className="text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                        asChild
                      >
                        <Link href={item.href} className="w-full">
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Link 
                  href="/blog" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/blog') 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  Blog
                </Link>
                
                <Link 
                  href="/contact" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/contact') 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  Contact
                </Link>
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-700 hover:text-emerald-600 p-2"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              {/* Cart */}
              <Link 
                href="/cart" 
                className="flex items-center text-gray-700 hover:text-emerald-600 relative p-2"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              </Link>

              {/* Appointment Button */}
              <Link 
                href="/appointment" 
                className="hidden xs:flex items-center space-x-1 sm:space-x-2 bg-emerald-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-emerald-700 transition-colors text-xs sm:text-sm"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Book</span>
                <span className="sm:hidden">Appt</span>
              </Link>

              {/* Auth */}
              {user ? (
                <SignedIn>
                  <div className="hidden sm:block">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                  <div className="sm:hidden">
                    <Link 
                      href="/profile" 
                      className="flex items-center text-gray-700 hover:text-emerald-600 p-2"
                    >
                      <User className="h-4 w-4" />
                    </Link>
                  </div>
                </SignedIn>
              ) : (
                <SignedOut>
                  <Link 
                    href="/login" 
                    className="flex items-center space-x-1 sm:space-x-2 bg-emerald-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-emerald-700 transition-colors text-xs sm:text-sm"
                  >
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Login</span>
                  </Link>
                </SignedOut>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar (Hidden by default) */}
        {searchOpen && (
          <div className="border-t border-gray-200 bg-gray-50 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for products, courses, articles..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  autoFocus
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

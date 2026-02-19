'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Calendar, LogIn, MessageCircle, Leaf, ShoppingBag, GraduationCap, Home, User, FileText, Phone } from 'lucide-react'
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

export default function MobileNavbar() {
  const [shopOpen, setShopOpen] = useState(false)
  const [coursesOpen, setCoursesOpen] = useState(false)

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

  return (
    <>
      {/* Mobile Navbar Trigger */}
      <div className="lg:hidden fixed top-4 right-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/90 backdrop-blur-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 shadow-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-[320px] sm:w-[400px] bg-gradient-to-br from-emerald-50 to-teal-50 border-l-emerald-200 p-0">
            {/* Header with Logo and Close */}
            <div className="flex items-center justify-between p-6 border-b border-emerald-100 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-lime-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-800 leading-tight">Gladtings</span>
                  <span className="text-sm font-medium text-emerald-600 leading-tight">Health</span>
                  <span className="text-xs text-gray-500 italic hidden sm:block">"Before there were drugs, there was nature"</span>
                </div>
              </div>
              <SheetClose asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </SheetClose>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              <SheetClose asChild>
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 group"
                >
                  <Home className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Home</span>
                </Link>
              </SheetClose>

              {/* Shop with Dropdown */}
              <DropdownMenu open={shopOpen} onOpenChange={setShopOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 group"
                  >
                    <ShoppingBag className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
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
                  className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 group"
                >
                  <User className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>About</span>
                </Link>
              </SheetClose>

              {/* Courses with Dropdown */}
              <DropdownMenu open={coursesOpen} onOpenChange={setCoursesOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 group"
                  >
                    <GraduationCap className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
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
                  className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 group"
                >
                  <FileText className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Blog</span>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link 
                  href="/contact" 
                  className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-gray-700 rounded-xl hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 group"
                >
                  <Phone className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Contact</span>
                </Link>
              </SheetClose>

              {/* Divider */}
              <div className="border-t border-emerald-200 my-4"></div>

              {/* Special Action Items */}
              <SheetClose asChild>
                <Link 
                  href="/appointment" 
                  className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 group shadow-lg"
                >
                  <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Book Appointment</span>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link 
                  href="/login" 
                  className="flex items-center space-x-3 px-4 py-4 text-lg font-medium text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 group shadow-lg"
                >
                  <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Login</span>
                </Link>
              </SheetClose>
            </div>

            {/* Footer with Tagline */}
            <div className="p-6 border-t border-emerald-100 bg-white/60 backdrop-blur-sm">
              <p className="text-center text-sm text-gray-600 italic">
                "Before there were drugs, there was nature"
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/254723730980"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-pulse"
      >
        <MessageCircle className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
      </a>
    </>
  )
}

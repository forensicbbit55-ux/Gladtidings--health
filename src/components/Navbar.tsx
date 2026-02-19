'use client'

import Link from 'next/link'
import { Heart, ChevronDown, Home, Briefcase, Users, FileText, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Navbar() {

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Services', href: '/services', icon: Briefcase },
    { name: 'Portfolio', href: '/portfolio', icon: FileText },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Contact', href: '/contact', icon: Phone },
  ]

  const dropdownItems = [
    'Web Development',
    'Mobile Apps', 
    'AI Solutions',
    'Cloud Services',
    'Digital Marketing',
    'IT Consulting'
  ]

  return (
    <>
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">Gladtings</span>
                <span className="text-sm font-light text-slate-300 leading-tight">Health</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-slate-300 hover:text-emerald-400 transition-colors duration-200 group py-2"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Right Side - What We Offer Dropdown */}
            <div className="hidden lg:flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-emerald-400 hover:bg-slate-800 transition-all duration-200 px-4 py-2"
                  >
                    What we offer
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-slate-800 border-slate-700 text-white min-w-[200px] shadow-xl"
                >
                  {dropdownItems.map((item) => (
                    <DropdownMenuItem 
                      key={item}
                      className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer transition-colors duration-200"
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="hidden lg:block h-16 lg:h-20"></div>
    </>
  )
}

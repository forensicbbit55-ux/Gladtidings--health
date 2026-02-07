'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// SEO metadata for home page
export const metadata = {
  title: 'Glad Tidings - Medical Missionary Health & Wellness',
  description: 'Discover natural health remedies, medical missionary insights, and holistic wellness tips. Your trusted source for spiritual health and natural healing.',
  keywords: [
    'medical missionary',
    'natural health',
    'wellness center',
    'holistic healing',
    'spiritual wellness',
    'herbal remedies',
    'health consultations',
    'natural medicine',
    'alternative health',
    'medical missionary services'
  ],
  openGraph: {
    title: 'Glad Tidings - Medical Missionary Health & Wellness',
    description: 'Discover natural health remedies, medical missionary insights, and holistic wellness tips. Your trusted source for spiritual health and natural healing.',
    type: 'website',
    images: [
      {
        url: '/images/home-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Glad Tidings Medical Missionary Health & Wellness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glad Tidings - Medical Missionary Health & Wellness',
    description: 'Discover natural health remedies, medical missionary insights, and holistic wellness tips.',
    images: ['/images/home-og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Medical Mission',
      subtitle: 'Serving Communities',
      description: 'Bringing healthcare and hope to underserved communities worldwide'
    },
    {
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Professional Healthcare',
      subtitle: 'Expert Medical Care',
      description: 'Compassionate healthcare professionals dedicated to your wellness'
    },
    {
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Natural Products',
      subtitle: 'Organic Solutions',
      description: 'Fresh organic products delivered to your doorstep'
    },
    {
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'True Healing Balm',
      subtitle: 'Divine Restoration',
      description: 'Experience complete healing through natural remedies and faith-based care'
    },
    {
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Three Angels Message',
      subtitle: 'Eternal Gospel',
      description: 'Sharing the everlasting gospel and health message to the world',
      hasLogo: true
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'exotic', name: 'Exotic Fruit', icon: '🍋' },
    { id: 'healthy', name: 'Healthy Food', icon: '🥬' },
    { id: 'organic', name: 'Organic Products', icon: '🌿' }
  ]

  const products = [
    { id: 1, name: 'European Lemon Zest', category: 'Cruciferous', price: 12.99, rating: 4.5, image: '/api/placeholder/200/200', badge: 'New' },
    { id: 2, name: 'Cabbage Band Gobhi', category: 'Cruciferous', price: 8.99, rating: 4.3, image: '/api/placeholder/200/200' },
    { id: 3, name: 'Aurore Grape', category: 'Green Vegetable', price: 15.99, rating: 4.7, image: '/api/placeholder/200/200', badge: 'Sale' },
    { id: 4, name: 'Organic Maize', category: 'Whole Grain', price: 9.99, rating: 4.4, image: '/api/placeholder/200/200' },
    { id: 5, name: 'Chinese Cabbage', category: 'Cruciferous', price: 7.99, rating: 4.2, image: '/api/placeholder/200/200' },
    { id: 6, name: 'Green Beans – 1 Kg', category: 'Broad Beans', price: 11.99, rating: 4.6, image: '/api/placeholder/200/200', badge: 'Best Seller' },
    { id: 7, name: 'Fresh Drinks', category: 'Beverages', price: 6.99, rating: 4.8, image: '/api/placeholder/200/200', badge: 'Popular' },
    { id: 8, name: 'Cucumber', category: 'Allium', price: 5.99, rating: 4.1, image: '/api/placeholder/200/200' },
    { id: 9, name: 'German Chilies Local', category: 'Green Peas', price: 8.49, rating: 4.0, image: '/api/placeholder/200/200' }
  ]

  const features = [
    { icon: '🚚', title: 'Free Shipping', description: 'Free shipping on qualifying orders and select natural remedy bundles.' },
    { icon: '🎧', title: 'Support 24/7', description: 'Caring support for questions about products, lifestyle changes, and prayer.' },
    { icon: '↩️', title: 'Easy Returns', description: 'Simple return options if something isn\'t the right fit for you.' },
    { icon: '🔒', title: '100% Payment Secure', description: 'Secure checkout for every order with trusted payment providers.' }
  ]

  const blogPosts = [
    { title: 'Review of Healthy Breakfast Meals for Energy Boost', category: 'Nutrition', date: '2 days ago' },
    { title: 'Simple Kitchen Habits for a More Plant-Based Life', category: 'Lifestyle', date: '5 days ago' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden border-b-4 border-emerald-600">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-gray-800/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                {slide.hasLogo && (
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                        <path fill="white" d="M12 4L4 8v9c0 4.42 3.07 8.54 7 9.66V4z"/>
                        <path d="M12 8l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z"/>
                      </svg>
                    </div>
                  </div>
                )}
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">{slide.subtitle}</h2>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{slide.description}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/products" className="bg-amber-500 hover:bg-amber-600 text-emerald-900 px-8 py-3 rounded-lg font-bold transition-colors">
                    Shop Now
                  </Link>
                  <Link href="/consultation" className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                    Get Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {categories.map((category) => (
              <div key={category.id} className="text-center group cursor-pointer">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  View Products →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">New Products</h2>
            <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-t-lg" />
                  {product.badge && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(Math.floor(product.rating))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-emerald-600">${product.price}</span>
                    <button className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Best Sellers products</h2>
            <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(5, 9).map((product) => (
              <div key={product.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-4" />
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <span className="text-lg font-bold text-emerald-600">${product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Section */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">SALE 50% OFF</h2>
          <p className="text-xl mb-8">Limited time offer on selected natural remedies</p>
          <Link href="/products?sale=true" className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Shop Sale Items
            </Link>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
            <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(1, 5).map((product) => (
              <div key={product.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-4" />
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <span className="text-lg font-bold text-emerald-600">${product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest Posts</h2>
            <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {blogPosts.map((post, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-emerald-600 font-medium">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Remedies</h3>
              <p className="text-gray-600">Discover the healing power of nature through proven herbal remedies and nutritional guidance.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gospel Ministry</h3>
              <p className="text-gray-600">Experience the life-changing message of hope, grace, and redemption through community fellowship.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifestyle Education</h3>
              <p className="text-gray-600">Learn practical principles for healthy living through comprehensive education on nutrition.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Us in Our Mission</h2>
            <p className="text-xl mb-8">Whether you're seeking healing, want to serve, or need prayer support, we welcome you to be part of this transformative journey. Together, we can bring hope and restoration to communities near and far.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/contact" className="bg-amber-500 text-emerald-900 px-8 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors">
                Join the Mission
              </Link>
              <Link href="/contact" className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Request Prayer
              </Link>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">Get Discount 30% Off</h2>
            <p className="text-lg mb-8 text-center">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
            <p className="text-lg mb-8 text-center">We ship hope and health everywhere through practical natural remedies and Christ-centered care.</p>
            <p className="text-lg mb-8 text-center">We ship everywhere! Free in the US for selected orders.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact</h3>
                <p className="mb-2">info@yourdomain.com</p>
                <p>+1 (403) 253-7717</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Address</h3>
                <p>123 Ave, Lorem City, Site Country, the World</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Social</h3>
                <div className="space-y-1">
                  <p>Instagram</p>
                  <p>Twitter</p>
                  <p>Facebook</p>
                  <p>LinkedIn</p>
                  <p>YouTube</p>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-8 border-t border-emerald-500">
              <p>&copy; 2026 Glad Tidings. All rights reserved.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { getCartItems, addToCart } from '@/lib/cart';

export default function HomeClient() {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [remedies, setRemedies] = useState([])
  const [loading, setLoading] = useState(true)

  const formatPrice = (price) => {
    return `KSH ${parseFloat(price).toFixed(2)}`
  }

  const handleAddToCart = (remedy) => {
    if (!isSignedIn) {
      router.push('/sign-in?callbackUrl=/')
      return
    }

    // Convert remedy to cart format
    const cartItem = {
      id: remedy.id,
      title: remedy.title,
      price: remedy.price,
      image_url: remedy.imageUrl || (remedy.images && remedy.images[0]) || '/images/placeholder.jpg',
      quantity: 1
    }

    addToCart(cartItem)
    
    // Show success feedback
    const button = document.getElementById(`home-add-to-cart-${remedy.id}`)
    if (button) {
      const originalText = button.textContent
      button.textContent = '✓ Added!'
      button.classList.add('bg-green-600')
      
      setTimeout(() => {
        button.textContent = originalText
        button.classList.remove('bg-green-600')
      }, 1500)
    }
  }

  // Fetch remedies from API
  useEffect(() => {
    const fetchRemedies = async () => {
      try {
        const response = await fetch('/api/remedies')
        const data = await response.json()
        if (data.success) {
          setRemedies(data.data)
        }
      } catch (error) {
        console.error('Error fetching remedies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRemedies()
  }, [])

  const slides = [
    {
      id: 'slide-1',
      title: 'Medical Missionary Services',
      subtitle: 'Natural Health Solutions',
      description: 'Discover holistic wellness through natural remedies and spiritual health practices',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'slide-2',
      title: 'Spiritual Wellness',
      subtitle: 'Faith-Based Healing',
      description: 'Integrating spiritual practices with natural health for complete wellness',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'slide-3',
      title: 'Community Health',
      subtitle: 'Medical Missionary Outreach',
      description: 'Serving communities with natural health education and spiritual support',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
    }
  ]

  const categories = [
    { id: 'herbal', name: 'Herbal Remedies', icon: '🌿' },
    { id: 'wellness', name: 'Wellness', icon: '💚' },
    { id: 'spiritual', name: 'Spiritual Health', icon: '🙏' }
  ]

  const blogPosts = [
    { id: 1, title: 'Natural Remedies for Seasonal Wellness', category: 'Health Tips', date: '2 days ago', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', excerpt: 'Discover natural ways to boost your immune system during seasonal changes with herbal remedies and lifestyle adjustments.', slug: 'natural-remedies-seasonal-wellness', readTime: '5 min read' },
    { id: 2, title: 'Spiritual Practices for Holistic Healing', category: 'Spiritual Health', date: '5 days ago', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', excerpt: 'Explore how spiritual practices can complement natural healing methods for complete wellness.', slug: 'spiritual-practices-holistic-healing', readTime: '7 min read' },
    { id: 3, title: 'The Power of Herbal Medicine', category: 'Herbal Remedies', date: '1 week ago', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop', excerpt: 'Understanding the healing properties of traditional herbal medicines and their modern applications.', slug: 'power-herbal-medicine', readTime: '6 min read' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Carousel Section */}
      <section className="relative h-[180px] sm:h-[250px] md:h-[300px] overflow-hidden border-b-4 border-emerald-600">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 via-teal-600/80 to-emerald-700/90">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-emerald-400/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-teal-400/20 rounded-full animate-pulse"></div>
        </div>

        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              currentSlide === slides.indexOf(slide) 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <div className="absolute inset-0">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-transparent to-teal-900/80"></div>
            </div>
            
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-center md:text-left max-w-3xl">
                  <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
                    <span className="text-white text-sm font-medium">{slide.subtitle}</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    {slide.title}
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl drop-shadow-lg">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Link 
                      href="/shop" 
                      className="px-8 py-4 bg-white text-emerald-700 rounded-full font-semibold text-lg hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50"
                    >
                      Explore Products
                    </Link>
                    <Link 
                      href="/appointment" 
                      className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-emerald-700 transform hover:scale-105 transition-all duration-300"
                    >
                      Book Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 border border-white/30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 border border-white/30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Remedies Section */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block px-4 py-2 bg-emerald-100 rounded-full mb-4">
              <span className="text-emerald-700 text-sm font-semibold">Featured Products</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Natural Health Remedies
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of natural remedies for your wellness journey
            </p>
          </div>
          
          {remedies.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🌿</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h3>
              <p className="text-gray-600 mb-4">Natural remedies will appear here soon</p>
              <Link 
                href="/shop"
                className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Visit Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
              {remedies.slice(0, 12).map((remedy) => (
                <div key={remedy.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
                  {/* Product Image */}
                  <div className="relative h-16 sm:h-20 bg-gray-100">
                    {remedy.images && remedy.images.length > 0 ? (
                      <img
                        src={remedy.images[0]}
                        alt={remedy.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                        <div className="text-emerald-600 text-lg sm:text-xl">🌿</div>
                      </div>
                    )}
                    <span className="absolute top-1 right-1 bg-emerald-500 text-white px-1 py-0.5 rounded-full text-xs">
                      New
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-2 sm:p-3">
                    {/* Category Badge */}
                    {remedy.category && (
                      <div className="mb-1">
                        <span className="inline-block px-1 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          {remedy.category.name}
                        </span>
                      </div>
                    )}

                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{remedy.title}</h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-bold text-emerald-600">KES {remedy.price}</span>
                      <span className="text-xs text-gray-500">Natural</span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        id={`home-add-to-cart-${remedy.id}`}
                        onClick={() => handleAddToCart(remedy)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1 px-1 rounded transition-colors duration-200 flex items-center justify-center"
                      >
                        <ShoppingCart className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Add
                      </button>
                      <Link 
                        href={`/shop`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs p-1 rounded transition-colors"
                      >
                        →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {remedies.length > 0 && (
            <div className="text-center mt-6">
              <Link 
                href="/shop"
                className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                View All Remedies
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <div className="fixed right-4 sm:right-8 bottom-4 sm:bottom-8 z-50 group">
        {/* Wave Effect Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-16 h-16 rounded-full border-2 border-green-400 animate-ping"></div>
          <div className="absolute w-20 h-20 rounded-full border border-green-300 animate-ping animation-delay-200"></div>
          <div className="absolute w-24 h-24 rounded-full border border-green-200 animate-ping animation-delay-400"></div>
        </div>
        
        <Link 
          href="https://wa.me/254723730980" 
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse border-2 border-green-400"
          aria-label="Chat with us on WhatsApp"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.891m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 9.891-5.335 9.891-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </Link>
        
        {/* Tooltip Message */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
            Contact us here for support!
            <div className="absolute top-full right-4 -mt-1">
              <div className="border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-6 sm:py-8 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block px-4 py-2 bg-emerald-100 rounded-full mb-4">
              <span className="text-emerald-700 text-sm font-semibold">Explore Our Products</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Discover natural remedies and wellness solutions
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {categories.map((category) => (
              <div key={category.id} className="group relative">
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-3xl transform group-hover:scale-105 transition-all duration-300"></div>
                
                {/* Card Content */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100/50">
                  {/* Icon Container */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-4 transform group-hover:rotate-6 transition-transform duration-300">
                    <span className="text-2xl sm:text-3xl">{category.icon}</span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">{category.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm text-center mb-4">
                    {category.id === 'herbal' && 'Natural herbal remedies for optimal health'}
                    {category.id === 'wellness' && 'Complete wellness solutions'}
                    {category.id === 'spiritual' && 'Spiritual health resources'}
                  </p>
                  
                  <div className="text-center">
                    <Link 
                      href={`/shop/${category.id}`}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 group-hover:bg-emerald-700"
                    >
                      Explore Category
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-4 py-2 bg-emerald-100 rounded-full mb-4">
              <span className="text-emerald-700 text-sm font-semibold">Health Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Latest Blog Posts
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay informed with our latest health and wellness insights from expert practitioners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post, index) => (
              <article key={post.id} className="group relative">
                {/* Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-2xl transform group-hover:scale-105 transition-all duration-300 blur-xl"></div>
                
                {/* Card */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-emerald-100/50 group-hover:border-emerald-200/70">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors duration-300">
                      {post.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {/* Read More Link */}
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold transition-all duration-300 group"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
            >
              View All Articles
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Remedies Section */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 animate-fade-in">Featured Natural Remedies</h2>
            <Link href="/remedies" className="btn-outline">
              View All Remedies →
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🌿</div>
              <p className="text-gray-600">Loading natural remedies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {remedies.slice(0, 8).map((remedy, index) => (
                <div key={remedy.id} className="product-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative overflow-hidden rounded-t-xl">
                    {remedy.images && remedy.images.length > 0 ? (
                      <img 
                        src={remedy.images[0]} 
                        alt={remedy.title} 
                        className="product-image w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                        <div className="text-emerald-600 text-4xl">🌿</div>
                      </div>
                    )}
                    {remedy.featured && (
                      <span className="product-badge">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{remedy.title}</h3>
                    <p className="text-gray-600 mb-4">{remedy.category?.name || 'Natural Remedy'}</p>
                    
                    {remedy.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{remedy.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-emerald-600">{formatPrice(remedy.price)}</span>
                      <Link 
                        href={`/remedies/${remedy.slug}`}
                        className="btn-primary text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Health Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover natural health tips and spiritual wellness practices from our medical missionary experts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.category}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-emerald-600 transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <Link href="/blog" className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Get the latest health tips, natural remedies, and spiritual insights delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-emerald-900 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

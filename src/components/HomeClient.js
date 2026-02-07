'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomeClient() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

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

  const products = [
    { id: 1, name: 'Natural Herbal Tea Blend', category: 'Herbal Remedies', price: 12.99, rating: 4.5, image: '/images/products/herbal-tea.jpg', badge: 'New' },
    { id: 2, name: 'Organic Echinacea Extract', category: 'Immune Support', price: 8.99, rating: 4.3, image: '/images/products/echinacea.jpg' },
    { id: 3, name: 'Essential Oil Collection', category: 'Aromatherapy', price: 15.99, rating: 4.7, image: '/images/products/essential-oils.jpg', badge: 'Sale' },
    { id: 4, name: 'Natural Vitamin C Complex', category: 'Supplements', price: 9.99, rating: 4.4, image: '/images/products/vitamin-c.jpg' },
    { id: 5, name: 'Herbal Detox Formula', category: 'Cleansing', price: 7.99, rating: 4.2, image: '/images/products/detox.jpg' },
    { id: 6, name: 'Organic Ginger Root', category: 'Digestive Health', price: 11.99, rating: 4.6, image: '/images/products/ginger.jpg', badge: 'Best Seller' },
    { id: 7, name: 'Natural Sleep Aid', category: 'Wellness', price: 6.99, rating: 4.8, image: '/images/products/sleep-aid.jpg', badge: 'Popular' },
    { id: 8, name: 'Probiotic Supplement', category: 'Digestive Health', price: 5.99, rating: 4.1, image: '/images/products/probiotic.jpg' },
    { id: 9, name: 'Natural Pain Relief', category: 'Pain Management', price: 8.49, rating: 4.0, image: '/images/products/pain-relief.jpg' }
  ]

  const features = [
    { id: 1, icon: '🚚', title: 'Free Shipping', description: 'Free shipping on qualifying orders and select natural remedy bundles.' },
    { id: 2, icon: '🎧', title: 'Support 24/7', description: 'Caring support for questions about products, lifestyle changes, and prayer.' },
    { id: 3, icon: '↩️', title: 'Easy Returns', description: 'Simple return options if something isn\'t the right fit for you.' },
    { id: 4, icon: '🔒', title: '100% Payment Secure', description: 'Secure checkout for every order with trusted payment providers.' }
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden border-b-4 border-emerald-600">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === slides.indexOf(slide) ? 'opacity-100' : 'opacity-0'
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
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">{slide.subtitle}</h2>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-in">
              Comprehensive natural health solutions for your wellness journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={category.id} className="feature-card animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="feature-icon">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.name}</h3>
                <p className="text-gray-600 text-center">{category.description}</p>
                <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200">
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Latest Blog Posts</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-in">
              Stay informed with our latest health and wellness insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post, index) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-t-xl" />
                  <div className="absolute top-4 right-4">
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-gray-500 text-sm">{post.date}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" className="btn-primary">
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-16 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 animate-fade-in">New Products</h2>
            <Link href="/products" className="btn-outline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, index) => (
              <div key={product.id} className="product-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative overflow-hidden rounded-t-xl">
                  <img src={product.image} alt={product.name} className="product-image" />
                  {product.badge && (
                    <span className="product-badge">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.category}</p>
                  <div className="flex items-center mb-4">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="text-sm text-gray-600 ml-2">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600">{product.price}</span>
                    <button className="btn-primary text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

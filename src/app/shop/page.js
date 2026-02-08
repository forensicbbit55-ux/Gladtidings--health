'use client'

import { useState } from 'react';
;import Link from 'next/link'
;
;export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 100])

  const categories = ['all', 'exotic', 'healthy', 'organic']
  const products = [
    { id: 1, name: 'European Lemon Zest', category: 'exotic', price: 12.99, rating: 4.5, image: '/api/placeholder/200/200', badge: 'New' },
    { id: 2, name: 'Cabbage Band Gobhi', category: 'healthy', price: 8.99, rating: 4.3, image: '/api/placeholder/200/200' },
    { id: 3, name: 'Aurore Grape', category: 'exotic', price: 15.99, rating: 4.7, image: '/api/placeholder/200/200', badge: 'Sale' },
    { id: 4, name: 'Organic Maize', category: 'organic', price: 9.99, rating: 4.4, image: '/api/placeholder/200/200' },
    { id: 5, name: 'Chinese Cabbage', category: 'healthy', price: 7.99, rating: 4.2, image: '/api/placeholder/200/200' },
    { id: 6, name: 'Green Beans – 1 Kg', category: 'organic', price: 11.99, rating: 4.6, image: '/api/placeholder/200/200', badge: 'Best Seller' },
    { id: 7, name: 'Fresh Drinks', category: 'organic', price: 6.99, rating: 4.8, image: '/api/placeholder/200/200', badge: 'Popular' },
    { id: 8, name: 'Cucumber', category: 'healthy', price: 5.99, rating: 4.1, image: '/api/placeholder/200/200' },
    { id: 9, name: 'German Chilies Local', category: 'exotic', price: 8.49, rating: 4.0, image: '/api/placeholder/200/200' }
  ]

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    return categoryMatch && priceMatch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Shop</h1>
          <p className="text-center text-emerald-100 mt-2">Discover our premium organic products</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded capitalize transition-colors ${
                      selectedCategory === category 
                        ? 'bg-emerald-600 text-white' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-4">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{filteredProducts.length} products found</p>
              <select className="border border-gray-300 rounded px-3 py-2">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
                    {product.badge && (
                      <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 capitalize">{product.category}</p>
                    <div className="flex items-center mb-2">
                      <div className="flex text-amber-400 text-sm">
                        {'★'.repeat(Math.floor(product.rating))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
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
        </div>
      </div>
    </div>
  )
};;

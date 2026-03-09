'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Search, Filter } from 'lucide-react'
import { getCartItems, addToCart } from '@/lib/cart'

export default function ShopPage() {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [remedies, setRemedies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    // Fetch remedies from API
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

  // Get unique categories from remedies
  const categories = ['all', ...Array.from(new Set(remedies.map(remedy => remedy.category?.name).filter(Boolean)))]

  // Filter remedies
  const filteredRemedies = remedies.filter(remedy => {
    const matchesCategory = selectedCategory === 'all' || remedy.category?.name === selectedCategory
    const matchesSearch = remedy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         remedy.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddToCart = (remedy) => {
    console.log('Shop handleAddToCart called')
    console.log('isSignedIn:', isSignedIn)
    console.log('remedy:', remedy)
    
    if (!isSignedIn) {
      console.log('Not signed in, redirecting to sign-in')
      router.push('/sign-in?callbackUrl=/shop')
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

    console.log('Adding cartItem:', cartItem)
    addToCart(cartItem)
    
    // Show success feedback
    const button = document.getElementById(`add-to-cart-${remedy.id}`)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading remedies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Natural Remedies Shop</h1>
            <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto">
              Discover our collection of natural health remedies crafted from the finest herbs
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search remedies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredRemedies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌿</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Remedies Found</h2>
            <p className="text-gray-600 mb-6">
              {remedies.length === 0 
                ? "No remedies available yet." 
                : "No remedies match your search criteria."
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredRemedies.map((remedy) => (
              <div key={remedy.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                {/* Product Image */}
                <div className="relative h-24 sm:h-28 bg-gray-200">
                  {remedy.images && remedy.images.length > 0 ? (
                    <img
                      src={remedy.images[0]}
                      alt={remedy.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                      <div className="text-emerald-600 text-2xl sm:text-3xl">🌿</div>
                    </div>
                  )}
                  <span className="absolute top-1 right-1 bg-emerald-500 text-white px-1 py-0.5 rounded-full text-xs">
                    Stock
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

                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{remedy.title}</h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm sm:text-base font-bold text-emerald-600">KES {remedy.price}</span>
                    <span className="text-xs text-gray-500">Natural</span>
                  </div>

                  <button
                    id={`add-to-cart-${remedy.id}`}
                    onClick={() => handleAddToCart(remedy)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm py-1.5 px-2 rounded transition-colors duration-200 flex items-center justify-center"
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

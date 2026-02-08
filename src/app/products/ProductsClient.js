'use client'

import { useState, useEffect } from 'react';
;import Link from 'next/link';
;import { useRouter, useSearchParams } from 'next/navigation'
;
;export default function ProductsClient({ categories, remedies, initialCategory }) {
  const [filteredRemedies, setFilteredRemedies] = useState(remedies)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setSelectedCategory(initialCategory)
  }, [initialCategory])

  useEffect(() => {
    const category = searchParams.get('category')
    if (category !== selectedCategory) {
      setSelectedCategory(category || 'all')
    }
  }, [searchParams, selectedCategory])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    
    // Update URL
    const params = new URLSearchParams(searchParams)
    if (categoryId === 'all') {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`
    router.push(newUrl, { scroll: false })
    
    // Filter remedies
    if (categoryId === 'all') {
      setFilteredRemedies(remedies)
    } else {
      setFilteredRemedies(remedies.filter(remedy => remedy.category_id === categoryId))
    }
  }

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No remedies found</h3>
      <p className="text-gray-500 mb-4">
        {selectedCategory !== 'all' 
          ? 'No remedies available in this category.' 
          : 'No remedies available yet.'
        }
      </p>
      {selectedCategory !== 'all' && (
        <button
          onClick={() => handleCategoryChange('all')}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          View All Categories
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Natural Remedies</h1>
          <p className="mt-2 text-gray-600">Discover our collection of natural health remedies</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Empty State */}
        {!loading && filteredRemedies.length === 0 && <EmptyState />}

        {/* Remedies Grid */}
        {!loading && filteredRemedies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRemedies.map((remedy) => (
              <div key={remedy.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {remedy.image_url ? (
                  <img
                    src={remedy.image_url}
                    alt={remedy.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{remedy.title}</h3>
                    {remedy.category_name && (
                      <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                        {remedy.category_name}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {remedy.description}
                  </p>
                  
                  {remedy.usage && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Usage:</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{remedy.usage}</p>
                    </div>
                  )}
                  
                  <Link
                    href={`/products/${remedy.id}`}
                    className="block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
};;

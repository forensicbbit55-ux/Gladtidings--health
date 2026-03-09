'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import ImageCarousel from '@/components/ImageCarousel'
import { getCartItems, addToCart } from '@/lib/cart'

export default function RemediesPage() {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [remedies, setRemedies] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    // Load cart items
    const items = getCartItems()
    setCartItems(items)

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updatedItems = getCartItems()
      setCartItems(updatedItems)
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

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

  const handleAddToCart = (remedy) => {
    if (!isSignedIn) {
      router.push('/login?callbackUrl=/remedies')
      return
    }

    // Convert remedy to cart format
    const cartItem = {
      id: remedy.id,
      title: remedy.title,
      price: remedy.price,
      image_url: remedy.imageUrl || '/images/placeholder.jpg',
      quantity: 1
    }

    addToCart(cartItem)
    
    // Update cart items
    const updatedItems = getCartItems()
    setCartItems(updatedItems)
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
      {/* Image Carousel */}
      <ImageCarousel />

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="container responsive-padding-lg">
          <div className="text-center">
            <h1 className="text-responsive-3xl md:text-responsive-4xl font-bold mb-4 text-white">Natural Health Remedies</h1>
            <p className="text-responsive-lg md:text-responsive-xl text-emerald-100 max-w-2xl mx-auto">
              Discover our collection of natural remedies crafted from the finest herbs and natural ingredients
            </p>
            <div className="mt-6">
              <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white">
                {remedies.length} Remedies Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Remedies Grid */}
      <div className="container responsive-padding-lg responsive-margin-xl">
        {remedies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌿</div>
            <h2 className="text-responsive-2xl font-semibold text-gray-800 mb-2">No Remedies Yet</h2>
            <p className="text-gray-600 mb-6">
              Natural remedies will appear here once they are added to system.
            </p>
          </div>
        ) : (
          <div className="responsive-grid responsive-grid-2 lg:responsive-grid-3">
            {remedies.map((remedy) => (
              <div key={remedy.id} className="card">
                {/* Image */}
                {remedy.images && remedy.images.length > 0 ? (
                  <div className="aspect-video relative">
                    <img
                      src={remedy.images[0]}
                      alt={remedy.title}
                      className="card-image"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                    <div className="text-emerald-600 text-4xl">🌿</div>
                  </div>
                )}

                {/* Content */}
                <div className="card-content">
                  {/* Category Badge */}
                  {remedy.category && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        {remedy.category.name}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-responsive-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                    {remedy.title}
                  </h3>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-responsive-xl font-bold text-green-600">
                      KSH {parseFloat(remedy.price?.toString() || '0').toFixed(2)}
                    </span>
                  </div>

                  {/* Description */}
                  {remedy.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3 text-responsive-sm">
                      {remedy.description}
                    </p>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(remedy)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
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

'use client'

import { useState, useEffect, useRef } from 'react'
;
;export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop',
      alt: 'Medical missionary work',
      title: 'Healing Communities',
      subtitle: 'Bringing hope through medical care'
    },
    {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=600&fit=crop',
      alt: 'Natural remedies',
      title: 'Natural Health Solutions',
      subtitle: 'Discover the power of natural healing'
    },
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
      alt: 'Spiritual guidance',
      title: 'Spiritual Wellness',
      subtitle: 'Nurturing body, mind, and spirit'
    },
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop',
      alt: 'Community support',
      title: 'Community Care',
      subtitle: 'Together we make a difference'
    }
  ]

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToSlide = (index) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeThreshold = 50
    const diff = touchStartX.current - touchEndX.current
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide() // Swipe left - next slide
      } else {
        prevSlide() // Swipe right - previous slide
      }
    }
  }

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className="relative w-full h-[600px] overflow-hidden bg-gray-900"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        <div
          className={`flex transition-transform duration-500 ease-in-out h-full ${
            isTransitioning ? '' : ''
          }`}
          style={ transform: `translateX(-${currentIndex * 100}%)` }
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              {/* Enhanced overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                  <h1 className="text-5xl md:text-7xl font-black mb-4 text-white drop-shadow-2xl">
                    {image.title}
                  </h1>
                  <p className="text-2xl md:text-3xl text-gray-100 mb-8 font-medium drop-shadow-lg">
                    {image.subtitle}
                  </p>
                  <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto drop-shadow-md">
                    We are dedicated to medical missionary work that combines natural healing remedies 
                    with the transformative power of the Gospel, bringing wholeness to both physical 
                    health and spiritual well-being.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};;

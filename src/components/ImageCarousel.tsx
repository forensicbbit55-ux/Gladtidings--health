'use client'

import { useState, useEffect } from 'react'

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
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
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  const nextSlide = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }

  return (
    <div className="relative w-full h-[35px] md:h-[40px] overflow-hidden bg-gray-900">
      <div className="relative w-full h-full">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-black mb-2 text-white drop-shadow-2xl">
              {images[currentIndex].title}
            </h1>
            <p className="text-lg md:text-2xl text-gray-100 mb-3 font-medium drop-shadow-lg">
              {images[currentIndex].subtitle}
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
      
      <button
        onClick={prevSlide}
        className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-0.5 rounded-full transition-all duration-300 z-10"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-0.5 rounded-full transition-all duration-300 z-10"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

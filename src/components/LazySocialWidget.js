'use client'

import { useState, useEffect, useRef } from 'react'
;
;export default function LazySocialWidget({ platform, children, threshold = 0.1 }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const widgetRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (widgetRef.current) {
      observer.observe(widgetRef.current)
    }

    return () => {
      if (widgetRef.current) {
        observer.unobserve(widgetRef.current)
      }
    }
  }, [threshold])

  useEffect(() => {
    if (isVisible && !isLoaded) {
      // Simulate loading delay for social widgets
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isVisible, isLoaded])

  return (
    <div ref={widgetRef} className="social-widget-container">
      {isVisible ? (
        <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {children}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full mb-2"></div>
            <div className="w-16 h-2 bg-gray-300 rounded"></div>
          </div>
        </div>
      )}
    </div>
  )
};;

// Twitter Widget Component
export const TwitterWidget = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-black text-white p-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
        <span className="font-semibold">Latest Tweets</span>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-900">🌿 New wellness workshop starting next week! Join us for a transformative experience.</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span>2 hours ago</span>
              <span className="mx-2">•</span>
              <span>45 likes</span>
            </div>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-900">Did you know? Natural herbs can help boost your immune system.</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span>5 hours ago</span>
              <span className="mx-2">•</span>
              <span>32 likes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Facebook Widget Component
export const FacebookWidget = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-blue-600 text-white p-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span className="font-semibold">Facebook Posts</span>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          <div className="border-b pb-3">
            <p className="text-sm text-gray-900">Join us this Saturday for our free wellness workshop!</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span>3 hours ago</span>
              <span className="mx-2">•</span>
              <span>67 likes</span>
              <span className="mx-2">•</span>
              <span>15 shares</span>
            </div>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-gray-900">Client testimonial: "The natural health consultation changed my life!"</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span>1 day ago</span>
              <span className="mx-2">•</span>
              <span>89 likes</span>
              <span className="mx-2">•</span>
              <span>22 shares</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Instagram Widget Component
export const InstagramWidget = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.85-.148 3.252-.148 4.771-1.691 4.919-4.919.058-1.265.069-1.645.069-4.849 0-3.204-.012-3.584-.07-4.85-.148-3.252-.148-4.771 1.691-4.919 4.919-.058 1.265-.069 1.645-.069 4.849 0 3.204.012 3.584.07 4.85.148 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.85-.148 3.252-.148 4.771-1.691 4.919-4.919.058-1.265-.069-1.645-.069-4.849zm-4.85 14.637c-2.418 0-4.377-1.959-4.377-4.377s1.959-4.377 4.377-4.377 4.377 1.959 4.377 4.377-1.959 4.377-4.377 4.377zm7.461-8.688c0-.584-.474-1.058-1.058-1.058s-1.058.474-1.058 1.058.474 1.058 1.058 1.058z"/>
        </svg>
        <span className="font-semibold">Instagram Feed</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src="/api/placeholder/200/200" 
              alt="Instagram post" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src="/api/placeholder/200/200" 
              alt="Instagram post" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src="/api/placeholder/200/200" 
              alt="Instagram post" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src="/api/placeholder/200/200" 
              alt="Instagram post" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

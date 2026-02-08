'use client'

import { useState } from 'react'

export default function BlogShareButtons({ 
  url, 
  title, 
  description, 
  imageUrl,
  className = '' 
}) {
  const [copied, setCopied] = useState(false)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&via=gladtidings`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(description)}&media=${encodeURIComponent(imageUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\nRead more: ${url}`)}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleShare = (platform, shareUrl) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={() => handleShare('facebook', shareLinks.facebook)}
        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        aria-label="Share on Facebook"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </button>

      <button
        onClick={() => handleShare('twitter', shareLinks.twitter)}
        className="flex items-center px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        aria-label="Share on Twitter"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
        Twitter
      </button>

      <button
        onClick={() => handleShare('linkedin', shareLinks.linkedin)}
        className="flex items-center px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.064-2.063zM1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </button>

      <button
        onClick={() => handleShare('pinterest', shareLinks.pinterest)}
        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        aria-label="Share on Pinterest"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.85-.148 3.252-.148 4.771-1.691 4.919-4.919.058-1.265.069-1.645.069-4.849 0-3.204.012-3.584-.07-4.85-.148-3.252-.148-4.771 1.691-4.919 4.919-.058 1.265-.069 1.645-.069 4.849 0 3.204.012 3.584.07 4.85.148 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.85-.148 3.252-.148 4.771-1.691 4.919-4.919.058-1.265-.069-1.645-.069-4.849zm-4.85 14.637c-2.418 0-4.377-1.959-4.377-4.377s1.959-4.377 4.377-4.377 4.377 1.959 4.377 4.377-1.959 4.377-4.377zm7.461-8.688c0-.584-.474-1.058-1.058-1.058s-1.058.474-1.058 1.058.474 1.058 1.058z"/>
        </svg>
        Pinterest
      </button>

      <button
        onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        aria-label="Share on WhatsApp"
      >
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.23-1.115l-2.415-.982c-.242-.099-.5-.15-.77-.063-.277.087-.55.218-.77.063-.227-.15-.5-.063-.77.063-1.415.586-2.415.982-2.23 1.115-.472.248-.933.867-2.23 1.115C6.523 14.233 6.523 14.233 6.523 14.233c-.297.149-.5.15-.77.063-.277-.087-.55-.218-.77-.063-.227.15-.5.063-.77.063-1.415-.586-2.415-.982-2.23-1.115-.472-.248-.933-.867-2.23-1.115zM12.893 0c-.11-.07-.22-.14-.33-.14-.11 0-.22.04-.33.14-.11.07-.22.14-.33.14-.11 0-.22-.04-.33-.14-.11 0-.22-.04-.33-.14-.11 0-.22-.04-.33-.14-.11 0-.22-.04-.33-.14-.11 0-.22-.04-.33-.14zM12.893 0c-.11-.07-.22-.14-.33-.14-.11 0-.22.04-.33.14-.11.07-.22.14-.33.14-.11 0-.22-.04-.33.14-.11 0-.22-.04-.33.14-.11 0-.22-.04-.33.14-.11 0-.22-.04-.33.14-.11 0-.22-.04-.33.14zM12.893 0c-.11-.07-.22-.14-.33-.14-.11 0-.22.04-.33.14-.11.07-.22.14-.33.14-.11 0-.22-.04-.33.14-.11 0-.22-.04-.33.14-.11 0-.22-.04-.33.14-.11 0-.22-.04-.33.14-.11 0-.22-.04-.33.14z"/>
        </svg>
        WhatsApp
      </button>

      <button
        onClick={() => handleShare('email', shareLinks.email)}
        className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
        aria-label="Share via Email"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0l1.48-1.01L18 8m0 0l-3.42 2.26a2 2 0 00-2.22 0L9 16.01 7.52 17 5.26 2 2 0 01-2.22 0L3 16V8z"/>
        </svg>
        Email
      </button>

      <button
        onClick={copyToClipboard}
        className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
        aria-label="Copy link"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2m2-4h.01M8 13a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}

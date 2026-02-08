'use client'

import { useState, useEffect } from 'react'
;
;export default function SocialFeed({ platform, limit = 5 }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSocialPosts()
  }, [platform, limit])

  const fetchSocialPosts = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Mock data - replace with actual API calls
      const mockPosts = {
        twitter: [
          {
            id: '1',
            platform: 'twitter',
            content: '🌿 New wellness workshop starting next week! Join us for a transformative experience. #GladTidings #Wellness #NaturalHealth',
            author: 'Glad Tidings',
            timestamp: '2024-01-15T10:30:00Z',
            likes: 45,
            retweets: 12,
            url: 'https://twitter.com/gladtidings/status/123456789'
          },
          {
            id: '2',
            platform: 'twitter',
            content: 'Did you know? Natural herbs can help boost your immune system. Schedule a consultation to learn more! 🌱',
            author: 'Glad Tidings',
            timestamp: '2024-01-14T14:20:00Z',
            likes: 32,
            retweets: 8,
            url: 'https://twitter.com/gladtidings/status/123456788'
          }
        ],
        facebook: [
          {
            id: '1',
            platform: 'facebook',
            content: 'Join us this Saturday for our free wellness workshop! Learn about natural remedies and healthy living. 🌿',
            author: 'Glad Tidings',
            timestamp: '2024-01-15T09:00:00Z',
            likes: 67,
            shares: 15,
            url: 'https://facebook.com/gladtidings/posts/123456789'
          },
          {
            id: '2',
            platform: 'facebook',
            content: 'Client testimonial: "The natural health consultation changed my life!" - Sarah M. 💚',
            author: 'Glad Tidings',
            timestamp: '2024-01-13T16:45:00Z',
            likes: 89,
            shares: 22,
            url: 'https://facebook.com/gladtidings/posts/123456788'
          }
        ],
        instagram: [
          {
            id: '1',
            platform: 'instagram',
            content: 'Morning meditation session at our wellness center 🧘‍♀️✨',
            imageUrl: '/api/placeholder/400/400',
            author: 'Glad Tidings',
            timestamp: '2024-01-15T08:00:00Z',
            likes: 124,
            comments: 18,
            url: 'https://instagram.com/p/ABC123'
          },
          {
            id: '2',
            platform: 'instagram',
            content: 'Fresh herbs from our garden! Nature\'s pharmacy 🌿💚',
            imageUrl: '/api/placeholder/400/400',
            author: 'Glad Tidings',
            timestamp: '2024-01-14T11:30:00Z',
            likes: 98,
            comments: 12,
            url: 'https://instagram.com/p/DEF456'
          }
        ]
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const platformPosts = mockPosts[platform] || []
      setPosts(platformPosts.slice(0, limit))
    } catch (err) {
      setError('Failed to load social posts')
      console.error('Social feed error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return 'Just now'
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      facebook: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.85-.148 3.252-.148 4.771-1.691 4.919-4.919.058-1.265.069-1.645.069-4.849 0-3.204-.012-3.584-.07-4.85-.148-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.849 0-3.204.012-3.584.07-4.85.148-3.252.148-4.771 1.691-4.919 4.919-.058 1.265-.069 1.645-.069 4.849 0 3.204.012 3.584.07 4.85.148 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.85-.148 3.252-.148 4.771-1.691 4.919-4.919.058-1.265.069-1.645.069-4.849zm-4.85 14.637c-2.418 0-4.377-1.959-4.377-4.377s1.959-4.377 4.377-4.377 4.377 1.959 4.377 4.377-1.959 4.377-4.377 4.377zm7.461-8.688c0-.584-.474-1.058-1.058-1.058s-1.058.474-1.058 1.058.474 1.058 1.058 1.058z"/>
        </svg>
      )
    }
    return icons[platform] || null
  }

  const getPlatformColor = (platform) => {
    const colors = {
      twitter: 'bg-black hover:bg-gray-800',
      facebook: 'bg-blue-600 hover:bg-blue-700',
      instagram: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
    }
    return colors[platform] || 'bg-gray-600 hover:bg-gray-700'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className={`p-4 border-b ${getPlatformColor(platform)} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getPlatformIcon(platform)}
            <h3 className="ml-2 font-semibold capitalize">{platform}</h3>
          </div>
          <a
            href={`https://${platform}.com/gladtidings`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
      
      <div className="p-4">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recent posts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-2">{post.content}</p>
                    
                    {post.imageUrl && (
                      <img 
                        src={post.imageUrl} 
                        alt="Post image" 
                        className="w-full h-48 object-cover rounded-lg mb-2"
                        loading="lazy"
                      />
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {post.likes !== undefined && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            {post.likes}
                          </span>
                        )}
                        {post.retweets !== undefined && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23 4a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 006.55 2c6.71 0 10.44-5.56 10.44-10.38 0-.16 0-.31-.01-.47A7.72 7.72 0 0023 4z"/>
                            </svg>
                            {post.retweets}
                          </span>
                        )}
                        {post.shares !== undefined && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7 0-.24.04-.47.09-.7L16.04 6.8c.52.47 1.2.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3c-.76 0-1.44.3-1.96.77L8.91 8.3c-.05.23-.09.46-.09.7 0 .24-.04.47-.09.7L7.96 17.2c.52.47 1.2.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3z"/>
                            </svg>
                            {post.shares}
                          </span>
                        )}
                        {post.comments !== undefined && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                            </svg>
                            {post.comments}
                          </span>
                        )}
                      </div>
                      <span className="text-xs">
                        {formatTimestamp(post.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {post.url && (
                  <div className="mt-2">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      View on {platform} →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
};;

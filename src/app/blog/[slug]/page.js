'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// This will be handled by the API route for server-side SEO
export async function generateMetadata({ params }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/posts/${params.slug}`)
    const data = await response.json()
    
    if (!data.success || !data.post) {
      return {
        title: 'Post Not Found | Glad Tidings',
        description: 'The blog post you are looking for could not be found.',
      }
    }

    const post = data.post
    const title = post.meta_title || post.title
    const description = post.meta_description || post.excerpt || `Read about ${post.title} on Glad Tidings Medical Missionary blog.`
    
    return {
      title: title,
      description: description,
      keywords: post.categories || ['medical missionary', 'health', 'wellness'],
      authors: post.author_name ? [{ name: post.author_name }] : [{ name: 'Glad Tidings Medical Missionary' }],
      openGraph: {
        title: title,
        description: description,
        type: 'article',
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: post.author_name ? [post.author_name] : ['Glad Tidings Medical Missionary'],
        images: post.cover_image ? [
          {
            url: post.cover_image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ] : [
          {
            url: '/images/blog-og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Glad Tidings Medical Missionary Blog',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: post.cover_image ? [post.cover_image] : ['/images/blog-og-image.jpg'],
      },
      alternates: {
        canonical: `/blog/${params.slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'Blog Post | Glad Tidings',
      description: 'Read the latest insights on natural health and wellness.',
    }
  }
}

export default function BlogPost() {
  const params = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [params.slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blog/posts/${params.slug}`)
      const data = await response.json()

      if (data.success) {
        setPost(data.post)
      } else {
        setError(data.error || 'Post not found')
      }
    } catch (error) {
      setError('Failed to fetch post')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link 
              href="/blog"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {post.cover_image && (
        <div className="relative h-96 md:h-[500px]">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category, index) => (
                  <span key={index} className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {category}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
              <div className="flex items-center text-white/90 text-sm">
                {post.author_name && <span>By {post.author_name}</span>}
                {post.author_name && <span className="mx-2">•</span>}
                <span>{formatDate(post.published_at || post.created_at)}</span>
                <span className="mx-2">•</span>
                <span>{post.read_time} min read</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {!post.cover_image && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category, index) => (
                  <span key={index} className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {category}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <div className="flex items-center text-gray-600 text-sm mb-8">
                {post.author_name && <span>By {post.author_name}</span>}
                {post.author_name && <span className="mx-2">•</span>}
                <span>{formatDate(post.published_at || post.created_at)}</span>
                <span className="mx-2">•</span>
                <span>{post.read_time} min read</span>
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </article>

          {/* Author Bio */}
          {post.author_name && (
            <div className="mt-12 p-6 bg-gray-100 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {post.author_name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{post.author_name}</h3>
                  <p className="text-gray-600 text-sm">Medical Missionary Writer</p>
                </div>
              </div>
              <p className="text-gray-700">
                Passionate about sharing natural health insights and spiritual wellness through the lens of medical missionary work.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link 
                href="/blog"
                className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

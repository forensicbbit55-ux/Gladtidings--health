'use client'

import { useState, useEffect } from 'react';
;import { useParams } from 'next/navigation';
;import Image from 'next/image';
;import Link from 'next/link';
;import BlogShareButtons from './BlogShareButtons'
;
;export default function BlogPostClient({ post }) {
  const [relatedPosts, setRelatedPosts] = useState([])
  const params = useParams()

  useEffect(() => {
    // Fetch related posts
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/posts?limit=3`)
        const data = await response.json()
        if (data.success && data.posts) {
          // Filter out current post
          const filtered = data.posts.filter(p => p.slug !== params.slug)
          setRelatedPosts(filtered.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching related posts:', error)
      }
    }

    fetchRelatedPosts()
  }, [params.slug])

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`
  const shareTitle = post.title
  const shareDescription = post.excerpt || post.content?.substring(0, 160) || ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <p className="text-xl text-emerald-100 mb-6">{post.excerpt}</p>
            <div className="flex items-center text-emerald-100 space-x-4">
              {post.author_name && (
                <>
                  <span>By {post.author_name}</span>
                  <span>•</span>
                </>
              )}
              <span>{formatDate(post.published_at || post.created_at)}</span>
              {post.read_time && (
                <>
                  <span>•</span>
                  <span>{post.read_time} min read</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-12">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Share Buttons */}
            <div className="mb-8">
              <BlogShareButtons
                url={shareUrl}
                title={shareTitle}
                description={shareDescription}
                imageUrl={post.featured_image}
                className="justify-center"
              />
            </div>

            {/* Article Body */}
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
                    <p className="text-sm text-gray-600">Medical Missionary Expert</p>
                  </div>
                </div>
                {post.author_bio && (
                  <p className="text-gray-700">{post.author_bio}</p>
                )}
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Posts</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover more insights on natural health and spiritual wellness
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {relatedPost.featured_image && (
                    <div className="h-48">
                      <Image
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-emerald-600 transition-colors cursor-pointer">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Get the latest health tips, natural remedies, and spiritual insights delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-emerald-900 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
};;

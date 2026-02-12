'use client'

import Link from 'next/link';
import BlogShareButtons from './BlogShareButtons'

export default function BlogPostCard({ 
  post, 
  showShareButtons = true,
  className = '' 
}) {
  const {
    id,
    title,
    excerpt,
    content,
    author,
    publishedAt,
    updatedAt,
    slug,
    featuredImage,
    category,
    tags,
    readTime
  } = post

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${slug}`
  const shareTitle = title
  const shareDescription = excerpt || content?.substring(0, 160) || ''

  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Featured Image */}
      {featuredImage && (
        <div className="relative h-48 md:h-64">
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
              {category}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-emerald-600 font-medium">
            {category}
          </span>
          <time className="text-sm text-gray-500">
            {new Date(publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </time>
        </div>

        {/* Title */}
        <Link href={`/blog/${slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-emerald-600 transition-colors line-clamp-2">
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <span className="mr-4">
              By {author?.name || 'Glad Tidings Team'}
            </span>
            {readTime && (
              <span>
                {readTime} min read
              </span>
            )}
          </div>
          {updatedAt && updatedAt !== publishedAt && (
            <span>
              Updated {new Date(updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          )}
        </div>

        {/* Share Buttons */}
        {showShareButtons && (
          <div className="border-t pt-4">
            <BlogShareButtons
              url={shareUrl}
              title={shareTitle}
              description={shareDescription}
              imageUrl={featuredImage}
              className="justify-center"
            />
          </div>
        )}

        {/* Read More Button */}
        <div className="mt-6">
          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Read More
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

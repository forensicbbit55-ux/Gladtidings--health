import BlogPostClient from '@/components/BlogPostClient'
;
;// This will be handled by the API route for server-side SEO
export async function generateMetadata({ params }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/posts/${params.slug}`)
    const data = await response.json()
    
    if (!data.success || !data.post) {
      return {
        title: 'Post Not Found - Glad Tidings',
        description: 'The blog post you are looking for could not be found.',
      }
    }

    const post = data.post
    return {
      title: `${post.title} - Glad Tidings Blog`,
      description: post.excerpt || 'Read this insightful article on natural health and wellness from Glad Tidings Medical Missionary.',
      keywords: post.tags || ['medical missionary', 'natural health', 'wellness'],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        images: post.featured_image ? [
          {
            url: post.featured_image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ] : [
          {
            url: '/images/blog-og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Glad Tidings Blog',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.featured_image ? [post.featured_image] : ['/images/blog-og-image.jpg'],
      },
      alternates: {
        canonical: `/blog/${params.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blog Post - Glad Tidings',
      description: 'Read the latest insights on natural health and wellness.',
    }
  }
};

export default async function BlogPostPage({ params }) {
  // Fetch post data on server side
  let post = null
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/posts/${params.slug}`, {
      cache: 'no-store'
    })
    const data = await response.json()
    
    if (data.success && data.post) {
      post = data.post
    }
  } catch (error) {
    console.error('Error fetching post:', error)
  }

  return <BlogPostClient post={post} />
}

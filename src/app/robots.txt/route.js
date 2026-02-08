export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gladtidings-health.vercel.app'
  
  const robotsTxt = `User-agent: *
Allow: /
Allow: /blog/
Allow: /products/
Allow: /services/
Allow: /about/
Allow: /contact/

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /setup-database
Disallow: /setup-blog

# Allow specific API endpoints for SEO
Allow: /api/public/
Allow: /api/blog/posts
Allow: /api/blog/categories

Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-image.xml

# Crawl delay (optional)
Crawl-delay: 1

# Host directive for Yandex
Host: ${baseUrl}`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
};

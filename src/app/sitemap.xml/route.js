import { query } from '@lib/db'
;
;export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gladtidings-health.vercel.app'
  
  // Static pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/blog', changefreq: 'daily', priority: 0.9 },
    { url: '/products', changefreq: 'weekly', priority: 0.8 },
    { url: '/services', changefreq: 'monthly', priority: 0.8 },
    { url: '/consultation', changefreq: 'monthly', priority: 0.7 },
    { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  ]

  // Dynamic blog posts
  let blogPosts = []
  try {
    const result = await query(`
      SELECT slug, updated_at 
      FROM posts 
      WHERE published = true 
      ORDER BY updated_at DESC
    `)
    
    blogPosts = result.rows.map(post => ({
      url: `/blog/${post.slug}`,
      lastmod: post.updated_at,
      changefreq: 'weekly',
      priority: 0.7
    }))
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  // Dynamic products (commented out until remedies table exists)
  let products = []
  /*
  try {
    const result = await query(`
      SELECT id, updated_at 
      FROM remedies 
      WHERE is_published = true 
      ORDER BY updated_at DESC
    `)
    
    products = result.rows.map(product => ({
      url: `/products/${product.id}`,
      lastmod: product.updated_at,
      changefreq: 'weekly',
      priority: 0.6
    }))
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
  }
  */

  // Combine all pages
  const allPages = [...staticPages, ...blogPosts, ...products]

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages.map(page => `
        <url>
          <loc>${baseUrl}${page.url}</loc>
          ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : ''}
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `).join('')}
    </urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
};

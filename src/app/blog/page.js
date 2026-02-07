import BlogClient from '@/components/BlogClient'

// SEO metadata for blog listing page
export const metadata = {
  title: 'Medical Missionary Blog - Health Tips & Natural Remedies',
  description: 'Read the latest insights on natural health, wellness tips, herbal remedies, and spiritual wellness from our medical missionary experts.',
  keywords: [
    'medical missionary blog',
    'health tips',
    'natural remedies',
    'herbal medicine',
    'spiritual wellness',
    'holistic health',
    'wellness advice',
    'natural healing'
  ],
  openGraph: {
    title: 'Medical Missionary Blog - Health Tips & Natural Remedies',
    description: 'Read the latest insights on natural health, wellness tips, herbal remedies, and spiritual wellness from our medical missionary experts.',
    type: 'website',
    images: [
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
    title: 'Medical Missionary Blog - Health Tips & Natural Remedies',
    description: 'Read the latest insights on natural health, wellness tips, herbal remedies, and spiritual wellness.',
    images: ['/images/blog-og-image.jpg'],
  },
  alternates: {
    canonical: '/blog',
  },
}

export default function Blog() {
  return <BlogClient />
}

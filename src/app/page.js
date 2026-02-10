import HomeClient from '@/components/HomeClient';

// SEO metadata for home page
export const metadata = {
  title: 'Glad Tidings - Medical Missionary Health & Wellness',
  description: 'Discover natural health remedies, medical missionary insights, and holistic wellness tips. Your trusted source for spiritual health and natural healing.',
  keywords: [
    'medical missionary',
    'natural health',
    'wellness center',
    'holistic healing',
    'spiritual wellness',
    'herbal remedies',
    'health consultations',
    'natural medicine',
    'alternative health',
    'medical missionary services'
  ],
  openGraph: {
    title: 'Glad Tidings - Medical Missionary Health & Wellness',
    description: 'Discover natural health remedies, medical missionary insights, and holistic wellness tips. Your trusted source for spiritual health and natural healing.',
    type: 'website',
    images: [
      {
        url: '/images/home-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Glad Tidings Medical Missionary Health & Wellness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glad Tidings - Medical Missionary Health & Wellness',
    description: 'Discover natural health remedies, medical missionary insights, and holistic wellness tips.',
    images: ['/images/home-og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return <HomeClient />
}

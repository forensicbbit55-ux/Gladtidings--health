import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import ClientProviders from '@/components/ClientProviders';
import ClerkClientProvider from '@/components/ClerkProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Glad Tidings - Medical Missionary Health & Wellness',
  description: 'Discover natural health remedies, medical missionary insights, and holistic wellness tips. Your trusted source for spiritual health and natural healing.',
  keywords: [
    'medical missionary',
    'natural health',
    'wellness',
    'holistic health',
    'spiritual wellness',
    'herbal remedies',
    'alternative medicine',
    'health consultations',
    'natural healing',
    'wellness center',
    'medical missionary services'
  ],
  authors: [{ name: 'Glad Tidings Team' }],
  creator: 'Glad Tidings Medical Missionary',
  publisher: 'Glad Tidings',
  formatDetection: { 
    email: true, 
    address: true, 
    telephone: true 
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/canonical',
    languages: {
      'en-US': '/en-US',
      'en-GB': '/en-GB'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Glad Tidings',
    title: 'Glad Tidings - Medical Missionary Health & Wellness',
    description: 'Discover natural health remedies, medical missionary insights, and holistic wellness tips. Your trusted source for spiritual health and natural healing.',
    images: [
      {
        url: '/images/gladtidings-logo.png',
        width: 1200,
        height: 630,
        alt: 'Glad Tidings Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glad Tidings - Medical Missionary Health & Wellness',
    description: 'Discover natural health remedies, medical missionary insights, and holistic wellness tips.',
    images: ['/images/gladtidings-logo.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkClientProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ClerkClientProvider>
      </body>
    </html>
  )
}

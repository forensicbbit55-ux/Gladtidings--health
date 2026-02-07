import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Glad Tidings - Medical Missionary Health & Wellness',
  description: 'Discover natural health remedies, medical missionary insights, and holistic wellness tips. Your trusted source for spiritual health and natural healing.',
  keywords: [
    'medical missionary',
    'natural health',
    'wellness',
    'holistic health',
    'spiritual wellness',
    'natural remedies',
    'herbal medicine',
    'health tips',
    'wellness advice',
    'natural healing'
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
    images: ['/images/blog-og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            
            {/* Floating WhatsApp Button */}
            <a 
              href="https://wa.me/1234567890?text=Greetings%20I%20would%20like%20to%20inquire%20about%20your%20natural%20health%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed right-6 bottom-6 z-50 group"
            >
              <div className="relative">
                <button className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 hover:shadow-xl transform hover:scale-110 flex items-center justify-center">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAgVBMVEX///83vGnl5eXZ2dnc3Nzw8PDz8/P5+fnW1tbS0tL29vbf39/s7Ozo6Oji4uLKysq/v78wu2Uiul/Y7+Ll9OsdtV3i9uuM0qdFwXPu+vQHslVHvnX5/ftlxIq35crB6NHN69l2yZdvypOC0KCq3L+X1bBbwIKg2LdWwn43uW234MlS8JkyAAAJYElEQVR4nO1aa5uisA6uLZdCoViUcRQVHHXU+f8/8CRNQRzd0TlHnPOBPMvu+pKkL2maXoCxQQYZZJBBBhlkkEEGGWSQQQYZZJBBBhmkD1nO52/T6Xz51zwaWb6tZ6tj+Q5Slp+bff3n1OZfs7JY5MaMrBhj8oVZHSZ/SOlt9m4aPh0xxehzPf8bSvWmKK4INbwW5eEPaL1tbsSoS8uUu1cn19eoGyWT5wVInucdpqb4eGluTVdFp+3RcTU7rKtqvd5vjmUny0yxex2n+mjaEBUfu0k3e6bVvly0tIrNqzitizYS5WF6fX9Zb0a5U8lXNxR6kF3RROn0zxE22TTRKo6vGIW7heM0mv00uurPhvvxrXdOaxeB/FT/rDjfNuyPfZeGieuWYnO/V6p30s0/+mU1PzacHmmnPjntfa+kXH0qZo+pT0titah75FTlrj8eNahHlpX57K8D36g7zEN9RzKh0OYPhva/kFlOJfM3lWfvKkNfNfSN/JuqRabrfXUnasuNjW7e13xDgcq3LY2qzIvOz9viHmXUz4rhzc0bbedVBQYhvzfe9+5ZeiF1KC6rwdyNd3MnxVxdOPUyB1rfpmwz9uBWAndDRYp5H2ur2lyO7WW7qCrvxGBuQ2z6mGz2lsOinfLn7eKzWN8x/TA9VYXlyvbeqQXeFg0pcy+HK8rG6o7a72V++ja1Ts6k7s0607Kn8VdTYtRnlufuu7sIsP1njk8ntbND6P28ilyemr366W6y2FJlRk8vClvrt7vg3jar8Pu5Qkn1/KJOPdDNnsrVzsN9YxoU5umZ/mmuxtknsXqgqSWR+no2qfK6eFfU1OcD1qT59Jpe3ph8qSgWD/Rf0QupJZG6bH/iakL9R6RuRsptls3o7nazJ1LH60SH+H24fcG9KbmnRF9dlQTbGi0V8tO5BE13+/X3akpTUmc6eJJszffiSc3ZPZQxZVMY5sciL8pvHVVRRX968aT0eb/yO3E7u8WMwvNh289PF9WLVsTPn2bchHxdKdeFOzF4x/BUzcrvYhPd14Q8t/NvcWP50ZwYmLw4rJtZGpaDZ1a0dLm77Pq90CJvdLpxa1K24emew55PgCjKi+cv8tiBlsP1jVvzjxsH6p3pxxWOHjbJtHG43QfLQ3F1qH6u/sv+Ng7M7V5uV+/J9hstc97j0Bbr+fUchcb1P9e+1apLy5xPH5uDtl6OOKbU2uKf1aaevbvDR1N8ngsanbv0daI+oynlhxONebU9wq7ntFqfddwG4/lzDIk94TAj8/NsMZ1cvIFgm7ynIuWEhnb5q+SgXdCo6O3dER1x/Gpo1+54sbdA0fFX/sDqtxVX7M2xtzc0X7YnFr/oCDqaMn0eWdOSqnjcoJkUezwbpiL4+Bk6q0bNa5CwN1ITW7HPh1F38j3cuyWDKXt8NeOOEymllvVhNftpJVmvmtPHXl+t0dZhtWTLyW51MvgO+58vIc/v4s29w8f/SZb21Mxsqu0nEKIWi/JwKwz19vy6tt9XkM3qu/uWH5fAq920E4vlvN6fzssF0/OL7b1L29E3wU8AtvvdV1V9fR1mH2Xnsw6z6Pl7CbdGvyn43Q3JZRRXfX8sQQex5wbzxeLfLG03jw69f1ayvvxmY/s1n2xGN/YLTopy/4IvXbY5phP2U/HpvtlY1tsivw4XfkN12r/kG4kSI1SUq0PdRZdf26Pp7PYM6JxW+xd9eDOBwV/Oqul1n8wnO1gDF4sFfhdUrmbrycu+UKq2Xz92yHKO8io2TaMvbm+QQQYZZJBBBhlkkEEGGWSQQQb5P5UsyrJIRu2VSYlAdv7RXJGILsFroPXRglca2XeN7LJpvJhQ47Hg0TjicpxxbzzWfDxWaTaWAEQAZFpnY8Uzp4WAIsCDK+ICzBRpeVYDgFSRFgJohhpjrsGx7vjhHFtrzCT6QI3xGCIlPSmFJ4TwvO7lXQLSanS0RPvvfa1vvjoanvvRAhJixsbj1I8yHajMC9Is8v0s84MoSwMvUwBIPyEgCQQA3AJR4qOGtGYiAMBPCOANEICfxJcRBz8emAEQZb41Qz86k6hBWgL86Ez41DxElEVSaaU455q7v3Tzfw1/GkB3buoWAA2LqksN7m6efzRO6Yb7n7Kgc+a0NIabcT+KklBHKUsiFQZShkxGMVNRAoBmvvTCEAEv8lkaceZHXhgLSQAngMVSxKEnfYZ+LBBJ1PJD8qNYEEkWShlYAPyEQSRYGEUhmoUczbClKIqDaMw87enET3gS4OVz7sNFPxKeApAGAYIp9xGEu6n9AZc1gwuB1A8QdGa+35ikzk9CjslH64eThvODzeskFRGDjAmV8FkiUhYIzZgnGFMiBiABgLPQ8xAIWQpaPgCxpwjgFkhZCGah8hAIAEhYLBSahUwDkDqACfCjvaD1w6TA1hrHKWnJzE8ZdB7w80OfJ3Clccx1HKY8CBMLJDHEqQFASydhAFpXQGwB5yfQaRhzACBW1o8DyMy3WmCiudWKz354HCuRcpZAGsUs9XwWeAk8MEYBnjGFR0Ig8DgCjHEAfABiAEKtIAqglVgzAJSGOHmNHwwvxFyr2PmBaNrwKnKMfizgWccxABArbAkCF0YZS30hA5YoQBWS0s5WEalYOQ6Ns8ACyAGaTNQV4BMALEMLoJlKHUtNjtEMHTNPoVlAD4dayoNEx5wKKDm6YdGWfULPqJqwgFYMQOxpAognNWiJ24e2KaTJDDWwwRgpYWiIp2/NbJyoV3zXCZhTUPOQVEgZm9DjXCW66iR6IJqHFk1eN4BNdCIV2gGjCEgcS4Zp3D4cJroQHVLWj2dJ+ZhTEQ0RGlkejQhuARiQ2KASzA6kxA4RTkMNaSWWp8YEQSB2xEGDGCDgiAubQjRkk2aoIa0mvHZACihvkFMJ9CGQkoBKcCY9vAOqUAkT6Ww9ABRoWUAqoq1wfAAQABDicCcAHlrCc0gHaAs4x2imG8dYECQ6loHzg2aRTXSYfAJPJnEq0tgXGuowFGcoXNCnaWgBz4OBCmUXLROh40AoHLl+qGUSJhKKs1BhrLwg1iIBLR1icQazwBZAjo4lTBboWAs/RscJOpYw1DyB2QNmgoNjaAmmS85gneGLKI15pONEigB7MxZRYoE0UuBQIuDHKuJxYgHhBwCEHmhZjUgEMIb92HNmAKCZHyCgrZmAUSWDQEgEUjCzwww4gBlqoJ8EWgqyjOv/AHckqvSfO7CuAAAAAElFTkSuQmCC" alt="WhatsApp" className="w-7 h-7" />
                </button>
                <span className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Chat on WhatsApp
                </span>
              </div>
            </a>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

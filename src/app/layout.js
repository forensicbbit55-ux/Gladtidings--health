import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '../contexts/AuthProvider'
import { CartProvider } from '../contexts/CartContext'

export const metadata = {
  title: 'Glad Tidings',
  description: 'Glad Tidings application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            
            {/* Floating WhatsApp Button */}
            <a 
              href="https://wa.me/1234567890?text=Hello%20I%20would%20like%20to%20chat%20about%20your%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed right-6 bottom-6 z-50 group"
            >
              <div className="relative">
                <button className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:shadow-xl transform hover:scale-110 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 2.475 4.022c1.689 1.386 3.279 1.974 3.976 2.221.173.05.326.076.46.076.562 0 1.787-.22 2.034-.864.247-.645.247-1.198.173-1.314-.074-.115-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.815 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>
                <span className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Chat with us
                </span>
              </div>
            </a>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

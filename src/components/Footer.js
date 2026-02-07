import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Glad Tidings</h3>
            <p className="text-gray-300 text-sm">
              Natural health remedies and medical missionary services for your well-being.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  Natural Remedies
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  Health Consultation
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  Educational Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>Email: info@gladtidings.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Health Street, Wellness City</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Glad Tidings Medical Missionary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

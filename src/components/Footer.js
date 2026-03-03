import Link from 'next/link';
import { Youtube, Mail, Linkedin, Facebook, Camera, Send, Music } from 'lucide-react';

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
                  href="/admin"
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                >
                  Admin
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
              <p>Email: glad.tidings.health@gmail.com</p>
              <p>Phone: +254 723 730 980</p>
              <p>Address: 123 Health Street, Wellness City</p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-3">
              <Link 
                href="https://www.youtube.com/@GladTidingsHealth" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </Link>
              <Link 
                href="mailto:glad.tidings.health@gmail.com" 
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
              <Link 
                href="https://www.linkedin.com/in/glad-tidings-85b3883a9" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link 
                href="https://www.facebook.com/profile.php?id=61587257731253" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link 
                href="https://instagram.com/gladtidingshealth" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="Instagram"
              >
                <Camera className="w-5 h-5" />
              </Link>
              {/* Custom TikTok Icon */}
              <Link 
                href="https://www.tiktok.com/@gladtidingshealth" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.05v10.95a3.02 3.02 0 0 1-3.02 3.02c-1.65 0-3.02-1.37-3.02-3.02s1.37-3.02 3.02-3.02V7.9A5.96 5.96 0 0 0 2.75 13.85a5.96 5.96 0 0 0 5.96 5.96 5.96 0 0 0 5.96-5.96V9.34a7.95 7.95 0 0 0 4.9 1.69v-3.05a4.83 4.83 0 0 1-.02-.29z"/>
                </svg>
              </Link>
              <Link 
                href="https://t.me/yourusername" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </Link>
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

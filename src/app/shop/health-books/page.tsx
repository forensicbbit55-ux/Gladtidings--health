import Link from 'next/link'
import { ShoppingCart, Star, Heart, Filter, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const healthBooks = [
  {
    id: 1,
    name: 'Natural Healing Encyclopedia',
    price: 4500,
    description: 'Comprehensive guide to natural remedies and holistic health practices',
    author: 'Dr. Sarah Mitchell',
    pages: 450,
    image: '/images/products/healing-encyclopedia.jpg',
    rating: 4.8,
    reviews: 234,
    featured: true
  },
  {
    id: 2,
    name: 'Herbal Medicine for Beginners',
    price: 3200,
    description: 'Easy-to-follow guide to using herbs for common health conditions',
    author: 'James Thompson',
    pages: 280,
    image: '/images/products/herbal-medicine.jpg',
    rating: 4.7,
    reviews: 189,
    featured: true
  },
  {
    id: 3,
    name: 'The Essential Oil Bible',
    price: 3800,
    description: 'Complete reference guide to essential oils and aromatherapy',
    author: 'Maria Rodriguez',
    pages: 320,
    image: '/images/products/essential-oil-bible.jpg',
    rating: 4.9,
    reviews: 156,
    featured: false
  },
  {
    id: 4,
    name: 'Nutrition for Wellness',
    price: 2800,
    description: 'Science-based approach to nutrition for optimal health',
    author: 'Dr. Michael Chen',
    pages: 240,
    image: '/images/products/nutrition-wellness.jpg',
    rating: 4.6,
    reviews: 98,
    featured: false
  },
  {
    id: 5,
    name: 'Mind-Body Connection',
    price: 3500,
    description: 'Understanding the link between mental and physical health',
    author: 'Dr. Emma Williams',
    pages: 300,
    image: '/images/products/mind-body.jpg',
    rating: 4.8,
    reviews: 145,
    featured: false
  },
  {
    id: 6,
    name: 'Detox and Cleanse Guide',
    price: 2500,
    description: 'Natural methods for body detoxification and rejuvenation',
    author: 'Robert Green',
    pages: 200,
    image: '/images/products/detox-guide.jpg',
    rating: 4.5,
    reviews: 67,
    featured: false
  }
]

export default function HealthBooksPage() {
  const formatPrice = (price) => {
    return `KSH ${parseFloat(price).toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-4">
            <Link href="/shop" className="flex items-center text-emerald-100 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Shop
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Health Books</h1>
            <p className="text-xl mb-8 text-emerald-100">
              Educational resources for natural health and wellness
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Filter by</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Herbal Medicine</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Nutrition</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Essential Oils</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Mind-Body Health</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Difficulty Level</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Beginner</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Intermediate</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Advanced</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm text-gray-600">Under KSH 3,000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm text-gray-600">KSH 3,000 - 4,000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm text-gray-600">Over KSH 4,000</span>
                  </label>
                </div>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Showing {healthBooks.length} products</p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                      <div className="text-emerald-600 text-3xl font-bold">
                        📚
                      </div>
                    </div>
                    {book.featured && (
                      <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                    <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-emerald-600 font-medium">Health Book</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{book.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                    <p className="text-xs text-gray-500 mb-2">{book.pages} pages</p>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{book.description}</p>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(book.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {book.rating} ({book.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-800">{formatPrice(book.price)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

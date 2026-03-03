import Link from 'next/link'
import { ShoppingCart, Star, Heart, Filter, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const essentialOils = [
  {
    id: 1,
    name: 'Pure Lavender Essential Oil',
    price: 4200,
    description: 'Therapeutic grade lavender oil from France, perfect for relaxation and sleep',
    image: '/images/products/pure-lavender.jpg',
    rating: 4.9,
    reviews: 312,
    featured: true
  },
  {
    id: 2,
    name: 'Organic Peppermint Oil',
    price: 3800,
    description: 'Steam-distilled organic peppermint oil for digestion and mental clarity',
    image: '/images/products/organic-peppermint.jpg',
    rating: 4.8,
    reviews: 267,
    featured: true
  },
  {
    id: 3,
    name: 'Wild Frankincense Oil',
    price: 5500,
    description: 'Premium wild-harvested frankincense from Somalia for meditation and skin care',
    image: '/images/products/wild-frankincense.jpg',
    rating: 5.0,
    reviews: 189,
    featured: true
  },
  {
    id: 4,
    name: 'Rose Otto Essential Oil',
    price: 8500,
    description: 'Luxurious rose otto oil from Bulgaria for emotional balance and beauty',
    image: '/images/products/rose-otto.jpg',
    rating: 4.9,
    reviews: 145,
    featured: false
  },
  {
    id: 5,
    name: 'Sandalwood Essential Oil',
    price: 6200,
    description: 'Steam-distilled sandalwood oil for grounding and spiritual practices',
    image: '/images/products/sandalwood.jpg',
    rating: 4.8,
    reviews: 98,
    featured: false
  },
  {
    id: 6,
    name: 'Ylang Ylang Complete',
    price: 4800,
    description: 'Complete ylang ylang oil from Madagascar for relaxation and romance',
    image: '/images/products/ylang-ylang.jpg',
    rating: 4.7,
    reviews: 156,
    featured: false
  },
  {
    id: 7,
    name: 'Clove Bud Essential Oil',
    price: 3200,
    description: 'Powerful clove bud oil for dental health and immune support',
    image: '/images/products/clove-bud.jpg',
    rating: 4.6,
    reviews: 87,
    featured: false
  },
  {
    id: 8,
    name: 'Lemon Essential Oil',
    price: 2800,
    description: 'Cold-pressed lemon oil for mood elevation and natural cleaning',
    image: '/images/products/lemon-essential.jpg',
    rating: 4.7,
    reviews: 234,
    featured: false
  }
]

export default function EssentialOilsPage() {
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
            <h1 className="text-4xl font-bold mb-4">Pure Essential Oils</h1>
            <p className="text-xl mb-8 text-emerald-100">
              100% pure therapeutic grade essential oils from around the world
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
                <h4 className="font-medium text-gray-700 mb-3">Origin</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">France</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Bulgaria</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">India</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Madagascar</span>
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Extraction Method</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Steam Distilled</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Cold Pressed</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">CO2 Extracted</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Solvent Extracted</span>
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
                    <span className="text-sm text-gray-600">KSH 3,000 - 6,000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm text-gray-600">Over KSH 6,000</span>
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
              <p className="text-gray-600">Showing {essentialOils.length} products</p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {essentialOils.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                      <div className="text-emerald-600 text-3xl font-bold">
                        🌿
                      </div>
                    </div>
                    {product.featured && (
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
                      <span className="text-xs text-emerald-600 font-medium">Pure Essential Oil</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-800">{formatPrice(product.price)}</span>
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

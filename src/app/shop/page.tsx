import Link from 'next/link'
import { ShoppingCart, Star, Heart, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Fetch remedies server-side
async function getRemedies() {
  try {
    const remedies = await prisma.remedy.findMany({
      where: {
        isPublished: true
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 8 // Show first 8 remedies
    })
    return remedies
  } catch (error) {
    console.error('Error fetching remedies:', error)
    return []
  }
}

const shopCategories = [
  {
    id: 'herbal-remedies',
    name: 'Herbal Remedies',
    description: 'Natural healing solutions for common ailments',
    image: '/images/products/herbal-remedies.jpg',
    productCount: 24
  },
  {
    id: 'natural-supplements',
    name: 'Natural Supplements',
    description: 'Vitamins and minerals for optimal health',
    image: '/images/products/supplements.jpg',
    productCount: 18
  },
  {
    id: 'wellness-products',
    name: 'Wellness Products',
    description: 'Essential oils and aromatherapy',
    image: '/images/products/wellness.jpg',
    productCount: 32
  },
  {
    id: 'essential-oils',
    name: 'Essential Oils',
    description: 'Pure therapeutic grade essential oils',
    image: '/images/products/essential-oils.jpg',
    productCount: 45
  },
  {
    id: 'health-books',
    name: 'Health Books',
    description: 'Educational resources for natural health',
    image: '/images/products/books.jpg',
    productCount: 12
  }
]

export default async function ShopPage() {
  const remedies = await getRemedies()
  
  const formatPrice = (price) => {
    return `KSH ${parseFloat(price).toFixed(2)}`
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Natural Health Shop</h1>
            <p className="text-xl mb-8 text-emerald-100">
              Discover premium natural products for your wellness journey
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {shopCategories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.id}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                <div className="text-emerald-600 text-2xl sm:text-3xl md:text-4xl font-bold">
                  {category.name.charAt(0)}
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 group-hover:text-emerald-600 transition-colors text-sm sm:text-base">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{category.description}</p>
                <p className="text-xs sm:text-sm text-emerald-600 font-medium">
                  {category.productCount} products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Remedies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Featured Natural Remedies</h2>
          <div className="flex gap-2 sm:gap-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Filter</span>
              <span className="sm:hidden">🔽</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              Sort by
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {remedies.map((remedy) => (
            <div key={remedy.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                {remedy.images && remedy.images.length > 0 ? (
                  <img 
                    src={remedy.images[0]} 
                    alt={remedy.title} 
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                    <div className="text-emerald-600 text-2xl sm:text-3xl font-bold">
                      🌿
                    </div>
                  </div>
                )}
                {remedy.featured && (
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </div>
                )}
                <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-100 transition-colors">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-emerald-600 font-medium">
                    {remedy.category?.name || 'Natural Remedy'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{remedy.title}</h3>
                
                {remedy.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{remedy.description}</p>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-800">{formatPrice(remedy.price)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Link 
                    href={`/remedies/${remedy.slug}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {remedies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No remedies available</h3>
            <p className="text-gray-600 mb-6">
              Check back soon for natural health remedies
            </p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-emerald-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Get 10% Off Your First Order</h2>
          <p className="mb-6 text-emerald-100">
            Subscribe to our newsletter for exclusive offers and natural health tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Button className="bg-white text-emerald-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

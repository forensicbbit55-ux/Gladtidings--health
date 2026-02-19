import Link from 'next/link'
import { ShoppingCart, Star, Heart, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

const featuredProducts = [
  {
    id: 1,
    name: 'Echinacea Immune Support',
    category: 'Herbal Remedies',
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.8,
    reviews: 127,
    image: '/images/products/echinacea.jpg',
    inStock: true,
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Vitamin C Complex',
    category: 'Natural Supplements',
    price: 19.99,
    originalPrice: 29.99,
    rating: 4.6,
    reviews: 89,
    image: '/images/products/vitamin-c.jpg',
    inStock: true,
    badge: 'New'
  },
  {
    id: 3,
    name: 'Lavender Essential Oil',
    category: 'Essential Oils',
    price: 15.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 203,
    image: '/images/products/lavender.jpg',
    inStock: true,
    badge: 'Popular'
  },
  {
    id: 4,
    name: 'Herbal Tea Collection',
    category: 'Herbal Remedies',
    price: 18.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 156,
    image: '/images/products/herbal-tea.jpg',
    inStock: true,
    badge: null
  }
]

export default function ShopPage() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {shopCategories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.id}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                <div className="text-emerald-600 text-4xl font-bold">
                  {category.name.charAt(0)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <p className="text-sm text-emerald-600 font-medium">
                  {category.productCount} products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Sort by
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                  <div className="text-emerald-600 text-3xl font-bold">
                    {product.name.charAt(0)}
                  </div>
                </div>
                {product.badge && (
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                    {product.badge}
                  </div>
                )}
                <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-emerald-600 font-medium">{product.category}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({product.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-800">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
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

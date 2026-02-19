import Link from 'next/link'
import { ShoppingCart, Star, Heart, ArrowLeft, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const products = [
  {
    id: 1,
    name: 'Echinacea Immune Support',
    description: 'Premium echinacea extract for immune system support',
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.8,
    reviews: 127,
    image: '/images/products/echinacea.jpg',
    inStock: true,
    badge: 'Best Seller',
    features: ['Organic', 'Non-GMO', 'Gluten-Free']
  },
  {
    id: 2,
    name: 'Elderberry Syrup',
    description: 'Traditional immune-boosting elderberry extract',
    price: 18.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 89,
    image: '/images/products/elderberry.jpg',
    inStock: true,
    badge: 'Popular',
    features: ['Cold-Pressed', 'No Additives', 'Family Size']
  },
  {
    id: 3,
    name: 'Goldenseal Root Extract',
    description: 'Potent goldenseal for natural immune support',
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.6,
    reviews: 67,
    image: '/images/products/goldenseal.jpg',
    inStock: true,
    badge: 'Sale',
    features: ['Wildcrafted', 'Alcohol-Free', 'Concentrated']
  },
  {
    id: 4,
    name: 'Astragalus Root',
    description: 'Traditional adaptogen for stress and immunity',
    price: 22.99,
    originalPrice: null,
    rating: 4.5,
    reviews: 45,
    image: '/images/products/astragalus.jpg',
    inStock: true,
    badge: null,
    features: ['Organic', 'Vegan', 'Lab Tested']
  },
  {
    id: 5,
    name: 'Oregano Oil Complex',
    description: 'Powerful antimicrobial oregano oil blend',
    price: 34.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 156,
    image: '/images/products/oregano-oil.jpg',
    inStock: true,
    badge: 'Premium',
    features: ['Wild Oregano', 'High Purity', 'Softgels']
  },
  {
    id: 6,
    name: 'Garlic Extract',
    description: 'Odorless garlic for cardiovascular health',
    price: 16.99,
    originalPrice: 24.99,
    rating: 4.4,
    reviews: 234,
    image: '/images/products/garlic.jpg',
    inStock: true,
    badge: 'Value',
    features: ['Odorless', 'Enteric Coated', 'Alliumin']
  },
  {
    id: 7,
    name: 'Turmeric Curcumin Complex',
    description: 'Anti-inflammatory turmeric with black pepper',
    price: 26.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 189,
    image: '/images/products/turmeric.jpg',
    inStock: true,
    badge: null,
    features: ['BioPerine', 'Anti-Inflammatory', 'Joint Support']
  },
  {
    id: 8,
    name: 'Ginger Root Extract',
    description: 'Soothing ginger for digestive wellness',
    price: 19.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 78,
    image: '/images/products/ginger.jpg',
    inStock: false,
    badge: null,
    features: ['Organic', 'Digestive Aid', 'Anti-Nausea']
  }
]

export default function HerbalRemediesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center mb-6">
            <Link href="/shop" className="text-emerald-100 hover:text-white flex items-center gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Herbal Remedies</h1>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Natural healing solutions from traditional herbal medicine. Premium quality herbs for your wellness journey.
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search herbal remedies..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{products.length} products</span>
            <select className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">In Stock</span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">Organic</span>
          <button className="text-gray-500 hover:text-gray-700 text-sm">Clear all</button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
                <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-emerald-600 font-medium">Herbal Remedies</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.features.map((feature, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center mb-3">
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

                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Info */}
      <div className="bg-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About Herbal Remedies</h2>
              <p className="text-gray-600 mb-4">
                Herbal remedies have been used for thousands of years across cultures to support health and wellness. 
                Our carefully selected herbal products are sourced from trusted growers and processed to maintain their 
                natural potency and effectiveness.
              </p>
              <p className="text-gray-600 mb-6">
                From immune-boosting echinacea to soothing ginger, our herbal remedies offer natural solutions for 
                common health concerns. All products are third-party tested for purity and potency.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">100% Natural Ingredients</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">Lab Tested</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">Sustainably Sourced</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-sm text-gray-700">Expert Formulated</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-800 mb-4">Popular Herbal Remedies</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Echinacea</h4>
                    <p className="text-sm text-gray-600">Immune support</p>
                  </div>
                  <span className="text-emerald-600 font-semibold">$24.99</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Elderberry</h4>
                    <p className="text-sm text-gray-600">Antioxidant rich</p>
                  </div>
                  <span className="text-emerald-600 font-semibold">$18.99</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">Turmeric</h4>
                    <p className="text-sm text-gray-600">Anti-inflammatory</p>
                  </div>
                  <span className="text-emerald-600 font-semibold">$26.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

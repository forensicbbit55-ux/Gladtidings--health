import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Star, Calendar, Clock, Package, Shield } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'

async function getRemedy(slug: string) {
  try {
    const remedy = await prisma.remedy.findUnique({
      where: { slug },
      include: {
        category: true
      }
    })
    
    if (!remedy) {
      return null
    }
    
    return remedy
  } catch (error) {
    console.error('Error fetching remedy:', error)
    return null
  }
}

export async function generateMetadata({ params }) {
  const remedy = await getRemedy(params.slug)
  
  if (!remedy) {
    return {
      title: 'Remedy Not Found',
      description: 'The requested remedy could not be found.'
    }
  }

  return {
    title: `${remedy.title} - Natural Health Remedy | Glad Tidings`,
    description: remedy.description?.substring(0, 160) || `Discover ${remedy.title}, a natural health remedy for optimal wellness.`,
    openGraph: {
      title: remedy.title,
      description: remedy.description?.substring(0, 160) || `Natural health remedy: ${remedy.title}`,
      images: remedy.images?.[0] ? [remedy.images[0]] : [],
    },
  }
}

export default async function RemedyDetailPage({ params }) {
  const remedy = await getRemedy(params.slug)
  
  if (!remedy) {
    notFound()
  }

  const formatPrice = (price) => {
    return `KSH ${parseFloat(price).toFixed(2)}`
  }

  const relatedRemedies = await prisma.remedy.findMany({
    where: {
      id: { not: remedy.id },
      categoryId: remedy.categoryId,
      isPublished: true
    },
    include: {
      category: true
    },
    take: 4
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <Link href="/remedies" className="hover:text-emerald-600">Natural Remedies</Link>
            <span>/</span>
            <span className="text-gray-900">{remedy.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-white">
              {remedy.images && remedy.images.length > 0 ? (
                <Image
                  src={remedy.images[0]}
                  alt={remedy.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                  <div className="text-emerald-600 text-6xl">🌿</div>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {remedy.images && remedy.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {remedy.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden bg-white">
                    <Image
                      src={image}
                      alt={`${remedy.title} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {remedy.category && (
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                  {remedy.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">{remedy.title}</h1>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-emerald-600">{formatPrice(remedy.price)}</span>
              {remedy.comparePrice && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(remedy.comparePrice)}
                </span>
              )}
            </div>

            {/* Description */}
            {remedy.description && (
              <div className="prose prose-emerald max-w-none">
                <p className="text-gray-700 leading-relaxed">{remedy.description}</p>
              </div>
            )}

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-600">100% Natural</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-600">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-600">Fast Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-600">Fresh Stock</span>
              </div>
            </div>

            {/* Ingredients */}
            {remedy.ingredients && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
                <p className="text-gray-700 text-sm">{remedy.ingredients}</p>
              </div>
            )}

            {/* Benefits */}
            {remedy.benefits && (
              <div className="bg-emerald-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
                <p className="text-gray-700 text-sm">{remedy.benefits}</p>
              </div>
            )}

            {/* Usage Instructions */}
            {remedy.usage && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Usage Instructions</h3>
                <p className="text-gray-700 text-sm">{remedy.usage}</p>
              </div>
            )}

            {/* Warnings */}
            {remedy.warnings && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Important Warnings</h3>
                <p className="text-yellow-700 text-sm">{remedy.warnings}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <AddToCartButton 
                remedyId={remedy.id}
                remedyTitle={remedy.title}
                remedyPrice={parseFloat(remedy.price.toString())}
                remedyImage={remedy.images?.[0]}
              />
              <button className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                <Heart className="h-5 w-5" />
                Add to Wishlist
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex items-center text-sm text-gray-500 pt-4 border-t">
              <span>SKU: {remedy.sku || 'N/A'}</span>
              <span className="mx-2">•</span>
              <span>Added: {new Date(remedy.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedRemedies.length > 0 && (
          <div className="mt-16 pt-16 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Natural Remedies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedRemedies.map((related) => (
                <div key={related.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-square relative rounded-t-lg overflow-hidden">
                    {related.images && related.images.length > 0 ? (
                      <Image
                        src={related.images[0]}
                        alt={related.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12.5vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                        <div className="text-emerald-600 text-3xl">🌿</div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{related.title}</h3>
                    <p className="text-emerald-600 font-bold mb-3">{formatPrice(related.price)}</p>
                    <Link 
                      href={`/remedies/${related.slug}`}
                      className="w-full inline-block text-center bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

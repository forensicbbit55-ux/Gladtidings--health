import { prisma } from '@/lib/prisma'
import ImageCarousel from '@/components/ImageCarousel'

export const dynamic = 'force-dynamic'

export default async function RemediesPage() {
  // Fetch all published remedies
  const allRemedies = await prisma.remedy.findMany({
    where: {
      isPublished: true
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Carousel */}
      <ImageCarousel />

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="container responsive-padding-lg">
          <div className="text-center">
            <h1 className="text-responsive-3xl md:text-responsive-4xl font-bold mb-4 text-white">Natural Health Remedies</h1>
            <p className="text-responsive-lg md:text-responsive-xl text-emerald-100 max-w-2xl mx-auto">
              Discover time-tested natural remedies for optimal health and wellness
            </p>
          </div>
        </div>
      </div>

      {/* Remedies Grid */}
      <div className="container responsive-padding-lg responsive-margin-xl">
        {allRemedies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌿</div>
            <h2 className="text-responsive-2xl font-semibold text-gray-800 mb-2">No Remedies Yet</h2>
            <p className="text-gray-600 mb-6">
              Natural remedies will appear here once they are added to system.
            </p>
          </div>
        ) : (
          <div className="responsive-grid responsive-grid-2 lg:responsive-grid-3">
            {allRemedies.map((remedy) => (
              <div key={remedy.id} className="card">
                {/* Image */}
                {remedy.images && remedy.images.length > 0 ? (
                  <div className="aspect-video relative">
                    <img
                      src={remedy.images[0]}
                      alt={remedy.title}
                      className="card-image"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                    <div className="text-emerald-600 text-4xl">🌿</div>
                  </div>
                )}

                {/* Content */}
                <div className="card-content">
                  {/* Category Badge */}
                  {remedy.category && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        {remedy.category.name}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-responsive-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                    {remedy.title}
                  </h3>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-responsive-xl font-bold text-green-600">
                      KSH {parseFloat(remedy.price?.toString() || '0').toFixed(2)}
                    </span>
                  </div>

                  {/* Description */}
                  {remedy.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3 text-responsive-sm">
                      {remedy.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <span>
                        {new Date(remedy.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Natural Remedy</span>
                    </div>
                  </div>

                  {/* Quick Info */}
                  {(remedy.ingredients || remedy.benefits) && (
                    <div className="border-t pt-4">
                      {remedy.ingredients && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-700">Ingredients:</span>
                          <p className="text-sm text-gray-600 line-clamp-2">{remedy.ingredients}</p>
                        </div>
                      )}
                      {remedy.benefits && (
                        <div>
                          <span className="text-xs font-medium text-gray-700">Benefits:</span>
                          <p className="text-sm text-gray-600 line-clamp-2">{remedy.benefits}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <a
                      href={`/remedies/${remedy.slug}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors btn"
                    >
                      View Details
                    </a>
                    <button
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors btn"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

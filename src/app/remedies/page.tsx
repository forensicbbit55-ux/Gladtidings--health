import { db } from '@/lib/drizzle-db'
import { remedies } from '@/lib/drizzle/schema'
import { desc } from 'drizzle-orm'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export default async function RemediesPage() {
  // Fetch all remedies ordered by created_at desc
  const allRemedies = await db
    .select()
    .from(remedies)
    .orderBy(desc(remedies.createdAt))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Natural Health Remedies</h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Discover time-tested natural remedies for optimal health and wellness
            </p>
          </div>
        </div>
      </div>

      {/* Remedies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {allRemedies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌿</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Remedies Yet</h2>
            <p className="text-gray-600 mb-6">
              Natural remedies will appear here once they are added to the system.
            </p>
            <Link 
              href="/admin/remedies/new"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Add First Remedy
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRemedies.map((remedy) => (
              <div key={remedy.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {/* Image */}
                {remedy.imageUrl ? (
                  <div className="aspect-video relative">
                    <Image
                      src={remedy.imageUrl}
                      alt={remedy.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                    <div className="text-emerald-600 text-4xl">🌿</div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  {remedy.category && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        {remedy.category}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                    {remedy.title}
                  </h3>

                  {/* Description */}
                  {remedy.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {remedy.description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(remedy.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
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

                  {/* View Details Button */}
                  <Link
                    href={`/remedies/${remedy.slug}`}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Discover Natural Healing
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore our collection of natural remedies and learn how to harness the power of nature for your health and wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Shop Natural Products
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Learn Natural Medicine
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

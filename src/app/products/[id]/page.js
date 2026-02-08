async function getRemedy(id) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BASE_URL 
      : 'http://localhost:3001'
    
    const response = await fetch(`${baseUrl}/api/public/remedies?category_id=${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch remedy')
    }
    const data = await response.json()
    
    // Find the specific remedy from the results
    const remedy = data.remedies.find(r => r.id === id)
    return remedy || null
  } catch (error) {
    console.error('Error fetching remedy:', error)
    return null
  }
};

export default async function RemedyPage({ params }) {
  const remedy = await getRemedy(params.id)

  if (!remedy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Remedy Not Found</h1>
          <p className="text-gray-600 mb-6">The remedy you're looking for doesn't exist.</p>
          <a
            href="/products"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Back to Remedies
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex">
            <a
              href="/products"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              ← Back to Remedies
            </a>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image */}
          {remedy.image_url ? (
            <img
              src={remedy.image_url}
              alt={remedy.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          ) : (
            <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
              <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{remedy.title}</h1>
              {remedy.category_name && (
                <span className="px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-800 rounded-full">
                  {remedy.category_name}
                </span>
              )}
            </div>

            <div className="prose max-w-none">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{remedy.description}</p>
              </div>

              {remedy.usage && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Use</h2>
                  <p className="text-gray-600 leading-relaxed">{remedy.usage}</p>
                </div>
              )}

              <div className="border-t pt-6">
                <p className="text-sm text-gray-500">
                  Added on {new Date(remedy.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/products"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-center font-medium"
              >
                Back to All Remedies
              </a>
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
                Contact for More Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

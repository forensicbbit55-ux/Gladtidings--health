export default function AdminTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Test Page</h1>
      <p className="mt-4 text-gray-600">If you can see this, the admin routes are working!</p>
      
      <div className="mt-8 space-y-4">
        <a href="/admin/products" className="block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 w-48 text-center">
          Go to Products
        </a>
        <a href="/" className="block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 w-48 text-center">
          Go to Home
        </a>
      </div>
    </div>
  )
};;

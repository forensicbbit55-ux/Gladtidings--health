'use client'

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Shop Products</h3>
          <p className="text-gray-600 mt-2">Manage shop inventory and products</p>
          <div className="mt-4 space-x-2">
            <a href="/admin/shop" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
              Manage Shop
            </a>
            <a href="/admin/shop/add" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add Product
            </a>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
          <p className="text-gray-600 mt-2">Manage online courses and content</p>
          <div className="mt-4 space-x-2">
            <a href="/admin/courses" className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Manage Courses
            </a>
            <a href="/admin/courses/add" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Add Course
            </a>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Remedies</h3>
          <p className="text-gray-600 mt-2">Manage and add natural remedies</p>
          <div className="mt-4 space-x-2">
            <a href="/admin/remedies" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
              Manage Remedies
            </a>
            <a href="/admin/remedies/new" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Add Remedy
            </a>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Blog</h3>
          <p className="text-gray-600 mt-2">Manage blog posts and articles</p>
          <div className="mt-4 space-x-2">
            <a href="/admin/blog" className="inline-block px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
              Manage Blog
            </a>
            <a href="/admin/blog/new" className="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Add Post
            </a>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
          <p className="text-gray-600 mt-2">View and manage customer orders</p>
          <a href="/admin/orders" className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Manage Orders
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Website</h3>
          <p className="text-gray-600 mt-2">View your website</p>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            View Website
          </a>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">0</div>
            <div className="text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-gray-600">Total Users</div>
          </div>
        </div>
      </div>
    </div>
  )
};;

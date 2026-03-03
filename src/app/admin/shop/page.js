'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link'

const shopCategories = [
  { id: 'herbal-remedies', name: 'Herbal Remedies', count: 24 },
  { id: 'natural-supplements', name: 'Natural Supplements', count: 18 },
  { id: 'wellness-products', name: 'Wellness Products', count: 32 },
  { id: 'essential-oils', name: 'Essential Oils', count: 45 },
  { id: 'health-books', name: 'Health Books', count: 12 }
]

const sampleProducts = [
  {
    id: 1,
    name: 'Vitamin D3 Complex',
    category: 'natural-supplements',
    price: 2500,
    stock: 45,
    status: 'active',
    image: '/images/products/vitamin-d3.jpg',
    created_at: '2024-01-15'
  },
  {
    id: 2,
    name: 'Lavender Essential Oil',
    category: 'essential-oils',
    price: 3500,
    stock: 23,
    status: 'active',
    image: '/images/products/lavender-oil.jpg',
    created_at: '2024-01-14'
  },
  {
    id: 3,
    name: 'Natural Healing Encyclopedia',
    category: 'health-books',
    price: 4500,
    stock: 12,
    status: 'active',
    image: '/images/products/healing-encyclopedia.jpg',
    created_at: '2024-01-13'
  }
]

export default function AdminShop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Simulate loading products
    setTimeout(() => {
      setProducts(sampleProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryBadge = (category) => {
    const badges = {
      'herbal-remedies': 'bg-green-100 text-green-800',
      'natural-supplements': 'bg-blue-100 text-blue-800',
      'wellness-products': 'bg-purple-100 text-purple-800',
      'essential-oils': 'bg-yellow-100 text-yellow-800',
      'health-books': 'bg-orange-100 text-orange-800'
    }
    return badges[category] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryName = (categoryId) => {
    const category = shopCategories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }
    
    // Simulate delete
    setProducts(products.filter(product => product.id !== id))
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-600">Loading shop products...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Shop Management</h1>
          <Link
            href="/admin/shop/add"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Add New Product
          </Link>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {shopCategories.map((category) => (
            <div key={category.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-2xl font-bold text-emerald-600">{category.count}</p>
              <p className="text-sm text-gray-600">products</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by product name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Categories</option>
                {shopCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white shadow overflow-hidden rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-lg font-medium mb-2">No products found</div>
                    <div className="text-sm mb-4">
                      {searchTerm || selectedCategory !== 'all' 
                        ? 'Try adjusting your filters' 
                        : 'Start by adding your first product'
                      }
                    </div>
                    <Link
                      href="/admin/shop/add"
                      className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Add Product
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-500 text-xs">IMG</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            Created {new Date(product.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(product.category)}`}>
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">KSH {product.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        product.stock < 10 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {product.stock} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/shop/edit/${product.id}`}
                        className="text-emerald-600 hover:text-emerald-900 mr-3"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

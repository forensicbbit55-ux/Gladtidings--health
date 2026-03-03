'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const shopCategories = [
  { id: 'herbal-remedies', name: 'Herbal Remedies' },
  { id: 'natural-supplements', name: 'Natural Supplements' },
  { id: 'wellness-products', name: 'Wellness Products' },
  { id: 'essential-oils', name: 'Essential Oils' },
  { id: 'health-books', name: 'Health Books' }
]

export default function AddShopProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
    images: [],
    featured: false,
    specifications: {
      weight: '',
      dimensions: '',
      ingredients: '',
      usage: ''
    }
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you'd make an API call here
      console.log('New product:', formData)
      
      alert('Product added successfully!')
      router.push('/admin/shop')
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Add a new product to your shop inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a category</option>
                  {shopCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Describe your product..."
              />
            </div>
          </div>

          {/* Pricing and Inventory */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (KSH) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Featured Product</span>
              </label>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  name="specifications.weight"
                  value={formData.specifications.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 500g"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  name="specifications.dimensions"
                  value={formData.specifications.dimensions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., 10x5x3 cm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredients
                </label>
                <input
                  type="text"
                  name="specifications.ingredients"
                  value={formData.specifications.ingredients}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="List main ingredients"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Instructions
                </label>
                <input
                  type="text"
                  name="specifications.usage"
                  value={formData.specifications.usage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="How to use the product"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="mt-2 inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer"
              >
                Select Files
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/shop')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

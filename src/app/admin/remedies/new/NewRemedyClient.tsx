'use client'

import { useState } from 'react'
import { addRemedy } from '@/app/actions/remedies'
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function NewRemedyClient() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    benefits: '',
    preparation: '',
    category: '',
    imageUrl: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    try {
      const formDataToSubmit = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value)
      })

      const result = await addRemedy(formDataToSubmit)
      setResult(result)

      if (result.success) {
        // Reset form on success
        setFormData({
          title: '',
          description: '',
          ingredients: '',
          benefits: '',
          preparation: '',
          category: '',
          imageUrl: ''
        })
      }
    } catch (error) {
      setResult({ success: false, error: 'An unexpected error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    'Herbal Remedies',
    'Natural Supplements',
    'Essential Oils',
    'Traditional Medicine',
    'Home Remedies',
    'Wellness',
    'Other'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/admin"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md">
          {/* Form Header */}
          <div className="border-b px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Add New Remedy</h1>
            <p className="text-gray-600 mt-1">
              Create a new natural health remedy for Glad Tidings Health collection.
            </p>
          </div>

          {/* Result Message */}
          {result && (
            <div className={`mx-6 mt-4 p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {result.success ? (
                <div>
                  <h3 className="font-semibold">Success!</h3>
                  <p className="text-sm">Remedy has been added successfully and is now visible on the remedies page.</p>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold">Error</h3>
                  <p className="text-sm">{result.error}</p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Echinacea Immune Support"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe the remedy and its uses..."
              />
            </div>

            {/* Ingredients */}
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="List all natural ingredients..."
              />
            </div>

            {/* Benefits */}
            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              <textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="What are the health benefits?"
              />
            </div>

            {/* Preparation */}
            <div>
              <label htmlFor="preparation" className="block text-sm font-medium text-gray-700 mb-2">
                Preparation Instructions
              </label>
              <textarea
                id="preparation"
                name="preparation"
                value={formData.preparation}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="How to prepare and use this remedy..."
              />
            </div>

            {/* Preview Section */}
            {showPreview && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {formData.title || 'Remedy Title'}
                    </h4>
                    {formData.category && (
                      <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full mb-2">
                        {formData.category}
                      </span>
                    )}
                    {formData.description && (
                      <p className="text-gray-600 mb-3">{formData.description}</p>
                    )}
                    {formData.ingredients && (
                      <div className="mb-2">
                        <strong className="text-sm text-gray-700">Ingredients:</strong>
                        <p className="text-sm text-gray-600">{formData.ingredients}</p>
                      </div>
                    )}
                    {formData.benefits && (
                      <div className="mb-2">
                        <strong className="text-sm text-gray-700">Benefits:</strong>
                        <p className="text-sm text-gray-600">{formData.benefits}</p>
                      </div>
                    )}
                    {formData.preparation && (
                      <div>
                        <strong className="text-sm text-gray-700">Preparation:</strong>
                        <p className="text-sm text-gray-600">{formData.preparation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                href="/admin"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Remedy
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

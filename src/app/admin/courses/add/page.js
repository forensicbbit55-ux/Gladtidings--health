'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const courseCategories = [
  { id: 'herbal-medicine', name: 'Herbal Medicine' },
  { id: 'natural-healing', name: 'Natural Healing' }
]

const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels']

export default function AddCourse() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    level: '',
    duration: '',
    price: '',
    originalPrice: '',
    lessons: '',
    status: 'draft',
    certificate: false,
    featured: false,
    badge: '',
    requirements: '',
    whatYouLearn: '',
    targetAudience: '',
    materials: []
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you'd make an API call here
      console.log('New course:', formData)
      
      alert('Course added successfully!')
      router.push('/admin/courses')
    } catch (error) {
      console.error('Error adding course:', error)
      alert('Failed to add course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Course</h1>
          <p className="text-gray-600">Create a new course for your students</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor *
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Instructor name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a category</option>
                  {courseCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select level</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 8 weeks"
                />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your course..."
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price ($)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Lessons *
                </label>
                <input
                  type="number"
                  name="lessons"
                  value={formData.lessons}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What You'll Learn
                </label>
                <textarea
                  name="whatYouLearn"
                  value={formData.whatYouLearn}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="List the key learning outcomes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="List any prerequisites or requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <textarea
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe who this course is for..."
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Options</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Badge
                </label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">No Badge</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Popular">Popular</option>
                  <option value="New">New</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                  <option value="Expert">Expert</option>
                  <option value="Best Value">Best Value</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="certificate"
                    checked={formData.certificate}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Certificate of Completion</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Featured Course</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Image */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Image</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB (Recommended: 1280x720)
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="course-image-upload"
              />
              <label
                htmlFor="course-image-upload"
                className="mt-2 inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer"
              >
                Select Image
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/courses')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Adding Course...' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

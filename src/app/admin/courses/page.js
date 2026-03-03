'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link'

const courseCategories = [
  { id: 'herbal-medicine', name: 'Herbal Medicine', count: 8 },
  { id: 'natural-healing', name: 'Natural Healing', count: 6 }
]

const sampleCourses = [
  {
    id: 1,
    title: 'Complete Herbal Medicine Course',
    instructor: 'Dr. Sarah Johnson',
    category: 'herbal-medicine',
    level: 'Beginner to Advanced',
    duration: '12 weeks',
    price: 199.99,
    students: 1234,
    rating: 4.9,
    status: 'published',
    created_at: '2024-01-15'
  },
  {
    id: 2,
    title: 'Natural Healing Fundamentals',
    instructor: 'Dr. Michael Chen',
    category: 'natural-healing',
    level: 'Beginner',
    duration: '8 weeks',
    price: 149.99,
    students: 892,
    rating: 4.7,
    status: 'published',
    created_at: '2024-01-14'
  }
]

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Simulate loading courses
    setTimeout(() => {
      setCourses(sampleCourses)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status) => {
    const badges = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryBadge = (category) => {
    const badges = {
      'herbal-medicine': 'bg-green-100 text-green-800',
      'natural-healing': 'bg-purple-100 text-purple-800'
    }
    return badges[category] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryName = (categoryId) => {
    const category = courseCategories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Unknown'
  }

  const deleteCourse = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return
    }
    
    // Simulate delete
    setCourses(courses.filter(course => course.id !== id))
  }

  const duplicateCourse = async (id) => {
    const courseToDuplicate = courses.find(course => course.id === id)
    if (courseToDuplicate) {
      const newCourse = {
        ...courseToDuplicate,
        id: Date.now(),
        title: `${courseToDuplicate.title} (Copy)`,
        status: 'draft'
      }
      setCourses([...courses, newCourse])
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading courses...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <Link
            href="/admin/courses/add"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add New Course
          </Link>
        </div>

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {courseCategories.map((category) => (
            <div key={category.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-2xl font-bold text-purple-600">{category.count}</p>
              <p className="text-sm text-gray-600">courses</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by course title or instructor..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                {courseCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white shadow overflow-hidden rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
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
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-lg font-medium mb-2">No courses found</div>
                    <div className="text-sm mb-4">
                      {searchTerm || selectedCategory !== 'all' 
                        ? 'Try adjusting your filters' 
                        : 'Start by adding your first course'
                      }
                    </div>
                    <Link
                      href="/admin/courses/add"
                      className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Add Course
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">
                          {course.level} • {course.duration}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${course.price}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(course.category)}`}>
                        {getCategoryName(course.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.students.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">{course.rating}</span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(course.status)}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => duplicateCourse(course.id)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        title="Duplicate"
                      >
                        📋
                      </button>
                      <Link
                        href={`/admin/courses/edit/${course.id}`}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteCourse(course.id)}
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

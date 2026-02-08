'use client'

import { useState, useEffect } from 'react';
;import Link from 'next/link'
;
;export default function AdminProducts() {
  const [remedies, setRemedies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRemedies()
  }, [])

  const fetchRemedies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/remedies')
      const data = await response.json()

      if (data.success) {
        setRemedies(data.remedies)
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Error fetching remedies:', err)
      setError('Failed to fetch remedies')
    } finally {
      setLoading(false)
    }
  }

  const deleteRemedy = async (id) => {
    if (!confirm('Are you sure you want to delete this remedy?')) {
      return
    }

    try {
      const response = await fetch(`/api/remedies/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        // Refresh the remedies list
        fetchRemedies()
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Error deleting remedy:', err)
      setError('Failed to delete remedy')
    }
  }

  const getCategoryBadge = (categoryName) => {
    const colors = {
      'Herbal Remedies': 'bg-green-100 text-green-800',
      'Natural Therapies': 'bg-purple-100 text-purple-800',
      'Dietary Supplements': 'bg-blue-100 text-blue-800',
      'Essential Oils': 'bg-yellow-100 text-yellow-800'
    }
    return colors[categoryName] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-600">Loading remedies...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <div className="text-xl font-semibold mb-2">Error</div>
          <div>{error}</div>
          <button 
            onClick={fetchRemedies}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Remedies Management</h1>
          <Link
            href="/admin/products/add"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Add New Remedy
          </Link>
        </div>

        {remedies.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-500">
              <div className="text-lg font-medium mb-2">No remedies found</div>
              <div className="text-sm mb-4">Start by adding your first remedy</div>
              <Link
                href="/admin/products/add"
                className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Add Remedy
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remedy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {remedies.map((remedy) => (
                  <tr key={remedy.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {remedy.image_url && (
                          <img
                            src={remedy.image_url}
                            alt={remedy.title}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{remedy.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {remedy.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(remedy.category_name)}`}>
                        {remedy.category_name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        remedy.is_published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {remedy.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(remedy.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/products/edit/${remedy.id}`}
                        className="text-emerald-600 hover:text-emerald-900 mr-3"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteRemedy(remedy.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
};;

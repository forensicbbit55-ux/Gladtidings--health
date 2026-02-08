'use client'

import { useState } from 'react'
;
;export default function MediaLibrary() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Mock media data
  const mediaFiles = [
    {
      id: 1,
      name: 'mission-camp-2024.jpg',
      type: 'image',
      size: '2.4 MB',
      uploadDate: '2024-01-28',
      dimensions: '1920x1080',
      url: '/api/placeholder/400/300',
      category: 'Mission Photos'
    },
    {
      id: 2,
      name: 'health-education.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadDate: '2024-01-27',
      url: '/api/placeholder/400/300',
      category: 'Documents'
    },
    {
      id: 3,
      name: 'sermon-walking-faith.mp4',
      type: 'video',
      size: '45.2 MB',
      uploadDate: '2024-01-26',
      duration: '15:30',
      url: '/api/placeholder/400/300',
      category: 'Sermons'
    },
    {
      id: 4,
      name: 'team-photo-2024.jpg',
      type: 'image',
      size: '3.1 MB',
      uploadDate: '2024-01-25',
      dimensions: '2048x1536',
      url: '/api/placeholder/400/300',
      category: 'Team Photos'
    },
    {
      id: 5,
      name: 'medical-report-q1.pdf',
      type: 'pdf',
      size: '892 KB',
      uploadDate: '2024-01-24',
      url: '/api/placeholder/400/300',
      category: 'Reports'
    },
    {
      id: 6,
      name: 'community-outreach.mp4',
      type: 'video',
      size: '38.7 MB',
      uploadDate: '2024-01-23',
      duration: '12:45',
      url: '/api/placeholder/400/300',
      category: 'Mission Videos'
    },
    {
      id: 7,
      name: 'church-service.jpg',
      type: 'image',
      size: '1.9 MB',
      uploadDate: '2024-01-22',
      dimensions: '1600x1200',
      url: '/api/placeholder/400/300',
      category: 'Church Photos'
    },
    {
      id: 8,
      name: 'prayer-request-form.pdf',
      type: 'pdf',
      size: '234 KB',
      uploadDate: '2024-01-21',
      url: '/api/placeholder/400/300',
      category: 'Forms'
    },
    {
      id: 9,
      name: 'baptism-ceremony.mp4',
      type: 'video',
      size: '52.1 MB',
      uploadDate: '2024-01-20',
      duration: '18:20',
      url: '/api/placeholder/400/300',
      category: 'Events'
    },
    {
      id: 10,
      name: 'volunteer-group.jpg',
      type: 'image',
      size: '2.7 MB',
      uploadDate: '2024-01-19',
      dimensions: '1920x1080',
      url: '/api/placeholder/400/300',
      category: 'Team Photos'
    },
    {
      id: 11,
      name: 'annual-report-2023.pdf',
      type: 'pdf',
      size: '4.2 MB',
      uploadDate: '2024-01-18',
      url: '/api/placeholder/400/300',
      category: 'Reports'
    },
    {
      id: 12,
      name: 'youth-camp-2024.mp4',
      type: 'video',
      size: '41.5 MB',
      uploadDate: '2024-01-17',
      duration: '22:10',
      url: '/api/placeholder/400/300',
      category: 'Events'
    }
  ]

  // Filter media files
  const filteredMedia = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || file.type === filterType
    return matchesSearch && matchesType
  })

  const handleSelectFile = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredMedia.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredMedia.map(file => file.id))
    }
  }

  const handleDelete = (fileId) => {
    // Mock delete
    }

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'pdf':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 001.586 0H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6m-6 4h6m-6 4h1" />
          </svg>
        )
      case 'video':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'image':
        return 'bg-emerald-100 text-emerald-800'
      case 'pdf':
        return 'bg-red-100 text-red-800'
      case 'video':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatFileSize = (size) => {
    if (size.includes('KB')) {
      return size
    }
    return size
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage images, videos, documents, and other media files</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
          
          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search media files..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* File Type Filter */}
          <div className="lg:w-48">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="pdf">PDFs</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedFiles.length} selected
              </span>
              <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Bulk Actions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              {/* File Thumbnail */}
              <div className="relative aspect-square bg-gray-100">
                {file.type === 'image' ? (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : file.type === 'video' ? (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 001.586 0H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6m-6 4h6m-6 4h1" />
                    </svg>
                  </div>
                )}
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleSelectFile(file.id)}
                  />
                </div>
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(file.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {/* File Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFileTypeColor(file.type)}`}>
                    {file.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate mb-1">{file.name}</p>
                <p className="text-xs text-gray-500">{file.uploadDate}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      checked={selectedFiles.length === filteredMedia.length && filteredMedia.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Size</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Upload Date</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMedia.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => handleSelectFile(file.id)}
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-xs text-gray-500">{file.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFileTypeColor(file.type)}`}>
                        {file.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{formatFileSize(file.size)}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{file.uploadDate}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upload Media Files</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF, MP4 up to 50MB</p>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                  }
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};;

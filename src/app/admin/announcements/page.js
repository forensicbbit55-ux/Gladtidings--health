'use client'

import { useState } from 'react'
;
;export default function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Sunday Service Schedule Update',
      content: 'Please note that our Sunday service times have been updated. We now have services at 8:00 AM, 10:00 AM, and 6:00 PM. The 8:00 AM service will be traditional, 10:00 AM will be contemporary worship, and 6:00 PM is our youth service. All are welcome to join us for any service that fits your schedule.',
      type: 'Service Schedule',
      priority: 'High',
      status: 'active',
      startDate: '2024-01-28',
      endDate: '2024-02-28',
      author: 'Admin Team',
      createdAt: '2024-01-28',
      updatedAt: '2024-01-28',
      views: 245,
      featured: true
    },
    {
      id: 2,
      title: 'Medical Mission February 2024',
      content: 'Join us for our upcoming medical mission in February! We will be providing free health checkups, dental services, and health education to the community. The mission will take place at the Nairobi Community Center on February 15th from 9 AM to 4 PM. Volunteers are welcome to join us in serving the community.',
      type: 'Event',
      priority: 'High',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      author: 'Pastor Sarah Johnson',
      createdAt: '2024-01-25',
      updatedAt: '2024-01-27',
      views: 189,
      featured: true
    },
    {
      id: 3,
      title: 'New Small Groups Starting Soon',
      content: 'We are excited to announce that our new small groups program will be starting in March! These groups will meet weekly to study the Bible, pray together, and build community. Sign-ups will begin next week. Groups available include: Young Adults, Married Couples, Men\'s Group, Women\'s Group, and Youth Group.',
      type: 'Program',
      priority: 'Medium',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-03-31',
      author: 'Rev. Michael Chen',
      createdAt: '2024-01-24',
      updatedAt: '2024-01-24',
      views: 156,
      featured: false
    },
    {
      id: 4,
      title: 'Church Picnic and Family Day',
      content: 'Mark your calendars for our annual church picnic and family day! Join us on March 10th at the church grounds from 11 AM to 3 PM. There will be food, games, activities for all ages, and fellowship time. Bring your family and friends for a day of fun and community building.',
      type: 'Event',
      priority: 'Medium',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-03-10',
      author: 'Admin Team',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
      views: 134,
      featured: false
    },
    {
      id: 5,
      title: 'Easter Sunrise Service',
      content: 'Celebrate the resurrection of our Lord with our special Easter Sunrise Service at 6:00 AM on Easter Sunday, March 31st. We will have a beautiful time of worship, communion, and breakfast fellowship following the service. All are welcome to join us for this special celebration.',
      type: 'Service Schedule',
      priority: 'High',
      status: 'active',
      startDate: '2024-03-25',
      endDate: '2024-04-01',
      author: 'Pastor David Kim',
      createdAt: '2024-01-19',
      updatedAt: '2024-01-19',
      views: 98,
      featured: true
    },
    {
      id: 6,
      title: 'Volunteer Training Session',
      content: 'We will be holding a volunteer training session for all current and prospective volunteers on February 3rd at 2:00 PM. This training will cover our ministry philosophy, safety protocols, and service opportunities. Whether you\'re new to volunteering or have been serving for years, this training is for you!',
      type: 'Training',
      priority: 'Low',
      status: 'inactive',
      startDate: '2024-02-03',
      endDate: '2024-02-03',
      author: 'Admin Team',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-22',
      views: 67,
      featured: false
    },
    {
      id: 7,
      title: 'Youth Camp Registration Open',
      content: 'Registration is now open for our annual youth camp taking place from April 10-14! This year\'s theme is "Rooted in Faith" and will feature worship, teaching, games, and activities for students aged 12-18. Early bird pricing available until March 15th. Limited spots available.',
      type: 'Program',
      priority: 'Medium',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-04-14',
      author: 'Youth Director',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      views: 203,
      featured: false
    },
    {
      id: 8,
      title: 'New Sermon Series: "Walking in Faith"',
      content: 'Starting this Sunday, Pastor David will begin a new sermon series titled "Walking in Faith." This series will explore what it means to live out our faith in everyday life, drawing inspiration from Hebrews 11 and the examples of faith heroes in Scripture. Join us Sundays at 10:00 AM.',
      type: 'Sermon Series',
      priority: 'Medium',
      status: 'active',
      startDate: '2024-01-14',
      endDate: '2024-02-25',
      author: 'Pastor David Kim',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12',
      views: 167,
      featured: false
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'preview'
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'General',
    priority: 'Medium',
    status: 'active',
    startDate: '',
    endDate: '',
    featured: false
  })

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || announcement.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreate = () => {
    setEditingAnnouncement(null)
    setFormData({
      title: '',
      content: '',
      type: 'General',
      priority: 'Medium',
      status: 'active',
      startDate: '',
      endDate: '',
      featured: false
    })
    setShowForm(true)
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      status: announcement.status,
      startDate: announcement.startDate,
      endDate: announcement.endDate,
      featured: announcement.featured
    })
    setShowForm(true)
  }

  const handleDelete = (announcement) => {
    setDeleteModal(announcement)
  }

  const confirmDelete = () => {
    // Mock delete
    setAnnouncements(prev => prev.filter(ann => ann.id !== deleteModal.id))
    setDeleteModal(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingAnnouncement) {
      // Update existing announcement
      setAnnouncements(prev => prev.map(ann => 
        ann.id === editingAnnouncement.id 
          ? { ...ann, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : ann
      ))
    } else {
      // Create new announcement
      const newAnnouncement = {
        id: Math.max(...announcements.map(a => a.id)) + 1,
        ...formData,
        author: 'Admin Team',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        views: 0
      }
      setAnnouncements(prev => [newAnnouncement, ...prev])
    }
    setShowForm(false)
    setEditingAnnouncement(null)
    setFormData({
      title: '',
      content: '',
      type: 'General',
      priority: 'Medium',
      status: 'active',
      startDate: '',
      endDate: '',
      featured: false
    })
  }

  const toggleStatus = (announcementId) => {
    setAnnouncements(prev => prev.map(ann => 
      ann.id === announcementId 
        ? { ...ann, status: ann.status === 'active' ? 'inactive' : 'active' }
        : ann
    ))
  }

  const toggleFeatured = (announcementId) => {
    setAnnouncements(prev => prev.map(ann => 
      ann.id === announcementId 
        ? { ...ann, featured: !ann.featured }
        : ann
    ))
  }

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeBadge = (type) => {
    const colors = {
      'Service Schedule': 'bg-purple-100 text-purple-800',
      'Event': 'bg-orange-100 text-orange-800',
      'Program': 'bg-emerald-100 text-emerald-800',
      'Training': 'bg-indigo-100 text-indigo-800',
      'Sermon Series': 'bg-pink-100 text-pink-800',
      'General': 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Manage church announcements, events, and important updates</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
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
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'preview' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>
          
          {/* Add New Button */}
          <button
            onClick={handleCreate}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Announcement
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
                placeholder="Search announcements..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements Display */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    {/* Announcement Icon */}
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    
                    {/* Announcement Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(announcement.status)}`}>
                          {announcement.status}
                        </span>
                        {announcement.featured && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(announcement.type)}`}>
                          {announcement.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(announcement.priority)}`}>
                          {announcement.priority} Priority
                        </span>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-2">{announcement.content}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                        <span>Start: {announcement.startDate}</span>
                        <span>End: {announcement.endDate}</span>
                        <span>Views: {announcement.views}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-4">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(announcement.id)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      announcement.status === 'active'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {announcement.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => toggleFeatured(announcement.id)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      announcement.featured
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {announcement.featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleDelete(announcement)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Preview View */
        <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    <h3 className="text-white font-semibold">Announcement</h3>
                  </div>
                  {announcement.featured && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-400 text-yellow-900">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{announcement.content}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{announcement.startDate}</span>
                  <span>{announcement.endDate}</span>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(announcement.status)}`}>
                    {announcement.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(announcement.type)}`}>
                    {announcement.type}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {announcement.views} views
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter announcement title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Write your announcement content..."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                ></textarea>
              </div>

              {/* Type and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="General">General</option>
                    <option value="Service Schedule">Service Schedule</option>
                    <option value="Event">Event</option>
                    <option value="Program">Program</option>
                    <option value="Training">Training</option>
                    <option value="Sermon Series">Sermon Series</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />
                <label className="ml-2 text-sm text-gray-700">Featured announcement</label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {editingAnnouncement ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833.192-1.964.833-2.5L4.082 16.5c-.77.833.192 1.964.833 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete Announcement
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete "{deleteModal.title}"? This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};;

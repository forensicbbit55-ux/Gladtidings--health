'use client'

import { useState } from 'react'
;
;export default function MissionsManagement() {
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    image: null
  })

  // Mock mission event data
  const missions = [
    {
      id: 1,
      title: 'Community Health Camp - Nairobi',
      date: '2024-02-15',
      location: 'Nairobi Community Center',
      status: 'Upcoming',
      description: 'Free medical checkup and health education for the local community',
      attendees: 150,
      maxAttendees: 200,
      coordinator: 'Dr. Sarah Johnson',
      category: 'Health Camp'
    },
    {
      id: 2,
      title: 'Mobile Clinic - Rural Outreach',
      date: '2024-02-20',
      location: 'Kibera Slums',
      status: 'Upcoming',
      description: 'Mobile medical unit providing basic healthcare services to underserved communities',
      attendees: 89,
      maxAttendees: 100,
      coordinator: 'Dr. Michael Chen',
      category: 'Mobile Clinic'
    },
    {
      id: 3,
      title: 'Children\'s Health Education Program',
      date: '2024-01-28',
      location: 'St. Mary\'s School',
      status: 'Completed',
      description: 'Educational program teaching children about basic health and hygiene',
      attendees: 75,
      maxAttendees: 80,
      coordinator: 'Nurse Emily Rodriguez',
      category: 'Education'
    },
    {
      id: 4,
      title: 'Elderly Care Medical Mission',
      date: '2024-02-10',
      location: 'Sunset Retirement Home',
      status: 'Upcoming',
      description: 'Specialized medical care and health screening for elderly residents',
      attendees: 45,
      maxAttendees: 50,
      coordinator: 'Dr. David Kim',
      category: 'Elderly Care'
    },
    {
      id: 5,
      title: 'Maternal Health Workshop',
      date: '2024-01-20',
      location: 'Women\'s Health Center',
      status: 'Completed',
      description: 'Workshop focusing on maternal health, prenatal care, and infant nutrition',
      attendees: 92,
      maxAttendees: 100,
      coordinator: 'Dr. Lisa Thompson',
      category: 'Maternal Health'
    },
    {
      id: 6,
      title: 'Diabetes Awareness Campaign',
      date: '2024-02-25',
      location: 'City Hall Plaza',
      status: 'Upcoming',
      description: 'Public awareness campaign about diabetes prevention and management',
      attendees: 0,
      maxAttendees: 300,
      coordinator: 'Dr. James Wilson',
      category: 'Awareness'
    },
    {
      id: 7,
      title: 'Dental Health Mission',
      date: '2024-01-15',
      location: 'Rural Health Post',
      status: 'Completed',
      description: 'Free dental checkups and oral hygiene education for rural communities',
      attendees: 120,
      maxAttendees: 150,
      coordinator: 'Dr. Fiona Garcia',
      category: 'Dental'
    },
    {
      id: 8,
      title: 'Mental Health Support Group',
      date: '2024-02-18',
      location: 'Community Counseling Center',
      status: 'Upcoming',
      description: 'Support group session for mental health awareness and counseling',
      attendees: 25,
      maxAttendees: 30,
      coordinator: 'Dr. George Miller',
      category: 'Mental Health'
    }
  ]

  // Filter missions
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || mission.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleEdit = (mission) => {
    setEditingEvent(mission)
    setFormData({
      title: mission.title,
      date: mission.date,
      location: mission.location,
      description: mission.description,
      image: null
    })
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowForm(false)
    setFormData({
      title: '',
      date: '',
      location: '',
      description: '',
      image: null
    })
    setEditingEvent(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryBadge = (category) => {
    const colors = {
      'Health Camp': 'bg-purple-100 text-purple-800',
      'Mobile Clinic': 'bg-orange-100 text-orange-800',
      'Education': 'bg-emerald-100 text-emerald-800',
      'Elderly Care': 'bg-pink-100 text-pink-800',
      'Maternal Health': 'bg-indigo-100 text-indigo-800',
      'Awareness': 'bg-yellow-100 text-yellow-800',
      'Dental': 'bg-cyan-100 text-cyan-800',
      'Mental Health': 'bg-teal-100 text-teal-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getAttendanceProgress = (attendees, maxAttendees) => {
    const percentage = (attendees / maxAttendees) * 100
    return percentage
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Missions & Events</h1>
          <p className="text-gray-600">Manage medical outreach programs and evangelism events</p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null)
            setFormData({
              title: '',
              date: '',
              location: '',
              description: '',
              image: null
            })
            setShowForm(true)
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Event
        </button>
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
                placeholder="Search events by title or location..."
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
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredMissions.map((mission) => (
          <div key={mission.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  {/* Event Icon */}
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{mission.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(mission.status)}`}>
                        {mission.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(mission.category)}`}>
                        {mission.category}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {mission.date}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {mission.location}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {mission.coordinator}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mt-2">{mission.description}</p>
                    
                    {/* Attendance Progress */}
                    {mission.status === 'Upcoming' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Attendance</span>
                          <span>{mission.attendees}/{mission.maxAttendees}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getAttendanceProgress(mission.attendees, mission.maxAttendees)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-4">
                <button
                  onClick={() => handleEdit(mission)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingEvent ? 'Edit Medical Mission' : 'Add New Medical Mission'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Date and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Event location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Describe the medical mission or event"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Maximum number of attendees"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coordinator</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Event coordinator name"
                  />
                </div>
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
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
};;

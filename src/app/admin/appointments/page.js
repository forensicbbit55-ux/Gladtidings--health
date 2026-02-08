'use client'

import { useState, useEffect } from 'react';
;import { useAuth } from '@/contexts/NextAuthContext'
;
;export default function AdminAppointmentsPage() {
  const { user, isAdmin, loading } = useAuth()
  
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    userId: '',
    serviceType: ''
  })
  
  // Modal states
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Service type options
  const serviceTypes = [
    { value: 'consultation', label: 'Natural Health Consultation' },
    { value: 'follow-up', label: 'Follow-up Appointment' },
    { value: 'workshop', label: 'Wellness Workshop' },
    { value: 'detox', label: 'Detox Program' },
    { value: 'counseling', label: 'Spiritual Counseling' }
  ]

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'approved', label: 'Approved', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'completed', label: 'Completed', color: 'blue' }
  ]

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.date) queryParams.append('date', filters.date)
      if (filters.userId) queryParams.append('userId', filters.userId)
      
      const response = await fetch(`/api/appointments?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments')
      }
      
      const data = await response.json()
      setAppointments(data)
      setFilteredAppointments(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters
  useEffect(() => {
    let filtered = appointments

    if (filters.status) {
      filtered = filtered.filter(apt => apt.status === filters.status)
    }

    if (filters.date) {
      filtered = filtered.filter(apt => apt.appointmentDate === filters.date)
    }

    if (filters.userId) {
      filtered = filtered.filter(apt => apt.userId === filters.userId)
    }

    if (filters.serviceType) {
      filtered = filtered.filter(apt => apt.serviceType === filters.serviceType)
    }

    setFilteredAppointments(filtered)
  }, [appointments, filters])

  // Initial fetch and real-time updates
  useEffect(() => {
    if (isAdmin) {
      fetchAppointments()
      
      // Set up real-time updates (polling every 30 seconds)
      const interval = setInterval(fetchAppointments, 30000)
      
      return () => clearInterval(interval)
    }
  }, [isAdmin])

  // Handle appointment actions
  const handleApprove = async (appointmentId) => {
    try {
      setActionLoading(true)
      setError('')
      setSuccessMessage('')
      
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to approve appointment')
      }
      
      setSuccessMessage('Appointment approved successfully!')
      fetchAppointments() // Refresh data
    } catch (error) {
      setError(error.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async (appointmentId) => {
    try {
      setActionLoading(true)
      setError('')
      setSuccessMessage('')
      
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to cancel appointment')
      }
      
      setSuccessMessage('Appointment cancelled successfully!')
      fetchAppointments() // Refresh data
    } catch (error) {
      setError(error.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleComplete = async (appointmentId) => {
    try {
      setActionLoading(true)
      setError('')
      setSuccessMessage('')
      
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to complete appointment')
      }
      
      setSuccessMessage('Appointment marked as completed!')
      fetchAppointments() // Refresh data
    } catch (error) {
      setError(error.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Format date and time
  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status)
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and monitor all appointments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="ml-2 text-sm text-gray-600">Live Updates</span>
            </div>
            <button
              onClick={fetchAppointments}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 12.293a1 1 0 00-1.414 0l-2-2a1 1 0 00-1.414 1.414L10.586 9.414a1 1 0 001.414 0l4 4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 9.414a1 1 0 001.414 0l4-4a1 1 0 001.414-1.414L13.414 6.586a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L11.414 9.414a1 1 0 001.414 0z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              placeholder="Enter user ID"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              value={filters.serviceType}
              onChange={(e) => setFilters(prev => ({ ...prev, serviceType: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            >
              <option value="">All Services</option>
              {serviceTypes.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setFilters({ status: '', date: '', userId: '', serviceType: '' })}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Appointments ({filteredAppointments.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.appointmentDate} at {appointment.appointmentTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.userId}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {appointment.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {serviceTypes.find(s => s.value === appointment.serviceType)?.label || appointment.serviceType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(appointment.id)}
                              disabled={actionLoading}
                              className="text-emerald-600 hover:text-emerald-900 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleCancel(appointment.id)}
                              disabled={actionLoading}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === 'approved' && (
                          <button
                            onClick={() => handleComplete(appointment.id)}
                            disabled={actionLoading}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment)
                            setShowDetailsModal(true)
                          }
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Appointment ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedAppointment.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">User ID</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedAppointment.userId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Service Type</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {serviceTypes.find(s => s.value === selectedAppointment.serviceType)?.label || selectedAppointment.serviceType}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedAppointment.appointmentDate}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Time</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedAppointment.appointmentTime}</p>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedAppointment.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedAppointment.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};;

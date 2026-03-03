'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/NextAuthContext'

export default function AdminAppointmentsClient() {
  const { user, isAdmin, loading } = useAuth()
  
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      window.location.href = '/admin'
    }
  }, [user, isAdmin, loading])

  // Fetch appointments
  useEffect(() => {
    if (!isAdmin) return

    const fetchAppointments = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/appointments')
        if (response.ok) {
          const data = await response.json()
          setAppointments(data.appointments || [])
          setFilteredAppointments(data.appointments || [])
        } else {
          setError('Failed to fetch appointments')
        }
      } catch (error) {
        console.error('Error fetching appointments:', error)
        setError('Network error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [isAdmin])

  // Filter appointments
  useEffect(() => {
    let filtered = appointments

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(apt => 
        new Date(apt.date).toDateString() === new Date(dateFilter).toDateString()
      )
    }

    setFilteredAppointments(filtered)
  }, [appointments, searchTerm, statusFilter, dateFilter])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show access denied if not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page</p>
          <button
            onClick={() => window.location.href = '/admin'}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go to Admin
          </button>
        </div>
      </div>
    )
  }

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Update local state
        setAppointments(prev => prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        ))
      } else {
        setError('Failed to update appointment status')
      }
    } catch (error) {
      console.error('Error updating appointment:', error)
      setError('Network error occurred')
    }
  }

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId))
      } else {
        setError('Failed to delete appointment')
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      setError('Network error occurred')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const openDetailsModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedAppointment(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600">Manage all appointment bookings</p>
            </div>
            <div className="text-sm text-gray-500">
              Total: {filteredAppointments.length} appointments
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
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
                          <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                          <div className="text-sm text-gray-500">{appointment.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.serviceType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openDetailsModal(appointment)}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            View
                          </button>
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusUpdate(appointment.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Name:</span> {selectedAppointment.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {selectedAppointment.email}
                </div>
                <div>
                  <span className="font-medium">Service:</span> {selectedAppointment.serviceType}
                </div>
                <div>
                  <span className="font-medium">Date:</span> {new Date(selectedAppointment.date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Time:</span> {selectedAppointment.time}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <span className="font-medium">Notes:</span> {selectedAppointment.notes}
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

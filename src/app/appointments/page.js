'use client'

import { useState, useEffect } from 'react';
;import { useAuth } from '@/contexts/NextAuthContext';
;import { useRouter } from 'next/navigation'
;
;export default function AppointmentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    serviceType: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])

  // Available services
  const services = [
    { id: 'consultation', name: 'Natural Health Consultation', duration: 60, description: 'Initial consultation for herbal remedies and natural health solutions' },
    { id: 'follow-up', name: 'Follow-up Appointment', duration: 30, description: 'Review progress and adjust treatment plan' },
    { id: 'workshop', name: 'Wellness Workshop', duration: 120, description: 'Group session on spiritual wellness and natural healing' },
    { id: 'detox', name: 'Detox Program', duration: 90, description: 'Comprehensive body detoxification consultation' },
    { id: 'counseling', name: 'Spiritual Counseling', duration: 45, description: 'Spiritual guidance and wellness counseling' }
  ]

  // Time slots (30-minute intervals from 9 AM to 6 PM)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00'
  ]

  // Generate available dates (next 30 days)
  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      dates.push(date)
    }
    
    return dates
  }

  // Check if a slot is already booked
  const isSlotBooked = (date, time) => {
    return bookedSlots.some(slot => 
      slot.date === date && slot.time === time
    )
  }

  // Fetch existing appointments to prevent double bookings
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // In a real app, this would be an API call
        // For demo, we'll use mock data
        const mockBookedSlots = [
          { date: '2026-02-10', time: '10:00' },
          { date: '2026-02-10', time: '14:00' },
          { date: '2026-02-15', time: '09:30' },
          { date: '2026-02-15', time: '13:00' }
        ]
        setBookedSlots(mockBookedSlots)
      } catch (error) {
        console.error('Failed to fetch appointments:', error)
      }
    }

    if (user) {
      fetchAppointments()
    }
  }, [user])

  // Update available slots when date changes
  useEffect(() => {
    if (formData.appointmentDate) {
      const slots = timeSlots.filter(time => !isSlotBooked(formData.appointmentDate, time))
      setAvailableSlots(slots)
    } else {
      setAvailableSlots(timeSlots)
    }
  }, [formData.appointmentDate, bookedSlots])

  const validateForm = () => {
    const newErrors = {}

    // Service validation
    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service'
    }

    // Date validation
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Please select a date'
    } else {
      const selectedDate = new Date(formData.appointmentDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Cannot book appointments in the past'
      }
    }

    // Time validation
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Please select a time'
    } else if (!availableSlots.includes(formData.appointmentTime)) {
      newErrors.appointmentTime = 'Selected time is not available'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Reset time when service or date changes
    if (name === 'serviceType' || name === 'appointmentDate') {
      setFormData(prev => ({
        ...prev,
        appointmentTime: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSuccessMessage('')

    try {
      // Check for double booking one more time
      if (isSlotBooked(formData.appointmentDate, formData.appointmentTime)) {
        setErrors({ general: 'This time slot is already booked. Please select a different time.' })
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage('Appointment booked successfully! You will receive a confirmation email.')
        setFormData({
          serviceType: '',
          appointmentDate: '',
          appointmentTime: '',
          notes: ''
        })
        setErrors({})
        
        // Add to booked slots to prevent immediate double booking
        setBookedSlots(prev => [...prev, {
          date: formData.appointmentDate,
          time: formData.appointmentTime
        }])
      } else {
        setErrors({ general: data.error || 'Failed to book appointment' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getSelectedService = () => {
    return services.find(service => service.id === formData.serviceType)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
          <p className="mt-1 text-sm text-gray-600">
            Schedule your natural health consultation
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 12.293a1 1 0 00-1.414 0l-2-2a1 1 0 00-1.414 1.414L10.586 9.414a1 1 0 001.414 0l4 4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 9.414a1 1 0 001.414 0l4-4a1 1 0 001.414-1.414L13.414 6.586a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L11.414 9.414a1 1 0 001.414 0z" clipRule="evenodd" />
              </svg>
              {errors.general}
            </div>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Selection */}
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
              Select Service
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
                errors.serviceType ? 'border-red-300' : ''
              }`}
            >
              <option value="">Choose a service...</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.duration} min)
                </option>
              ))}
            </select>
            {errors.serviceType && (
              <p className="mt-2 text-sm text-red-600">{errors.serviceType}</p>
            )}
            
            {/* Service Description */}
            {formData.serviceType && (
              <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                <p className="text-sm text-emerald-700">
                  {getSelectedService()?.description}
                </p>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div>
            <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
                errors.appointmentDate ? 'border-red-300' : ''
              }`}
            />
            {errors.appointmentDate && (
              <p className="mt-2 text-sm text-red-600">{errors.appointmentDate}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Weekends are not available
            </p>
          </div>

          {/* Time Selection */}
          <div>
            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map(time => {
                const isBooked = isSlotBooked(formData.appointmentDate, time)
                const isAvailable = availableSlots.includes(time)
                
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, appointmentTime: time }))}
                    disabled={!isAvailable}
                    className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                      formData.appointmentTime === time
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : isBooked
                        ? 'bg-red-100 text-red-400 border-red-200 cursor-not-allowed'
                        : isAvailable
                        ? 'bg-white text-gray-700 border-gray-300 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }`
                  }
                  >
                    {time}
                    {isBooked && (
                      <span className="ml-1 text-xs">Booked</span>
                    )}
                  </button>
                )
              })}
            </div>
            {errors.appointmentTime && (
              <p className="mt-2 text-sm text-red-600">{errors.appointmentTime}</p>
            )}
            {formData.appointmentDate && (
              <p className="mt-2 text-xs text-gray-500">
                {availableSlots.length} time slots available
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Please share any specific health concerns or questions you have..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum 500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !formData.appointmentTime}
              className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 ${
                isLoading || !formData.appointmentTime ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking...
                </div>
              ) : (
                'Book Appointment'
              )}
            </button>
          </div>
        </form>

        {/* Booking Instructions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Booking Information</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Select a service from the available options</li>
            <li>• Choose a date (weekends not available)</li>
            <li>• Select an available time slot</li>
            <li>• Add any additional notes or health concerns</li>
            <li>• You will receive a confirmation email after booking</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react';
;import { useAuth } from '@/contexts/NextAuthContext'
;
;export default function AdminAnalyticsPage() {
  const { user, isAdmin, loading } = useAuth()
  
  const [analyticsData, setAnalyticsData] = useState({
    registrations: [],
    appointments: [],
    newsletter: [],
    summary: {
      totalUsers: 0,
      totalAppointments: 0,
      totalNewsletterSubscribers: 0,
      avgConversionRate: 0,
      topService: '',
      topAcquisitionChannel: ''
    }
  })
  
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 11)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  
  const [loadingData, setLoadingData] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch analytics data
  useEffect(() => {
    if (isAdmin) {
      fetchAnalyticsData()
    }
  }, [isAdmin, dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoadingData(true)
      
      // Fetch user registrations
      const registrationsResponse = await fetch(
        `/api/analytics/registrations?startDate=${dateRange.start}&endDate=${dateRange.end}&groupBy=month`
      )
      const registrationsData = await registrationsResponse.json()
      
      // Fetch appointment analytics
      const appointmentsResponse = await fetch(
        `/api/analytics/appointments?startDate=${dateRange.start}&endDate=${dateRange.end}&groupBy=month`
      )
      const appointmentsData = await appointmentsResponse.json()
      
      // Fetch newsletter analytics
      const newsletterResponse = await fetch(
        `/api/analytics/newsletter?startDate=${dateRange.start}&endDate=${dateRange.end}&groupBy=month`
      )
      const newsletterData = await newsletterResponse.json()

      // Calculate summary metrics
      const totalUsers = registrationsData.totalCount || 0
      const totalAppointments = appointmentsData.totalCount || 0
      const totalNewsletterSubscribers = newsletterData.totalCount || 0
      
      // Calculate average conversion rate
      const totalBookings = appointmentsData.analytics?.reduce((sum, item) => sum + item.bookings, 0) || 0
      const totalConversions = appointmentsData.analytics?.reduce((sum, item) => sum + item.conversions, 0) || 0
      const avgConversionRate = totalBookings > 0 ? Math.round((totalConversions / totalBookings) * 100 * 100) / 100 : 0

      // Find top service type
      const serviceCounts = {}
      appointmentsData.analytics?.forEach(item => {
        item.serviceTypes?.forEach(service => {
          serviceCounts[service] = (serviceCounts[service] || 0) + 1
        })
      })
      const topService = Object.keys(serviceCounts).reduce((a, b) => 
        serviceCounts[a] > serviceCounts[b] ? a : b
      , '')

      // Find top acquisition channel
      const channelCounts = {}
      registrationsData.registrations?.forEach(item => {
        item.acquisitionChannels?.forEach(channel => {
          channelCounts[channel] = (channelCounts[channel] || 0) + 1
        })
      })
      const topAcquisitionChannel = Object.keys(channelCounts).reduce((a, b) => 
        channelCounts[a] > channelCounts[b] ? a : b
      , '')

      setAnalyticsData({
        registrations: registrationsData.registrations || [],
        appointments: appointmentsData.analytics || [],
        newsletter: newsletterData.analytics || [],
        summary: {
          totalUsers,
          totalAppointments,
          totalNewsletterSubscribers,
          avgConversionRate,
          topService,
          topAcquisitionChannel
        }
      })
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  // Chart data preparation
  const prepareChartData = (data, metric) => {
    return data.map(item => ({
      date: item.date,
      value: item[metric] || 0,
      label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }))
  }

  const registrationChartData = prepareChartData(analyticsData.registrations, 'registrations')
  const appointmentChartData = prepareChartData(analyticsData.appointments, 'bookings')
  const conversionChartData = prepareChartData(analyticsData.appointments, 'conversionRate')
  const newsletterChartData = prepareChartData(analyticsData.newsletter, 'signups')

  // Calculate growth rates
  const calculateGrowthRate = (current, previous) => {
    if (previous === 0) return 100
    return Math.round(((current - previous) / previous) * 100 * 100) / 100
  }

  if (loading || loadingData) {
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
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Comprehensive analytics and insights for Glad Tidings
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700">Date Range</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700">to</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-emerald-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 3.162 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-semibold text-gray-900">{analyticsData.summary.totalUsers.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                  <dd className="text-lg font-semibold text-gray-900">{analyticsData.summary.totalAppointments.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0l1.48-1.01L18 8m0 8l-3.42 2.26a2 2 0 00-2.22 0L9 16.01 7.52 17 5.26 2 2 0 01-2.22 0L3 16V8z"/>
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Newsletter Subscribers</dt>
                  <dd className="text-lg font-semibold text-gray-900">{analyticsData.summary.totalNewsletterSubscribers.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0l8-8m-4-4v8m0 0l-8 8m8-4H9m-4-4v8m0 0l-8 8"/>
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Conversion Rate</dt>
                  <dd className="text-lg font-semibold text-gray-900">{analyticsData.summary.avgConversionRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'newsletter'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Newsletter
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Growth Overview</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">User Registrations</h4>
                    <SimpleChart data={registrationChartData} color="#10b981" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Appointment Bookings</h4>
                    <SimpleChart data={appointmentChartData} color="#3b82f6" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Registration Analytics</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <DetailedChart 
                  data={registrationChartData} 
                  title="User Registrations"
                  color="#10b981"
                  showGrowth={true}
                />
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Analytics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Bookings Per Month</h4>
                    <DetailedChart 
                      data={appointmentChartData} 
                      title="Monthly Bookings"
                      color="#3b82f6"
                      showGrowth={true}
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Conversion Rate</h4>
                    <DetailedChart 
                      data={conversionChartData} 
                      title="Conversion Rate (%)"
                      color="#10b981"
                      showGrowth={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'newsletter' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Newsletter Growth</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <DetailedChart 
                  data={newsletterChartData} 
                  title="Newsletter Signups"
                  color="#8b5cf6"
                  showGrowth={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};;

// Simple Chart Component
function SimpleChart({ data, color }) {
  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full px-2">
        {data.map((point, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-gray-200 rounded-t"
              style={ 
                height: `${(point.value / Math.max(...data.map(d => d.value))) * 100}%`,
                backgroundColor: color 
              }
            />
            <div className="text-xs text-gray-600 mt-1 text-center">
              {point.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

// Detailed Chart Component
function DetailedChart({ data, title, color, showGrowth }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-4">{title}</h4>
      <div className="h-80">
        <div className="flex items-end justify-between h-full px-2">
          {data.map((point, index) => {
            const previousValue = index > 0 ? data[index - 1].value : 0
            const growth = calculateGrowthRate(point.value, previousValue)
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gray-200 rounded-t relative group"
                  style={ 
                    height: `${(point.value / Math.max(...data.map(d => d.value))) * 100}%`,
                    backgroundColor: color 
                  }
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {point.value}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-1 text-center">
                  <div>{point.label}</div>
                  {showGrowth && index > 0 && (
                    <div className={`text-xs font-medium ${
                      growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {growth > 0 ? '+' : ''}{growth}%
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function calculateGrowthRate(current, previous) {
  if (previous === 0) return 100
  return Math.round(((current - previous) / previous) * 100 * 100) / 100
}

import { NextResponse } from 'next/server'
;
;// Mock database storage (replace with actual database calls)
let appointmentAnalytics = []

export async function POST(request) {
  try {
    const { appointmentId, userId, serviceType, bookingDate, bookingTime, status, conversionTime, referrer, utmSource, utmMedium, utmCampaign, deviceType, browser } = await request.json()

    // Validate input
    if (!appointmentId || !userId || !serviceType || !bookingDate || !bookingTime) {
      return NextResponse.json(
        { error: 'Appointment ID, user ID, service type, booking date, and booking time are required' },
        { status: 400 }
      )
    }

    // Create appointment analytics
    const analytics = {
      id: Date.now().toString(),
      appointmentId,
      userId,
      serviceType,
      bookingDate,
      bookingTime,
      status,
      conversionTime: conversionTime || null,
      referrer: referrer || null,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      deviceType: deviceType || null,
      browser: browser || null,
      createdAt: new Date().toISOString()
    }

    // In a real app, you would save to database:
    // const appointmentAnalytics = await prisma.appointmentAnalytics.create({
    //   data: analytics
    // })

    // For demo, add to mock storage
    appointmentAnalytics.push(analytics)

    return NextResponse.json(
      { 
        message: 'Appointment analytics tracked successfully',
        analyticsId: analytics.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to track appointment analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const groupBy = searchParams.get('groupBy') || 'day'
    const serviceType = searchParams.get('serviceType')

    // In a real app, you would query database:
    // let whereClause = {}
    // if (startDate) {
    //   whereClause.bookingDate = { gte: new Date(startDate) }
    // }
    // if (endDate) {
    //   whereClause.bookingDate = { lte: new Date(endDate) }
    // }
    // if (serviceType) {
    //   whereClause.serviceType = serviceType
    // }
    // 
    // const analytics = await prisma.appointmentAnalytics.findMany({
    //   where: whereClause,
    //   orderBy: { bookingDate: 'desc' }
    // })

    // For demo, return mock data with aggregation
    let filteredAnalytics = appointmentAnalytics

    if (startDate) {
      filteredAnalytics = filteredAnalytics.filter(analytics => 
        new Date(analytics.bookingDate) >= new Date(startDate)
      )
    }

    if (endDate) {
      filteredAnalytics = filteredAnalytics.filter(analytics => 
        new Date(analytics.bookingDate) <= new Date(endDate)
      )
    }

    if (serviceType) {
      filteredAnalytics = filteredAnalytics.filter(analytics => 
        analytics.serviceType === serviceType
      )
    }

    // Group by date
    const groupedData = {}
    filteredAnalytics.forEach(analytics => {
      let key = analytics.bookingDate
      if (groupBy === 'week') {
        const date = new Date(analytics.bookingDate)
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        key = weekStart.toISOString().split('T')[0]
      } else if (groupBy === 'month') {
        const date = new Date(analytics.bookingDate)
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          bookings: 0,
          conversions: 0,
          conversionRate: 0,
          serviceTypes: [],
          avgConversionTime: 0,
          totalConversionTime: 0,
          conversionCount: 0
        }
      }

      groupedData[key].bookings++
      groupedData[key].serviceTypes.push(analytics.serviceType)
      
      if (analytics.status === 'approved') {
        groupedData[key].conversions++
        groupedData[key].conversionCount++
        
        if (analytics.conversionTime) {
          groupedData[key].totalConversionTime += analytics.conversionTime
        }
      }
    })

    // Calculate metrics
    Object.values(groupedData).forEach(group => {
      // Get unique service types
      group.serviceTypes = [...new Set(group.serviceTypes)]
      
      // Calculate conversion rate
      if (group.bookings > 0) {
        group.conversionRate = Math.round((group.conversions / group.bookings) * 100 * 100) / 100
      }
      
      // Calculate average conversion time
      if (group.conversionCount > 0) {
        group.avgConversionTime = Math.round(group.totalConversionTime / group.conversionCount)
      }
    })

    const result = Object.values(groupedData).sort((a, b) => new Date(b.date) - new Date(a.date))

    return NextResponse.json({
      analytics: result,
      totalCount: filteredAnalytics.length
    })
  } catch (error) {
    console.error('Failed to fetch appointment analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

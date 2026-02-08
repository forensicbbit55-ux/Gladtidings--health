import { NextResponse } from 'next/server'
;
;// Mock database storage (replace with actual database calls)
let newsletterAnalytics = []

export async function POST(request) {
  try {
    const { subscriberId, signupDate, signupSource, referrer, utmSource, utmMedium, utmCampaign, conversionTime, deviceType, browser } = await request.json()

    // Validate input
    if (!subscriberId || !signupDate) {
      return NextResponse.json(
        { error: 'Subscriber ID and signup date are required' },
        { status: 400 }
      )
    }

    // Create newsletter analytics
    const analytics = {
      id: Date.now().toString(),
      subscriberId,
      signupDate,
      signupSource: signupSource || 'unknown',
      referrer: referrer || null,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      conversionTime: conversionTime || null,
      deviceType: deviceType || null,
      browser: browser || null,
      createdAt: new Date().toISOString()
    }

    // In a real app, you would save to database:
    // const newsletterAnalytics = await prisma.newsletterAnalytics.create({
    //   data: analytics
    // })

    // For demo, add to mock storage
    newsletterAnalytics.push(analytics)

    return NextResponse.json(
      { 
        message: 'Newsletter signup tracked successfully',
        analyticsId: analytics.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to track newsletter analytics:', error)
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
    const signupSource = searchParams.get('signupSource')

    // In a real app, you would query database:
    // let whereClause = {}
    // if (startDate) {
    //   whereClause.signupDate = { gte: new Date(startDate) }
    // }
    // if (endDate) {
    //   whereClause.signupDate = { lte: new Date(endDate) }
    // }
    // if (signupSource) {
    //   whereClause.signupSource = signupSource
    // }
    // 
    // const analytics = await prisma.newsletterAnalytics.findMany({
    //   where: whereClause,
    //   orderBy: { signupDate: 'desc' }
    // })

    // For demo, return mock data with aggregation
    let filteredAnalytics = newsletterAnalytics

    if (startDate) {
      filteredAnalytics = filteredAnalytics.filter(analytics => 
        new Date(analytics.signupDate) >= new Date(startDate)
      )
    }

    if (endDate) {
      filteredAnalytics = filteredAnalytics.filter(analytics => 
        new Date(analytics.signupDate) <= new Date(endDate)
      )
    }

    if (signupSource) {
      filteredAnalytics = filteredAnalytics.filter(analytics => 
        analytics.signupSource === signupSource
      )
    }

    // Group by date
    const groupedData = {}
    filteredAnalytics.forEach(analytics => {
      let key = analytics.signupDate
      if (groupBy === 'week') {
        const date = new Date(analytics.signupDate)
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        key = weekStart.toISOString().split('T')[0]
      } else if (groupBy === 'month') {
        const date = new Date(analytics.signupDate)
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          signups: 0,
          signupSources: [],
          avgConversionTime: 0,
          totalConversionTime: 0,
          conversionCount: 0
        }
      }

      groupedData[key].signups++
      groupedData[key].signupSources.push(analytics.signupSource)
      
      if (analytics.conversionTime) {
        groupedData[key].totalConversionTime += analytics.conversionTime
        groupedData[key].conversionCount++
      }
    })

    // Calculate metrics
    Object.values(groupedData).forEach(group => {
      // Get unique signup sources
      group.signupSources = [...new Set(group.signupSources)]
      
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
    console.error('Failed to fetch newsletter analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

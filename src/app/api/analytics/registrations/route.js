import { NextResponse } from 'next/server'
;
;// Mock database storage (replace with actual database calls)
let userRegistrations = []

export async function POST(request) {
  try {
    const { userId, registrationDate, referrer, utmSource, utmMedium, utmCampaign, acquisitionChannel } = await request.json()

    // Validate input
    if (!userId || !registrationDate) {
      return NextResponse.json(
        { error: 'User ID and registration date are required' },
        { status: 400 }
      )
    }

    // Create registration analytics
    const registration = {
      id: Date.now().toString(),
      userId,
      registrationDate,
      referrer: referrer || null,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      acquisitionChannel: acquisitionChannel || 'organic',
      createdAt: new Date().toISOString()
    }

    // In a real app, you would save to database:
    // const userReg = await prisma.userRegistration.create({
    //   data: registration
    // })

    // For demo, add to mock storage
    userRegistrations.push(registration)

    return NextResponse.json(
      { 
        message: 'Registration tracked successfully',
        registrationId: registration.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to track registration:', error)
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

    // In a real app, you would query database:
    // let whereClause = {}
    // if (startDate) {
    //   whereClause.registrationDate = { gte: new Date(startDate) }
    // }
    // if (endDate) {
    //   whereClause.registrationDate = { lte: new Date(endDate) }
    // }
    // 
    // const registrations = await prisma.userRegistration.findMany({
    //   where: whereClause,
    //   orderBy: { registrationDate: 'desc' }
    // })

    // For demo, return mock data with aggregation
    let filteredRegistrations = userRegistrations

    if (startDate) {
      filteredRegistrations = filteredRegistrations.filter(reg => 
        new Date(reg.registrationDate) >= new Date(startDate)
      )
    }

    if (endDate) {
      filteredRegistrations = filteredRegistrations.filter(reg => 
        new Date(reg.registrationDate) <= new Date(endDate)
      )
    }

    // Group by date
    const groupedData = {}
    filteredRegistrations.forEach(reg => {
      let key = reg.registrationDate
      if (groupBy === 'week') {
        const date = new Date(reg.registrationDate)
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        key = weekStart.toISOString().split('T')[0]
      } else if (groupBy === 'month') {
        const date = new Date(reg.registrationDate)
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          registrations: 0,
          referrers: [],
          utmSources: [],
          acquisitionChannels: []
        }
      }

      groupedData[key].registrations++
      
      if (reg.referrer) {
        groupedData[key].referrers.push(reg.referrer)
      }
      
      if (reg.utmSource) {
        groupedData[key].utmSources.push(reg.utmSource)
      }
      
      if (reg.acquisitionChannel) {
        groupedData[key].acquisitionChannels.push(reg.acquisitionChannel)
      }
    })

    const result = Object.values(groupedData).sort((a, b) => new Date(b.date) - new Date(a.date))

    return NextResponse.json({
      registrations: result,
      totalCount: filteredRegistrations.length
    })
  } catch (error) {
    console.error('Failed to fetch registration analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

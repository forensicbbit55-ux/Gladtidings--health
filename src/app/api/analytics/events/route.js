import { NextResponse } from 'next/server'
;
;// Mock database storage (replace with actual database calls)
let analyticsEvents = []

export async function POST(request) {
  try {
    const { eventType, eventData, userId, sessionId, ipAddress, userAgent, referrer, utmSource, utmMedium, utmCampaign, utmTerm, utmContent } = await request.json()

    // Validate input
    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    // Create analytics event
    const newEvent = {
      id: Date.now().toString(),
      eventType,
      eventData: eventData || {},
      userId: userId || null,
      sessionId: sessionId || null,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      referrer: referrer || null,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      utmTerm: utmTerm || null,
      utmContent: utmContent || null,
      createdAt: new Date().toISOString()
    }

    // In a real app, you would save to database:
    // const event = await prisma.analyticsEvent.create({
    //   data: newEvent
    // })

    // For demo, add to mock storage
    analyticsEvents.push(newEvent)

    return NextResponse.json(
      { 
        message: 'Event tracked successfully',
        eventId: newEvent.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to track analytics event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventType = searchParams.get('eventType')
    const limit = parseInt(searchParams.get('limit')) || 100
    const offset = parseInt(searchParams.get('offset')) || 0

    // In a real app, you would query database:
    // let whereClause = {}
    // if (eventType) {
    //   whereClause.eventType = eventType
    // }
    // 
    // const events = await prisma.analyticsEvent.findMany({
    //   where: whereClause,
    //   orderBy: { createdAt: 'desc' },
    //   take: limit,
    //   skip: offset
    // })

    // For demo, return mock data
    let filteredEvents = analyticsEvents

    if (eventType) {
      filteredEvents = filteredEvents.filter(event => event.eventType === eventType)
    }

    filteredEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    const paginatedEvents = filteredEvents.slice(offset, offset + limit)

    return NextResponse.json({
      events: paginatedEvents,
      totalCount: filteredEvents.length
    })
  } catch (error) {
    console.error('Failed to fetch analytics events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

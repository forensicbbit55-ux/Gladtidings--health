import { NextResponse } from 'next/server'
;
;// Mock database storage (replace with actual database calls)
let subscribers = []

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit')) || 100
    const offset = parseInt(searchParams.get('offset')) || 0
    const subscribedAfter = searchParams.get('subscribedAfter')

    // In a real app, you would query the database:
    // let whereClause = {}
    // if (subscribedAfter) {
    //   whereClause.subscribedAt = { gte: new Date(subscribedAfter) }
    // }
    // 
    // const newsletterSubscribers = await prisma.newsletterSubscriber.findMany({
    //   where: whereClause,
    //   orderBy: { subscribedAt: 'desc' },
    //   take: limit,
    //   skip: offset
    // })

    // For demo, return mock data
    let filteredSubscribers = subscribers

    if (subscribedAfter) {
      const afterDate = new Date(subscribedAfter)
      filteredSubscribers = filteredSubscribers.filter(sub => 
        new Date(sub.subscribedAt) >= afterDate
      )
    }

    filteredSubscribers.sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt))
    
    const paginatedSubscribers = filteredSubscribers.slice(offset, offset + limit)

    return NextResponse.json({
      subscribers: paginatedSubscribers,
      totalCount: filteredSubscribers.length
    })
  } catch (error) {
    console.error('Failed to fetch newsletter subscribers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
};

export async function POST(request) {
  try {
    const { email } = await request.json()

    // Validate input
    if (!email || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Check if email already exists
    const existingSubscriber = subscribers.find(sub => sub.email === normalizedEmail)
    
    if (existingSubscriber) {
      return NextResponse.json(
        { 
          error: 'Email is already subscribed to the newsletter',
          subscriberId: existingSubscriber.id
        },
        { status: 409 }
      )
    }

    // Create new subscriber
    const newSubscriber = {
      id: Date.now().toString(),
      email: normalizedEmail,
      subscribedAt: new Date().toISOString()
    }

    // In a real app, you would save to database:
    // const subscriber = await prisma.newsletterSubscriber.create({
    //   data: { email: normalizedEmail }
    // })

    // For demo, add to mock storage
    subscribers.push(newSubscriber)

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to the newsletter!',
        subscriber: newSubscriber
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required for unsubscribe' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Find and remove subscriber
    const initialLength = subscribers.length
    subscribers = subscribers.filter(sub => sub.email !== normalizedEmail)
    const deletedCount = initialLength - subscribers.length

    if (deletedCount === 0) {
      return NextResponse.json(
        { error: 'Email not found in newsletter subscribers' },
        { status: 404 }
      )
    }

    // In a real app, you would delete from database:
    // const result = await prisma.newsletterSubscriber.deleteMany({
    //   where: { email: normalizedEmail }
    // })

    return NextResponse.json(
      { 
        message: 'Successfully unsubscribed from the newsletter',
        deletedCount
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to unsubscribe from newsletter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

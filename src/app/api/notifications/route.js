import { NextResponse } from 'next/server';
;import { getServerSession } from 'next-auth/nextjs'
;
;// Mock database storage (replace with actual database calls)
let notifications = []

// Helper function to check if user is admin
function isAdmin(session) {
  return session?.user?.role === 'ADMIN'
};

export async function GET(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit')) || 50
    const offset = parseInt(searchParams.get('offset')) || 0

    // In a real app, you would query the database:
    // let whereClause = { userId: session.user.id }
    // if (unreadOnly) {
    //   whereClause.read = false
    // }
    // 
    // const userNotifications = await prisma.notification.findMany({
    //   where: whereClause,
    //   orderBy: { createdAt: 'desc' },
    //   take: limit,
    //   skip: offset
    // })

    // For demo, return mock data
    let userNotifications = notifications.filter(n => n.userId === session.user.id)
    
    if (unreadOnly) {
      userNotifications = userNotifications.filter(n => !n.read)
    }

    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    const paginatedNotifications = userNotifications.slice(offset, offset + limit)

    return NextResponse.json({
      notifications: paginatedNotifications,
      totalCount: userNotifications.length,
      unreadCount: userNotifications.filter(n => !n.read).length
    })
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { message, userId } = await request.json()

    // Validate input
    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if user is admin creating notification for someone else
    if (userId && !isAdmin(session)) {
      return NextResponse.json(
        { error: 'Only admins can create notifications for other users' },
        { status: 403 }
      )
    }

    // Create new notification
    const newNotification = {
      id: Date.now().toString(),
      userId: userId || session.user.id,
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString()
    }

    // In a real app, you would save to database:
    // const notification = await prisma.notification.create({
    //   data: newNotification
    // })

    // For demo, add to mock storage
    notifications.push(newNotification)

    return NextResponse.json(
      { 
        message: 'Notification created successfully',
        notification: newNotification
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { notificationIds, markAllRead } = await request.json()

    if (markAllRead) {
      // Mark all notifications as read for the user
      const userNotifications = notifications.filter(n => n.userId === session.user.id)
      
      userNotifications.forEach(notification => {
        notification.read = true
      })

      // In a real app, you would update the database:
      // await prisma.notification.updateMany({
      //   where: { userId: session.user.id, read: false },
      //   data: { read: true }
      // })

      return NextResponse.json(
        { 
          message: 'All notifications marked as read',
          updatedCount: userNotifications.length
        },
        { status: 200 }
      )
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      let updatedCount = 0
      
      notificationIds.forEach(id => {
        const notification = notifications.find(n => 
          n.id === id && n.userId === session.user.id
        )
        
        if (notification && !notification.read) {
          notification.read = true
          updatedCount++
        }
      })

      // In a real app, you would update the database:
      // await prisma.notification.updateMany({
      //   where: { 
      //     id: { in: notificationIds },
      //     userId: session.user.id 
      //   },
      //   data: { read: true }
      // })

      return NextResponse.json(
        { 
          message: 'Notifications marked as read',
          updatedCount
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Invalid request. Provide notificationIds or markAllRead' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Failed to update notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { notificationIds, deleteAllRead } = await request.json()

    if (deleteAllRead) {
      // Delete all read notifications for the user
      const initialLength = notifications.length
      notifications = notifications.filter(n => 
        !(n.userId === session.user.id && n.read)
      )
      const deletedCount = initialLength - notifications.length

      // In a real app, you would delete from database:
      // await prisma.notification.deleteMany({
      //   where: { userId: session.user.id, read: true }
      // })

      return NextResponse.json(
        { 
          message: 'Read notifications deleted',
          deletedCount
        },
        { status: 200 }
      )
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Delete specific notifications
      const initialLength = notifications.length
      notifications = notifications.filter(n => 
        !(notificationIds.includes(n.id) && n.userId === session.user.id)
      )
      const deletedCount = initialLength - notifications.length

      // In a real app, you would delete from database:
      // await prisma.notification.deleteMany({
      //   where: { 
      //     id: { in: notificationIds },
      //     userId: session.user.id 
      //   }
      // })

      return NextResponse.json(
        { 
          message: 'Notifications deleted',
          deletedCount
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Invalid request. Provide notificationIds or deleteAllRead' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Failed to delete notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

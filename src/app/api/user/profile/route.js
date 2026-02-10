import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function PUT(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, email } = await request.json()

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // In a real app, you would update the database here
    // For now, we'll just return success
    // Example database update:
    // await prisma.user.update({
    //   where: { id: session.user.id },
    //   data: { name, email }
    // })

    return NextResponse.json(
      { 
        message: 'Profile updated successfully',
        user: { name, email }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
};

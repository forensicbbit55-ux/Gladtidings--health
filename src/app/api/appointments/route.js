import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Mock database storage (replace with actual database calls)
let appointments = []

// Helper function to check if user is admin
function isAdmin(session) {
  return session?.user?.role === 'ADMIN'
};

// Helper function to check if user can access appointment
function canAccessAppointment(session, appointment) {
  // Admin can access all appointments
  if (isAdmin(session)) return true
  
  // Users can only access their own appointments
  return appointment.userId === session?.user?.id
}

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
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const date = searchParams.get('date')

    // In a real app, you would query the database:
    // let whereClause = {}
    // 
    // if (isAdmin(session)) {
    //   // Admin can filter by any user
    //   if (userId) whereClause.userId = userId
    //   if (status) whereClause.status = status
    //   if (date) whereClause.appointmentDate = date
    // } else {
    //   // Users can only see their own appointments
    //   whereClause.userId = session.user.id
    // }
    // 
    // const appointments = await prisma.appointment.findMany({
    //   where: whereClause,
    //   orderBy: { appointmentDate: 'asc', appointmentTime: 'asc' }
    // })

    // For demo, return mock data based on user role
    let filteredAppointments = appointments

    if (isAdmin(session)) {
      // Admin can see all appointments with optional filters
      if (userId) {
        filteredAppointments = filteredAppointments.filter(apt => apt.userId === userId)
      }
      if (status) {
        filteredAppointments = filteredAppointments.filter(apt => apt.status === status)
      }
      if (date) {
        filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate === date)
      }
    } else {
      // Users can only see their own appointments
      filteredAppointments = filteredAppointments.filter(apt => apt.userId === session.user.id)
    }

    return NextResponse.json(filteredAppointments)
  } catch (error) {
    console.error('Failed to fetch appointments:', error)
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

    const { serviceType, appointmentDate, appointmentTime, notes, userId, userEmail, userName } = await request.json()

    // Validate input
    if (!serviceType || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Service, date, and time are required' },
        { status: 400 }
      )
    }

    // Check if user is admin booking for someone else
    if (userId && !isAdmin(session)) {
      return NextResponse.json(
        { error: 'Only admins can book appointments for other users' },
        { status: 403 }
      )
    }

    // Check for double booking
    const existingAppointment = appointments.find(apt => 
      apt.appointmentDate === appointmentDate && 
      apt.appointmentTime === appointmentTime &&
      apt.status !== 'cancelled'
    )

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      )
    }

    // Validate date is not in the past
    const selectedDate = new Date(appointmentDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Cannot book appointments in the past' },
        { status: 400 }
      )
    }

    // Create new appointment
    const newAppointment = {
      id: Date.now().toString(),
      userId: userId || session.user.id,
      serviceType,
      appointmentDate,
      appointmentTime,
      status: 'pending',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In a real app, you would save to the database:
    // const appointment = await prisma.appointment.create({
    //   data: newAppointment
    // })

    // For demo, add to mock storage
    appointments.push(newAppointment)

    // Send confirmation email
    try {
      if (userEmail && userName) {
        await sendAppointmentConfirmation(userEmail, userName, newAppointment)
        }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
      { 
        message: 'Appointment booked successfully',
        appointment: newAppointment
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

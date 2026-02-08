import { NextResponse } from 'next/server';
;import { getServerSession } from 'next-auth/nextjs';
;import { sendAppointmentApproval, sendAppointmentCancellation } from '@/lib/email'
;
;// Mock database storage (replace with actual database calls)
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

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession()
    const { id } = params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find the appointment
    const appointment = appointments.find(apt => apt.id === id)
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check access permissions
    if (!canAccessAppointment(session, appointment)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const { serviceType, appointmentDate, appointmentTime, status, notes, userEmail, userName } = await request.json()

    // Users can only update limited fields
    const isUser = !isAdmin(session)
    if (isUser) {
      // Users cannot change status (admin only)
      if (status && status !== appointment.status) {
        return NextResponse.json(
          { error: 'Only admins can change appointment status' },
          { status: 403 }
        )
      }
      
      // Users cannot change service type after creation
      if (serviceType && serviceType !== appointment.serviceType) {
        return NextResponse.json(
          { error: 'Cannot change service type after booking' },
          { status: 403 }
        )
      }
    }

    // Validate date is not in the past (for future appointments)
    if (appointmentDate) {
      const selectedDate = new Date(appointmentDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        return NextResponse.json(
          { error: 'Cannot move appointments to past dates' },
          { status: 400 }
        )
      }
    }

    // Check for double booking if changing date/time
    if (appointmentDate || appointmentTime) {
      const newDate = appointmentDate || appointment.appointmentDate
      const newTime = appointmentTime || appointment.appointmentTime
      
      const conflictingAppointment = appointments.find(apt => 
        apt.id !== id && // Exclude current appointment
        apt.appointmentDate === newDate && 
        apt.appointmentTime === newTime &&
        apt.status !== 'cancelled'
      )

      if (conflictingAppointment) {
        return NextResponse.json(
          { error: 'This time slot is already booked' },
          { status: 409 }
        )
      }
    }

    // Update appointment
    const updatedAppointment = {
      ...appointment,
      serviceType: serviceType || appointment.serviceType,
      appointmentDate: appointmentDate || appointment.appointmentDate,
      appointmentTime: appointmentTime || appointment.appointmentTime,
      status: status || appointment.status,
      notes: notes !== undefined ? notes : appointment.notes,
      updatedAt: new Date().toISOString()
    }

    // In a real app, you would update the database:
    // const updated = await prisma.appointment.update({
    //   where: { id },
    //   data: updatedAppointment
    // })

    // For demo, update mock storage
    const index = appointments.findIndex(apt => apt.id === id)
    appointments[index] = updatedAppointment

    // Send email notifications for status changes
    try {
      if (status && status !== appointment.status && userEmail && userName) {
        if (status === 'approved') {
          await sendAppointmentApproval(userEmail, userName, updatedAppointment)
          } else if (status === 'cancelled') {
          await sendAppointmentCancellation(userEmail, userName, updatedAppointment, 'admin', 'Cancelled by administrator')
          }
      }
    } catch (emailError) {
      console.error('Failed to send status change email:', emailError)
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
      { 
        message: 'Appointment updated successfully',
        appointment: updatedAppointment
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to update appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession()
    const { id } = params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find the appointment
    const appointment = appointments.find(apt => apt.id === id)
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check access permissions
    if (!canAccessAppointment(session, appointment)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Users can only cancel their own appointments
    // Admins can cancel any appointment
    if (appointment.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot cancel completed appointments' },
        { status: 400 }
      )
    }

    // Mark as cancelled instead of deleting
    const cancelledAppointment = {
      ...appointment,
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    }

    // In a real app, you would update the database:
    // const updated = await prisma.appointment.update({
    //   where: { id },
    //   data: { status: 'cancelled' }
    // })

    // For demo, update mock storage
    const index = appointments.findIndex(apt => apt.id === id)
    appointments[index] = cancelledAppointment

    // Send cancellation email
    try {
      // In a real app, you would get user email from the database
      // For demo, we'll assume it's passed in the request or available
      const userEmail = appointment.userEmail || session.user.email
      const userName = appointment.userName || session.user.name
      
      if (userEmail && userName) {
        await sendAppointmentCancellation(
          userEmail, 
          userName, 
          cancelledAppointment, 
          isAdmin(session) ? 'admin' : 'user',
          isAdmin(session) ? 'Cancelled by administrator' : 'Cancelled at user request'
        )
        }
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError)
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
      { 
        message: 'Appointment cancelled successfully',
        appointment: cancelledAppointment
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to cancel appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

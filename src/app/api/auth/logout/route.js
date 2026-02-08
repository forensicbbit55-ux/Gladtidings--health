import { cookies } from 'next/headers';
;import { NextResponse } from 'next/server'
;
;export async function DELETE() {
  try {
    // Clear admin session
    const cookieStore = cookies()
    cookieStore.delete('admin_session')

    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
};

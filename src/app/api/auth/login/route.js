import { cookies } from 'next/headers';
;import { NextResponse } from 'next/server'
;
;// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gladtidings.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-this-password'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Debug logging
    // Simple hardcoded authentication
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set secure HTTP-only cookie
      const cookieStore = cookies()
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      })

      return NextResponse.json({ 
        success: true, 
        message: 'Authentication successful' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 })
    }

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
};

export async function DELETE() {
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
}

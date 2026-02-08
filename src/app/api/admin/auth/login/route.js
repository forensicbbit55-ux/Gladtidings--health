import { query } from '@lib/db';
;import { hashPassword, verifyPassword, createSessionToken } from '@lib/auth';
;import { cookies } from 'next/headers';
;import { NextResponse } from 'next/server'
;
;export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    // Find admin by email
    const result = await query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 })
    }

    const admin = result.rows[0]

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password_hash)
    
    if (!isValidPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 })
    }

    // Create session token
    const sessionToken = createSessionToken(admin)

    // Set secure HTTP-only cookie
    const cookieStore = cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Authentication successful',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    })

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

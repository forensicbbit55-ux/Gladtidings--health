import { NextResponse } from 'next/server'
import { verifySessionToken } from '@lib/auth'

export async function GET(request) {
  try {
    const token = request.cookies.get('admin_session')?.value
    
    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({
        authenticated: false,
        error: 'Invalid or missing session token'
      }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      message: 'Admin session is valid'
    })

  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json({
      authenticated: false,
      error: 'Authentication verification failed'
    }, { status: 500 })
  }
}

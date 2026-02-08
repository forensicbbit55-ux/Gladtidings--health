import { query } from '@lib/db';
;import { hashPassword } from '@lib/auth'
;
;export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return Response.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    // Check if admin already exists
    const existingAdmin = await query(
      'SELECT id FROM admins WHERE email = $1',
      [email]
    )

    if (existingAdmin.rows.length > 0) {
      return Response.json({ 
        success: false, 
        error: 'Admin with this email already exists' 
      }, { status: 400 })
    }

    // Hash the password
    const passwordHash = await hashPassword(password)

    // Create admin user
    const result = await query(
      'INSERT INTO admins (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [email, passwordHash, 'admin']
    )

    return Response.json({
      success: true,
      message: 'Admin user created successfully',
      admin: result.rows[0]
    })

  } catch (error) {
    console.error('Error creating admin:', error)
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
};

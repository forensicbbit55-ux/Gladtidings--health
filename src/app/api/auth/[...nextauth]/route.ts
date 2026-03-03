export const dynamic = 'force-dynamic'

// Simple auth handler that doesn't use NextAuth during build
export async function GET(request: Request) {
  return new Response('Auth endpoint - use /login for authentication', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simple admin authentication
    if (email === "admin@gladtidings.org" && password === "gladtidings.org2026") {
      return new Response(JSON.stringify({
        user: {
          id: "admin",
          email: "admin@gladtidings.org",
          name: "Admin",
          role: "ADMIN"
        },
        token: "admin-token-" + Date.now()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      error: "Invalid credentials"
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Authentication failed"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

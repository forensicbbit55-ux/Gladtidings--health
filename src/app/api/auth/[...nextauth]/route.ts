import NextAuth from "next-auth"

export const dynamic = 'force-dynamic'

async function getAuthOptions() {
  const { authOptions } = await import("@/lib/auth")
  return authOptions
}

const handler = async (req: Request, res: Response) => {
  const authOptions = await getAuthOptions()
  const nextAuthHandler = NextAuth(authOptions)
  return nextAuthHandler(req, res)
}

export { handler as GET, handler as POST }

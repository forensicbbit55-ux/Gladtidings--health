import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo.png"
              alt="Glad Tidings Health"
              width={60}
              height={60}
              className="mx-auto h-12 w-12"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Glad Tidings Health community
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-sm",
              },
              variables: {
                colorPrimary: "#10b981",
                colorBackground: "#f0fdf4",
                colorInputBackground: "#ffffff",
                colorInputText: "#374151",
              }
            }}
            redirectUrl="/admin/remedies/new"
            signInUrl="/sign-in"
          />
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/sign-in" 
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Sign in
            </Link>
          </p>
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

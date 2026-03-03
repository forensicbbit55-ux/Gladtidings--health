'use client'

import { useUser } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import NewRemedyClient from './NewRemedyClient'

export default function NewRemedyPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect_url=/admin/remedies/new')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <SignedIn>
      <NewRemedyClient />
    </SignedIn>
  )
}

import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import NewRemedyClient from './NewRemedyClient'

export default async function NewRemedyPage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in?redirect_url=/admin/remedies/new')
  }

  return <NewRemedyClient />
}

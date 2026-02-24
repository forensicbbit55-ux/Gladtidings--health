import { db } from '@/lib/drizzle-db'
import { remedies } from '@/lib/drizzle/schema'
import { desc } from 'drizzle-orm'
import RemediesClient from './RemediesClient'

export default async function RemediesPage() {
  // Fetch all remedies ordered by created_at desc
  const allRemedies = await db
    .select()
    .from(remedies)
    .orderBy(desc(remedies.createdAt))

  return <RemediesClient remedies={allRemedies} />
}

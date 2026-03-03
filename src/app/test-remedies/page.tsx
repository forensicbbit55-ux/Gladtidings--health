import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function TestPage() {
  // Fetch all published remedies
  const allRemedies = await prisma.remedy.findMany({
    where: {
      isPublished: true
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Debug: Remedies Data</h1>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Database Info</h2>
        <p>Total Remedies: {allRemedies.length}</p>
        <p>First Remedy: {allRemedies[0]?.title || 'None'}</p>
        <p>Last Remedy: {allRemedies[allRemedies.length - 1]?.title || 'None'}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">All Remedies:</h2>
        <div className="space-y-2">
          {allRemedies.map((remedy) => (
            <div key={remedy.id} className="border p-3 rounded">
              <h3 className="font-semibold">{remedy.title}</h3>
              <p>Price: KSH {remedy.price.toString()}</p>
              <p>Category: {remedy.category?.name || 'None'}</p>
              <p>Published: {remedy.isPublished ? 'Yes' : 'No'}</p>
              <p>Images: {remedy.images?.length || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

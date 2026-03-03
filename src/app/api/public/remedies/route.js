import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const category_id = searchParams.get('category_id')
    const published = searchParams.get('published')
    const limit = parseInt(searchParams.get('limit')) || 50
    const offset = parseInt(searchParams.get('offset')) || 0

    // Build the where clause
    const where = {}
    
    if (category_id) {
      where.categoryId = category_id
    }

    if (published !== null) {
      where.isPublished = published === 'true'
    } else {
      // By default, only show published remedies for public API
      where.isPublished = true
    }

    // Execute the query with Prisma
    const remedies = await prisma.remedy.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })
    
    // Get total count for pagination
    const total = await prisma.remedy.count({
      where
    })

    // Transform the data to match the expected format
    const transformedRemedies = remedies.map(remedy => ({
      id: remedy.id,
      title: remedy.title,
      description: remedy.description,
      usage: remedy.usage,
      image_url: remedy.images?.[0] || null, // Get first image
      created_at: remedy.createdAt,
      category_id: remedy.categoryId,
      category_name: remedy.category?.name || null
    }))

    return NextResponse.json({
      success: true,
      remedies: transformedRemedies,
      pagination: {
        total,
        limit,
        offset,
        has_more: offset + limit < total
      },
      filters: {
        category_id: category_id || null,
        published: published !== null ? published === 'true' : true
      }
    })
    
  } catch (error) {
    console.error('Error fetching public remedies:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch remedies',
      message: 'Internal server error'
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Return all remedies
export async function GET() {
  try {
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

    return NextResponse.json({
      success: true,
      data: allRemedies,
      count: allRemedies.length
    })
  } catch (error) {
    console.error('Error fetching remedies:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch remedies' 
      },
      { status: 500 }
    )
  }
}

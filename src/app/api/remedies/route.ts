import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/drizzle-db'
import { remedies } from '@/lib/drizzle/schema'
import { desc, eq } from 'drizzle-orm'

// GET: Return all remedies
export async function GET() {
  try {
    const allRemedies = await db
      .select()
      .from(remedies)
      .orderBy(desc(remedies.createdAt))

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

// POST: Add new remedy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { title, description, ingredients, benefits, preparation, category, imageUrl } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title is required' 
        },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check for duplicate slug
    const existingRemedy = await db
      .select()
      .from(remedies)
      .where(eq(remedies.slug, slug))
      .limit(1)

    if (existingRemedy.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A remedy with this title already exists' 
        },
        { status: 409 }
      )
    }

    // Create new remedy
    const newRemedy = {
      title: title.trim(),
      slug,
      description: description?.trim() || null,
      ingredients: ingredients?.trim() || null,
      benefits: benefits?.trim() || null,
      preparation: preparation?.trim() || null,
      category: category?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
    }

    const [insertedRemedy] = await db
      .insert(remedies)
      .values(newRemedy)
      .returning()

    return NextResponse.json({
      success: true,
      data: insertedRemedy,
      message: 'Remedy added successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding remedy:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add remedy' 
      },
      { status: 500 }
    )
  }
}

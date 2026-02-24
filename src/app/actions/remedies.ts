'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/drizzle-db'
import { remedies } from '@/lib/drizzle/schema'
import { NewRemedy } from '@/lib/drizzle/schema'

export async function addRemedy(formData: FormData) {
  try {
    // Extract all fields from FormData
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const ingredients = formData.get('ingredients') as string
    const benefits = formData.get('benefits') as string
    const preparation = formData.get('preparation') as string
    const category = formData.get('category') as string
    const imageUrl = formData.get('imageUrl') as string

    // Validate required fields
    if (!title || !title.trim()) {
      return { success: false, error: 'Title is required' }
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create new remedy object
    const newRemedy: NewRemedy = {
      title: title.trim(),
      slug,
      description: description?.trim() || null,
      ingredients: ingredients?.trim() || null,
      benefits: benefits?.trim() || null,
      preparation: preparation?.trim() || null,
      category: category?.trim() || null, // Back to category (Neon AI corrected this)
      imageUrl: imageUrl?.trim() || null,
    }

    // Insert into database
    await db.insert(remedies).values(newRemedy)

    // Revalidate paths to update UI
    revalidatePath('/')
    revalidatePath('/remedies')

    return { 
      success: true, 
      message: 'Remedy added successfully!' 
    }
  } catch (error) {
    console.error('Error adding remedy:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add remedy' 
    }
  }
}

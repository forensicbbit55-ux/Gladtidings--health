'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function addRemedy(formData: FormData) {
  try {
    // Extract all fields from FormData
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const ingredients = formData.get('ingredients') as string
    const benefits = formData.get('benefits') as string
    const category = formData.get('category') as string
    const imageUrl = formData.get('imageUrl') as string
    const price = formData.get('price') as string

    // Validate required fields
    if (!title || !title.trim()) {
      return { success: false, error: 'Title is required' }
    }

    // Generate slug from title with timestamp to avoid conflicts
    const timestamp = Date.now()
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + `-${timestamp}`

    // Handle images - convert single URL to array format for Prisma
    const images = imageUrl?.trim() ? [imageUrl.trim()] : []

    // Handle category - check if it exists or set to null
    let categoryId = null
    if (category?.trim()) {
      try {
        const existingCategory = await prisma.category.findFirst({
          where: { name: category.trim() }
        })
        if (existingCategory) {
          categoryId = existingCategory.id
        } else {
          // Create the category if it doesn't exist
          const newCategory = await prisma.category.create({
            data: {
              name: category.trim(),
              slug: category.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
            }
          })
          categoryId = newCategory.id
        }
      } catch (error) {
        console.log('Category handling failed, setting to null:', error)
        categoryId = null
      }
    }

    // Create new remedy using Prisma
    const newRemedy = await prisma.remedy.create({
      data: {
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        ingredients: ingredients?.trim() || null,
        benefits: benefits?.trim() || null,
        categoryId: categoryId,
        price: parseFloat(price) || 0,
        images: images,
        isPublished: true, // Make it visible on the site
      }
    })

    console.log('✅ Remedy created:', newRemedy)

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

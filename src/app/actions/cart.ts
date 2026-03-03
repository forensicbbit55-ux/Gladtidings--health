'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function addToCart(formData: FormData) {
  const remedyId = formData.get('remedyId') as string
  const quantity = parseInt(formData.get('quantity') as string) || 1

  try {
    // Get remedy details
    const remedy = await prisma.remedy.findUnique({
      where: { id: remedyId },
      include: { category: true }
    })

    if (!remedy) {
      return { success: false, error: 'Remedy not found' }
    }

    if (!remedy.isPublished) {
      return { success: false, error: 'Remedy is not available' }
    }

    // In a real application, you would store this in a database or session
    // For now, we'll return the cart item to be handled client-side
    const cartItem = {
      id: remedy.id,
      title: remedy.title,
      price: parseFloat(remedy.price.toString()),
      quantity,
      image: remedy.images?.[0] || null,
      category: remedy.category?.name || 'Natural Remedy'
    }

    revalidatePath('/remedies/[slug]')
    revalidatePath('/cart')
    
    return { 
      success: true, 
      message: 'Added to cart successfully!',
      cartItem 
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return { 
      success: false, 
      error: 'Failed to add to cart' 
    }
  }
}

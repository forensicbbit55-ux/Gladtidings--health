import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const remedyId = formData.get('remedyId') as string
    const quantity = parseInt(formData.get('quantity') as string) || 1

    // Get remedy details
    const remedy = await prisma.remedy.findUnique({
      where: { id: remedyId },
      include: { category: true }
    })

    if (!remedy) {
      return NextResponse.json(
        { success: false, error: 'Remedy not found' },
        { status: 404 }
      )
    }

    if (!remedy.isPublished) {
      return NextResponse.json(
        { success: false, error: 'Remedy is not available' },
        { status: 400 }
      )
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

    return NextResponse.json({
      success: true,
      message: 'Added to cart successfully!',
      cartItem
    })

  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCartStore, type CartItem } from '@/store/cartStore'

interface AddToCartButtonProps {
  remedyId: string
  remedyTitle: string
  remedyPrice: number
  remedyImage: string | null
}

export default function AddToCartButton({ remedyId, remedyTitle, remedyPrice, remedyImage }: AddToCartButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState('')
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    setIsPending(true)
    
    try {
      const formData = new FormData()
      formData.set('remedyId', remedyId)
      formData.set('quantity', '1')
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Add to cart store
        addItem({
          id: remedyId,
          title: remedyTitle,
          price: remedyPrice,
          quantity: 1,
          image: remedyImage,
          category: result.cartItem?.category || 'Natural Remedy'
        })
        
        setMessage('✅ Added to cart!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ ' + result.error)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('❌ Failed to add to cart')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex-1">
      <form onSubmit={handleAddToCart}>
        <input type="hidden" name="quantity" value="1" />
        
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-5 w-5" />
          {isPending ? 'Adding...' : 'Add to Cart'}
        </button>
      </form>
      
      {message && (
        <div className="mt-2 text-sm text-center">
          {message}
        </div>
      )}
    </div>
  )
}

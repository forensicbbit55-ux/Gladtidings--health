'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string | null
  category: string
}

export interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isInCart: (id: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find(i => i.id === item.id)
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          })
        } else {
          set({ items: [...items, item] })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
          })
        }
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      isInCart: (id) => {
        return get().items.some(item => item.id === id)
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)

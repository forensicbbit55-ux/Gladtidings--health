import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image_url?: string
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  isInCart: (id: string) => boolean
  getItemQuantity: (id: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          } else {
            return {
              items: [...state.items, { ...item, quantity: 1 }],
            }
          }
        })
      },

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id)
          return
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + item.price * item.quantity
        }, 0)
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => {
          return total + item.quantity
        }, 0)
      },

      isInCart: (id) => {
        return get().items.some((item) => item.id === id)
      },

      getItemQuantity: (id) => {
        const item = get().items.find((item) => item.id === id)
        return item?.quantity || 0
      },
    }),
    {
      name: 'gladtidings-cart-storage',
    }
  )
)

'use client'

import { createContext, useContext, useMemo, useState } from 'react'
;
;const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  function openCart() {
    setIsCartOpen(true)
  }

  function closeCart() {
    setIsCartOpen(false)
  }

  function toggleCart() {
    setIsCartOpen((v) => !v)
  }

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          qty: 1,
        },
      ]
    })
    openCart()
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function setQty(id, qty) {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
        .filter((i) => i.qty > 0)
    )
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = useMemo(() => {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0)
  }, [items])

  const value = useMemo(
    () => ({
      items,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      setQty,
      clearCart,
    }),
    [items, subtotal, isCartOpen]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
};

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}


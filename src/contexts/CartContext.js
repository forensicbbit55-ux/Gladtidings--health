'use client'

import { createContext, useContext, useReducer } from 'react'
;
;// Cart context for managing shopping cart state
const CartContext = createContext()

// Initial cart state
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false
}

// Cart reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id)
      let newItems
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      }
      
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      }
      
    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      }
      
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      }
      
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }
      
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      }
      
    default:
      return state
  }
};

// Cart provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }
  
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }
  
  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }
  
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleCart,
    clearCart
  }
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext

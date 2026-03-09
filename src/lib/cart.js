'use client'

// Cart management functions for client-side localStorage

export function getCartItems() {
  if (typeof window === 'undefined') {
    console.log('getCartItems: window is undefined')
    return []
  }
  
  try {
    const cartData = localStorage.getItem('gladtidings_cart')
    console.log('getCartItems: raw cart data =', cartData)
    const parsed = cartData ? JSON.parse(cartData) : []
    console.log('getCartItems: parsed cart =', parsed)
    return parsed
  } catch (error) {
    console.error('Error getting cart items:', error)
    return []
  }
}

export function addToCart(product, quantity = 1) {
  if (typeof window === 'undefined') {
    console.log('addToCart: window is undefined')
    return
  }
  
  try {
    console.log('addToCart: adding product =', product)
    const cart = getCartItems()
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
      console.log('addToCart: updated existing item quantity =', existingItem.quantity)
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity
      })
      console.log('addToCart: added new item to cart')
    }
    
    localStorage.setItem('gladtidings_cart', JSON.stringify(cart))
    console.log('addToCart: saved to localStorage')
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'))
    console.log('addToCart: dispatched cartUpdated event')
    
    return cart
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

export function removeFromCart(productId) {
  if (typeof window === 'undefined') return
  
  try {
    const cart = getCartItems()
    const updatedCart = cart.filter(item => item.id !== productId)
    localStorage.setItem('gladtidings_cart', JSON.stringify(updatedCart))
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'))
    
    return updatedCart
  } catch (error) {
    console.error('Error removing from cart:', error)
  }
}

export function updateQuantity(productId, quantity) {
  if (typeof window === 'undefined') return
  
  try {
    const cart = getCartItems()
    const item = cart.find(item => item.id === productId)
    
    if (item) {
      item.quantity = Math.max(1, quantity)
      localStorage.setItem('gladtidings_cart', JSON.stringify(cart))
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'))
    }
    
    return cart
  } catch (error) {
    console.error('Error updating quantity:', error)
  }
}

export function clearCart() {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('gladtidings_cart')
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'))
  } catch (error) {
    console.error('Error clearing cart:', error)
  }
}

export function getCartTotal() {
  const cart = getCartItems()
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export function getCartCount() {
  const cart = getCartItems()
  return cart.reduce((count, item) => count + item.quantity, 0)
}

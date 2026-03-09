'use client'

// Cart management functions for client-side localStorage

// Toast notification function
export function showToast(message) {
  // Create toast element
  const toast = document.createElement('div')
  toast.className = 'fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[250px] animate-in slide-in-from-right duration-300'
  toast.innerHTML = `
    <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span class="text-sm font-medium">${message}</span>
    <button class="ml-auto flex-shrink-0 p-1 hover:bg-green-700 rounded transition-colors">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  `
  
  document.body.appendChild(toast)
  
  // Add close functionality
  const closeBtn = toast.querySelector('button')
  closeBtn.addEventListener('click', () => {
    toast.remove()
  })
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.remove()
    }
  }, 3000)
}

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
      showToast(`${product.title} quantity updated!`)
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity
      })
      console.log('addToCart: added new item to cart')
      showToast(`${product.title} added to cart successfully!`)
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

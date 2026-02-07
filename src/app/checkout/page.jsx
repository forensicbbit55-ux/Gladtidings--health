'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

// Try to import CartContext, but provide fallback if not available
let useCart = null
try {
  useCart = require('@/context/CartContext').useCart
} catch (error) {
  console.log('CartContext not available, using fallback')
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function CheckoutPage() {
  // Fallback cart data if CartContext is not available
  const cartFallback = {
    items: [],
    subtotal: 0,
    clearCart: () => {}
  }
  
  const { items, subtotal, clearCart } = useCart ? useCart() : cartFallback
  const total = useMemo(() => subtotal, [subtotal])
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (items.length === 0) {
        setError('Your cart is empty')
        setIsSubmitting(false)
        return
      }

      const orderData = {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: items.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.qty,
        })),
        subtotal: total,
        paymentMethod: e.nativeEvent.submitter?.textContent?.includes('PayPal') ? 'paypal' : 'card',
      }

      const order = await ordersAPI.create(orderData)
      setOrderNumber(order.orderNumber)
      setIsSuccess(true)
      clearCart()
    } catch (err) {
      console.error('Order submission error:', err)
      setError(err.message || 'Failed to submit order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isSuccess) {
    return (
      <main className="px-4 py-12">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="bg-white border border-primary/10 rounded-2xl p-12 shadow-sm">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-serif text-primary mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-700 mb-8">
              Thank you for your order. We've received your payment and will process your order shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-bold text-primary mb-4">Order Details</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Order Number:</span> {orderNumber || 'N/A'}</p>
                <p><span className="font-semibold">Email:</span> {formData.email || 'N/A'}</p>
                <p><span className="font-semibold">Total:</span> {formatMoney(total)}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-lg bg-secondary text-white px-6 py-3 font-semibold hover:bg-secondary/90 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-primary/20 bg-white text-primary px-6 py-3 font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="px-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="text-secondary font-semibold tracking-wide uppercase text-sm">
            Checkout
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl font-serif text-primary">
            Complete Your Order
          </h1>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Placeholder checkout — no real payment processing is wired up.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Shipping & Contact Form */}
            <div className="space-y-6">
              <section className="bg-white border border-primary/10 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-primary mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-primary/20 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-primary/20 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-primary/20 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white border border-primary/10 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-primary mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-primary/20 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="123 Hope Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-primary/20 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                        placeholder="Springfield"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-primary/20 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                        placeholder="CA"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-primary/20 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                        placeholder="90210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-primary/20 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Order Summary */}
            <aside className="bg-white border border-primary/10 rounded-2xl p-6 shadow-sm h-fit">
              <h2 className="text-xl font-bold text-primary mb-4">Order Summary</h2>

              <div className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-gray-700">
                    <p>Your cart is empty.</p>
                    <Link
                      href="/services"
                      className="mt-3 inline-flex text-secondary font-semibold hover:text-primary"
                    >
                      Go to Services
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start pb-4 border-b border-primary/10">
                      <div>
                        <p className="font-semibold text-primary">{item.title}</p>
                        <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {formatMoney(item.price * item.qty)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatMoney(total)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-6 border-t border-primary/20 pt-4 flex justify-between font-bold text-lg text-primary">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full rounded-lg bg-[#0070ba] text-white px-4 py-3 font-semibold hover:bg-[#005c96] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-6.157 6.157a.75.75 0 01-1.06 0l-3.157-3.157a.75.75 0 011.06-1.06l2.627 2.627 5.627-5.627a.75.75 0 011.06 0z"/>
                  </svg>
                  {isSubmitting ? 'Processing...' : 'Pay with PayPal'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full rounded-lg bg-secondary text-white px-4 py-3 font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  {isSubmitting ? 'Processing...' : 'Pay with Credit Card'}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  )
}


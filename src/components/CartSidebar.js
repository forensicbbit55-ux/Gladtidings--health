'use client'

import Link from 'next/link';
;import { useCart } from '@/context/CartContext'
;
;function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
};

export default function CartSidebar() {
  const { items, subtotal, isCartOpen, closeCart, removeItem, setQty } = useCart()

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className={[
          'fixed inset-0 z-40 bg-black/50 transition-opacity',
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* Panel */}
      <aside
        aria-label="Shopping cart"
        className={[
          'fixed right-0 top-0 z-50 h-full w-full sm:w-[420px] bg-white shadow-2xl',
          'transform transition-transform duration-300',
          isCartOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="h-full flex flex-col">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Your Cart</p>
              <h2 className="text-xl font-bold text-primary">Shopping Cart</h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-md p-2 hover:bg-gray-100"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-auto px-5 py-4">
            {items.length === 0 ? (
              <div className="text-center py-14">
                <p className="text-gray-700 font-semibold">Your cart is empty.</p>
                <p className="text-gray-500 mt-2">
                  Add an item from Services to see it here.
                </p>
                <div className="mt-6">
                  <Link
                    href="/services"
                    onClick={closeCart}
                    className="inline-flex items-center justify-center rounded-lg bg-secondary text-white px-5 py-3 font-semibold hover:bg-secondary/90 transition-colors"
                  >
                    Browse Services
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="border rounded-xl p-4 flex gap-4 items-start"
                  >
                    <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 text-xs">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        'Image'
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatMoney(item.price)}
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <label className="text-sm text-gray-600" htmlFor={`qty-${item.id}`}>
                          Qty
                        </label>
                        <input
                          id={`qty-${item.id}`}
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => setQty(item.id, Number(e.target.value))}
                          className="w-20 rounded-md border px-2 py-1 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-sm font-semibold text-secondary hover:text-primary"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t px-5 py-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-semibold">Subtotal</p>
              <p className="text-primary font-bold">{formatMoney(subtotal)}</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Taxes and shipping are calculated at checkout.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <Link
                href="/checkout"
                onClick={closeCart}
                className={[
                  'inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold',
                  items.length === 0
                    ? 'bg-gray-200 text-gray-500 pointer-events-none'
                    : 'bg-accent text-white hover:bg-accent/90',
                  'transition-colors',
                ].join(' ')}
              >
                Continue to Checkout
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex items-center justify-center rounded-lg border border-primary/20 bg-white text-primary px-5 py-3 font-semibold hover:bg-gray-50 transition-colors"
              >
                Keep Shopping
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
};


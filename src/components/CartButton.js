'use client'

import { useCart } from '@/context/CartContext'
;
;export default function CartButton() {
  const { toggleCart, items } = useCart()
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative rounded-md px-3 py-2 hover:bg-white/10 transition-colors"
      aria-label="Open cart"
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.2 6H19M7 13l-1.2-6M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
        />
      </svg>

      {count > 0 ? (
        <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
          {count}
        </span>
      ) : null}
    </button>
  )
};;


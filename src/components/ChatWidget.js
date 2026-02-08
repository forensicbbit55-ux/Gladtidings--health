'use client'

import { useState } from 'react'
;
;export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 rounded-2xl border border-primary/10 bg-white shadow-xl overflow-hidden">
          <div className="flex items-center justify-between bg-primary text-white px-4 py-3">
            <p className="font-semibold">Chat with Us</p>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              className="hover:text-accent transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-800">
                How can we help your healing journey? Message a missionary.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Your message
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-primary/20 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <button
              type="button"
              className="w-full rounded-lg bg-secondary text-white px-4 py-2 font-semibold hover:bg-secondary/90 transition-colors"
            >
              Send Message
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="rounded-full bg-accent text-white shadow-lg px-5 py-4 font-semibold hover:bg-accent/90 transition-colors flex items-center gap-2"
        aria-label="Open chat"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {isOpen ? 'Close' : 'Chat'}
      </button>
    </div>
  )
};;

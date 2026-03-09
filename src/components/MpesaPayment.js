'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function MpesaPayment({ orderId, amount, onPaymentSuccess, onPaymentError }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [checkoutRequestID, setCheckoutRequestID] = useState('')

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+254|0|07)[0-9]{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  const formatPhoneNumber = (phone) => {
    let formatted = phone.replace(/\s/g, '')
    if (formatted.startsWith('07')) {
      formatted = '+254' + formatted.substring(1)
    } else if (formatted.startsWith('0')) {
      formatted = '+254' + formatted.substring(1)
    }
    return formatted
  }

  const initiatePayment = async () => {
    if (!phoneNumber) {
      setPaymentStatus('Please enter a phone number')
      return
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPaymentStatus('Please enter a valid Kenyan phone number')
      return
    }

    setIsLoading(true)
    setPaymentStatus('')

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber)
      console.log('Initiating payment with:', {
        phoneNumber: formattedPhone,
        amount: amount,
        orderId: orderId
      })
      
      const response = await fetch('/api/mpesa/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          amount: amount,
          orderId: orderId,
          accountReference: `GLADTIDINGS-${orderId}`,
          transactionDesc: `Payment for order ${orderId}`
        })
      })

      console.log('M-Pesa API response status:', response.status)
      const data = await response.json()
      console.log('M-Pesa API response:', data)

      if (data.success) {
        setCheckoutRequestID(data.checkoutRequestID)
        setPaymentStatus('Payment initiated! Please check your phone and enter your M-Pesa PIN.')
        
        // Start polling for payment status
        pollPaymentStatus(data.checkoutRequestID)
      } else {
        console.error('M-Pesa payment failed:', data.error)
        setPaymentStatus(data.error || 'Payment initiation failed')
        onPaymentError?.(data.error)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('Payment failed. Please try again.')
      onPaymentError?.('Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  const pollPaymentStatus = async (checkoutID) => {
    const maxAttempts = 30 // Poll for 5 minutes max
    let attempts = 0

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setPaymentStatus('Payment verification timeout. Please check if payment was completed.')
        return
      }

      try {
        const response = await fetch('/api/mpesa/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            checkoutRequestID: checkoutID
          })
        })

        const data = await response.json()

        if (data.success) {
          if (data.order.status === 'paid') {
            setPaymentStatus('Payment successful! 🎉')
            onPaymentSuccess?.(data.order)
            return
          } else if (data.paymentAttempt.status === 'failed') {
            setPaymentStatus('Payment failed. Please try again.')
            onPaymentError?.('Payment failed')
            return
          }
        }

        attempts++
        setTimeout(poll, 10000) // Poll every 10 seconds
      } catch (error) {
        console.error('Polling error:', error)
        attempts++
        setTimeout(poll, 10000)
      }
    }

    poll()
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">M-Pesa Payment</h3>
        <p className="text-gray-600">Pay KES {amount} for order {orderId}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="0712345678 or +254712345678"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Examples: 0712345678, 012345678, +254712345678
          </p>
        </div>

        <Button
          onClick={initiatePayment}
          disabled={isLoading || !phoneNumber}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Pay with M-Pesa'
          )}
        </Button>

        {paymentStatus && (
          <div className={`p-4 rounded-lg text-sm ${
            paymentStatus.includes('successful') 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : paymentStatus.includes('failed') || paymentStatus.includes('error')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {paymentStatus}
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Payment Instructions:</h4>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Enter your M-Pesa phone number above</li>
            <li>2. Click "Pay with M-Pesa"</li>
            <li>3. Check your phone for M-Pesa prompt</li>
            <li>4. Enter your M-Pesa PIN to complete payment</li>
            <li>5. Wait for payment confirmation</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

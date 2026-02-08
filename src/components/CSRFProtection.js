'use client'

import { useState, useEffect } from 'react'
;
;export default function CSRFProtection({ children }) {
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    // Generate CSRF token on component mount
    const token = generateCSRFToken()
    setCsrfToken(token)
    
    // Store token in session storage
    sessionStorage.setItem('csrfToken', token)
  }, [])

  // Add CSRF token to all forms
  useEffect(() => {
    const forms = document.querySelectorAll('form')
    forms.forEach(form => {
      // Check if CSRF token input already exists
      if (!form.querySelector('input[name="csrf_token"]')) {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'csrf_token'
        input.value = csrfToken
        form.appendChild(input)
      }
    })
  }, [csrfToken])

  return <>{children}</>
};;

function generateCSRFToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
};

// Hook for CSRF protection
export function useCSRFProtection() {
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    const token = sessionStorage.getItem('csrfToken')
    if (token) {
      setCsrfToken(token)
    } else {
      const newToken = generateCSRFToken()
      setCsrfToken(newToken)
      sessionStorage.setItem('csrfToken', newToken)
    }
  }, [])

  const addCSRFToken = (formData) => {
    if (csrfToken) {
      formData.append('csrf_token', csrfToken)
    }
    return formData
  }

  const validateCSRFToken = (token) => {
    const storedToken = sessionStorage.getItem('csrfToken')
    return token && storedToken && token === storedToken
  }

  return {
    csrfToken,
    addCSRFToken,
    validateCSRFToken,
    generateCSRFToken
  }
}

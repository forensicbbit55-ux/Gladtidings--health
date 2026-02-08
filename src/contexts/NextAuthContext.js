'use client'

import React, { createContext, useContext, useState } from 'react';
;import { useSession, signIn, signOut } from 'next-auth/react'
;
;const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)

  const user = session?.user ? {
    id: session.user.id || '',
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role
  } : null

  const isAdmin = user?.role === 'ADMIN'

  const login = async (email, password) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      
      setLoading(false)
      return !result?.error
    } catch (error) {
      setLoading(false)
      return false
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      if (response.ok) {
        // Auto-login after successful registration
        await login(email, password)
        setLoading(false)
        return true
      }
      
      setLoading(false)
      return false
    } catch (error) {
      setLoading(false)
      return false
    }
  }

  const logout = async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={
      user,
      loading: loading || status === 'loading',
      login,
      register,
      logout,
      isAdmin
    }>
      {children}
    </AuthContext.Provider>
  )
};

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

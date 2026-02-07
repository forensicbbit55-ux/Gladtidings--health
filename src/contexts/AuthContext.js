'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// TODO: Replace with actual authentication logic using Neon database

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  // Placeholder auth functions - TODO: Implement with Neon database
  const signIn = async (email, password) => {
    console.log('TODO: Implement sign in with Neon database')
    return { success: false, error: 'Authentication not implemented yet' }
  }

  const signUp = async (email, password) => {
    console.log('TODO: Implement sign up with Neon database')
    return { success: false, error: 'Authentication not implemented yet' }
  }

  const signOut = async () => {
    console.log('TODO: Implement sign out with Neon database')
    setUser(null)
    setProfile(null)
    return { success: true }
  }

  const updateProfile = async (updates) => {
    console.log('TODO: Implement update profile with Neon database')
    return { success: false, error: 'Update profile not implemented yet' }
  }

  const isAdmin = () => {
    return profile?.role === 'admin'
  }

  const hasPermission = (requiredRole) => {
    const roleHierarchy = { viewer: 0, editor: 1, admin: 2 }
    return roleHierarchy[profile?.role] >= roleHierarchy[requiredRole]
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

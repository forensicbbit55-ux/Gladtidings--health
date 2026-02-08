import { useAuth } from '@/contexts/AuthContext';
;import { useRouter } from 'next/navigation';
;import { useEffect } from 'react'
;
;// Higher-order component for protecting routes
export const withAuth = (WrappedComponent, requiredRole = 'viewer') => {
  return function AuthenticatedComponent(props) {
    const { user, profile, loading, hasPermission } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (loading) return

      if (!user) {
        router.push(';/login')
        return
      }

      if (!profile) {
        router.push('/login')
        return
      }

      if (!hasPermission(requiredRole)) {
        router.push('/unauthorized')
        return
      }
    }, [user, profile, loading, hasPermission, router])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
        </div>
      )
    }

    if (!user || !profile || !hasPermission(requiredRole)) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

// Hook for checking admin access
export const useAdminAuth = () => {
  const { user, profile, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user || !profile || !isAdmin()) {
      router.push('/login')
    }
  }, [user, profile, loading, isAdmin, router])

  return { user, profile, loading, isAdmin }
}

// Hook for checking editor access
export const useEditorAuth = () => {
  const { user, profile, loading, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user || !profile || !hasPermission('editor')) {
      router.push('/login')
    }
  }, [user, profile, loading, hasPermission, router])

  return { user, profile, loading, hasPermission }
}

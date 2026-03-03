'use client';

// Temporarily disabled SessionProvider to avoid build issues
// import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/NextAuthContext';

export default function ClientProviders({ children }) {
  return (
    // <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    // </SessionProvider>
  );
}

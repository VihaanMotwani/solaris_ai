"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Check for auth cookie
    const hasAuthCookie = document.cookie.includes('auth-session=')
    
    // Redirect based on auth status
    if (hasAuthCookie) {
      console.log('Root page: Auth cookie found, redirecting to dashboard')
      router.push('/dashboard')
    } else {
      console.log('Root page: No auth cookie found, redirecting to login')
      router.push('/login')
    }
  }, [router])
  
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        </div>
        <p className="text-lg">Redirecting...</p>
      </div>
    </div>
  )
} 
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth-store'

export default function LoginHandlerPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'not-authenticated'>('checking')
  
  useEffect(() => {
    // Check for authentication indicators
    try {
      console.log("Login handler: checking auth state")
      
      // Try to get auth data from cookies or localStorage
      const localStorageData = localStorage.getItem('auth-storage')
      const hasCookie = document.cookie.includes('auth-session=')
      
      console.log("Login handler: Auth check", {
        hasLocalStorage: !!localStorageData,
        hasCookie: hasCookie
      })
      
      if (localStorageData || hasCookie) {
        // If we have either auth indicator, consider authenticated
        let isAuthenticated = false
        
        if (hasCookie) {
          console.log("Login handler: Found auth-session cookie")
          isAuthenticated = true
        }
        
        if (localStorageData) {
          try {
            console.log("Login handler: Found localStorage data")
            const authData = JSON.parse(localStorageData)
            isAuthenticated = authData.state?.isAuthenticated || isAuthenticated
          } catch (e) {
            console.error("Login handler: Error parsing localStorage data", e)
          }
        }
        
        if (isAuthenticated) {
          console.log("Login handler: User is authenticated")
          setAuthState('authenticated')
          
          // Add a delay to ensure state is persisted
          const timer = setTimeout(() => {
            console.log("Login handler: redirecting to dashboard")
            // Use a direct location change to bypass router
            window.location.href = '/dashboard'
          }, 3000)
          
          // Countdown timer
          const interval = setInterval(() => {
            setCountdown(prev => prev > 0 ? prev - 1 : 0)
          }, 1000)
          
          return () => {
            clearTimeout(timer)
            clearInterval(interval)
          }
        } else {
          console.error("Login handler: Auth indicators found but not authenticated")
          setAuthState('not-authenticated')
        }
      } else {
        console.error("Login handler: No auth indicators found")
        setAuthState('not-authenticated')
      }
    } catch (error) {
      console.error("Login handler error:", error)
      setAuthState('not-authenticated')
    }
  }, [])
  
  // If auth state is still checking, show loading
  if (authState === 'checking') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          </div>
          <p className="text-lg">Checking authentication...</p>
        </div>
      </div>
    )
  }
  
  // If not authenticated, show error
  if (authState === 'not-authenticated') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md p-6 rounded-lg bg-destructive/10 text-center">
          <p className="text-lg font-semibold text-destructive">Authentication Error</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Unable to verify your authentication. Please try logging in again.
          </p>
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-4 py-2 rounded bg-primary text-primary-foreground"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // If authenticated, show success
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        </div>
        <p className="text-lg">Logging in...</p>
        <p className="text-sm text-muted-foreground">You will be redirected to the dashboard in {countdown} seconds.</p>
        <p className="mt-4 text-sm">
          If you are not redirected automatically, <a href="/dashboard" className="text-primary hover:underline">click here</a>
        </p>
      </div>
    </div>
  )
} 
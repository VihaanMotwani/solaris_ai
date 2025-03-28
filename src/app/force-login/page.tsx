"use client"

import { useEffect, useState } from 'react'

export default function ForceLoginPage() {
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [countdown, setCountdown] = useState(3)
  const [authData, setAuthData] = useState(null)
  
  useEffect(() => {
    let timer: NodeJS.Timeout
    let interval: NodeJS.Timeout
    
    try {
      console.log("Force login: generating auth data")
      
      // Set token expiry for 1 hour from now
      const expiryTime = Date.now() + 3600000 // 1 hour in milliseconds
      
      // Create auth data directly in localStorage
      const authDataObj = {
        state: {
          token: "mock-jwt-token-for-mvp",
          refreshToken: "mock-refresh-token-for-mvp",
          tokenExpiry: expiryTime,
          user: {
            id: "1",
            name: "John Technician",
            email: "demo@litag.ai",
            role: "technician"
          },
          isAuthenticated: true
        },
        version: 0
      }
      
      setAuthData(authDataObj)

      console.log("Force login: setting auth data in localStorage")
      // Set it directly in localStorage
      localStorage.setItem('auth-storage', JSON.stringify(authDataObj))
      
      // Set up countdown
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      // Redirect to dashboard after a delay
      console.log("Force login: scheduling redirect to dashboard in 3 seconds")
      timer = setTimeout(() => {
        console.log("Force login: redirecting to dashboard now")
        window.location.href = '/dashboard'
      }, 3000)
    } catch (error) {
      console.error('Error during force login:', error)
      setStatus('error')
    }
    
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])
  
  if (status === 'error') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md p-6 rounded-lg bg-destructive/10 text-center">
          <p className="text-lg font-semibold text-destructive">Force Login Error</p>
          <p className="mt-2 text-sm text-muted-foreground">
            There was a problem setting the authentication data.
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
  
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-4 w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p className="text-xl font-semibold">Bypassing login...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Setting auth cookie and redirecting to dashboard in {countdown} seconds.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          If you are not redirected automatically, 
          <button 
            onClick={() => window.location.href = '/dashboard'} 
            className="text-primary underline ml-1"
          >
            click here
          </button>
        </p>
        {authData && (
          <p className="mt-4 text-xs text-green-500">Auth data set successfully.</p>
        )}
      </div>
    </div>
  )
} 
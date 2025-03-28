import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'technician' | 'manager'
}

interface AuthState {
  token: string | null
  refreshToken: string | null
  tokenExpiry: number | null
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshAuthToken: () => Promise<boolean>
  isTokenValid: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      tokenExpiry: null,
      user: null,
      isAuthenticated: false,
      
      isTokenValid: () => {
        const { token, tokenExpiry } = get()
        if (!token || !tokenExpiry) return false
        
        // Check if token is expired (with 10-second buffer)
        return Date.now() < tokenExpiry - 10000
      },
      
      login: async (email: string, password: string) => {
        try {
          // Mock API call
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (data.success && data.token) {
            // Mock user data for MVP
            const mockUser: User = {
              id: '1',
              name: 'John Technician',
              email,
              role: 'technician',
            }

            // Set token expiry for 1 hour from now
            const expiryTime = Date.now() + 3600000 // 1 hour in milliseconds

            set({
              token: data.token,
              refreshToken: data.refreshToken || 'mock-refresh-token',
              tokenExpiry: expiryTime,
              user: mockUser,
              isAuthenticated: true,
            })
            
            // Manually set a session cookie to ensure middleware can see it
            document.cookie = `auth-session=${data.token}; path=/; max-age=3600`;
            
            // Also set the auth data directly in localStorage for immediate access
            const authData = {
              state: {
                token: data.token,
                refreshToken: data.refreshToken || 'mock-refresh-token',
                tokenExpiry: expiryTime,
                user: mockUser,
                isAuthenticated: true
              },
              version: 0
            }
            localStorage.setItem('auth-storage', JSON.stringify(authData));
            
            console.log("Auth state set, isAuthenticated=true");
            return true
          }
          return false
        } catch (error) {
          console.error('Login error:', error)
          return false
        }
      },
      
      refreshAuthToken: async () => {
        try {
          const { refreshToken } = get()
          
          if (!refreshToken) {
            console.error('No refresh token available')
            return false
          }
          
          // Mock API call to refresh token
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          })

          const data = await response.json()

          if (data.success && data.token) {
            // Set token expiry for 1 hour from now
            const expiryTime = Date.now() + 3600000 // 1 hour in milliseconds
            
            set({
              token: data.token,
              refreshToken: data.refreshToken || get().refreshToken,
              tokenExpiry: expiryTime,
              isAuthenticated: true,
            })
            
            // Update the session cookie
            document.cookie = `auth-session=${data.token}; path=/; max-age=3600`;
            
            return true
          }
          
          // If refresh fails, log the user out
          get().logout()
          return false
        } catch (error) {
          console.error('Token refresh error:', error)
          get().logout()
          return false
        }
      },
      
      logout: () => {
        set({ 
          token: null, 
          refreshToken: null,
          tokenExpiry: null,
          user: null, 
          isAuthenticated: false 
        })
        
        // Clear the session cookie
        document.cookie = 'auth-session=; path=/; max-age=0';
        
        // Force navigation on logout
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
) 
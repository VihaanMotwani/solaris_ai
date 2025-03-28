import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    // For MVP purposes, we'll accept any credentials
    // In a real app, we'd validate against a database
    if (email && password) {
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return NextResponse.json({
        success: true,
        token: 'mock-jwt-token-for-mvp',
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
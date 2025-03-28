import { NextResponse } from 'next/server'
import { Feedback } from '@/types/api'

export async function POST(request: Request) {
  try {
    const body: Feedback = await request.json()
    
    // Validate required fields
    if (!body.relatedId || !body.relatedType || !body.diagnosisCorrect) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // For MVP, we just acknowledge receipt of feedback
    // In a production app, we'd store this in a database
    console.log('Received feedback:', body)
    
    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Feedback submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
} 
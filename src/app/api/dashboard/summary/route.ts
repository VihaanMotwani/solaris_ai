import { NextResponse } from 'next/server'
import { DashboardSummary } from '@/types/api'

export async function GET() {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data for MVP
    const data: DashboardSummary = {
      totalSites: 24,
      activeAlerts: 7,
      productionVsForecast: 0.03, // 3% above forecast
    }
    
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Dashboard summary error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
} 
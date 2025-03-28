import { NextResponse } from 'next/server'
import { Alert } from '@/types/api'

// Mock data for MVP
const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    siteId: 'SITE-001',
    componentId: 'PANEL-A23',
    type: 'Hot Spot',
    severity: 4,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    details: 'Thermal imaging shows significant hot spot in bottom right quadrant of panel A23. Potential cell damage.',
    status: 'active',
  },
  {
    id: 'ALT-002',
    siteId: 'SITE-002',
    componentId: 'INV-B12',
    type: 'Inverter Efficiency Drop',
    severity: 3,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    details: 'Inverter B12 showing 15% decrease in conversion efficiency over past 48 hours.',
    status: 'active',
  },
  {
    id: 'ALT-003',
    siteId: 'SITE-001',
    componentId: 'STRING-C4',
    type: 'String Underperformance',
    severity: 2,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    details: 'String C4 producing 20% less than other strings with similar orientation and conditions.',
    status: 'active',
  },
  {
    id: 'ALT-004',
    siteId: 'SITE-003',
    componentId: 'PANEL-D45',
    type: 'Potential Shading',
    severity: 2,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    details: 'Panel D45 shows pattern consistent with partial shading during peak generation hours.',
    status: 'active',
  },
  {
    id: 'ALT-005',
    siteId: 'SITE-002',
    componentId: 'PANEL-E11',
    type: 'Physical Damage',
    severity: 5,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    details: 'Image analysis indicates likely physical damage to panel E11, possibly from debris impact.',
    status: 'active',
  },
  {
    id: 'ALT-006',
    siteId: 'SITE-004',
    componentId: 'STRING-F2',
    type: 'Connection Issue',
    severity: 3,
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
    details: 'String F2 showing intermittent connection issues, possibly related to connector degradation.',
    status: 'active',
  },
  {
    id: 'ALT-007',
    siteId: 'SITE-001',
    componentId: 'PANEL-G17',
    type: 'Microfractures',
    severity: 1,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48 hours ago
    details: 'Early signs of microfractures detected in panel G17. Minor impact on performance currently.',
    status: 'active',
  },
]

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy')
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 700))
    
    // Filter by status if provided
    let filteredAlerts = [...mockAlerts]
    if (status) {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status)
    }
    
    // Sort if requested
    if (sortBy) {
      if (sortBy === 'severity_desc') {
        filteredAlerts.sort((a, b) => b.severity - a.severity)
      } else if (sortBy === 'severity_asc') {
        filteredAlerts.sort((a, b) => a.severity - b.severity)
      } else if (sortBy === 'timestamp_desc') {
        filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      } else if (sortBy === 'timestamp_asc') {
        filteredAlerts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      }
    }
    
    return NextResponse.json({
      success: true,
      data: filteredAlerts,
    })
  } catch (error) {
    console.error('Alerts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import type { Site } from '@/types/site'

// Mock data for sites
const mockSites: Site[] = [
  {
    id: 'SITE001',
    name: 'Solar Farm Alpha',
    location: 'Phoenix, AZ',
    capacity: 10.5,
    status: 'active',
    lastInspection: '2023-11-15T14:30:00Z',
    components: 245,
    alerts: 3
  },
  {
    id: 'SITE002',
    name: 'Desert Sun Array',
    location: 'Las Vegas, NV',
    capacity: 8.2,
    status: 'active',
    lastInspection: '2023-11-10T09:15:00Z',
    components: 180,
    alerts: 0
  },
  {
    id: 'SITE003',
    name: 'Coastal Panels',
    location: 'San Diego, CA',
    capacity: 5.7,
    status: 'maintenance',
    lastInspection: '2023-10-28T11:45:00Z',
    components: 120,
    alerts: 4
  },
  {
    id: 'SITE004',
    name: 'Mountain View Solar',
    location: 'Denver, CO',
    capacity: 12.3,
    status: 'active',
    lastInspection: '2023-11-05T16:20:00Z',
    components: 290,
    alerts: 1
  },
  {
    id: 'SITE005',
    name: 'Riverside Energy Park',
    location: 'Austin, TX',
    capacity: 7.8,
    status: 'active',
    lastInspection: '2023-11-12T10:00:00Z',
    components: 160,
    alerts: 2
  }
]

export async function GET(request: Request) {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Get search params
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    
    // Filter sites by status if provided
    let filteredSites = [...mockSites]
    if (statusFilter && statusFilter !== 'all') {
      filteredSites = filteredSites.filter(site => site.status === statusFilter)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredSites
    })
  } catch (error) {
    console.error('Error fetching sites:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sites' },
      { status: 500 }
    )
  }
} 
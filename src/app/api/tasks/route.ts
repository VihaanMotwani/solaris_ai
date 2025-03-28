import { NextResponse } from 'next/server'
import { Task } from '@/types/api'

// Mock data for MVP
const mockTasks: Task[] = [
  {
    id: 'TSK-001',
    siteId: 'SITE-002',
    componentId: 'PANEL-E11',
    description: 'Inspect and replace damaged panel',
    priority: 5,
    status: 'pending',
    suggestedAction: 'Replace panel E11 due to physical damage. Inspect mounting hardware for potential issues. Recommend full replacement rather than repair based on damage assessment.',
  },
  {
    id: 'TSK-002',
    siteId: 'SITE-001',
    componentId: 'PANEL-A23',
    description: 'Investigate hot spot and clean panel',
    priority: 4,
    status: 'pending',
    suggestedAction: 'Inspect panel A23 for hot spot issue. Clean panel surface thoroughly and check for bypass diode failure. If diode failure confirmed, replace affected component.',
  },
  {
    id: 'TSK-003',
    siteId: 'SITE-002',
    componentId: 'INV-B12',
    description: 'Service inverter',
    priority: 3,
    status: 'pending',
    suggestedAction: 'Perform maintenance on inverter B12. Check ventilation, clean filters, verify firmware version, and test all operational modes. Consider firmware update if available.',
  },
  {
    id: 'TSK-004',
    siteId: 'SITE-004',
    componentId: 'STRING-F2',
    description: 'Check and secure connections',
    priority: 3,
    status: 'pending',
    suggestedAction: 'Inspect all connections in string F2. Secure loose connections, replace corroded connectors, and apply anti-corrosion treatment. Test string performance after maintenance.',
  },
  {
    id: 'TSK-005',
    siteId: 'SITE-001',
    componentId: 'STRING-C4',
    description: 'Troubleshoot string performance',
    priority: 2,
    status: 'pending',
    suggestedAction: 'Investigate string C4 underperformance. Check for shading issues, panel soiling, and connection integrity. Measure string voltage and current under load.',
  },
  {
    id: 'TSK-006',
    siteId: 'SITE-003',
    componentId: 'PANEL-D45',
    description: 'Assess and mitigate shading',
    priority: 2,
    status: 'pending',
    suggestedAction: 'Evaluate shading impact on panel D45. Remove vegetation if present, or consider panel repositioning if architectural shading is identified. Document shading patterns throughout day.',
  },
  {
    id: 'TSK-007',
    siteId: 'SITE-001',
    componentId: 'PANEL-G17',
    description: 'Monitor for microfracture progression',
    priority: 1,
    status: 'pending',
    suggestedAction: 'Schedule regular monitoring of panel G17. Capture high-resolution images monthly to track microfracture progression. No immediate action needed but document baseline condition.',
  },
]

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy')
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Filter by status if provided
    let filteredTasks = [...mockTasks]
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status)
    }
    
    // Sort if requested
    if (sortBy) {
      if (sortBy === 'priority_desc') {
        filteredTasks.sort((a, b) => b.priority - a.priority)
      } else if (sortBy === 'priority_asc') {
        filteredTasks.sort((a, b) => a.priority - b.priority)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: filteredTasks,
    })
  } catch (error) {
    console.error('Tasks error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
} 
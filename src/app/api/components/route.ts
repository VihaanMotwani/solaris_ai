import { NextResponse } from 'next/server'
import type { Component } from '@/types/component'

// Mock data for components
const mockComponents: Component[] = [
  {
    id: 'COMP001',
    siteId: 'SITE001',
    name: 'Panel Array A1',
    type: 'solar_panel',
    manufacturer: 'SunTech',
    model: 'ST-P680',
    installDate: '2022-04-15',
    lastMaintenance: '2023-10-20',
    status: 'operational',
    efficiency: 92.5,
    healthScore: 95
  },
  {
    id: 'COMP002',
    siteId: 'SITE001',
    name: 'Inverter B2',
    type: 'inverter',
    manufacturer: 'PowerConvert',
    model: 'PC-5000',
    installDate: '2022-04-16',
    lastMaintenance: '2023-09-12',
    status: 'needs_attention',
    efficiency: 88.0,
    healthScore: 82
  },
  {
    id: 'COMP003',
    siteId: 'SITE001',
    name: 'Panel Array A2',
    type: 'solar_panel',
    manufacturer: 'SunTech',
    model: 'ST-P680',
    installDate: '2022-04-15',
    lastMaintenance: '2023-10-22',
    status: 'operational',
    efficiency: 91.8,
    healthScore: 93
  },
  {
    id: 'COMP004',
    siteId: 'SITE002',
    name: 'Panel Array C1',
    type: 'solar_panel',
    manufacturer: 'EcoSolar',
    model: 'ES-750',
    installDate: '2022-08-10',
    lastMaintenance: '2023-11-05',
    status: 'operational',
    efficiency: 94.2,
    healthScore: 97
  },
  {
    id: 'COMP005',
    siteId: 'SITE002',
    name: 'Inverter D1',
    type: 'inverter',
    manufacturer: 'PowerConvert',
    model: 'PC-6000',
    installDate: '2022-08-12',
    lastMaintenance: '2023-11-06',
    status: 'operational',
    efficiency: 93.5,
    healthScore: 95
  },
  {
    id: 'COMP006',
    siteId: 'SITE003',
    name: 'Panel Array E1',
    type: 'solar_panel',
    manufacturer: 'SunTech',
    model: 'ST-P720',
    installDate: '2022-06-20',
    lastMaintenance: '2023-08-30',
    status: 'maintenance',
    efficiency: 84.0,
    healthScore: 75
  },
  {
    id: 'COMP007',
    siteId: 'SITE003',
    name: 'Battery Bank F1',
    type: 'battery',
    manufacturer: 'StorageTech',
    model: 'ST-B2000',
    installDate: '2022-06-22',
    lastMaintenance: '2023-08-25',
    status: 'operational',
    efficiency: 90.0,
    healthScore: 88
  }
]

export async function GET(request: Request) {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 650))
    
    // Get search params
    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get('siteId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    
    // Filter components based on query parameters
    let filteredComponents = [...mockComponents]
    
    if (siteId) {
      filteredComponents = filteredComponents.filter(component => component.siteId === siteId)
    }
    
    if (type) {
      filteredComponents = filteredComponents.filter(component => component.type === type)
    }
    
    if (status && status !== 'all') {
      filteredComponents = filteredComponents.filter(component => component.status === status)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredComponents
    })
  } catch (error) {
    console.error('Error fetching components:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch components' },
      { status: 500 }
    )
  }
} 
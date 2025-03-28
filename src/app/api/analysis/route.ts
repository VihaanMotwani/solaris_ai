import { NextResponse } from 'next/server'
import type { AnalysisResult } from '@/types/analysis'

// Mock analysis results
const mockAnalysisResults: Record<string, AnalysisResult> = {
  'IMG-123456': {
    imageId: 'IMG-123456',
    siteId: 'SITE001',
    componentId: 'COMP001',
    timestamp: '2023-11-15T10:30:00Z',
    status: 'completed',
    anomalies: [
      {
        id: 'ANOM001',
        type: 'hotspot',
        severity: 'high',
        location: { x: 320, y: 240, width: 45, height: 30 },
        confidence: 0.92,
        details: 'Thermal anomaly detected with 15°C above ambient temperature'
      },
      {
        id: 'ANOM002',
        type: 'crack',
        severity: 'medium',
        location: { x: 120, y: 180, width: 60, height: 5 },
        confidence: 0.87,
        details: 'Linear crack detected on panel surface'
      }
    ],
    overallHealth: 78,
    recommendations: [
      'Schedule inspection of hotspot area within 48 hours',
      'Monitor crack progression over next maintenance cycle'
    ]
  },
  'IMG-234567': {
    imageId: 'IMG-234567',
    siteId: 'SITE002',
    componentId: 'COMP004',
    timestamp: '2023-11-14T14:45:00Z',
    status: 'completed',
    anomalies: [],
    overallHealth: 95,
    recommendations: [
      'Continue regular maintenance schedule',
      'No issues detected in current scan'
    ]
  },
  'IMG-345678': {
    imageId: 'IMG-345678',
    siteId: 'SITE003',
    componentId: 'COMP006',
    timestamp: '2023-11-13T09:15:00Z',
    status: 'completed',
    anomalies: [
      {
        id: 'ANOM003',
        type: 'delamination',
        severity: 'medium',
        location: { x: 220, y: 300, width: 80, height: 60 },
        confidence: 0.81,
        details: 'Delamination detected at panel edge'
      }
    ],
    overallHealth: 82,
    recommendations: [
      'Plan replacement of affected panel during next maintenance window',
      'Check surrounding panels for similar issues'
    ]
  },
  'IMG-456789': {
    imageId: 'IMG-456789',
    siteId: 'SITE001',
    componentId: 'COMP003',
    timestamp: '2023-11-16T11:20:00Z',
    status: 'processing',
    anomalies: [],
    overallHealth: null,
    recommendations: []
  }
}

export async function GET(request: Request) {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Get search params
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')
    
    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      )
    }
    
    const analysisResult = mockAnalysisResults[imageId]
    
    if (!analysisResult) {
      // For demo purposes, generate a processing result for unknown IDs
      return NextResponse.json({
        success: true,
        data: {
          imageId: imageId,
          siteId: 'UNKNOWN',
          componentId: 'UNKNOWN',
          timestamp: new Date().toISOString(),
          status: 'processing',
          anomalies: [],
          overallHealth: null,
          recommendations: []
        }
      })
    }
    
    return NextResponse.json({
      success: true,
      data: analysisResult
    })
  } catch (error) {
    console.error('Error fetching analysis result:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analysis result' },
      { status: 500 }
    )
  }
}
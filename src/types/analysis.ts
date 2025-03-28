export type Anomaly = {
  id: string
  type: 'hotspot' | 'crack' | 'delamination' | 'soiling' | 'shading' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: {
    x: number
    y: number
    width: number
    height: number
  }
  confidence: number // 0-1
  details: string
}

export type AnalysisResult = {
  imageId: string
  siteId: string
  componentId: string
  timestamp: string // ISO date string
  status: 'processing' | 'completed' | 'failed'
  anomalies: Anomaly[]
  overallHealth: number | null // 0-100 or null if status is not 'completed'
  recommendations: string[]
} 
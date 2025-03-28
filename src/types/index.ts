export * from './site'
export * from './component'
export * from './analysis'

// Reexport for components not yet created with their own type files
export type Alert = {
  id: string
  siteId: string
  componentId: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string // ISO date
  details: string
  status: 'active' | 'acknowledged' | 'resolved'
}

export type Task = {
  id: string
  siteId: string
  componentId: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  suggestedAction?: string
  dueDate?: string // ISO date
}

export type Feedback = {
  id: string
  relatedId: string // Could be imageId, alertId, etc.
  relatedType: 'analysis' | 'alert' | 'recommendation'
  diagnosisCorrect: boolean
  comments?: string
  timestamp: string // ISO date
}

export type DashboardSummary = {
  totalSites: number
  activeAlerts: number
  productionToday: number // in kWh
  forecastToday: number // in kWh
  monthlyProduction: number // in kWh
  monthlyForecast: number // in kWh
  sitesStatus: {
    active: number
    maintenance: number
    offline: number
  }
} 
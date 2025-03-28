// Dashboard Summary
export interface DashboardSummary {
  totalSites: number
  activeAlerts: number
  productionVsForecast: number
}

// Alert Types
export type AlertSeverity = 1 | 2 | 3 | 4 | 5
export type AlertStatus = 'active' | 'resolved'

export interface Alert {
  id: string
  siteId: string
  componentId: string
  type: string
  severity: AlertSeverity
  timestamp: string
  details: string
  status: AlertStatus
}

// Task Types
export type TaskPriority = 1 | 2 | 3 | 4 | 5
export type TaskStatus = 'pending' | 'in-progress' | 'complete'

export interface Task {
  id: string
  siteId: string
  componentId: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  suggestedAction: string
}

// Feedback Types
export type DiagnosisAccuracy = 'yes' | 'no' | 'partial'

export interface Feedback {
  id?: string
  relatedId: string  // Alert ID or Task ID
  relatedType: 'alert' | 'task'
  diagnosisCorrect: DiagnosisAccuracy
  taskComplete: boolean
  notes: string
}

// Image Upload Types
export interface ImageUpload {
  siteId: string
  componentId: string
  imageFile: File
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
} 
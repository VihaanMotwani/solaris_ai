export type Component = {
  id: string
  siteId: string
  name: string
  type: 'solar_panel' | 'inverter' | 'battery' | 'tracker' | 'other'
  manufacturer: string
  model: string
  installDate: string // ISO date string
  lastMaintenance: string // ISO date string
  status: 'operational' | 'needs_attention' | 'maintenance' | 'offline'
  efficiency: number // percentage
  healthScore: number // 0-100
} 
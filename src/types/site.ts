export type Site = {
  id: string
  name: string
  location: string
  capacity: number // in MW
  status: 'active' | 'maintenance' | 'offline'
  lastInspection: string // ISO date string
  components: number // total number of components
  alerts: number // active alert count
} 
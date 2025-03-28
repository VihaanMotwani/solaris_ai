import useSWR from 'swr'
import { useAuthStore } from './store/auth-store'
import {
  Alert,
  ApiResponse,
  DashboardSummary,
  Feedback,
  Task,
} from '@/types/api'

// SWR fetcher with auth token
const fetcher = async (url: string) => {
  const token = useAuthStore.getState().token
  
  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    throw error
  }
  
  return res.json()
}

// Dashboard API
export function useDashboardSummary() {
  return useSWR<ApiResponse<DashboardSummary>>('/api/dashboard/summary', fetcher)
}

// Alerts API
export function useAlerts(status?: string, sortBy?: string) {
  const query = new URLSearchParams()
  if (status) query.append('status', status)
  if (sortBy) query.append('sortBy', sortBy)
  
  const queryString = query.toString() ? `?${query.toString()}` : ''
  return useSWR<ApiResponse<Alert[]>>(`/api/alerts${queryString}`, fetcher)
}

// Tasks API
export function useTasks(status?: string, sortBy?: string) {
  const query = new URLSearchParams()
  if (status) query.append('status', status)
  if (sortBy) query.append('sortBy', sortBy)
  
  const queryString = query.toString() ? `?${query.toString()}` : ''
  return useSWR<ApiResponse<Task[]>>(`/api/tasks${queryString}`, fetcher)
}

// Submit feedback
export async function submitFeedback(feedback: Feedback): Promise<ApiResponse<void>> {
  const token = useAuthStore.getState().token
  
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(feedback),
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return { success: false, error: 'Failed to submit feedback' }
  }
}

// Upload image
export async function uploadImage(formData: FormData): Promise<ApiResponse<{ imageId: string }>> {
  const token = useAuthStore.getState().token
  
  try {
    const response = await fetch('/api/images/upload', {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error uploading image:', error)
    return { success: false, error: 'Failed to upload image' }
  }
} 
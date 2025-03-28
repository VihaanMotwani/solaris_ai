// src/lib/api.ts
import axios from 'axios';

// Create axios instance with defaults
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is unauthorized and we haven't tried to refresh token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token (in a real app)
        // const refreshResponse = await api.post('/auth/refresh');
        // const newToken = refreshResponse.data.token;
        // localStorage.setItem('auth_token', newToken);
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return api(originalRequest);
        
        // For demo, just redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API service functions
export const authService = {
  login: async (email: string, password: string) => {
    // Demo login with hardcoded credentials
    const demoCredentials = {
      email: 'demo@litag.ai',
      password: 'demo123'
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === demoCredentials.email && password === demoCredentials.password) {
      return {
        token: 'demo_token_123',
        user: {
          id: 'demo1',
          name: 'John Technician',
          email: demoCredentials.email,
          role: 'technician',
        },
      };
    }
    
    throw new Error('Invalid credentials. Try demo@litag.ai / demo123');
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    // In a real app, you might also want to call the API to invalidate the token
  },
};

export const sitesService = {
  getSites: async () => {
    // In a real app, this would be an API call
    // For demo, return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: 'SITE-001', name: 'Solar Farm Alpha', capacity: 5000, alerts: 3 },
      { id: 'SITE-002', name: 'Solar Farm Beta', capacity: 7500, alerts: 2 },
      { id: 'SITE-003', name: 'Solar Farm Gamma', capacity: 3000, alerts: 1 },
      { id: 'SITE-004', name: 'Solar Farm Delta', capacity: 4500, alerts: 1 },
      // Additional mock sites
      { id: 'SITE-005', name: 'Solar Farm Epsilon', capacity: 6000, alerts: 0 },
      { id: 'SITE-006', name: 'Solar Farm Zeta', capacity: 2500, alerts: 0 },
    ];
  },

  getSiteById: async (siteId: string) => {
    // In a real app, this would be an API call
    // For demo, return mock data based on the ID
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sites: SitesMap = {
      'SITE-001': { 
        id: 'SITE-001', 
        name: 'Solar Farm Alpha', 
        capacity: 5000, 
        location: { lat: 37.7749, lng: -122.4194 },
        installationDate: '2022-03-15',
        lastMaintenance: '2024-02-10',
        performance: 97.2,
        alerts: 3
      },
      'SITE-002': { 
        id: 'SITE-002', 
        name: 'Solar Farm Beta', 
        capacity: 7500, 
        location: { lat: 37.3382, lng: -121.8863 },
        installationDate: '2021-08-22',
        lastMaintenance: '2024-01-25',
        performance: 95.8,
        alerts: 2
      },
      // Add more detailed site data as needed
    };
    
    return sites[siteId] || null;
  }
};

interface SiteDetails {
  id: string;
  name: string;
  capacity: number;
  location: { lat: number; lng: number };
  installationDate: string;
  lastMaintenance: string;
  performance: number;
  alerts: number;
}

interface SitesMap {
  [key: string]: SiteDetails;
}

export const alertsService = {
  getAlerts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'ALT-005',
        siteId: 'SITE-002',
        componentId: 'PANEL-E11',
        anomalyType: 'Physical Damage',
        severity: 5,
        timestamp: '3/28/2025, 10:58:44 PM',
        status: 'Active' as const,
      },
      {
        id: 'ALT-001',
        siteId: 'SITE-001',
        componentId: 'PANEL-A23',
        anomalyType: 'Hot Spot',
        severity: 4,
        timestamp: '3/29/2025, 12:58:44 AM',
        status: 'Active' as const,
      },
    ];
  },

  updateAlertStatus: async (alertId: string, status: string) => {
    // In a real app, this would be an API call
    // For demo, simulate a success response
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true };
  }
};

export const tasksService = {
  getTasks: async () => {
    // In a real app, this would be an API call
    // For demo, return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'TSK-001',
        siteId: 'SITE-002',
        componentId: 'PANEL-E11',
        description: 'Inspect and replace damaged panel',
        priority: 5,
        status: 'Pending',
      },
      {
        id: 'TSK-002',
        siteId: 'SITE-001',
        componentId: 'PANEL-A23',
        description: 'Investigate hot spot and clean panel',
        priority: 4,
        status: 'Pending',
      },
      // Include all other tasks from the mockTasks array
    ];
  },

  updateTaskStatus: async (taskId: string, status: string) => {
    // In a real app, this would be an API call
    // For demo, simulate a success response
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true };
  }
};

export default api;
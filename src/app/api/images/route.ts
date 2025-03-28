import { NextResponse } from 'next/server'

// Mock image data
const mockImages = [
  {
    id: 'IMG-123456',
    siteId: 'SITE001',
    componentId: 'COMP001',
    uploadedAt: '2023-11-15T10:25:00Z',
    type: 'thermal',
    status: 'analyzed',
    url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&auto=format&fit=crop'
  },
  {
    id: 'IMG-234567',
    siteId: 'SITE002',
    componentId: 'COMP004',
    uploadedAt: '2023-11-14T14:40:00Z',
    type: 'visual',
    status: 'analyzed',
    url: 'https://images.unsplash.com/photo-1613665813427-4e2bd1217961?w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1613665813427-4e2bd1217961?w=400&auto=format&fit=crop'
  },
  {
    id: 'IMG-345678',
    siteId: 'SITE003',
    componentId: 'COMP006',
    uploadedAt: '2023-11-13T09:10:00Z',
    type: 'thermal',
    status: 'analyzed',
    url: 'https://images.unsplash.com/photo-1636491363519-7c773afec4b7?w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1636491363519-7c773afec4b7?w=400&auto=format&fit=crop'
  },
  {
    id: 'IMG-456789',
    siteId: 'SITE001',
    componentId: 'COMP003',
    uploadedAt: '2023-11-16T11:15:00Z',
    type: 'visual',
    status: 'processing',
    url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&auto=format&fit=crop'
  },
  {
    id: 'IMG-567890',
    siteId: 'SITE002',
    componentId: 'COMP004',
    uploadedAt: '2023-11-10T10:20:00Z',
    type: 'thermal',
    status: 'analyzed',
    url: 'https://images.unsplash.com/photo-1595437193398-f24279553f4f?w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595437193398-f24279553f4f?w=400&auto=format&fit=crop'
  }
]

export async function GET(request: Request) {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 700))
    
    // Get search params
    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get('siteId')
    const componentId = searchParams.get('componentId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    
    // Filter images based on query parameters
    let filteredImages = [...mockImages]
    
    if (siteId) {
      filteredImages = filteredImages.filter(image => image.siteId === siteId)
    }
    
    if (componentId) {
      filteredImages = filteredImages.filter(image => image.componentId === componentId)
    }
    
    if (type) {
      filteredImages = filteredImages.filter(image => image.type === type)
    }
    
    if (status) {
      filteredImages = filteredImages.filter(image => image.status === status)
    }
    
    // Sort by upload date (newest first)
    filteredImages.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      data: filteredImages
    })
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
} 
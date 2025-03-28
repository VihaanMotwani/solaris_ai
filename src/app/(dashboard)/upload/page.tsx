'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { uploadImage } from '@/lib/api'
import { UploadCloud, ImageIcon } from 'lucide-react'

const formSchema = z.object({
  siteId: z.string().min(1, { message: 'Site ID is required' }),
  componentId: z.string().min(1, { message: 'Component ID is required' }),
  imageType: z.enum(['rgb', 'ir'], { message: 'Image type is required' }),
  imageFile: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: 'Image is required' })
    .refine((files) => files[0].size <= 5000000, { message: 'Max file size is 5MB' })
    .refine(
      (files) => 
        ['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type),
      { message: 'Unsupported file format' }
    ),
})

type FormValues = z.infer<typeof formSchema>

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })
  
  const watchImageFile = watch('imageFile')
  
  // Create preview URL when image is selected
  React.useEffect(() => {
    if (watchImageFile instanceof FileList && watchImageFile.length > 0) {
      const file = watchImageFile[0]
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [watchImageFile])
  
  const onSubmit = async (data: FormValues) => {
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('siteId', data.siteId)
      formData.append('componentId', data.componentId)
      formData.append('imageType', data.imageType)
      formData.append('imageFile', data.imageFile[0])
      
      const response = await uploadImage(formData)
      
      if (response.success) {
        toast({
          title: 'Image uploaded successfully',
          description: `Image ID: ${response.data?.imageId}`,
        })
        reset()
        setPreviewUrl(null)
      } else {
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: response.error || 'Something went wrong',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'An unexpected error occurred',
      })
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Image Upload</h2>
        <p className="text-muted-foreground">
          Upload solar panel images for analysis and anomaly detection.
        </p>
      </div>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Manual Image Upload</CardTitle>
          <CardDescription>
            Upload RGB or infrared (IR) images of solar panels for analysis.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteId">Site ID</Label>
                <Input
                  id="siteId"
                  placeholder="Enter site identifier"
                  {...register('siteId')}
                />
                {errors.siteId && (
                  <p className="text-xs text-destructive">{errors.siteId.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="componentId">Component ID</Label>
                <Input
                  id="componentId"
                  placeholder="Enter panel/component identifier"
                  {...register('componentId')}
                />
                {errors.componentId && (
                  <p className="text-xs text-destructive">{errors.componentId.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageType">Image Type</Label>
              <Select
                onValueChange={(value) => setValue('imageType', value as 'rgb' | 'ir')}
              >
                <SelectTrigger id="imageType">
                  <SelectValue placeholder="Select image type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rgb">RGB (Regular camera)</SelectItem>
                  <SelectItem value="ir">IR (Infrared/Thermal)</SelectItem>
                </SelectContent>
              </Select>
              {errors.imageType && (
                <p className="text-xs text-destructive">{errors.imageType.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageFile">Image File</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                <div className="text-center">
                  {previewUrl ? (
                    <div className="space-y-2">
                      <div className="overflow-hidden rounded-md">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-40 w-auto object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewUrl(null)
                          setValue('imageFile', undefined as any)
                        }}
                      >
                        Change image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col text-sm items-center">
                        <Label
                          htmlFor="file-upload"
                          className="cursor-pointer font-semibold text-primary hover:text-primary/80"
                        >
                          <span>Click to upload</span>
                          <Input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            {...register('imageFile')}
                          />
                        </Label>
                        <p className="text-xs text-muted-foreground pt-1">
                          PNG, JPG or WEBP (max. 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {errors.imageFile && (
                <p className="text-xs text-destructive">{errors.imageFile.message}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <UploadCloud className="h-4 w-4 animate-pulse" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" />
                  Upload Image
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { submitFeedback } from '@/lib/api'
import { DiagnosisAccuracy } from '@/types/api'

const formSchema = z.object({
  diagnosisCorrect: z.enum(['yes', 'no', 'partial'] as const),
  taskComplete: z.boolean().default(false),
  notes: z.string().optional(),
})

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  relatedId: string
  relatedType: 'alert' | 'task'
  title: string
  description: string
  details?: string
}

export function FeedbackDialog({
  open,
  onOpenChange,
  relatedId,
  relatedType,
  title,
  description,
  details,
}: FeedbackDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosisCorrect: 'yes',
      taskComplete: false,
      notes: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    
    try {
      const response = await submitFeedback({
        relatedId,
        relatedType,
        diagnosisCorrect: values.diagnosisCorrect as DiagnosisAccuracy,
        taskComplete: values.taskComplete,
        notes: values.notes || '',
      })
      
      if (response.success) {
        toast({
          title: 'Feedback submitted',
          description: 'Thank you for your feedback',
        })
        onOpenChange(false)
        form.reset()
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'Failed to submit feedback',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {details && (
          <div className="rounded-md bg-muted p-3 text-sm">
            {details}
          </div>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Was the diagnosis correct?</Label>
              <RadioGroup
                className="mt-2"
                defaultValue={form.getValues().diagnosisCorrect}
                onValueChange={(value) => 
                  form.setValue('diagnosisCorrect', value as DiagnosisAccuracy)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partial" id="partial" />
                  <Label htmlFor="partial">Partially</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="taskComplete"
                checked={form.getValues().taskComplete}
                onCheckedChange={(checked) => 
                  form.setValue('taskComplete', checked === true)
                }
              />
              <Label htmlFor="taskComplete">
                {relatedType === 'alert' 
                  ? 'Issue has been addressed' 
                  : 'Task has been completed'}
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional information or observations..."
                {...form.register('notes')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
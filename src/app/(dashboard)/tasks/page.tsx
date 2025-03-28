'use client'

import React, { useState } from 'react'
import { useTasks } from '@/lib/api'
import { Task } from '@/types/api'
import { DataTable } from '@/components/ui/data-table/data-table'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import { FeedbackDialog } from '@/components/shared/feedback-dialog'
import { CalendarCheck, CheckCircle2, HelpCircle } from 'lucide-react'

// Define columns for the tasks data table
const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'id',
    header: 'Task ID',
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'siteId',
    header: 'Site ID',
  },
  {
    accessorKey: 'componentId',
    header: 'Component ID',
  },
  {
    accessorKey: 'description',
    header: 'Task Description',
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = Number(row.getValue('priority'))
      return (
        <Badge 
          variant={
            priority >= 4 ? 'destructive' : 
            priority >= 3 ? 'default' : 
            'outline'
          }
        >
          {priority}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <div className="flex items-center gap-2">
          {status === 'pending' ? (
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          ) : status === 'in-progress' ? (
            <CalendarCheck className="h-4 w-4 text-primary" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          )}
          <span className="capitalize">{status}</span>
        </div>
      )
    },
  },
]

export default function TasksPage() {
  const { data, error, isLoading } = useTasks('pending', 'priority_desc')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const handleRowClick = (task: Task) => {
    setSelectedTask(task)
    setFeedbackOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Maintenance Tasks</h2>
          <p className="text-muted-foreground">
            Prioritized maintenance suggestions for your solar portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-primary" />
          <span className="font-semibold">
            {data?.data?.length || 0} Pending Tasks
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="flex h-32 items-center justify-center">
          <p className="text-destructive">Error loading tasks</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          onRowClick={handleRowClick}
        />
      )}

      {selectedTask && (
        <FeedbackDialog
          open={feedbackOpen}
          onOpenChange={setFeedbackOpen}
          relatedId={selectedTask.id}
          relatedType="task"
          title={`Task: ${selectedTask.description}`}
          description={`Site: ${selectedTask.siteId} | Component: ${selectedTask.componentId} | Priority: ${selectedTask.priority}`}
          details={selectedTask.suggestedAction}
        />
      )}
    </div>
  )
} 
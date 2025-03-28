'use client'

import React, { useState } from 'react'
import { useAlerts } from '@/lib/api'
import { Alert } from '@/types/api'
import { DataTable } from '@/components/ui/data-table/data-table'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import { FeedbackDialog } from '@/components/shared/feedback-dialog'
import { CalendarClock, AlertTriangle } from 'lucide-react'

// Define columns for the alerts data table
const columns: ColumnDef<Alert>[] = [
  {
    accessorKey: 'id',
    header: 'Alert ID',
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
    accessorKey: 'type',
    header: 'Anomaly Type',
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ row }) => {
      const severity = Number(row.getValue('severity'))
      return (
        <Badge 
          variant={
            severity >= 4 ? 'destructive' : 
            severity >= 3 ? 'default' : 
            'outline'
          }
        >
          {severity}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => {
      const timestamp = new Date(row.getValue('timestamp'))
      return <div className="flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
        {timestamp.toLocaleString()}
      </div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'destructive' : 'outline'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
]

export default function AlertsPage() {
  const { data, error, isLoading } = useAlerts('active', 'severity_desc')
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const handleRowClick = (alert: Alert) => {
    setSelectedAlert(alert)
    setFeedbackOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
          <p className="text-muted-foreground">
            Active anomalies detected across your solar portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span className="font-semibold">
            {data?.data?.length || 0} Active Alerts
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      ) : error ? (
        <div className="flex h-32 items-center justify-center">
          <p className="text-destructive">Error loading alerts</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          onRowClick={handleRowClick}
        />
      )}

      {selectedAlert && (
        <FeedbackDialog
          open={feedbackOpen}
          onOpenChange={setFeedbackOpen}
          relatedId={selectedAlert.id}
          relatedType="alert"
          title={`Alert: ${selectedAlert.type}`}
          description={`Site: ${selectedAlert.siteId} | Component: ${selectedAlert.componentId} | Severity: ${selectedAlert.severity}`}
          details={selectedAlert.details}
        />
      )}
    </div>
  )
} 
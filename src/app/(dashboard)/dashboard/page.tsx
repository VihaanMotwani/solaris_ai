'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  LucideIcon, 
  MonitorSmartphone, 
  Bell, 
  Activity
} from 'lucide-react'
import { useDashboardSummary } from '@/lib/api'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProductionChart } from '@/components/dashboard/production-chart'

interface DashboardCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  linkHref?: string
  linkText?: string
}

function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  linkHref,
  linkText,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      {linkHref && (
        <CardFooter>
          <Link href={linkHref} passHref>
            <Button variant="ghost" className="h-8 w-full justify-between p-0">
              {linkText}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}

export default function DashboardPage() {
  const { data, error, isLoading } = useDashboardSummary()
  const dashboardData = data?.data || { totalSites: 0, activeAlerts: 0, productionVsForecast: 0 }

  const productionValue = dashboardData.productionVsForecast
  let productionDescription = 'On target'
  
  if (productionValue > 0.05) {
    productionDescription = `${(productionValue * 100).toFixed(1)}% above forecast`
  } else if (productionValue < -0.05) {
    productionDescription = `${Math.abs(productionValue * 100).toFixed(1)}% below forecast`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your solar asset portfolio.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Sites"
          value={isLoading ? '...' : dashboardData.totalSites}
          description="Total monitored solar installations"
          icon={MonitorSmartphone}
        />
        <DashboardCard
          title="Active Alerts"
          value={isLoading ? '...' : dashboardData.activeAlerts}
          description="Potential issues requiring attention"
          icon={Bell}
          linkHref="/alerts"
          linkText="View all alerts"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Production vs. Forecast</CardTitle>
            <CardDescription>
              Comparison of actual power generation against forecasted production
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ProductionChart value={productionValue} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Health</CardTitle>
            <CardDescription>Overall system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <Activity className="h-16 w-16 text-primary" />
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {productionDescription}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on power generation and active alerts
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/tasks" passHref>
              <Button variant="outline" className="w-full">
                View maintenance tasks
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 
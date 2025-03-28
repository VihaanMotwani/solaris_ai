"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Bell, 
  CalendarClock, 
  Upload,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: 'Alerts',
    href: '/alerts',
    icon: <Bell className="h-5 w-5" />,
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: <CalendarClock className="h-5 w-5" />,
  },
  {
    label: 'Upload',
    href: '/upload',
    icon: <Upload className="h-5 w-5" />,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="min-h-screen w-64 border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center">
          <Sun className="h-6 w-6 text-primary mr-2" />
          <span className="text-lg font-semibold">LitAgents</span>
        </div>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
} 
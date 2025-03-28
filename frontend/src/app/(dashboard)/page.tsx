// src/app/(dashboard)/page.tsx
'use client';

import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome to LitAgents Solar Monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dashboard content */}
      </div>
    </div>
  );
}